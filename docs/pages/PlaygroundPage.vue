<template>
    <div class="pg">
        <header class="pg_head">
            <div>
                <h1 class="pg_title">实时编辑预览</h1>
                <p class="pg_desc">支持 Vue 模板片段和简单的 <code>&lt;script setup&gt;</code> / <code>&lt;style&gt;</code>；暂不支持 import 与 defineProps。</p>
            </div>
            <div class="pg_actions">
                <AppButton variant="line" @click="Reset">示例</AppButton>
                <AppButton variant="line" @click="Clear">清空</AppButton>
                <AppButton variant="primary" @click="Run">运行</AppButton>
            </div>
        </header>

        <div class="pg_body">
            <section class="pg_pane pg_editor_pane">
                <div class="pg_bar">
                    <span>Vue SFC</span>
                    <span class="wa_hint">{{ code.length }} 字符</span>
                </div>
                <div class="pg_editor">
                    <pre ref="HighlightEl" class="pg_highlight" aria-hidden="true"><code v-html="highlighted"></code></pre>
                    <textarea ref="TextareaEl" v-model="code" class="pg_textarea" spellcheck="false" wrap="off"
                        placeholder="粘贴组件代码..." @keydown.tab.prevent="OnTab" @scroll="SyncScroll"></textarea>
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
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { PLAYGROUND_CHANNEL } from '../playground-bridge.js'

const SCRIPT_OPEN = '<' + 'script setup>'
const SCRIPT_CLOSE = '</' + 'script>'

const DEFAULT_CODE = `${SCRIPT_OPEN}
const count = ref(0)
${SCRIPT_CLOSE}

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
    <AppButton variant="primary" @click="count++">点击了 {{ count }} 次</AppButton>
    <AppButton variant="line">描边按钮</AppButton>
    <AppChip active>标记</AppChip>
    <AppIcon name="home" :size="24" />
  </div>
</template>`

const code = ref(DEFAULT_CODE)
const error = ref('')
const warning = ref('')
const PreviewEl = ref(null)
const HighlightEl = ref(null)
const TextareaEl = ref(null)
const highlighted = ref('')

let runtimePromise = null
let previewApp = null
let renderRun = 0
let debounceTimer = null
let highlightRun = 0
let highlightTimer = null
let playgroundChannel = null
let readyTimer = 0

