<template>
    <section class="wa_panel" :class="[`wa_panel_${variant}`, `wa_panel_${tone}`, { wa_panel_compact: compact }]">
        <header v-if="title || description || $slots.title || $slots.actions" class="wa_panel_head">
            <div class="wa_panel_text">
                <h2 v-if="title || $slots.title" class="wa_panel_title">
                    <slot name="title">{{ title }}</slot>
                </h2>
                <p v-if="description" class="wa_panel_desc">{{ description }}</p>
            </div>
            <div v-if="$slots.actions" class="wa_panel_actions">
                <slot name="actions" />
            </div>
        </header>
        <div class="wa_panel_body">
            <slot />
        </div>
        <footer v-if="$slots.footer" class="wa_panel_foot">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: '',
    },
    description: {
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
    compact: Boolean,
    /**
     * default：带左侧色条的展示框；tip：浅色文本提示条；
     * soft：灰色半透明内容块；plain：透明背景 + 细边框内容块
     * @type {'default' | 'tip' | 'soft' | 'plain'}
     */
    variant: {
        type: String,
        default: 'default',
    },
})
</script>

<style>
.wa_panel {
    --wa_panel_tone: var(--wa_color_line_strong);
    display: grid;
    gap: 14px;
    min-width: 0;
    padding: 20px;
    border: 1px solid var(--wa_color_line);
    border-left: 3px solid var(--wa_panel_tone);
    border-radius: var(--wa_radius_popover);
    background: var(--wa_color_surface);
}

.wa_panel_compact {
    gap: 10px;
    padding: 14px 16px;
}

/* * tip：文本提示条。去掉左侧粗色条，改成整块淡色底 + 细边框 */
.wa_panel_tip {
    --wa_panel_tone: var(--wa_color_text_faint);

    gap: 6px;
    padding: 10px 14px;
    border: 1px solid color-mix(in srgb, var(--wa_panel_tone) 26%, transparent);
    border-radius: var(--wa_radius_popover);
    background: color-mix(in srgb, var(--wa_panel_tone) 7%, var(--wa_color_surface));
}

.wa_panel_tip.wa_panel_compact {
    padding: 8px 12px;
}

.wa_panel_tip .wa_panel_title {
    font-size: 13px;
}

.wa_panel_tip .wa_panel_body {
    font-size: 12.5px;
    line-height: 1.65;
}

.wa_panel_tip .wa_panel_desc {
    font-size: 12px;
}

/* * soft：灰色半透明内容块，参考 WebApp 设置页的分组卡片 */
.wa_panel_soft {
    gap: 10px;
    padding: 12px 16px;
    border: 0;
    border-radius: var(--wa_radius_popover);
    background: var(--wa_color_soft);
}

/* * plain：透明背景 + 细边框，标题使用正文色 */
.wa_panel_plain {
    gap: 10px;
    padding: 12px 16px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_popover);
    background: transparent;
}

.wa_panel_soft .wa_panel_title,
.wa_panel_plain .wa_panel_title {
    font-size: 13px;
    font-weight: 600;
    color: var(--wa_color_text);

}

.wa_panel_soft .wa_panel_body,
.wa_panel_plain .wa_panel_body {
    font-size: 12.5px;
    line-height: 1.65;
}

.wa_panel_soft.wa_panel_compact,
.wa_panel_plain.wa_panel_compact {
    padding: 10px 14px;
}

.wa_panel_success {
    --wa_panel_tone: var(--wa_color_success);
}

.wa_panel_warning {
    --wa_panel_tone: var(--wa_color_warning);
}

.wa_panel_help {
    --wa_panel_tone: var(--wa_color_help);
}

.wa_panel_danger {
    --wa_panel_tone: var(--wa_color_danger);
}

.wa_panel_head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
}

.wa_panel_text {
    display: grid;
    gap: 4px;
    min-width: 0;
}

.wa_panel_title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
}

.wa_panel_desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--wa_color_text_subtle);
}

.wa_panel_actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}

.wa_panel_body {
    min-width: 0;
    color: var(--wa_color_text_muted);
    font-size: 13px;
    line-height: 1.7;
}

.wa_panel_foot {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
