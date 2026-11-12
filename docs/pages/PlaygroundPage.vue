<template>
    <div class="pg">
        <header class="pg_head">
            <div>
                <h1 class="pg_title">实时编辑预览</h1>
                <p class="pg_desc">
                    左侧按 HTML、JS、CSS 分段编辑，自动组合并预览；不需要书写
                    <code>&lt;template&gt;</code>、<code>&lt;script setup&gt;</code> 与 <code>&lt;style&gt;</code> 标签。
                </p>
            </div>
            <div class="pg_actions">
                <AppButton variant="line" @click="Reset">示例</AppButton>
                <AppButton variant="line" @click="Clear">清空</AppButton>
                <AppButton variant="line" @click="loading.clear()">停止加载</AppButton>
                <AppButton variant="primary" @click="Run">运行</AppButton>
            </div>
        </header>

        <div class="pg_body">
            <section class="pg_editor_column">
                <div class="pg_editors">
                    <PlaygroundEditor v-for="editor in editors" :key="editor.key" v-model="parts[editor.key]"
                        :label="editor.label" :lang="editor.lang" :placeholder="editor.placeholder"
                        :max="editor.max" />
                </div>
            </section>

            <section class="pg_pane">
                <div class="pg_bar">
                    <span>预览</span>
                    <span class="wa_hint">实时渲染</span>
                </div>
                <div ref="PreviewEl" class="pg_canvas"></div>
                <p v-if="error" class="pg_message pg_error">{{ error }}</p>
                <p v-else-if="warning" class="pg_message pg_warning">{{ warning }}</p>
            </section>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { loading } from 'wash-ui'
import { PLAYGROUND_CHANNEL } from '../playground-bridge.js'
import { ExtractDeclaredNames, ExtractImportNames, StripImports } from '../sfc-code.js'
import PlaygroundEditor from '../components/PlaygroundEditor.vue'

const LocalApi = Object.assign({}, ...Object.values(import.meta.glob('../api/*.js', { eager: true })))

const DEFAULT_HTML = `<div class="pg_demo">
  <AppButton variant="primary" @click="count++">点击了 {{ count }} 次</AppButton>
  <AppButton variant="line">描边按钮</AppButton>
  <AppChip active>标记</AppChip>
  <AppIcon name="home" :size="24" />
</div>`

const DEFAULT_JS = `const count = ref(0)`

const DEFAULT_CSS = `.pg_demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}`

const editors = [
    {
        key: 'html',
        label: 'HTML',
        lang: 'html',
        max: 'fill',
        placeholder: '在这里写模板，不需要 <template> 包裹',
    },
    {
        key: 'js',
        label: 'JS',
        lang: 'js',
        max: 'half',
        placeholder: '在这里写 setup 内容，不需要 <script setup> 包裹',
    },
    {
        key: 'css',
        label: 'CSS',
        lang: 'css',
        max: 'third',
        placeholder: '在这里写样式，不需要 <style> 包裹',
    },
]

const parts = reactive({
    html: DEFAULT_HTML,
    js: DEFAULT_JS,
    css: DEFAULT_CSS,
})
const error = ref('')
const warning = ref('')
const PreviewEl = ref(null)
let applyingCode = false

let runtimePromise = null
let previewApp = null
let renderRun = 0
let debounceTimer = null
let playgroundChannel = null
let readyTimers = []

function LoadRuntime() {
    if (!runtimePromise) {
        runtimePromise = Promise.all([
            import('vue/dist/vue.esm-bundler.js'),
            import('wash-ui'),
            import('wash-ui/utils'),
        ])
    }
    return runtimePromise
}

function IsComponent(value) {
    if (!value) return false
    if (typeof value === 'function') return Boolean(value.render || value.setup || value.__name)
    if (typeof value !== 'object') return false
    return Boolean(value.render || value.setup || value.template || value.__name || value.__file)
}

let styleEl = null

