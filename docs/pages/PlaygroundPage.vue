<template>
    <div class="pg">
        <div class="pg_top">
            <header class="pg_head">
                <div class="pg_head_text">
                    <h1 class="pg_title">实验场</h1>
                    <p class="pg_desc">
                        单个编辑器，按 HTML / JS / CSS 标签切换，自动组合并预览；不需要书写
                        <code>&lt;template&gt;</code>、<code>&lt;script setup&gt;</code> 与 <code>&lt;style&gt;</code> 标签。
                    </p>
                </div>
            </header>

            <div class="pg_toolbar">
                <AppTabs v-model="MobileView" class="pg_mobile_tabs" variant="group" size="sm" :items="MobileTabs" />

                <div class="pg_actions">
                    <AppChip :active="autoRun" size="sm" title="自动运行开关"
                        @click="autoRun = !autoRun">自动运行</AppChip>
                    <AppIconButton name="refresh" label="重置" @click.stop="Reset" />
                    <AppIconButton name="trash" label="清空" @click.stop="Clear" />
                    <AppButton variant="icon" size="sm" class="pg_run_btn" title="运行" aria-label="运行"
                        @click.stop="Run">
                        <AppIcon name="play-fill" :size="14" />
                    </AppButton>
                </div>
            </div>
        </div>

        <div ref="WorkspaceEl" class="pg_workspace" :style="{ '--pg_split': `${Split}%` }">
            <section class="pg_editor_pane" :class="{ 'pg_pane_hidden': MobileView === 'preview' }">
                <header class="pg_pane_bar">
                    <div class="pg_file_tabs" role="tablist" aria-label="文件">
                        <button v-for="editor in editors" :key="editor.key" type="button" class="pg_file_tab"
                            :class="{ on: ActiveFile === editor.key }" role="tab"
                            :aria-selected="ActiveFile === editor.key" @click="ActiveFile = editor.key">
                            {{ editor.label }}
                            <span class="pg_file_count">{{ parts[editor.key].length }}</span>
                        </button>
                    </div>
                </header>

                <div class="pg_editor_host">
                    <PlaygroundEditor :key="ActiveFile" v-model="parts[ActiveFile]" :label="ActiveEditor.label"
                        :lang="ActiveEditor.lang" :placeholder="ActiveEditor.placeholder" bare />
                </div>

                <footer class="pg_status">
                    <span>{{ LineCount }} 行 · {{ CharCount }} 字符</span>
                    <span v-if="ErrorCount" class="pg_status_error">{{ ErrorCount }} 个错误</span>
                    <span v-else class="pg_status_ok">{{ ActionHint || '就绪' }}</span>
                </footer>
            </section>

            <div class="pg_splitter" role="separator" aria-orientation="vertical" title="拖动调整宽度"
                @pointerdown="StartSplit"></div>

            <section class="pg_preview_pane"
                :class="{ 'pg_pane_hidden': MobileView === 'code', 'pg_preview_fullscreen': PreviewFullscreen }">
                <header class="pg_pane_bar">
                    <span class="pg_pane_title">预览</span>
                    <div class="pg_viewports" role="group" aria-label="预览宽度">
                        <AppIconButton v-for="item in viewports" :key="item.name" :name="item.icon"
                            :label="item.label" :class="{ on: Viewport === item.name }"
                            @click.stop="Viewport = item.name" />
                    </div>
                    <AppIconButton :name="PreviewFullscreen ? 'fullscreen-exit' : 'fullscreen'"
                        :label="PreviewFullscreen ? '退出全屏' : '全屏预览'"
                        @click.stop="PreviewFullscreen = !PreviewFullscreen" />
                </header>

                <div class="pg_canvas_wrap">
                    <div ref="PreviewEl" class="pg_canvas" :style="CanvasStyle"></div>
                </div>

                <p v-if="error" class="pg_message pg_error">{{ error }}</p>
                <p v-else-if="warning" class="pg_message pg_warning">{{ warning }}</p>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
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
const WorkspaceEl = ref(null)

// section 实验场界面状态
const MobileTabs = [
    { name: 'code', label: '代码' },
    { name: 'preview', label: '预览' }
]
const MobileView = ref('code')
const ActiveFile = ref('html')
const autoRun = ref(true)
const Viewport = ref('auto')
const Split = ref(50)
const PreviewFullscreen = ref(false)
const ActionHint = ref('')
let ActionTimer = null

