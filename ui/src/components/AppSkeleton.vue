<template>
    <span class="wa_skeleton" :style="Style" aria-hidden="true"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    width: {
        type: [Number, String],
        default: '100%',
    },
    height: {
        type: [Number, String],
        default: 14,
    },
    radius: {
        type: [Number, String],
        default: 'var(--wa_radius_small)',
    },
})

function toSize(value) {
    return typeof value === 'number' ? `${value}px` : value
}

const Style = computed(() => ({
    width: toSize(props.width),
    height: toSize(props.height),
    borderRadius: toSize(props.radius),
}))
</script>