function LoadRuntime() {
    if (!runtimePromise) {
        runtimePromise = Promise.all([
            import('vue/dist/vue.esm-bundler.js'),
            import('@wash/ui'),
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

const SETUP_HELPERS = 'ref, computed, reactive, readonly, shallowRef, shallowReactive, watch, watchEffect, nextTick, onMounted, onUnmounted, onBeforeUnmount, toRef, toRefs, unref, isRef, markRaw, provide, inject, h, defineComponent, useId'

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

function BuildSetup(Vue, script) {
    if (!script) return undefined

    const clean = script
        .replace(/^\s*import\s+(?:[\s\S]*?\s+from\s+)?['"][^'"]+['"];?\s*$/gm, '')
        .trim()

    if (!clean) return undefined

    const names = new Set()

    for (const match of clean.matchAll(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)/gm)) names.add(match[1])
    for (const match of clean.matchAll(/^function\s+([A-Za-z_$][\w$]*)/gm)) names.add(match[1])

    const factory = new Function('Vue', `
const { ${SETUP_HELPERS} } = Vue;
${clean}
return { ${[...names].join(', ')} };
`)

    return () => factory(Vue)
}

function ApplyStyles(styles) {
    styleEl?.remove()
    styleEl = null

    if (!styles.length) return

    styleEl = document.createElement('style')
    styleEl.textContent = styles.join('\n')
    document.head.appendChild(styleEl)
}

function EscapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
}

function SyncScroll() {
    const textarea = TextareaEl.value
    const pre = HighlightEl.value
    if (!textarea || !pre) return
    pre.scrollTop = textarea.scrollTop
    pre.scrollLeft = textarea.scrollLeft
}

async function UpdateHighlight() {
    const id = ++highlightRun
    const source = code.value

    try {
        const [, ui] = await LoadRuntime()
        const html = await ui.highlightCode(source, 'html', { block: false })
        if (id !== highlightRun) return
        highlighted.value = html || EscapeHtml(source)
    } catch {
        if (id === highlightRun) highlighted.value = EscapeHtml(source)
    }

    nextTick(SyncScroll)
}

function ScheduleHighlight() {
    highlighted.value = EscapeHtml(code.value)
    clearTimeout(highlightTimer)
    highlightTimer = setTimeout(UpdateHighlight, 90)
}

function OnChannelMessage(event) {
    const data = event.data || {}

    if (data.type === 'ping') {
        playgroundChannel?.postMessage({ type: 'pong', token: data.token })
    } else if (data.type === 'code' && data.code) {
        code.value = data.code
        error.value = ''
        warning.value = ''
        Run()
    }
}

async function Render() {
    const id = ++renderRun
    const parsed = Parse(code.value)
    const container = PreviewEl.value

    if (!container) return

    if (previewApp) {
        previewApp.unmount()
        previewApp = null
    }

    container.innerHTML = ''
    error.value = ''
    warning.value = ''
    ApplyStyles(parsed.styles)

    if (!parsed.template) {
        if (parsed.script) error.value = '缺少 <template> 或模板片段'
        return
    }

    let Vue
    let ui

    try {
        ;[Vue, ui] = await LoadRuntime()
    } catch (err) {
        error.value = err?.message || String(err)
        return
    }

    if (id !== renderRun) return

    let setup
    try {
        setup = BuildSetup(Vue, parsed.script)
    } catch (err) {
        error.value = err?.message || String(err)
        return
    }

    const app = Vue.createApp({ template: parsed.template, setup })

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
    code.value = ''
    Run()
}

function Reset() {
    code.value = DEFAULT_CODE
    Run()
}

function OnTab(event) {
    const el = event.target
    const start = el.selectionStart
    const end = el.selectionEnd

    code.value = code.value.slice(0, start) + '  ' + code.value.slice(end)
    nextTick(() => {
        el.selectionStart = el.selectionEnd = start + 2
    })
}

watch(code, () => {
    ScheduleHighlight()
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(Render, 350)
})

onMounted(() => {
    highlighted.value = EscapeHtml(code.value)
    UpdateHighlight()
    Render()

    if (typeof BroadcastChannel !== 'undefined') {
        playgroundChannel = new BroadcastChannel(PLAYGROUND_CHANNEL)
        playgroundChannel.onmessage = OnChannelMessage
        playgroundChannel.postMessage({ type: 'ready' })
        readyTimer = setTimeout(() => {
            playgroundChannel?.postMessage({ type: 'ready' })
        }, 600)
    }
})

onUnmounted(() => {
    clearTimeout(debounceTimer)
    clearTimeout(highlightTimer)
    clearTimeout(readyTimer)
    renderRun++
    highlightRun++
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

.pg_editor {
    position: relative;
    flex: 1;
    min-height: 0;
    background: var(--wa_color_field);
}

.pg_editor_pane:focus-within {
    border-color: var(--wa_color_text);
}

.pg_textarea:active,
.pg_textarea:focus,
.pg_textarea:focus-visible {
    outline: none;
    border: 0;
    box-shadow: none;
}

.pg_highlight,
.pg_textarea {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 14px 16px;
    font: 13px/1.7 var(--wa_font_mono);
    tab-size: 4;
    white-space: pre;
    overflow: auto;
}

.pg_highlight {
    overflow: hidden;
    color: var(--wa_color_text);
    pointer-events: none;
    scrollbar-width: none;
}

.pg_highlight code {
    font: inherit;
}

.pg_textarea {
    border: 0;
    outline: 0;
    resize: none;
    background: transparent;
    color: transparent;
    caret-color: var(--wa_color_text);
    scrollbar-width: none;
}

.pg_textarea::selection {
    background: var(--wa_color_active);
}

.pg_textarea::-webkit-scrollbar,
.pg_highlight::-webkit-scrollbar {
    display: none;
}

.pg_highlight .shj-syn-kwd {
    color: var(--wa_color_danger);
}

.pg_highlight .shj-syn-str {
    color: var(--wa_color_success);
}

.pg_highlight .shj-syn-num {
    color: var(--wa_color_warning);
}

.pg_highlight .shj-syn-cmnt {
    color: var(--wa_color_text_subtle);
    font-style: italic;
}

.pg_highlight .shj-syn-func {
    color: var(--wa_color_help);
}

.pg_highlight .shj-syn-type {
    color: var(--wa_color_accent);
}

.pg_highlight .shj-syn-var {
    color: var(--wa_color_text_muted);
}

.pg_highlight .shj-syn-oper {
    color: var(--wa_color_text_muted);
}

.pg_highlight .shj-syn-bool {
    color: var(--wa_color_warning);
}

.pg_highlight .shj-syn-class {
    color: var(--wa_color_warning);
}

.pg_highlight .shj-syn-section {
    color: var(--wa_color_help);
}

.pg_highlight .shj-syn-esc {
    color: var(--wa_color_warning);
}

.pg_highlight .shj-syn-insert {
    color: var(--wa_color_success);
}

.pg_highlight .shj-syn-deleted {
    color: var(--wa_color_danger);
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

    .pg_editor {
        min-height: 320px;
    }

    .pg_canvas {
        min-height: 300px;
    }
}
</style>
