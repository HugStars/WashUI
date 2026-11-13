<template>
    <RouterLink :to="path" class="doc_entry" :class="{ doc_entry_large: large }">
        <span class="doc_entry_head">
            <span class="doc_entry_title">{{ title }}</span>
            <code v-if="name" class="doc_entry_name">{{ name }}</code>
        </span>
        <span class="doc_entry_desc">{{ summary }}</span>
        <AppIcon name="chevron" :size="15" class="doc_entry_arrow" aria-hidden="true" />
    </RouterLink>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    /** 组件名 / 函数名 / 英文名，作为标题后的弱化等宽小字 */
    name: {
        type: String,
        default: '',
    },
    summary: {
        type: String,
        default: '',
    },
    path: {
        type: String,
        required: true,
    },
    /** 首页等大入口使用更大的内边距和标题 */
    large: Boolean,
})
</script>

<style>
.doc_entry_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
    gap: 10px;
}

.doc_entry_group+.doc_entry_group {
    margin-top: 26px;
}

.doc_entry_group .doc_h2 {
    padding-bottom: 8px;
    border-bottom: 1px solid var(--wa_color_line);
}

.doc_entry {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    min-height: 112px;
    padding: 14px 16px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    color: inherit;
    background: transparent;
    text-decoration: none;
    transition:
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.doc_entry:hover {
    border-color: var(--wa_color_line_strong);
    background: var(--wa_color_soft);
}

.doc_entry:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.doc_entry_head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 8px;
    min-width: 0;
    padding-right: 20px;
}

.doc_entry_title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    color: var(--wa_color_text);
}

.doc_entry_name {
    font: 11px var(--wa_font_mono);
    line-height: 1.5;
    color: var(--wa_color_text_muted);
}

.doc_entry_desc {
    display: -webkit-box;
    overflow: hidden;
    font-size: 12px;
    line-height: 1.65;
    color: var(--wa_color_text_subtle);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.doc_entry_arrow {
    position: absolute;
    top: 16px;
    right: 14px;
    color: var(--wa_color_text_faint);
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.doc_entry:hover .doc_entry_arrow {
    color: var(--wa_color_text);
    transform: translateX(2px);
}

.doc_entry_large {
    min-height: 132px;
    padding: 18px;
}

.doc_entry_large .doc_entry_title {
    font-size: 16px;
}

.doc_entry_large .doc_entry_arrow {
    top: 20px;
    right: 18px;
}

@media (max-width: 860px) {
    .doc_entry_grid {
        grid-template-columns: minmax(0, 1fr);
    }

    .doc_entry {
        min-height: 0;
    }
}

@media (prefers-reduced-motion: reduce) {

    .doc_entry,
    .doc_entry_arrow {
        transition: none;
    }

    .doc_entry:hover .doc_entry_arrow {
        transform: none;
    }
}
</style>
