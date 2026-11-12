<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :for="InputId">
            <slot name="label">{{ label }}</slot>
        </label>
        <div class="wa_input"
            :class="{ on: DisplayError, off: disabled, wa_input_sm: size === 'sm', wa_frosted: frosted }">
            <span v-if="$slots.prefix" class="wa_input_affix">
                <slot name="prefix" />
            </span>
            <input :id="InputId" ref="InputEl" v-bind="$attrs" class="wa_input_control" :type="type"
                :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly"
                :aria-invalid="DisplayError ? 'true' : undefined" :aria-describedby="DescribedBy"
                @input="HandleInput" @blur="HandleBlur">
            <Transition enter-active-class="wa_input_clear_enter_active"
                leave-active-class="wa_input_clear_leave_active">
                <button v-if="clearable && HasValue" type="button" class="wa_input_clear" aria-label="清空"
                    :disabled="disabled || readonly" @click="Clear">
                    <AppIcon name="close" :size="14" />
                </button>
            </Transition>
            <span v-if="$slots.suffix" class="wa_input_affix">
                <slot name="suffix" />
            </span>
        </div>
        <p v-if="DisplayError" :id="ErrorId" class="wa_field_error">{{ DisplayError }}</p>
        <p v-else-if="hint" :id="HintId" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import { useValidation } from '../composables/useValidation.js'
import AppIcon from './AppIcon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    hint: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: '',
    },
    /**
     * @type {'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'range' | 'checkbox' | 'radio' | 'hidden'}
     */
    type: {
        type: String,
        default: 'text',
    },
    /**
     * @type {'md' | 'sm'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    clearable: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    /** 校验规则对象或数组；支持 required、min、max、pattern、validator、message、trigger */
    rule: {
        type: [Object, Array],
        default: null,
    },
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
})

const emit = defineEmits(['update:modelValue', 'clear'])

const InputId = useId()
const HintId = `${InputId}-hint`
const ErrorId = `${InputId}-error`
const InputEl = ref(null)
const HasValue = computed(
    () => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined
)
const { DisplayError, OnBlur: ValidateBlur, OnInput: ValidateInput } = useValidation(
    props,
    () => props.modelValue,
    { defaultTrigger: 'blur' }
)
const DescribedBy = computed(() => (DisplayError.value ? ErrorId : props.hint ? HintId : undefined))

function HandleInput(event) {
    const value = event.target.value
    emit('update:modelValue', value)
    ValidateInput(value)
}

function HandleBlur() {
    ValidateBlur(props.modelValue)
}

function Clear() {
    emit('update:modelValue', '')
    emit('clear')
    ValidateInput('')
    InputEl.value?.focus()
}
</script>

<style>
.wa_input {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: var(--wa_control_height);
    padding: 0 var(--wa_space_3);
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_field);
    transition: border-color var(--wa_duration_fast), box-shadow var(--wa_duration_fast), opacity var(--wa_duration_fast);
}

.wa_input:hover {
    border-color: var(--wa_color_line_strong);
}

.wa_input:focus-within {
    border-color: var(--wa_color_text);
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.wa_input.on {
    border-color: var(--wa_color_danger);
}

.wa_input.on:focus-within {
    box-shadow: 0 0 0 3px var(--wa_color_danger_soft);
}

.wa_input.off {
    opacity: .55;
}

.wa_input_sm {
    min-height: var(--wa_control_height_sm);
    padding: 0 var(--wa_space_2);
}

.wa_input_control {
    flex: 1;
    min-width: 0;
    width: 100%;
    height: calc(var(--wa_control_height) - 2px);
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    color: inherit;
    background: transparent;
    box-shadow: none;
    font-size: 14px;
}

.wa_input_control:hover,
.wa_input_control:focus {
    border: 0;
    box-shadow: none;
}

.wa_input_control:disabled {
    cursor: not-allowed;
}

.wa_input_sm .wa_input_control {
    height: calc(var(--wa_control_height_sm) - 2px);
    font-size: 13px;
}

.wa_input_affix {
    display: inline-flex;
    flex: none;
    align-items: center;
    color: var(--wa_color_text_faint);
}

.wa_input_clear {
    display: grid;
    flex: none;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: var(--wa_color_text_faint);
    background: var(--wa_color_soft);
    cursor: pointer;
    transform-origin: center;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_input_clear:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_input_clear:active:not(:disabled) {
    transform: scale(.86);
}

.wa_input_clear_enter_active,
.wa_input_clear_leave_active {
    transition:
        opacity .12s var(--wa_ease_out),
        transform .16s var(--wa_ease_spring);
}

.wa_input_clear_enter_from,
.wa_input_clear_leave_to {
    opacity: 0;
    transform: scale(.6);
}

@media (prefers-reduced-motion: reduce) {
    .wa_input_clear,
    .wa_input_clear_enter_active,
    .wa_input_clear_leave_active {
        transition: none;
    }
}

.wa_input_clear:disabled {
    opacity: .4;
    cursor: not-allowed;
}
</style>
