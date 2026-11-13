<template>
    <code v-if="inline" class="wa_code wa_code_inline" :class="`shj-lang-${Language}`" v-html="Html"></code>
    <div v-else class="wa_code"
        :class="{ wa_code_plain: plain, wa_code_float: showLang || copyable, wa_code_has_numbers: showLineNumbers }">
        <span v-if="showLang" class="wa_code_lang">{{ languageLabel }}</span>
        <button v-if="copyable" type="button" class="wa_code_copy" :class="{ on: copied }"
            :aria-label="copied ? '已复制' : '复制代码'" :title="copied ? '已复制' : '复制代码'" @click="Copy">
            <AppIcon :name="copied ? 'check' : 'copy'" :size="13" />
            <span class="wa_code_copy_text">{{ copied ? '已复制' : '复制' }}</span>
        </button>
        <div class="wa_code_body" :style="BodyStyle">
            <div class="wa_code_pre" :class="`shj-lang-${Language} shj-block`" v-html="Html"></div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { highlightHTML } from '@speed-highlight/core'
import { codeLanguageLabel, normalizeCodeLang } from '../core/code_languages.js'
import { toast } from '../core/toast.js'
import { useClipboard } from '../composables/useClipboard.js'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    code: {
        type: String,
        default: ''
    },
    /**
     * @type {string} 可选值见 codeLanguageNames
     */
    lang: {
        type: String,
        default: 'plain',
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
    // 平铺模式：无边框、无背景、无圆角，语言与复制浮动在代码上方
    plain: {
        type: Boolean,
        default: false,
    },
    // 行内代码：只输出高亮文字，不含语言与复制
    inline: {
        type: Boolean,
        default: false,
    },
})

const Language = computed(() => normalizeCodeLang(props.lang))
const languageLabel = computed(() => codeLanguageLabel(props.lang))
const Flat = computed(() => props.plain || props.inline)
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
            // 平铺与行内模式只输出高亮 span，不生成块级行号结构
            block: !Flat.value,
            showLineNumbers: props.showLineNumbers && !Flat.value,
        })
        if (id === run) Html.value = html
    } catch {
        if (id === run) Html.value = Escape(source)
    }
}

async function Copy() {
    const ok = await copy(props.code || '')
    if (ok) toast.success('已复制代码')
    else toast.danger('复制失败')
}

onBeforeUnmount(() => {
    run++
})

watch(
    [() => props.code, Language, () => props.showLineNumbers, () => props.plain, () => props.inline],
    Render,
    { immediate: true }
)
</script>

<style>
.wa_code {
    --wa_code_color_kwd: var(--wa_code_kwd, var(--wa_color_danger));    --wa_code_color_str: var(--wa_code_str, var(--wa_color_success));
    --wa_code_color_num: var(--wa_code_num, var(--wa_color_warning));
    --wa_code_color_cmnt: var(--wa_code_cmnt, var(--wa_color_text_subtle));
    --wa_code_color_func: var(--wa_code_func, var(--wa_color_help));
    --wa_code_color_type: var(--wa_code_type, var(--wa_color_accent));
    --wa_code_color_var: var(--wa_code_var, var(--wa_color_text_muted));
    --wa_code_color_oper: var(--wa_code_oper, var(--wa_color_text_muted));
    --wa_code_color_bool: var(--wa_code_bool, var(--wa_color_warning));
    --wa_code_color_class: var(--wa_code_class, var(--wa_color_warning));
    --wa_code_color_section: var(--wa_code_section, var(--wa_color_help));
    --wa_code_color_esc: var(--wa_code_esc, var(--wa_color_warning));
    --wa_code_color_insert: var(--wa_code_insert, var(--wa_color_success));
    --wa_code_color_deleted: var(--wa_code_deleted, var(--wa_color_danger));
    --wa_code_color_err: var(--wa_code_err, var(--wa_color_danger));
    position: relative;
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_code_bg);
    font-family: var(--wa_font_mono);
}

.wa_code_lang {
    position: absolute;
    z-index: 2;
    top: 10px;
    left: 14px;
    overflow: hidden;
    max-width: calc(100% - 100px);
    color: var(--wa_color_text_subtle);
    font: 600 11px/1.4 var(--wa_font_mono);
    letter-spacing: .03em;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
}

.wa_code_copy {
    position: absolute;
    z-index: 2;
    top: 5px;
    right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: auto;
    height: 24px;
    padding: 0 8px;
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_subtle);
    background: transparent;
    font: inherit;
    font-family: var(--wa_font_family);
    font-size: 11px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    opacity: 0;
    transform-origin: center;
    transition:
        opacity var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_code_copy svg {
    flex: none;
}

