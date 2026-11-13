<template>
    <p class="wa_app_hint" :class="[`wa_app_hint_${tone}`, { wa_app_hint_box: box }]">
        <span v-if="ResolvedIcon" class="wa_app_hint_icon" aria-hidden="true">
            <AppIcon :name="ResolvedIcon" :size="15" />
        </span>
        <span class="wa_app_hint_text">
            <slot>{{ text }}</slot>
        </span>
    </p>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    text: {
        type: String,
        default: '',
    },
    /**
     * @type {'default' | 'success' | 'warning' | 'help' | 'danger'}
     */
    tone: {
        type: String,
        default: 'default',
    },
    /** 自定义图标名；传 false 可以去掉默认图标 */
    icon: {
        type: [String, Boolean],
        default: undefined,
    },
    /** 带底色和边框的提示块 */
    box: Boolean,
})

const DEFAULT_ICONS = {
    default: '',
    success: 'check',
    warning: 'alert-triangle',
    help: 'help-circle',
    danger: 'alert-circle',
}

const ResolvedIcon = computed(() => {
    if (props.icon === false) return ''
    return props.icon || DEFAULT_ICONS[props.tone] || ''
})
</script>

<style>
.wa_app_hint {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    min-width: 0;
    font-size: 12px;
    line-height: 1.65;
    color: var(--wa_color_text_subtle);
}

/* * 图标占一个完整行高并居中：单行时和文字垂直居中，多行时对齐第一行 */
.wa_app_hint_icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    height: 1.65em;
    color: currentColor;
}

.wa_app_hint_text {
    min-width: 0;
}

.wa_app_hint_success {
    color: color-mix(in srgb, var(--wa_color_success) 78%, var(--wa_color_text));
}

.wa_app_hint_warning {
    color: color-mix(in srgb, var(--wa_color_warning) 72%, var(--wa_color_text));
}

.wa_app_hint_help {
    color: color-mix(in srgb, var(--wa_color_help) 76%, var(--wa_color_text));
}

.wa_app_hint_danger {
    color: var(--wa_color_danger);
}

.wa_app_hint_box {
    padding: 8px 12px;
    border: 1px solid color-mix(in srgb, currentColor 24%, transparent);
    /* * 与 AppPanel / AppList 等内容块共用同一档圆角 */
    border-radius: var(--wa_radius_popover);
    background: color-mix(in srgb, currentColor 7%, transparent);
}
</style>
