<template>
    <div class="doc_layout" :class="{ doc_layout_side: section }">
        <DocSideNav v-if="section" :section="section" />

        <article class="doc_article">
            <header class="doc_head">
                <div class="doc_head_title">
                    <h1 class="doc_title">{{ title }}</h1>
                    <p v-if="category || name" class="doc_meta">
                        <span v-if="category" class="wa_tag">{{ category }}</span>
                        <code v-if="name" class="doc_meta_name">{{ name }}</code>
                    </p>
                </div>
                <p v-if="description" class="doc_desc">{{ description }}</p>
            </header>

            <slot />

            <section v-if="$slots.api" class="doc_block">
                <h2 class="doc_h2">API</h2>
                <slot name="api" />
            </section>

            <footer v-if="prev || next" class="doc_pager">
                <RouterLink v-if="prev" :to="prev.path" class="doc_pager_link">
                    <span>上一页</span>
                    <b>{{ pageLabel(prev) }}</b>
                </RouterLink>
                <RouterLink v-if="next" :to="next.path" class="doc_pager_link doc_pager_next">
                    <span>下一页</span>
                    <b>{{ pageLabel(next) }}</b>
                </RouterLink>
            </footer>
        </article>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { pageLabel, pageNav, sections } from '../site.js'
import DocSideNav from './DocSideNav.vue'

defineProps({
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
})

const route = useRoute()
// 桌面端左侧面板与移动端 Header 下拉共用同一份 section 配置。
const section = computed(() => sections[route.meta.section] || null)
const index = computed(() => pageNav.findIndex(item => item.name === route.name))
const prev = computed(() => index.value > 0 ? pageNav[index.value - 1] : null)
const next = computed(() => index.value >= 0 && index.value < pageNav.length - 1 ? pageNav[index.value + 1] : null)
</script>

<style>
.doc_layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
}

.doc_layout>* {
    min-width: 0;
}

.doc_layout_side {
    grid-template-columns: var(--doc_side_width) minmax(0, 1fr);
}

.doc_article {
    min-width: 0;
    max-width: 880px;
    padding: calc(var(--doc_side_radius) * 2);
    border-radius: var(--doc_side_radius);
    background: var(--wa_color_surface);
}

.doc_head {
    display: grid;
    gap: 10px;
    margin-bottom: 22px;
}

.doc_head_title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.doc_meta {
    display: flex;
    align-items: center;
    gap: 8px;
}

.doc_meta_name {
    font: 12px var(--wa_font_mono);
    color: var(--wa_color_text_subtle);
}

.doc_title {
    font-size: clamp(26px, 4vw, 34px);
    font-weight: 600;
    letter-spacing: -.02em;
    line-height: 1.2;
}

.doc_desc {
    max-width: 760px;
    font-size: 14px;
    line-height: 1.75;
    color: var(--wa_color_text_muted);
}

.doc_block {
    margin-top: 28px;
}

.doc_pager {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 36px;
    padding-top: 18px;
    border-top: 1px solid var(--wa_color_line);
}

.doc_pager_link {
    display: grid;
    gap: 2px;
    min-width: min(200px, 40vw);
    padding: 10px 14px;
    border-radius: 12px;
    color: var(--wa_color_text);
    background: var(--wa_color_soft);
    text-decoration: none;
    transition: background var(--wa_duration_fast);
}

.doc_pager_link:hover {
    background: var(--wa_color_hover);
}

.doc_pager_link span {
    font-size: 11px;
    color: var(--wa_color_text_faint);
}

.doc_pager_link b {
    font-size: 13px;
    font-weight: 500;
}

.doc_pager_next {
    margin-left: auto;
    text-align: right;
}

@media (max-width: 860px) {
    .doc_layout_side {
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
    }

    .doc_article {
        padding: var(--doc_side_radius);
    }
}
</style>
