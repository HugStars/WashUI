<template>
    <AppDateTimeField v-model="Value" mode="date" v-bind="$attrs" :label="label" :hint="hint" :error="error"
        :placeholder="placeholder" :size="size" :min="min" :max="max" :quick="quick" :picker="picker"
        :range="range" :disabled="disabled" :readonly="readonly" :rule="rule" :aria-label="ariaLabel"
        @change="emit('change', $event)" />
</template>

<script setup>
import AppDateTimeField from './AppDateTimeField.vue'

defineOptions({ inheritAttrs: false })

const emit = defineEmits(['change'])
const Value = defineModel({
    type: [String, Array],
    default: '',
})

defineProps({
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
    placeholder: {
        type: String,
        default: '请选择',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /** 最小日期，YYYY-MM-DD */
    min: {
        type: String,
        default: '',
    },
    /** 最大日期，YYYY-MM-DD */
    max: {
        type: String,
        default: '',
    },
    /** 快捷项：string 或 { label, value } */
    quick: {
        type: Array,
        default: () => [],
    },
    /**
     * 选择粒度：day / week / month / year
     * @type {'day' | 'week' | 'month' | 'year'}
     */
    picker: {
        type: String,
        default: 'day',
    },
    /** 范围选择，modelValue 为 [start, end] */
    range: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    /** 校验规则，与 AppInput 一致 */
    rule: {
        type: [Object, Array],
        default: null,
    },
    ariaLabel: {
        type: String,
        default: '日期时间选择',
    },
})
</script>
