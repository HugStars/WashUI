<template>
    <div class="wa_choice_group" :class="[
        `wa_choice_group_${direction}`,
        {
            'wa_choice_group_right': direction === 'vertical' && align === 'right',
            'wa_choice_group_between': direction === 'vertical' && IsBetween,
            'wa_choice_group_segmented': variant === 'segmented',
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
    /**
     * horizontal：单选项横向排列；vertical：单选项纵向排列
     * @type {'horizontal' | 'vertical'}
     */
    direction: {
        type: String,
        default: 'horizontal',
    },
    /**
     * default：圆形单选框；segmented：等宽分段单选
     * @type {'default' | 'segmented'}
     */
    variant: {
        type: String,
        default: 'default',
    },
    /**
     * before：每个标签在单选框前；after：标签在单选框后
     * @type {'before' | 'after'}
     */
    labelPosition: {
        type: String,
        default: 'after',
    },
    /**
     * 纵向排列时整组靠左/靠右，或让标签与单选框两端对齐
     * @type {'left' | 'right' | 'between' | 'space-between'}
     */
    align: {
        type: String,
        default: 'left',
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
