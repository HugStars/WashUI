<template>
    <div class="wa_field">
        <span v-if="label || $slots.label" class="wa_field_label">
            <slot name="label">{{ label }}</slot>
        </span>

        <div class="wa_choice_group" :class="[
            `wa_choice_group_${direction}`,
            {
                'wa_choice_group_right': direction === 'vertical' && align === 'right',
                'wa_choice_group_between': direction === 'vertical' && IsBetween,
            },
        ]" role="group" :aria-label="label || ariaLabel">
            <slot />

            <AppCheck v-for="item in options" :key="item.value" :value="item.value" :label="item.label"
                :disabled="item.disabled" />
        </div>

        <p v-if="DisplayError" class="wa_field_error">{{ DisplayError }}</p>
        <p v-else-if="hint" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { createChoiceGroup, provideChoiceGroup } from '../composables/useChoiceGroup.js'
import { useValidation } from '../composables/useValidation.js'
import AppCheck from './AppCheck.vue'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    /** { label, value, disabled? } */
    options: {
        type: Array,
        default: () => [],
    },
    /**
     * horizontal：复选项横向排列；vertical：复选项纵向排列
     * @type {'horizontal' | 'vertical'}
     */
    direction: {
        type: String,
        default: 'horizontal',
    },
    /**
     * before：每个标签在复选框前；after：标签在复选框后
     * @type {'before' | 'after'}
     */
    labelPosition: {
        type: String,
        default: 'after',
    },
    /**
     * 纵向排列时整组靠左/靠右，或让标签与复选框两端对齐
     * @type {'left' | 'right' | 'between' | 'space-between'}
     */
    align: {
        type: String,
        default: 'left',
    },
    /** 复选框尺寸，数字按 px 处理 */
    checkSize: {
        type: [Number, String],
        default: 20,
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
    rule: {
        type: [Object, Array],
        default: null,
    },
    ariaLabel: {
        type: String,
        default: '复选框组',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])
const { DisplayError, OnChange: ValidateChange } = useValidation(
    props,
    () => props.modelValue,
    { defaultTrigger: 'change' }
)
const { group, IsBetween } = createChoiceGroup(props, (event, value) => {
    emit(event, value)
    if (event === 'change') ValidateChange(value)
}, true)
provideChoiceGroup(group)
</script>
