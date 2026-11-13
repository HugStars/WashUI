<template>
    <section class="pg_editor_block"
        :class="{ 'is_half': max === 'half', 'is_fill': max === 'fill', is_bare: bare }"
        :style="{ '--pg_editor_content_height': `${ContentHeight}px` }">
        <header v-if="!bare" class="pg_editor_head">
            <span class="pg_editor_label">{{ label }}</span>
            <span class="pg_editor_count">{{ modelValue.length }}</span>
        </header>

        <div class="pg_editor_body">
            <div class="pg_editor_inner">
                <pre ref="HighlightEl" class="pg_highlight" aria-hidden="true"><code v-html="highlighted"></code></pre>
                <textarea ref="TextareaEl" class="pg_textarea" :value="modelValue" spellcheck="false" wrap="off"
                    :aria-label="`${label} 代码编辑器`" :placeholder="placeholder" @input="OnInput"
                    @keydown.tab.prevent="OnTab" @scroll="SyncScroll"></textarea>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { highlightCode } from 'wash-ui'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    lang: {
        type: String,
        default: 'html',
    },
    placeholder: {
        type: String,
        default: '',
    },
    max: {
        type: String,
        default: 'third',
        allows: ['third', 'half', 'fill'],
    },
    /** 去掉外框和标题，撑满父容器，供实验场的标签式编辑器使用 */
    bare: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const HighlightEl = ref(null)
const TextareaEl = ref(null)
const highlighted = ref('')
let highlightRun = 0
let highlightTimer = null

const ContentHeight = computed(() => {
    const lines = props.modelValue ? props.modelValue.split('\n').length : 1
    return Math.max(92, Math.ceil(lines * 22.1 + 24))
})

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

    try {
        const html = await highlightCode(props.modelValue, props.lang, { block: false })
        if (id !== highlightRun) return
        highlighted.value = html || EscapeHtml(props.modelValue)
    } catch {
        if (id === highlightRun) highlighted.value = EscapeHtml(props.modelValue)
    }

    nextTick(SyncScroll)
}

function ScheduleHighlight() {
    highlighted.value = EscapeHtml(props.modelValue)
    clearTimeout(highlightTimer)
    highlightTimer = setTimeout(UpdateHighlight, 90)
}

function OnInput(event) {
    emit('update:modelValue', event.target.value)
}

function OnTab(event) {
    const el = event.target
    const start = el.selectionStart
    const end = el.selectionEnd

    emit('update:modelValue', props.modelValue.slice(0, start) + '  ' + props.modelValue.slice(end))
    nextTick(() => {
        el.selectionStart = el.selectionEnd = start + 2
    })
}

watch(() => props.modelValue, ScheduleHighlight)
watch(() => props.lang, ScheduleHighlight)

onMounted(ScheduleHighlight)

onUnmounted(() => {
    clearTimeout(highlightTimer)
    highlightRun++
})
</script>

<style>
.pg_editor_block {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    min-height: 0;
    max-height: calc((100% - 24px) / 3);
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_field);
}

.pg_editor_block.is_half {
    max-height: calc((100% - 12px) / 2);
}

.pg_editor_block.is_fill {
    flex: 1 1 auto;
    max-height: none;
    min-height: 120px;
}

/* * bare：实验场标签页里的单编辑器，占满父容器，不再自带外框和标题 */
.pg_editor_block.is_bare {
    flex: 1 1 auto;
    height: 100%;
    max-height: none;
    min-height: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
}

.pg_editor_block.is_bare:focus-within {
    border-color: transparent;
}

.pg_editor_block.is_bare .pg_editor_body {
    flex: 1 1 auto;
    height: auto;
    min-height: 0;
}

.pg_editor_block:focus-within {
    border-color: var(--wa_color_text);
}

.pg_editor_head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 7px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--wa_color_line);
    color: var(--wa_color_text_subtle);
    font-size: 12px;
    line-height: 1.4;
}

.pg_editor_label {
    font-weight: 600;
    color: var(--wa_color_text);
}

.pg_editor_count {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
}

.pg_editor_body {
    flex: 1 1 auto;
    height: var(--pg_editor_content_height, 120px);
    min-height: 0;
    overflow: hidden;
}

.pg_editor_inner {
    position: relative;
    height: 100%;
    min-height: 0;
    overflow: hidden;
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
    padding: 12px 14px;
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

.pg_textarea::placeholder {
    color: var(--wa_color_text_subtle);
}

.pg_textarea::selection {
    color: transparent;
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
</style>
