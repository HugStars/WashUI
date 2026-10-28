<template>
    <span class="wa_spinner" :style="Style" aria-hidden="true"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: [Number, String],
        default: 20,
    },
})

const Style = computed(() => {
    const size = typeof props.size === 'number' ? `${props.size}px` : props.size
    return { width: size, height: size }
})
</script>