.wa_code_copy_text {
    line-height: 1;
}

.wa_code:hover .wa_code_copy,
.wa_code_copy:focus-visible,
.wa_code_copy.on {
    opacity: 1;
}

.wa_code_copy:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_code_copy:active:not(:disabled) {
    transform: scale(.86);
}

.wa_code_copy.on {
    color: var(--wa_color_success);
}

.wa_code_copy.on svg {
    animation: wa_code_check_in var(--wa_duration_medium) var(--wa_ease_spring) both;
}

@keyframes wa_code_check_in {
    from {
        opacity: 0;
        transform: scale(.4) rotate(-24deg);
    }

    to {
        opacity: 1;
        transform: scale(1) rotate(0);
    }
}

@media (hover: none) {

    .wa_code_copy {
        opacity: 1;
    }
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

.wa_code_float .wa_code_pre {
    padding-top: 34px;
}

.wa_code_pre>div {
    display: flex;
}

.wa_code_pre>div>div:last-child {
    flex: 1;
}

.wa_code .shj-numbers {
    position: sticky;
    left: 0;
    z-index: 1;
    flex: none;
    align-self: stretch;
    margin-right: 14px;
    padding-right: 12px;
    border-right: 1px solid var(--wa_color_line);
    color: var(--wa_color_text_faint);
    background: var(--wa_color_code_bg);
    text-align: right;
    user-select: none;
    counter-reset: wa_code_line;
}

/* * 有行号时去掉 pre 的左内边距，数字列从最左侧开始，sticky 不会再“先跟随再归零” */
.wa_code_has_numbers .wa_code_pre {
    padding-left: 0;
}

.wa_code_has_numbers .shj-numbers {
    padding-left: 16px;
}

.wa_code .shj-numbers:empty {
    display: none;
}

.wa_code .shj-numbers>div::before {
    counter-increment: wa_code_line;
    content: counter(wa_code_line);
}

.wa_code .shj-syn-kwd {
    color: var(--wa_code_color_kwd);
}

.wa_code .shj-syn-str {
    color: var(--wa_code_color_str);
}

.wa_code .shj-syn-num {
    color: var(--wa_code_color_num);
}

.wa_code .shj-syn-cmnt {
    color: var(--wa_code_color_cmnt);
    font-style: italic;
}

.wa_code .shj-syn-func {
    color: var(--wa_code_color_func);
}

.wa_code .shj-syn-type {
    color: var(--wa_code_color_type);
}

.wa_code .shj-syn-var {
    color: var(--wa_code_color_var);
}

.wa_code .shj-syn-oper {
    color: var(--wa_code_color_oper);
}

.wa_code .shj-syn-bool {
    color: var(--wa_code_color_bool);
}

.wa_code .shj-syn-class {
    color: var(--wa_code_color_class);
}

.wa_code .shj-syn-section {
    color: var(--wa_code_color_section);
}

.wa_code .shj-syn-esc {
    color: var(--wa_code_color_esc);
}

.wa_code .shj-syn-insert {
    color: var(--wa_code_color_insert);
}

.wa_code .shj-syn-deleted {
    color: var(--wa_code_color_deleted);
}

.wa_code .shj-syn-err {
    color: var(--wa_code_color_err);
    font-weight: 600;
}

/* 平铺模式：无边框、无背景、无圆角，语言与复制浮动在代码上方 */
.wa_code_plain {
    border: 0;
    border-radius: 0;
    background: none;
}

.wa_code_plain .wa_code_lang {
    top: 0;
    left: 0;
    color: var(--wa_color_text_subtle);
}

.wa_code_plain .wa_code_copy {
    top: 0;
    right: 0;
}

.wa_code_plain .wa_code_pre {
    padding: 0;
}

.wa_code_plain.wa_code_float .wa_code_pre {
    padding-top: 26px;
}

/* 行内代码：单个 code，只保留语法高亮文字 */
.wa_code_inline {
    position: static;
    display: inline;
    overflow: visible;
    padding: 1px 5px;
    border: 0;
    border-radius: var(--wa_radius_sm);
    background: var(--wa_color_soft);
    font-size: 12px;
    color: var(--wa_color_text);
    white-space: pre;
}

@media (prefers-reduced-motion: reduce) {
    .wa_code_copy {
        transition: none;
    }

    .wa_code_copy:active:not(:disabled) {
        transform: none;
    }

    .wa_code_copy.on svg {
        animation: none;
    }
}
</style>