function FlashAction(text) {
    ActionHint.value = text
    clearTimeout(ActionTimer)
    ActionTimer = setTimeout(() => {
        ActionHint.value = ''
    }, 1200)
}

const viewports = [
    { name: 'auto', label: '自适应', icon: 'fullscreen' },
    { name: 'desktop', label: '桌面', icon: 'monitor' },
    { name: 'tablet', label: '平板', icon: 'layout' },
    { name: 'mobile', label: '手机', icon: 'phone' }
]

const VIEWPORT_WIDTHS = {
    auto: '100%',
    desktop: '1280px',
    tablet: '820px',
    mobile: '390px'
}

const ActiveEditor = computed(() => editors.find(editor => editor.key === ActiveFile.value) || editors[0])
const LineCount = computed(() => parts[ActiveFile.value].split('\n').length)
const CharCount = computed(() => parts[ActiveFile.value].length)
const ErrorCount = computed(() => error.value ? 1 : 0)
const CanvasStyle = computed(() => ({ maxWidth: VIEWPORT_WIDTHS[Viewport.value] }))

// section 分栏拖拽
let Splitting = false

function StartSplit(event) {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches) return
    Splitting = true
    event.preventDefault()
    window.addEventListener('pointermove', OnSplitMove)
    window.addEventListener('pointerup', StopSplit)
}

function OnSplitMove(event) {
    if (!Splitting || !WorkspaceEl.value) return

    const rect = WorkspaceEl.value.getBoundingClientRect()
    const next = (event.clientX - rect.left) / rect.width * 100
    Split.value = Math.min(72, Math.max(30, next))
}

function StopSplit() {
    Splitting = false
    window.removeEventListener('pointermove', OnSplitMove)
    window.removeEventListener('pointerup', StopSplit)
}

function OnKeydown(event) {
    if (event.key === 'Escape' && PreviewFullscreen.value) PreviewFullscreen.value = false
}
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
    FlashAction('已运行')
    Render()
}

function Clear() {
    loading.clear()
    parts.html = ''
    parts.js = ''
    parts.css = ''
    Run()
    FlashAction('已清空')
}

function Reset() {
    loading.clear()
    parts.html = DEFAULT_HTML
    parts.js = DEFAULT_JS
    parts.css = DEFAULT_CSS
    Run()
    FlashAction('已重置')
}

watch(() => [parts.html, parts.js, parts.css], () => {
    if (applyingCode || !autoRun.value) return

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(Render, 350)
})

onMounted(() => {
    document.documentElement.classList.add('wa_playground_active')
    window.addEventListener('keydown', OnKeydown)

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
    clearTimeout(ActionTimer)
    readyTimers.forEach(timer => clearTimeout(timer))
    readyTimers = []
    renderRun++
    loading.clear()
    window.removeEventListener('keydown', OnKeydown)
    StopSplit()
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
    gap: 14px;
}

html.wa_playground_active .wa_loading.on {
    pointer-events: none;
}

.pg_head {
    min-width: 0;
}

.pg_top {
    position: relative;
    z-index: 3;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 12px;
}

.pg_toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-width: 0;
}

.pg_actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
}

.pg_actions .wa_icon_btn {
    width: 28px;
    height: 26px;
}

.pg_run_btn.wa_btn_icon {
    width: 28px;
    height: 26px;
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
}

.pg_run_btn.wa_btn_icon:hover:not(:disabled),
.pg_run_btn.wa_btn_icon:active:not(:disabled) {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
    opacity: .88;
}

.pg_title {
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 600;
    letter-spacing: -.02em;
    line-height: 1.2;
}

.pg_desc {
    max-width: 760px;
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--wa_color_text_muted);
}

.pg_mobile_tabs {
    display: none;
}

.pg_workspace {
    display: grid;
    grid-template-columns: minmax(0, var(--pg_split, 50%)) 6px minmax(0, 1fr);
    height: min(700px, calc(100vh - 220px));
    min-height: 460px;
}

.pg_editor_pane,
.pg_preview_pane {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_surface);
}

