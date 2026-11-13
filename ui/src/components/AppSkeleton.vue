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
        default: 'var(--wa_radius_sm)',
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

<style>
.wa_skeleton {
    display: block;
    background: linear-gradient(90deg, var(--wa_color_soft), var(--wa_color_hover), var(--wa_color_soft));
    background-size: 200% 100%;
    animation: wa_skeleton_shimmer var(--wa_duration_shimmer) ease-in-out infinite;
}

@keyframes wa_skeleton_shimmer {
    from {
        background-position: 100% 0;
    }

    to {
        background-position: -100% 0;
    }
}

@media (prefers-reduced-motion: reduce) {

    .wa_skeleton {
        animation: none;
    }
}
</style>