function Dedent(value) {
    const lines = String(value || '').split('\n')
    const indents = lines
        .filter(line => line.trim())
        .map(line => line.match(/^\s*/)[0].length)
    const min = indents.length ? Math.min(...indents) : 0
    return lines.map(line => line.slice(min)).join('\n')
}

function Parse(value) {
    const source = String(value || '')

    const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1])
    const scriptMatch = source.match(/<script(?:\s+setup)?[^>]*>([\s\S]*?)<\/script>/i)
    const script = scriptMatch ? Dedent(scriptMatch[1]).trim() : ''

    let body = source
        .replace(/<script(?:\s+setup)?[^>]*>[\s\S]*?<\/script>/i, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .trim()

    let template = body
    const templateMatch = body.match(/^<template[^>]*>([\s\S]*)<\/template>$/i)
    if (templateMatch) template = templateMatch[1].trim()

    return { template, script, styles }
}

function IsBindingName(name) {
    return /^[A-Za-z_$][\w$]*$/.test(name) && name !== 'default'
}

function BuildSetup(Vue, Ui, Utils, script) {
    if (!script) return undefined

    const imported = ExtractImportNames(script)
    const clean = StripImports(script).trim()

    if (!clean && !imported.size) return undefined

    const declared = ExtractDeclaredNames(clean)
    const names = new Set([...declared, ...imported])
    const scope = new Set(declared)

    const vueNames = Object.keys(Vue).filter(name => IsBindingName(name) && !scope.has(name))
    vueNames.forEach(name => scope.add(name))

    const uiNames = Object.keys(Ui).filter(name => IsBindingName(name) && !scope.has(name))
    uiNames.forEach(name => scope.add(name))

    const utilNames = Object.keys(Utils).filter(name => IsBindingName(name) && !scope.has(name))
    utilNames.forEach(name => scope.add(name))

    const localNames = Object.keys(LocalApi).filter(name => IsBindingName(name) && !scope.has(name))

    const prelude = [
        vueNames.length ? `const { ${vueNames.join(', ')} } = __pgVue;` : '',
        uiNames.length ? `const { ${uiNames.join(', ')} } = __pgUi;` : '',
        utilNames.length ? `const { ${utilNames.join(', ')} } = __pgUtils;` : '',
        localNames.length ? `const { ${localNames.join(', ')} } = __pgLocal;` : '',
    ].filter(Boolean).join('\n')

    const exposed = [...names]
        .map(name => `${name}: typeof ${name} === 'undefined' ? undefined : ${name}`)
        .join(', ')

    const factory = new Function('__pgVue', '__pgUi', '__pgUtils', '__pgLocal', `
${prelude}
${clean}
return { ${exposed} };
`)

    return () => factory(Vue, Ui, Utils, LocalApi)
}

function ApplyStyles(styles) {
    styleEl?.remove()
    styleEl = null

    if (!styles.length) return

    styleEl = document.createElement('style')
    styleEl.textContent = styles.join('\n')
    document.head.appendChild(styleEl)
}

function ApplyCode(source) {
    applyingCode = true
    loading.clear()
    const parsed = Parse(source)

    parts.html = parsed.template
    parts.js = parsed.script
    parts.css = parsed.styles.join('\n\n').trim()

    nextTick(() => {
        applyingCode = false
    })

    return parsed
}

function OnChannelMessage(event) {
    const data = event.data || {}

    if (data.type === 'ping') {
        playgroundChannel?.postMessage({ type: 'pong', token: data.token })
        return
    }

    if (data.type !== 'code' || !data.code) return

    ApplyCode(data.code)
    error.value = ''
    warning.value = ''
    Run()
}

