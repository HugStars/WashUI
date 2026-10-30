<template>
    <div v-if="plain" class="wa_code wa_code_plain" :class="`shj-lang-${Language}`" v-html="Html"></div>
    <div v-else class="wa_code">
        <header v-if="showHeader" class="wa_code_head">
            <span v-if="showLang" class="wa_code_lang">{{ languageLabel }}</span>
            <button v-if="copyable" type="button" class="wa_code_copy" :aria-label="copied ? '已复制' : '复制代码'"
                @click="Copy">
                {{ copied ? '已复制' : '复制' }}
            </button>
        </header>
        <div class="wa_code_body" :style="BodyStyle">
            <div class="wa_code_pre" :class="`shj-lang-${Language} shj-block`" v-html="Html"></div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { highlightHTML } from '@speed-highlight/core'
import { codeLanguageLabel, codeLanguageNames, normalizeCodeLang } from '../core/code_languages.js'
import { useClipboard } from '../composables/useClipboard.js'

const props = defineProps({
    code: {
        type: String,
        default: ''
    },
    lang: {
        type: String,
        default: 'plain',
        allows: codeLanguageNames,
    },
    showLineNumbers: Boolean,
    showLang: {
        type: Boolean,
        default: true,
    },
    copyable: {
        type: Boolean,
        default: true,
    },
    maxHeight: {
        type: [Number, String],
        default: 0,
    },
    // 无框模式
    plain: {
        type: Boolean,
        default: false,
    },
})

const Language = computed(() => normalizeCodeLang(props.lang))
const languageLabel = computed(() => codeLanguageLabel(props.lang))
const showHeader = computed(() => props.showLang || props.copyable)
const Html = ref('')
const { copied, copy } = useClipboard()

const BodyStyle = computed(() => {
    const value = props.maxHeight
    if (!value || value === '0') return undefined
    return { maxHeight: typeof value === 'number' ? `${value}px` : value }
})

let run = 0

function Escape(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
}

async function Render() {
    const id = ++run
    const source = props.code || ''

    if (!Html.value) Html.value = Escape(source)

    try {
        const html = await highlightHTML(source, Language.value, {
            // plain 模式只输出高亮 span，不生成块级行号结构
            block: !props.plain,
            showLineNumbers: props.showLineNumbers,
        })
        if (id === run) Html.value = html
    } catch {
        if (id === run) Html.value = Escape(source)
    }
}

function Copy() {
    copy(props.code || '')
}

onBeforeUnmount(() => {
    run++
})

watch(
    [() => props.code, Language, () => props.showLineNumbers, () => props.plain],
    Render,
    { immediate: true }
)
</script>

<style>
.wa_code {
    --wa_code_kwd: var(--wa_color_danger);
    --wa_code_str: var(--wa_color_success);
    --wa_code_num: var(--wa_color_warning);
    --wa_code_cmnt: var(--wa_color_text_faint);
    --wa_code_func: var(--wa_color_help);
    --wa_code_type: var(--wa_color_accent);
    --wa_code_var: var(--wa_color_text_muted);
    --wa_code_oper: var(--wa_color_text_muted);
    --wa_code_bool: var(--wa_color_warning);
    --wa_code_class: var(--wa_color_warning);
    --wa_code_section: var(--wa_color_help);
    --wa_code_esc: var(--wa_color_warning);
    --wa_code_insert: var(--wa_color_success);
    --wa_code_deleted: var(--wa_color_danger);
    --wa_code_err: var(--wa_color_danger);
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_field);
    font-family: var(--wa_font_mono);
}

.wa_code_head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px 8px 14px;
    border-bottom: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
}

.wa_code_lang {
    overflow: hidden;
    color: var(--wa_color_text_subtle);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .02em;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_code_copy {
    flex: none;
    margin-left: auto;
    padding: 3px 8px;
    border: 0;
    border-radius: var(--wa_radius_small);
    color: var(--wa_color_text_subtle);
    background: transparent;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.wa_code_copy:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_code_copy:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_code_body {
    overflow: auto;
}

.wa_code_pre {
    min-width: max-content;
    padding: 14px 16px;
    color: var(--wa_color_text);
    font: 13px/1.7 var(--wa_font_mono);
    tab-size: 4;
    white-space: pre;
}

.wa_code_pre>div {
    display: flex;
}

.wa_code_pre>div>div:last-child {
    flex: 1;
}

.wa_code .shj-numbers {
    flex: none;
    margin-right: 14px;
    padding-right: 12px;
    border-right: 1px solid var(--wa_color_line);
    color: var(--wa_color_text_faint);
    text-align: right;
    user-select: none;
    counter-reset: wa_code_line;
}

.wa_code .shj-numbers:empty {
    display: none;
}

.wa_code .shj-numbers>div::before {
    counter-increment: wa_code_line;
    content: counter(wa_code_line);
}

.wa_code .shj-syn-kwd {
    color: var(--wa_code_kwd);
}

.wa_code .shj-syn-str {
    color: var(--wa_code_str);
}

.wa_code .shj-syn-num {
    color: var(--wa_code_num);
}

.wa_code .shj-syn-cmnt {
    color: var(--wa_code_cmnt);
    font-style: italic;
}

.wa_code .shj-syn-func {
    color: var(--wa_code_func);
}

.wa_code .shj-syn-type {
    color: var(--wa_code_type);
}

.wa_code .shj-syn-var {
    color: var(--wa_code_var);
}

.wa_code .shj-syn-oper {
    color: var(--wa_code_oper);
}

.wa_code .shj-syn-bool {
    color: var(--wa_code_bool);
}

.wa_code .shj-syn-class {
    color: var(--wa_code_class);
}

.wa_code .shj-syn-section {
    color: var(--wa_code_section);
}

.wa_code .shj-syn-esc {
    color: var(--wa_code_esc);
}

.wa_code .shj-syn-insert {
    color: var(--wa_code_insert);
}

.wa_code .shj-syn-deleted {
    color: var(--wa_code_deleted);
}

.wa_code .shj-syn-err {
    color: var(--wa_code_err);
    font-weight: 600;
}

/* 无框模式：单个内联 code，只保留语法高亮文字 */
.wa_code_plain {
    display: inline;
    overflow: visible;
    border: 0;
    background: none;
    white-space: pre;
}
</style>