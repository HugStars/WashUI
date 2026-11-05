<template>
    <div class="wa_choice_row" :style="BetweenStyle">
        <label v-if="HasLabel && LabelPosition === 'before'" :id="`${RadioId}-label`" class="wa_choice_label"
            :for="RadioId">
            <slot>{{ label }}</slot>
        </label>

        <button :id="RadioId" type="button" class="wa_radio" :class="{ on: Checked }" role="radio"
            :style="SizeStyle" :aria-checked="Checked"
            :aria-labelledby="HasLabel ? `${RadioId}-label` : undefined"
            :aria-label="HasLabel ? undefined : AccessibleLabel" :disabled="Disabled" @click="Select">
            <span class="wa_radio_dot" aria-hidden="true"></span>
        </button>

        <label v-if="HasLabel && LabelPosition !== 'before'" :id="`${RadioId}-label`" class="wa_choice_label"
            :for="RadioId">
            <slot>{{ label }}</slot>
        </label>
    </div>
</template>

<script setup>
import { computed, useId, useSlots } from 'vue'
import { useChoiceItemState } from '../composables/useChoiceGroup.js'

const props = defineProps({
    modelValue: Boolean,
    /** 在 AppRadioGroup / AppChoiceList 中使用时对应的值 */
    value: {
        type: [String, Number, Symbol, Boolean],
        default: undefined,
    },
    label: {
        type: String,
        default: '',
    },
    /** before：标签在单选框前；after：标签在单选框后 */
    labelPosition: {
        type: String,
        default: null,
        allows: ['before', 'after'],
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    /** 单选框尺寸，数字按 px 处理；在分组中默认继承分组尺寸 */
    size: {
        type: [Number, String],
        default: null,
    },
    /** 纵向两端对齐时，让标签和单选框分别贴左右两侧 */
    between: Boolean,
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const RadioId = useId()
const { group, Checked, Disabled, Size, LabelPosition, BetweenStyle } = useChoiceItemState(props, false)
const HasLabel = computed(() => Boolean(props.label || slots.default))
const AccessibleLabel = computed(() => props.ariaLabel || props.label || '单选框')
const SizeStyle = computed(() => ({
    '--wa_radio_size': typeof Size.value === 'number' ? `${Size.value}px` : Size.value,
}))

function Select() {
    if (Disabled.value) return

    if (group) {
        group.select(props.value)
        return
    }

    if (Checked.value) return
    emit('update:modelValue', true)
    emit('change', true)
}
</script>

<style>
.wa_radio {
    --wa_radio_border: calc(var(--wa_radio_size, 20px) * .1);

    position: relative;
    display: grid;
    flex: none;
    place-items: center;
    width: var(--wa_radio_size, 20px);
    height: var(--wa_radio_size, 20px);
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 var(--wa_radio_border) var(--wa_color_line_strong);
    color: var(--wa_color_text);
    background: var(--wa_color_field);
    cursor: pointer;
    transition:
        background var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_radio:hover:not(:disabled) {
    box-shadow: inset 0 0 0 var(--wa_radio_border) var(--wa_color_text_muted);
    background: var(--wa_color_hover);
}

.wa_radio.on {
    box-shadow: inset 0 0 0 var(--wa_radio_border) var(--wa_color_text);
}

.wa_radio.on:hover:not(:disabled) {
    box-shadow: inset 0 0 0 var(--wa_radio_border) var(--wa_color_primary_hover);
}

.wa_radio:active:not(:disabled) {
    transform: scale(.9);
}

.wa_radio:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_radio:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_radio_dot {
    width: 46%;
    height: 46%;
    border-radius: 50%;
    background: currentColor;
    opacity: 0;
    transform: scale(.2);
    transition:
        opacity .12s var(--wa_ease_out),
        transform .2s var(--wa_ease_spring);
}

.wa_radio.on .wa_radio_dot {
    opacity: 1;
    transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
    .wa_radio,
    .wa_radio_dot {
        transition: none;
    }

    .wa_radio:active:not(:disabled) {
        transform: none;
    }
}
</style>
