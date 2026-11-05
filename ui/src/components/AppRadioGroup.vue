<template>
    <div class="wa_choice_group" :class="[
        `wa_choice_group_${direction}`,
        {
            'wa_choice_group_right': direction === 'vertical' && align === 'right',
            'wa_choice_group_between': direction === 'vertical' && IsBetween,
        },
    ]" role="radiogroup" :aria-label="ariaLabel">
        <slot />

        <AppRadio v-for="item in options" :key="item.value" :value="item.value" :label="item.label"
            :disabled="item.disabled" />
    </div>
</template>

<script setup>
import { createChoiceGroup, provideChoiceGroup } from '../composables/useChoiceGroup.js'
import AppRadio from './AppRadio.vue'

const props = defineProps({
    modelValue: {
        type: [String, Number, Symbol, Boolean],
        default: '',
    },
    /** { label, value, disabled? } */
    options: {
        type: Array,
        default: () => [],
    },
    /** horizontal：单选项横向排列；vertical：单选项纵向排列 */
    direction: {
        type: String,
        default: 'horizontal',
        allows: ['horizontal', 'vertical'],
    },
    /** before：每个标签在单选框前；after：标签在单选框后 */
    labelPosition: {
        type: String,
        default: 'after',
        allows: ['before', 'after'],
    },
    /** 纵向排列时整组靠左/靠右，或让标签与单选框两端对齐 */
    align: {
        type: String,
        default: 'left',
        allows: ['left', 'right', 'between', 'space-between'],
    },
    /** 单选框尺寸，数字按 px 处理 */
    size: {
        type: [Number, String],
        default: 20,
    },
    ariaLabel: {
        type: String,
        default: '单选框组',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])
const { group, IsBetween } = createChoiceGroup(props, emit, false)
provideChoiceGroup(group)
</script>
