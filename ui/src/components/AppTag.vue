<template>
    <span class="wa_tag" :class="Classes">
        <span class="wa_tag_text"><slot>{{ text }}</slot></span>
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    text: {
        type: String,
        default: '',
    },
    /**
     * default | success | warning | help | danger
     * @type {'default' | 'success' | 'warning' | 'help' | 'danger'}
     */
    tone: {
        type: String,
        default: 'default',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /** 等宽字体；默认关闭，避免中文回退到其他字体 */
    mono: {
        type: Boolean,
        default: false,
    },
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
    /** 胶囊圆角，适合做状态角标 */
    pill: Boolean,
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
        wa_tag_pill: props.pill,
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
    height: 22px;
    padding: 0 6px;
    border: 1px solid transparent;
    border-radius: var(--wa_radius_sm);
    color: var(--wa_tag_color);
    background: var(--wa_tag_bg);
    font-family: var(--wa_font_mono);
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.wa_tag>svg,
.wa_tag>.wa_icon_raw {
    flex: none;
}

.wa_tag_text {
    display: block;
    min-width: 0;
    overflow: hidden;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 支持 text-box 的浏览器按字体内容区裁剪；CJK 字形在内容区里偏上，补一点下移 */
@supports (text-box-trim: trim-both) {
    .wa_tag_text {
        text-box-trim: trim-both;
        text-box-edge: auto;
        translate: 0 .06em;
    }
}

/* 旧内核没有 text-box，中文行盒通常偏上，做一点近似补偿 */
@supports not (text-box-trim: trim-both) {
    .wa_tag_text {
        padding-top: .08em;
    }
}

.wa_tag_md {
    height: 27px;
    padding: 0 8px;
    font-size: 13px;
}

.wa_tag_pill {
    border-radius: var(--wa_radius_pill);
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
    -webkit-backdrop-filter: var(--wa_frosted_filter);
    backdrop-filter: var(--wa_frosted_filter);
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
