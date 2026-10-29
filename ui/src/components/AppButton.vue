<template>
    <button :type="type" class="wa_btn" :class="Classes" :disabled="disabled || loading"
        :aria-busy="loading || undefined">
        <span v-if="loading" class="wa_spinner" aria-hidden="true"></span>
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'default',
    },
    size: {
        type: String,
        default: 'sm',
    },
    type: {
        type: String,
        default: 'button',
    },
    loading: Boolean,
    disabled: Boolean,
})

const Classes = computed(() => {
    const list = []
    if (props.variant !== 'default') list.push(`wa_btn_${props.variant}`)
    if (props.size === 'sm') list.push('wa_btn_sm')
    if (props.loading) list.push('wa_btn_loading')
    return list
})
</script>

<style>
.wa_btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: var(--wa_control_height);
    padding: 6px 22px;
    border: 0;
    border-radius: var(--wa_radius_pill);
    font: inherit;
    color: var(--wa_color_text);
    background: var(--wa_color_soft);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    transition: background var(--wa_duration_fast), opacity var(--wa_duration_fast), border-color var(--wa_duration_fast);
}

.wa_btn:hover {
    background: var(--wa_color_hover);
}

.wa_btn:active {
    background: var(--wa_color_active);
}

.wa_btn:disabled {
    opacity: .4;
    cursor: not-allowed;
}

.wa_btn:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_btn_primary {
    color: var(--wa_color_on_text);
    background: var(--wa_color_text);
}

.wa_btn_primary:hover,
.wa_btn_primary:active {
    background: var(--wa_color_primary_hover);
}

.wa_btn_line {
    border: 1px solid var(--wa_color_line);
    background: transparent;
}

.wa_btn_line:hover {
    background: var(--wa_color_soft);
}

.wa_btn_danger {
    color: var(--wa_color_danger);
    background: var(--wa_color_danger_soft);
}

.wa_btn_danger:hover {
    background: var(--wa_color_danger_hover);
}

.wa_btn_sm {
    min-height: var(--wa_control_height_sm);
    padding: 4px 16px;
    font-size: 13px;
}

.wa_btn_icon {
    position: relative;
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
}

.wa_btn_icon .wa_spinner {
    position: absolute;
    inset: 0;
    margin: auto;
}

.wa_btn_loading.wa_btn_icon> :not(.wa_spinner) {
    visibility: hidden;
}

.wa_btn_icon.wa_btn_sm {
    width: 32px;
    height: 32px;
}

.wa_btn .wa_spinner {
    width: 14px;
    height: 14px;
}
</style>
