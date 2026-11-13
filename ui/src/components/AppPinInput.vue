<template>
    <div class="wa_pin" :class="[`wa_pin_${size}`, { wa_pin_disabled: disabled, wa_pin_error: error }]"
        role="group" :aria-label="ariaLabel">
        <input v-for="index in Length" :key="index" :ref="el => SetInputEl(index - 1, el)"
            class="wa_pin_input" :class="{ filled: !!Chars[index - 1] }"
            :value="Chars[index - 1] || ''" :type="inputType" :inputmode="Numeric ? 'numeric' : 'text'"
            :autocomplete="index === 1 ? 'one-time-code' : 'off'" :maxlength="1" :disabled="disabled"
            :aria-label="`第 ${index} 位验证码`" :aria-invalid="error ? 'true' : undefined"
            @input="OnInput(index - 1, $event)" @keydown="OnKeydown(index - 1, $event)"
            @paste="OnPaste(index - 1, $event)" @focus="OnFocus($event)" />
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
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    disabled: Boolean,
    /** 只允许数字（type=number 时默认开启） */
    numeric: {
        type: Boolean,
        default: undefined,
    },
    autofocus: Boolean,
    /** 校验失败态 */
    error: Boolean,
    ariaLabel: {
        type: String,
        default: '验证码',
    },
})

const emit = defineEmits(['update:modelValue', 'change', 'complete'])

const Length = computed(() => Math.max(1, Math.floor(Number(props.length) || 6)))
const Numeric = computed(() => props.numeric ?? props.type === 'number')
const inputType = computed(() => props.type === 'password' ? 'password' : 'text')

const InputEls = []
const Chars = ref([])

function SetInputEl(index, el) {
    InputEls[index] = el
}

function Normalize(value) {
    const chars = String(value ?? '').split('')
    return Array.from({ length: Length.value }, (_, index) => chars[index] || '')
}

watch(() => props.modelValue, value => {
    Chars.value = Normalize(value)
}, { immediate: true })

watch(Length, () => {
    Chars.value = Normalize(Chars.value.join(''))
})

function Commit() {
    const value = Chars.value.join('')
    emit('update:modelValue', value)
    emit('change', value)
    if (Chars.value.every(Boolean)) emit('complete', value)
}

function FocusAt(index) {
    const target = Math.min(Length.value - 1, Math.max(0, index))
    nextTick(() => {
        const el = InputEls[target]
        el?.focus()
        el?.select?.()
    })
}

function Write(start, text) {
    if (props.disabled) return

    const source = Numeric.value ? String(text).replace(/\D/g, '') : String(text)
    if (!source) return

    const next = [...Chars.value]

    for (let offset = 0; offset < source.length && start + offset < Length.value; offset++) {
        next[start + offset] = source[offset]
    }

    Chars.value = next
    Commit()
    FocusAt(start + source.length)
}

function OnInput(index, event) {
    const value = event.target.value

    // 输入法或浏览器自动填充可能一次给出多位，按顺序摊开
    if (value.length > 1) {
        Write(index, value)
        return
    }

    const char = Numeric.value ? value.replace(/\D/g, '') : value
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

function OnFocus(event) {
    event.target.select?.()
}

defineExpose({
    focus: () => FocusAt(0),
    clear: () => {
        Chars.value = Normalize('')
        Commit()
    },
})

onMounted(() => {
    if (props.autofocus) FocusAt(0)
})
</script>

<style>
.wa_pin {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.wa_pin_input {
    width: 42px;
    height: 46px;
    padding: 0;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    outline: 0;
    color: var(--wa_color_text);
    background: var(--wa_color_field);
    font: inherit;
    font-size: 19px;
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

.wa_pin_sm .wa_pin_input {
    width: 36px;
    height: 40px;
    font-size: 17px;
}

.wa_pin_md .wa_pin_input {
    width: 48px;
    height: 52px;
    font-size: 21px;
}

.wa_pin_disabled .wa_pin_input {
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
        gap: 6px;
    }

    .wa_pin_input,
    .wa_pin_sm .wa_pin_input {
        width: 34px;
        height: 40px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_pin_input {
        transition: none;
    }
}
</style>
