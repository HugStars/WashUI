<template>
    <button type="button" class="wa_icon_btn" :class="Classes" :disabled="disabled"
        :aria-label="label || ariaLabel || undefined" :title="label || ariaLabel || undefined">
        <AppIcon v-if="icon" :icon="icon" :size="iconSize" />
        <AppIcon v-else :name="name" :size="iconSize" />
    </button>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    name: {
        type: String,
        default: '',
    },
    /** 直接传图标数据，优先级高于 name */
    icon: {
        type: [Array, String],
        default: undefined,
    },
    label: {
        type: String,
        default: '',
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    iconSize: {
        type: [Number, String],
        default: 15,
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /**
     * @type {'ghost' | 'danger'}
     */
    variant: {
        type: String,
        default: 'ghost',
    },
    disabled: Boolean,
})

const Classes = computed(() => ({
    wa_icon_btn_md: props.size === 'md',
    wa_icon_btn_danger: props.variant === 'danger',
}))
</script>

<style>
.wa_icon_btn {
    display: inline-grid;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_muted);
    background: transparent;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_icon_btn_md {
    width: 32px;
    height: 32px;
}

.wa_icon_btn:hover:not(:disabled) {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_icon_btn:active:not(:disabled) {
    transform: scale(.94);
}

.wa_icon_btn:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_icon_btn:disabled {
    opacity: .4;
    cursor: not-allowed;
}

.wa_icon_btn_danger:hover:not(:disabled),
.wa_icon_btn_danger:active:not(:disabled) {
    color: #ffffff;
    background: var(--wa_color_danger);
}

@media (prefers-reduced-motion: reduce) {
    .wa_icon_btn {
        transition: none;
    }

    .wa_icon_btn:active:not(:disabled) {
        transform: none;
    }
}
</style>