.pg_pane_bar {
    position: relative;
    z-index: 2;
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
    min-height: 38px;
    padding: 4px 6px 4px 10px;
    border-bottom: 1px solid var(--wa_color_line);
}

.pg_file_tabs {
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
}

.pg_file_tabs::-webkit-scrollbar {
    display: none;
}

.pg_file_tab {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 10px;
    border: 0;
    border-radius: 7px;
    color: var(--wa_color_text_subtle);
    background: transparent;
    font: inherit;
    font-size: 12px;
    line-height: 1.4;
    white-space: nowrap;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.pg_file_tab:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.pg_file_tab.on {
    color: var(--wa_color_text);
    background: var(--wa_color_active);
    font-weight: 600;
}

.pg_file_count {
    color: var(--wa_color_text_faint);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.pg_editor_host {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    background: var(--wa_color_code_bg, var(--wa_color_field));
}

.pg_status {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 12px;
    border-top: 1px solid var(--wa_color_line);
    font-size: 11px;
    line-height: 1.4;
    color: var(--wa_color_text_faint);
}

.pg_status_error {
    color: var(--wa_color_danger);
}

.pg_status_ok {
    color: var(--wa_color_text_faint);
}

.pg_splitter {
    position: relative;
    cursor: col-resize;
    touch-action: none;
}

.pg_splitter::after {
    content: '';
    position: absolute;
    inset: 0 2px;
    border-radius: var(--wa_radius_pill);
    background: transparent;
    transition: background var(--wa_duration_fast) var(--wa_ease_out);
}

.pg_splitter:hover::after,
.pg_splitter:active::after {
    background: var(--wa_color_line_strong);
}

.pg_pane_title {
    font-size: 12px;
    font-weight: 600;
    color: var(--wa_color_text_muted);
}

.pg_viewports {
    display: flex;
    gap: 2px;
    margin-left: auto;
}

.pg_viewports .wa_icon_btn {
    width: 28px;
    height: 26px;
}

.pg_viewports .wa_icon_btn.on {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
}

.pg_viewports .wa_icon_btn.on:hover:not(:disabled) {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
    opacity: .88;
}

.pg_canvas_wrap {
    flex: 1;
    min-height: 0;
    overflow: auto;
    background: var(--wa_color_canvas);
}

.pg_canvas {
    width: 100%;
    min-height: 100%;
    margin-inline: auto;
    padding: 20px;
    background: var(--wa_color_canvas);
    transition: max-width var(--wa_duration_slow) var(--wa_ease_out);
}

.pg_message {
    flex: none;
    max-height: 140px;
    margin: 0;
    padding: 10px 12px;
    overflow: auto;
    border-top: 1px solid var(--wa_color_line);
    font: 12px/1.6 var(--wa_font_mono);
    white-space: pre-wrap;
}

.pg_error {
    color: var(--wa_color_danger);
    background: var(--wa_color_danger_soft);
}

.pg_warning {
    color: var(--wa_color_text_muted);
    background: var(--wa_color_soft);
}

/* * 全屏预览：覆盖文档布局，Esc 或右上角按钮退出 */
.pg_preview_fullscreen {
    position: fixed;
    inset: 0;
    z-index: var(--wa_z_toast);
    border: 0;
    border-radius: 0;
}

.pg_preview_fullscreen .pg_canvas {
    padding: 28px;
}

@media (max-width: 860px) {
    .pg_top {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
    }

    .pg_head {
        display: none;
    }

    .pg_toolbar {
        justify-content: space-between;
        gap: 8px;
    }

    .pg_mobile_tabs {
        display: flex;
        flex: 1;
        min-width: 0;
    }

    .pg_actions {
        margin-left: auto;
    }

    .pg_workspace {
        display: block;
        height: calc(100dvh - 236px - env(safe-area-inset-bottom));
        min-height: 300px;
    }

    .pg_editor_pane,
    .pg_preview_pane {
        height: 100%;
    }

    .pg_pane_hidden {
        display: none;
    }

    .pg_splitter {
        display: none;
    }

    .pg_canvas {
        padding: 14px;
    }

    .pg_preview_fullscreen .pg_canvas {
        padding: 18px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .pg_canvas {
        transition: none;
    }
}
</style>
