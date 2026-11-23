<template>
    <div class="wa_field" v-bind="$attrs">
        <div class="wa_pin"
            :class="[`wa_pin_${size}`, { wa_pin_fluid: fluid, wa_pin_disabled: disabled, wa_pin_error: error }]"
            :style="PinStyle" role="group" :aria-label="ariaLabel" @pointerdown="OnPinPointerdown"
            @mousedown.prevent @click="OnPinClick">
            <span v-for="index in Length" :key="index" class="wa_pin_cell">
                <input :ref="el => SetInputEl(index - 1, el)" class="wa_pin_input"
                    :class="{ filled: !!Chars[index - 1], wa_pin_input_latin: ForceLatinKeyboard }"
                    :value="Chars[index - 1] || ''" :type="inputType"
                    :inputmode="ForceLatinKeyboard ? undefined : KeyboardMode"
                    :lang="keyboard === 'alphanumeric' ? 'en' : undefined" autocapitalize="off" autocorrect="off"
                    spellcheck="false"
                    :autocomplete="ForceLatinKeyboard ? 'off' : index === 1 ? 'one-time-code' : 'off'"
                    :maxlength="1" :disabled="disabled" :aria-label="`第 ${index} 位验证码`"
                    :aria-invalid="error ? 'true' : undefined" @input="OnInput(index - 1, $event)"
                    @keydown="OnKeydown(index - 1, $event)" @paste="OnPaste(index - 1, $event)"
                    @focus="OnFocus(index - 1, $event)" />
                <span v-if="ForceLatinKeyboard" class="wa_pin_char" aria-hidden="true">{{ Chars[index - 1] || '' }}</span>
            </span>
        </div>
        <p v-if="ErrorText" class="wa_field_error">{{ ErrorText }}</p>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    /** 验证码位数 */
    length: {
        type: Number,
        default: 6,
    },
    /**
     * @type {'text' | 'number' | 'password'}
     */
    type: {
        type: String,
        default: 'text',
    },
    /**
     * 移动端虚拟键盘类型
     * - auto：纯数字时用数字键盘，其余用文字键盘
     * - alphanumeric：用 password 类型强制英文 26 键，只接受 A-Z / a-z / 0-9
     * @type {'auto' | 'text' | 'alphanumeric' | 'numeric' | 'tel'}
     */
    keyboard: {
        type: String,
        default: 'auto',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /** 验证码总宽度；数字按 px，格子随宽度与位数均分并保持正方形 */
    width: {
        type: [Number, String],
        default: null,
    },
    /** 撑满父容器，格子随容器宽度与位数自适应 */
    fluid: Boolean,
    disabled: Boolean,
    /** 只允许数字（type=number 或 keyboard=numeric 时默认开启） */
    numeric: {
        type: Boolean,
        default: undefined,
    },
    autofocus: Boolean,
    /** 校验失败态；字符串时显示具体错误文本 */
    error: {
        type: [Boolean, String],
        default: false,
    },
    ariaLabel: {
        type: String,
        default: '验证码',
    },
})

const emit = defineEmits(['update:modelValue', 'change', 'complete'])

const Length = computed(() => Math.max(1, Math.floor(Number(props.length) || 6)))
const ErrorText = computed(() => typeof props.error === 'string' ? props.error : '')
const Numeric = computed(() => props.numeric ?? (props.type === 'number' || props.keyboard === 'numeric'))

// * alphanumeric 用 password 类型强制 26 键英文键盘，再自己渲染字符
const ForceLatinKeyboard = computed(() => props.keyboard === 'alphanumeric' && props.type !== 'password')
const inputType = computed(() => {
    if (props.type === 'password') return 'password'
    if (props.keyboard === 'alphanumeric') return 'password'
    return 'text'
})

const KeyboardMode = computed(() => {
    if (props.keyboard === 'text') return 'text'
    if (props.keyboard === 'alphanumeric') return 'email'
    if (props.keyboard === 'numeric') return 'numeric'
    if (props.keyboard === 'tel') return 'tel'
    return Numeric.value ? 'numeric' : 'text'
})

/**
 * 按当前输入模式过滤字符
 * @param {string} text 原始输入
 * @returns {string} 过滤后的字符
 */
