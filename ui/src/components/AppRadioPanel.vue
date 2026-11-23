<template>
    <AppChoiceList :multiple="false" :model-value="modelValue" :options="options" :groups="groups"
        :check-size="checkSize" :disabled="disabled" :autofocus="autofocus" :empty-text="emptyText"
        :aria-label="ariaLabel"
        @update:model-value="emit('update:modelValue', $event)" @change="emit('change', $event)" />
</template>

<script setup>
import AppChoiceList from './AppChoiceList.vue'

defineProps({
    modelValue: {
        type: [String, Number, Symbol, Boolean],
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    checkSize: {
        type: [Number, String],
        default: 18,
    },
    disabled: Boolean,
    autofocus: Boolean,
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    ariaLabel: {
        type: String,
        default: '单选框列表',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])
</script>
