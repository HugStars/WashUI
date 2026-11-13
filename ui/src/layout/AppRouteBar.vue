<template>
    <Teleport to="body">
        <div class="wa_route_bar" :class="{ on: Loading }" aria-hidden="true"></div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { routeLoading } from '../core/route_state.js'

const props = defineProps({
    loading: {
        type: Boolean,
        default: undefined,
    },
})

const Loading = computed(() => props.loading ?? routeLoading.value)
</script>

<style>
.wa_route_bar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: var(--wa_z_route);
    width: auto;
    height: 3px;
    background: var(--wa_color_accent);
    transform: scaleX(0);
    transform-origin: left;
    opacity: 0;
    pointer-events: none;
    transition:
        opacity var(--wa_duration_base) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_route_bar.on {
    opacity: 1;
    animation: wa_route_grow var(--wa_duration_route) cubic-bezier(.1, .8, .3, 1) forwards;
}

@keyframes wa_route_grow {
    0% {
        transform: scaleX(0);
    }

    60% {
        transform: scaleX(.75);
    }

    100% {
        transform: scaleX(.92);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_route_bar.on {
        animation: none;
        transform: scaleX(.5);
    }
}
</style>
