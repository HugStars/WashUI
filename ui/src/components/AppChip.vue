<template>
    <button type="button" class="wa_chip" :class="{ on: active, wa_frosted: frosted }">
        <slot>{{ text }}</slot>
    </button>
</template>

<script setup>
defineProps({
    active: Boolean,
    text: {
        type: String,
        default: '',
    },
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
})
</script>

<style>
.wa_chip:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 34px;
    padding: 0 18px;
    border: 1px solid var(--wa_color_border);
    border-radius: var(--wa_radius_pill);
    font-size: 13px;
    color: var(--wa_color_text_muted);
    background: var(--wa_color_surface);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transform-origin: center;
    transition:
        background var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out),
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

@media (hover: hover) and (pointer: fine) {
    .wa_chip:hover {
        border-color: var(--wa_color_text_faint);
        color: var(--wa_color_text);
        transform: translateY(-1px);
    }
}

.wa_chip:active {
    transform: translateY(0) scale(.94);
}

.wa_chip.on,
.wa_chip.on:hover {
    border-color: var(--wa_color_text);
    color: var(--wa_color_on_text);
    background: var(--wa_color_text);
    font-weight: 600;
    transform: none;
}

.wa_chip.on:active {
    transform: scale(.94);
}

@media (prefers-reduced-motion: reduce) {
    .wa_chip {
        transition: none;
    }

    .wa_chip:hover,
    .wa_chip:active {
        transform: none;
    }
}
</style>
