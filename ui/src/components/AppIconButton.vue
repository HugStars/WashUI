<template>
    <button :type="type" class="wa_icon_btn" :class="Classes" :disabled="disabled || loading"
        :aria-label="label || ariaLabel || undefined" :title="label || ariaLabel || undefined"
        :aria-busy="loading || undefined" :aria-pressed="active ? 'true' : undefined">
        <AppSpinner v-if="loading" :size="SpinnerSize" label="" />
        <AppIcon v-else-if="icon" :icon="icon" :size="IconSize" />
        <AppIcon v-else :name="name" :size="IconSize" />
    </button>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import AppSpinner from './AppSpinner.vue'

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
    /** 图标尺寸；不传时跟随 size 自动设置 */
    iconSize: {
        type: [Number, String],
        default: null,
    },
    /**
     * @type {'xs' | 'sm' | 'md' | 'lg'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /**
     * @type {'ghost' | 'line' | 'solid' | 'danger'}
     */
    variant: {
        type: String,
        default: 'ghost',
    },
    /**
     * @type {'button' | 'submit' | 'reset'}
     */
    type: {
        type: String,
        default: 'button',
    },
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
    /** 选中 / 开启态，同时输出 aria-pressed */
    active: Boolean,
    loading: Boolean,
    disabled: Boolean,
})

const ICON_SIZES = { xs: 13, sm: 15, md: 16, lg: 18 }
const SPINNER_SIZES = { xs: 12, sm: 13, md: 14, lg: 16 }

const IconSize = computed(() => props.iconSize ?? ICON_SIZES[props.size] ?? 15)
const SpinnerSize = computed(() => SPINNER_SIZES[props.size] ?? 14)

const Classes = computed(() => {
    const list = []
    if (props.size !== 'sm') list.push(`wa_icon_btn_${props.size}`)
    if (props.variant !== 'ghost') list.push(`wa_icon_btn_${props.variant}`)
    if (props.frosted) list.push('wa_frosted')
    if (props.active) list.push('wa_icon_btn_on')
    if (props.loading) list.push('wa_icon_btn_loading')
    return list
})
</script>

<style>
.wa_icon_btn {
    --wa_icon_btn_size: var(--wa_size_icon_btn_sm);

    display: inline-grid;
    place-items: center;
    flex: none;
    width: var(--wa_icon_btn_size);
    height: var(--wa_icon_btn_size);
    padding: 0;
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_muted);
    background: transparent;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        opacity var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_icon_btn_xs {
    --wa_icon_btn_size: var(--wa_size_icon_btn_xs);
}

.wa_icon_btn_md {
    --wa_icon_btn_size: var(--wa_size_icon_btn_md);
}

.wa_icon_btn_lg {
    --wa_icon_btn_size: var(--wa_size_icon_btn_lg);
}

.wa_icon_btn:hover:not(:disabled) {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_icon_btn:active:not(:disabled) {
    transform: scale(.94);
}

.wa_icon_btn:disabled {
    opacity: .4;
    cursor: not-allowed;
}

.wa_icon_btn_loading:disabled {
    opacity: 1;
    cursor: progress;
}

.wa_icon_btn_line {
    border: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
}

.wa_icon_btn_line:hover:not(:disabled) {
    border-color: var(--wa_color_line_strong);
    background: var(--wa_color_hover);
}

.wa_icon_btn_solid {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
}

.wa_icon_btn_solid:hover:not(:disabled) {
    background: var(--wa_color_primary_hover);
}

.wa_icon_btn_danger {
    color: var(--wa_color_danger);
}

.wa_icon_btn_danger:hover:not(:disabled),
.wa_icon_btn_danger:active:not(:disabled) {
    color: var(--wa_color_on_danger);
    background: var(--wa_color_danger);
}

.wa_icon_btn.wa_frosted {
    color: var(--wa_color_text);
}

.wa_icon_btn_solid.wa_frosted {
    color: var(--wa_color_on_highlight);
}

.wa_icon_btn_danger.wa_frosted {
    color: var(--wa_color_danger);
}

.wa_icon_btn_on {
    color: var(--wa_color_text);
    background: var(--wa_color_active);
}

.wa_icon_btn_on:hover:not(:disabled) {
    color: var(--wa_color_text);
    background: var(--wa_color_active);
}

.wa_icon_btn_solid.wa_icon_btn_on {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_primary_hover);
}

.wa_icon_btn_danger.wa_icon_btn_on {
    color: var(--wa_color_on_danger);
    background: var(--wa_color_danger);
}

.wa_icon_btn.wa_frosted:hover:not(:disabled) {
    background: var(--wa_color_glass);
    background: linear-gradient(var(--wa_color_hover), var(--wa_color_hover)), var(--wa_color_glass);
}

/* 磨砂和选中态叠加时保留玻璃底 */
.wa_icon_btn.wa_frosted.wa_icon_btn_on,
.wa_icon_btn.wa_frosted.wa_icon_btn_on:hover:not(:disabled) {
    background: linear-gradient(var(--wa_color_active), var(--wa_color_active)), var(--wa_color_glass);
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
