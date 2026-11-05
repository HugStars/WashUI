<template>
    <div class="wa_check_group" :class="[
        `wa_check_group_${direction}`,
        { 'wa_check_group_right': direction === 'vertical' && align === 'right' },
    ]" role="group" :aria-label="ariaLabel">
        <slot />

        <AppCheckItem v-for="item in options" :key="item.value" :model-value="IsChecked(item.value)"
            :label="item.label" :label-position="labelPosition" :disabled="disabled || item.disabled"
            @change="checked => Toggle(item.value, checked)" />
    </div>
</template>

<script setup>
import AppCheckItem from './AppCheckItem.vue'

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
    /** horizontal：复选项横向排列；vertical：复选项纵向排列 */
    direction: {
        type: String,
        default: 'horizontal',
        allows: ['horizontal', 'vertical'],
    },
    /** before：每个标签在复选框前；after：标签在复选框后 */
    labelPosition: {
        type: String,
        default: 'after',
        allows: ['before', 'after'],
    },
    /** 纵向排列时整体靠左或靠右 */
    align: {
        type: String,
        default: 'left',
        allows: ['left', 'right'],
    },
    ariaLabel: {
        type: String,
        default: '复选框组',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

function IsChecked(value) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
}

function Toggle(value, checked) {
    if (props.disabled) return

    const current = Array.isArray(props.modelValue) ? props.modelValue : []
    const next = checked
        ? current.includes(value) ? current : [...current, value]
        : current.filter(item => item !== value)

    emit('update:modelValue', next)
    emit('change', next)
}
</script>

<style>
.wa_check_group {
    display: flex;
    gap: 12px 18px;
    min-width: 0;
    font-size: 13px;
    color: var(--wa_color_text);
}

.wa_check_group_horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}

.wa_check_group_vertical {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.wa_check_group_vertical.wa_check_group_right {
    align-items: flex-end;
}

.wa_check_group_vertical .wa_check_label {
    white-space: normal;
}

.wa_check_group_vertical.wa_check_group_right .wa_check_label {
    text-align: right;
}
</style>
