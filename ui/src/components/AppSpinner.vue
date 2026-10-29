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

<style>
.wa_spinner {
    display: inline-block;
    flex: none;
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: wa_spin .8s linear infinite;
}

@keyframes wa_spin {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_spinner {
        animation-duration: 1.6s;
    }
}
</style>
