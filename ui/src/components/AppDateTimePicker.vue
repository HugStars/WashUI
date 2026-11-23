<template>
    <AppDateTimeField v-model="Value" mode="datetime" v-bind="$attrs" :label="label" :hint="hint" :error="error"
        :placeholder="placeholder" :size="size" :min="min" :max="max" :minute-step="minuteStep" :quick="quick"
        :disabled="disabled" :readonly="readonly" :rule="rule" :aria-label="ariaLabel"
        @change="emit('change', $event)" />
</template>

<script setup>
import AppDateTimeField from './AppDateTimeField.vue'

defineOptions({ inheritAttrs: false })

const emit = defineEmits(['change'])
const Value = defineModel({ type: String, default: '' })

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
    /** 最小日期时间，YYYY-MM-DDTHH:mm */
    min: {
        type: String,
        default: '',
    },
    /** 最大日期时间，YYYY-MM-DDTHH:mm */
    max: {
        type: String,
        default: '',
    },
    /** 分钟步长 */
    minuteStep: {
        type: Number,
        default: 5,
    },
    /** 快捷项：string 或 { label, value } */
    quick: {
        type: Array,
        default: () => [],
    },
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