function Sanitize(text) {
    const value = String(text ?? '')
    if (Numeric.value) return value.replace(/\D/g, '')
    if (props.keyboard === 'alphanumeric') return value.replace(/[^a-zA-Z0-9]/g, '')
    return value
}

const PinStyle = computed(() => {
    const style = { '--wa_pin_length': Length.value }
    if (props.width === null || props.width === undefined || props.width === '') return style
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    return style
})

const InputEls = []
const Chars = ref([])

function SetInputEl(index, el) {
    InputEls[index] = el
}

function Normalize(value) {
    const chars = String(value ?? '').split('')
    return Array.from({ length: Length.value }, (_, index) => chars[index] || '')
}

let WasComplete = false

watch(() => props.modelValue, value => {
    const next = Normalize(value)

    // ! v-model 是紧凑字符串，会丢掉中间空位；内部刚提交的同值不要重新左对齐，
    // ! 否则在第 3 格输入会跳回第 1 格
    // - 首次挂载时 Chars 还是空数组，join 同样为空串，必须继续初始化，否则找不到空位
    if (Chars.value.length === Length.value && next.join('') === Chars.value.join('')) return

    Chars.value = next
    WasComplete = IsFull()
}, { immediate: true })

watch(Length, () => {
    Chars.value = Array.from({ length: Length.value }, (_, index) => Chars.value[index] || '')
})

/** 所有位置都有内容才算填满；空数组和稀疏数组都不算 */
function IsFull() {
    for (let index = 0; index < Length.value; index++) {
        if (!Chars.value[index]) return false
    }
    return true
}

function Commit() {
    const value = Chars.value.join('')
    const full = IsFull()

    emit('update:modelValue', value)
    emit('change', value)
    if (full && !WasComplete) emit('complete', value)
    WasComplete = full
}

// 标记这一次 focus 来自键盘 / 内部跳格，不要被指针聚焦校正拦住
let AllowFocusMove = false

function ApplyFocus(index) {
    const el = InputEls[index]
    if (!el) return

    AllowFocusMove = true
    el.focus({ preventScroll: true })
    el.select?.()
    AllowFocusMove = false
}

function FocusAt(index) {
    const target = Math.min(Length.value - 1, Math.max(0, index))
    nextTick(() => ApplyFocus(target))
}

/**
 * 第一个未填写的下标
 * @returns {number} 没有空位时返回 -1
 */
function FirstEmpty() {
    for (let index = 0; index < Length.value; index++) {
        if (!Chars.value[index]) return index
    }
    return -1
}

/** 第一个未填写的位置；全部填满时停在最后一格 */
function FirstEmptyIndex() {
    const index = FirstEmpty()
    return index === -1 ? Length.value - 1 : index
}

function FocusEmpty() {
    FocusAt(FirstEmptyIndex())
}

/**
 * 计算本次输入的落点
 * @param {number} index 当前聚焦的格子
 * @returns {number} 实际写入的起始下标
 */
function EntryIndex(index) {
    const empty = FirstEmpty()
    if (empty === -1) return index
    return Math.min(index, empty)
}

function Write(index, text) {
    if (props.disabled) return

    const source = Sanitize(text)
    if (!source) return

    const start = EntryIndex(index)
    const next = [...Chars.value]

    for (let offset = 0; offset < source.length && start + offset < Length.value; offset++) {
        next[start + offset] = source[offset]
    }

    Chars.value = next
    Commit()
    FocusEmpty()
}

function OnPinPointerdown(event) {
    if (props.disabled) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()

    // 同步聚焦，保证移动端在用户手势内唤出键盘
    ApplyFocus(FirstEmptyIndex())
}

// 部分浏览器仍会在 pointerdown 之后把焦点交给被点击的格子，click 时再校正一次
function OnPinClick() {
    if (props.disabled) return
    ApplyFocus(FirstEmptyIndex())
}

function OnInput(index, event) {
    const value = event.target.value

    // 输入法或浏览器自动填充可能一次给出多位，按顺序摊开
    if (value.length > 1) {
        Write(index, value)
        return
    }

    const char = Sanitize(value)
    event.target.value = ''

    if (!char) {
        Chars.value = Chars.value.map((item, itemIndex) => itemIndex === index ? '' : item)
        Commit()
        return
    }

    Write(index, char.slice(-1))
}

