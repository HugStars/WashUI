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
    position: relative;
    display: block;
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background: var(--wa_color_dot_success);
    animation: wa_spinner_dot 2s var(--wa_ease_in_out) infinite;
}

/* * 外层呼吸圈：随圆点一起放大缩小，比单纯的 box-shadow 更柔和 */
.wa_spinner_dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border: 1px solid color-mix(in srgb, var(--wa_color_dot_success) 48%, transparent);
    border-radius: 50%;
    animation: wa_spinner_dot_ring 2s var(--wa_ease_in_out) infinite;
}

@keyframes wa_spinner_dot {
    0%,
    100% {
        opacity: .65;
        transform: scale(.82);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes wa_spinner_dot_ring {
    0%,
    100% {
        opacity: .2;
        transform: scale(.72);
    }

    50% {
        opacity: .65;
        transform: scale(1.32);
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
        opacity: .9;
    }

    .wa_spinner_dot::after {
        animation: none;
        opacity: .4;
    }
}
</style>
