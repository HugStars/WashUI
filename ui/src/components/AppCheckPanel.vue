<template>
    <AppChoiceList multiple :model-value="modelValue" :options="options" :groups="groups" :size="size"
        :disabled="disabled" :empty-text="emptyText" :aria-label="ariaLabel"
        @update:model-value="emit('update:modelValue', $event)" @change="emit('change', $event)" />
</template>

<script setup>
import AppChoiceList from './AppChoiceList.vue'

defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    options: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    size: {
        type: [Number, String],
        default: 18,
    },
    disabled: Boolean,
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    ariaLabel: {
        type: String,
        default: '复选框列表',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])
</script>
