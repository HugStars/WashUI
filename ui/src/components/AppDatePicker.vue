<template>
    <AppDateTimeField v-model="Value" mode="date" v-bind="$attrs" @change="emit('change', $event)" />
</template>

<script setup>
import AppDateTimeField from './AppDateTimeField.vue'

defineOptions({ inheritAttrs: false })

const emit = defineEmits(['change'])
const Value = defineModel({
    type: [String, Number],
    default: '',
})
</script>