function OnKeydown(index, event) {
    if (props.disabled) return

    if (event.key === 'Backspace') {
        event.preventDefault()
        const hadValue = Boolean(Chars.value[index])
        const next = [...Chars.value]

        if (hadValue) {
            next[index] = ''
        } else if (index > 0) {
            next[index - 1] = ''
        }

        Chars.value = next
        Commit()
        FocusAt(hadValue ? index : index - 1)
        return
    }

    if (event.key === 'Delete') {
        event.preventDefault()
        Chars.value = Chars.value.map((item, itemIndex) => itemIndex === index ? '' : item)
        Commit()
        return
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault()
        FocusAt(index - 1)
        return
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault()
        FocusAt(index + 1)
        return
    }

    if (event.key === 'Home') {
        event.preventDefault()
        FocusAt(0)
        return
    }

    if (event.key === 'End') {
        event.preventDefault()
        FocusAt(Length.value - 1)
    }
}

function OnPaste(index, event) {
    event.preventDefault()
    Write(index, event.clipboardData?.getData('text') || '')
}

function OnFocus(index, event) {
    // ! 部分浏览器在 pointerdown 之后仍会聚焦被点击的格子；这里兜底拉回第一个空位
    if (!AllowFocusMove && index !== FirstEmptyIndex()) {
        ApplyFocus(FirstEmptyIndex())
        return
    }

    event.target.select?.()
}

defineExpose({
    focus: FocusEmpty,
    clear: () => {
        Chars.value = Normalize('')
        WasComplete = false
        Commit()
    },
})

onMounted(() => {
    if (props.autofocus) FocusEmpty()
})
</script>

<style>
.wa_pin {
    --wa_pin_cell: var(--wa_size_pin_sm);
    --wa_pin_gap: var(--wa_space_2);

    display: grid;
    grid-template-columns: repeat(var(--wa_pin_length, 6), minmax(0, 1fr));
    gap: var(--wa_pin_gap);
    width: min(100%, calc(var(--wa_pin_length) * var(--wa_pin_cell) + (var(--wa_pin_length) - 1) * var(--wa_pin_gap)));
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
}

.wa_pin_fluid {
    width: 100%;
}

.wa_pin_md {
    --wa_pin_cell: var(--wa_size_pin_md);
}

.wa_pin_cell {
    position: relative;
    display: block;
    width: 100%;
    min-width: 0;
    aspect-ratio: 1;
    font-size: 19px;
    font-size: clamp(15px, calc(42cqw / var(--wa_pin_length)), 24px);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
}

.wa_pin_input {
    width: 100%;
    height: 100%;
    min-width: 0;
    padding: 0;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    outline: 0;
    color: var(--wa_color_text);
    background: var(--wa_color_field);
    font: inherit;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    text-align: center;
    caret-color: var(--wa_color_text);
    transition:
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

/* 用 password 类型拉起英文键盘时，输入本身隐藏，字符由覆盖层展示 */
.wa_pin_input_latin {
    color: transparent;
    caret-color: transparent;
    -webkit-text-security: none;
}

.wa_pin_input_latin::selection {
    background: transparent;
}

.wa_pin_char {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    place-items: center;
    color: var(--wa_color_text);
    font: inherit;
    font-weight: 600;
    line-height: 1;
    pointer-events: none;
    user-select: none;
}

.wa_pin_input:hover:not(:disabled) {
    border-color: var(--wa_color_line_strong);
}

.wa_pin_input:focus {
    border-color: var(--wa_color_text);
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.wa_pin_input.filled {
    background: var(--wa_color_surface);
}

.wa_pin_disabled .wa_pin_input,
.wa_pin_disabled .wa_pin_char {
    opacity: .5;
    cursor: not-allowed;
}

.wa_pin_error .wa_pin_input {
    border-color: var(--wa_color_danger);
}

.wa_pin_error .wa_pin_input:focus {
    box-shadow: 0 0 0 3px var(--wa_color_danger_soft);
}

@media (max-width: 480px) {
    .wa_pin {
        --wa_pin_gap: var(--wa_space_1);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_pin_input {
        transition: none;
    }
}
</style>
