<template>
    <span class="wa_spinner" :class="{ wa_spinner_dotted: dot }" :style="Style" aria-hidden="true">
        <span v-if="dot" class="wa_spinner_dot"></span>
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: [Number, String],
        default: 20,
    },
    /** dot 模式直接渲染一个呼吸绿点，不显示旋转加载圈，适合 worker / 在线状态 */
    dot: Boolean,
})

const Style = computed(() => {
    const size = typeof props.size === 'number' ? `${props.size}px` : props.size
    return { width: size, height: size }
})
</script>

<style>
.wa_spinner {
    position: relative;
    display: inline-block;
    flex: none;
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: wa_spin var(--wa_duration_loop) linear infinite;
}

/* * dot 模式：去掉圆环和旋转，只保留呼吸点 */
.wa_spinner_dotted {
    display: inline-grid;
    place-items: center;
    border: 0;
    animation: none;
}

.wa_spinner_dot {
    display: block;
    width: min(10px, 100%);
    height: min(10px, 100%);
    border-radius: 50%;
    background: var(--wa_color_dot_success);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--wa_color_dot_success) 18%, transparent);
    animation: wa_spinner_dot 2s infinite;
}

@keyframes wa_spinner_dot {
    0%,
    100% {
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--wa_color_dot_success) 18%, transparent);
    }

    70% {
        box-shadow: 0 0 0 12px color-mix(in srgb, var(--wa_color_dot_success) 0%, transparent);
    }
}

@keyframes wa_spin {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_spinner {
        animation-duration: calc(var(--wa_duration_loop) * 2);
    }

    .wa_spinner_dot {
        animation: none;
    }
}
</style>