async function Render() {
    const id = ++renderRun
    const template = parts.html.trim()
    const script = parts.js.trim()
    const style = parts.css.trim()
    const container = PreviewEl.value

    if (!container) return

    if (previewApp) {
        previewApp.unmount()
        previewApp = null
    }

    container.innerHTML = ''
    error.value = ''
    warning.value = ''
    ApplyStyles(style ? [style] : [])

    if (!template) {
        if (script) error.value = '缺少 HTML 模板'
        return
    }

    let Vue
    let ui
    let utils

    try {
        ;[Vue, ui, utils] = await LoadRuntime()
    } catch (err) {
        error.value = err?.message || String(err)
        return
    }

    if (id !== renderRun) return

    let setup
    try {
        setup = BuildSetup(Vue, ui, utils, script)
    } catch (err) {
        error.value = err?.message || String(err)
        return
    }

    const app = Vue.createApp({ template, setup })

    for (const [name, value] of Object.entries(ui)) {
        if (IsComponent(value)) app.component(name, value)
    }

    app.config.errorHandler = err => {
        error.value = err?.message || String(err)
    }

    app.config.warnHandler = msg => {
        warning.value = msg
    }

    try {
        app.mount(container)
    } catch (err) {
        error.value = err?.message || String(err)
        try {
            app.unmount()
        } catch {
            // ignore unmount errors
        }
        return
    }

    if (id !== renderRun) {
        app.unmount()
        return
    }

    previewApp = app
}

function Run() {
    clearTimeout(debounceTimer)
    Render()
}

function Clear() {
    loading.clear()
    parts.html = ''
    parts.js = ''
    parts.css = ''
    Run()
}

function Reset() {
    loading.clear()
    parts.html = DEFAULT_HTML
    parts.js = DEFAULT_JS
    parts.css = DEFAULT_CSS
    Run()
}

watch(() => [parts.html, parts.js, parts.css], () => {
    if (applyingCode) return

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(Render, 350)
})

onMounted(() => {
    document.documentElement.classList.add('wa_playground_active')

    if (typeof BroadcastChannel !== 'undefined') {
        playgroundChannel = new BroadcastChannel(PLAYGROUND_CHANNEL)
        playgroundChannel.onmessage = OnChannelMessage
        playgroundChannel.postMessage({ type: 'ready' })

        readyTimers = [500, 1500, 3000, 6000, 10000].map(delay => setTimeout(() => {
            playgroundChannel?.postMessage({ type: 'ready' })
        }, delay))
    }

    Run()
})

onUnmounted(() => {
    clearTimeout(debounceTimer)
    readyTimers.forEach(timer => clearTimeout(timer))
    readyTimers = []
    renderRun++
    loading.clear()
    document.documentElement.classList.remove('wa_playground_active')
    playgroundChannel?.close()
    playgroundChannel = null
    previewApp?.unmount()
    previewApp = null
    styleEl?.remove()
    styleEl = null
})
</script>

<style>
.pg {
    display: grid;
    gap: 16px;
}

html.wa_playground_active .wa_loading.on {
    pointer-events: none;
}

.pg_head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
}

.pg_title {
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 600;
    letter-spacing: -.02em;
    line-height: 1.2;
}

.pg_desc {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--wa_color_text_muted);
}

.pg_actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.pg_body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
    height: min(680px, calc(100vh - 230px));
    min-height: 440px;
}

.pg_pane {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_surface);
}

.pg_bar {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--wa_color_line);
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}

.pg_editor_column {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.pg_editors {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
    overflow-y: auto;
    padding-right: 2px;
}

.pg_canvas {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 18px;
    background-color: var(--wa_color_canvas);
    background-image: radial-gradient(circle, var(--wa_color_line) 2px, transparent 1px);
    background-size: 16px 16px;
}

.pg_message {
    flex: none;
    margin: 0;
    padding: 10px 12px;
    border-top: 1px solid var(--wa_color_line);
    font: 12px/1.6 var(--wa_font_mono);
    white-space: pre-wrap;
}

.pg_error {
    background: var(--wa_color_danger_soft);
    color: var(--wa_color_danger);
}

.pg_warning {
    background: var(--wa_color_soft);
    color: var(--wa_color_text_muted);
}

@media (max-width: 860px) {
    .pg_body {
        grid-template-columns: minmax(0, 1fr);
        height: auto;
        min-height: 0;
    }

    .pg_editor_column {
        height: 560px;
    }

    .pg_canvas {
        min-height: 300px;
    }
}
</style>
