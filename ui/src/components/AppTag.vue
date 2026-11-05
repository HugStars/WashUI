<template>
    <span class="wa_tag" :class="Classes">
        <slot>{{ text }}</slot>
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    text: {
        type: String,
        default: '',
    },
    /** default | success | warning | help | danger */
    tone: {
        type: String,
        default: 'default',
        allows: ['default', 'success', 'warning', 'help', 'danger'],
    },
    size: {
        type: String,
        default: 'sm',
        allows: ['sm', 'md'],
    },
    /** 等宽字体，默认贴近文档 API 表格里的属性 / 类型 / 默认值 */
    mono: {
        type: Boolean,
        default: true,
    },
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
    /** 挂载时从左向右展开 */
    expand: {
        type: Boolean,
        default: true,
    },
})

const Classes = computed(() => [
    `wa_tag_${props.tone}`,
    {
        wa_tag_md: props.size === 'md',
        wa_tag_sans: !props.mono,
        wa_tag_frosted: props.frosted,
        wa_tag_expand: props.expand,
    },
])
</script>

<style>
.wa_tag {
    --wa_tag_color: var(--wa_color_text_muted);
    --wa_tag_bg: var(--wa_color_soft);

    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: 5px;
    color: var(--wa_tag_color);
    background: var(--wa_tag_bg);
    font-family: var(--wa_font_mono);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.wa_tag>svg,
.wa_tag>.wa_icon_raw {
    flex: none;
}

.wa_tag_md {
    padding: 4px 8px;
    font-size: 13px;
}

.wa_tag_sans {
    font-family: var(--wa_font_family);
}

.wa_tag_success {
    --wa_tag_color: color-mix(in srgb, var(--wa_color_success) 72%, var(--wa_color_text));
    --wa_tag_bg: color-mix(in srgb, var(--wa_color_success) 12%, transparent);
}

.wa_tag_warning {
    --wa_tag_color: color-mix(in srgb, var(--wa_color_warning) 72%, var(--wa_color_text));
    --wa_tag_bg: color-mix(in srgb, var(--wa_color_warning) 14%, transparent);
}

.wa_tag_help {
    --wa_tag_color: color-mix(in srgb, var(--wa_color_help) 72%, var(--wa_color_text));
    --wa_tag_bg: color-mix(in srgb, var(--wa_color_help) 12%, transparent);
}

.wa_tag_danger {
    --wa_tag_color: color-mix(in srgb, var(--wa_color_danger) 72%, var(--wa_color_text));
    --wa_tag_bg: color-mix(in srgb, var(--wa_color_danger) 12%, transparent);
}

.wa_tag_frosted {
    border-color: var(--wa_color_border);
    background: var(--wa_color_glass);
    background: linear-gradient(to bottom, var(--wa_color_glass), color-mix(in srgb, var(--wa_color_glass) 68%, transparent));
    -webkit-backdrop-filter: blur(var(--wa_blur));
    backdrop-filter: blur(var(--wa_blur));
}

.wa_tag_expand {
    transform-origin: left center;
    animation: wa_tag_expand var(--wa_duration_slow) var(--wa_ease_spring) both;
}

@keyframes wa_tag_expand {
    from {
        transform: scaleX(.72);
    }

    to {
        transform: scaleX(1);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_tag_expand {
        animation: none;
    }
}
</style>
