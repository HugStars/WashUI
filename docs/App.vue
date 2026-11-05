<template>
    <AppShell :nav="nav" :active="active" @navigate="go">
        <PageHeader :title="title">
            <template #center>
                <DocNavSelect v-if="Mobile" />
            </template>
            <template #actions>
                <span class="doc_version">v0.1.0</span>
                <AppThemeToggle />
            </template>
        </PageHeader>

        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>

        <template #footer>
            <span class="wa_mono">@wash/ui</span>
            <a href="https://hugstars.top" target="_blank" rel="noopener noreferrer">✨ By Hugstars.</a>
        </template>
    </AppShell>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppThemeToggle } from '@wash/ui'
import DocNavSelect from './components/DocNavSelect.vue'
import { nav } from './site.js'

const route = useRoute()
const router = useRouter()
const active = computed(() => route.meta.nav || route.name)
const title = computed(() => route.meta.title || '文档')
// Header 导航下拉只在移动端使用，桌面端使用 DocSideNav。
const Media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 860px)') : null
const Mobile = ref(Media?.matches ?? false)

function OnMedia(event) {
    Mobile.value = event.matches
}

onMounted(() => {
    Media?.addEventListener('change', OnMedia)
})

onUnmounted(() => {
    Media?.removeEventListener('change', OnMedia)
})

const entry = {
    home: '/',
    guide: '/guide/install',
    components: '/components',
    icons: '/icons',
    layout: '/layout',
    playground: '/playground',
    abilities: '/abilities',
}

function go(item) {
    const path = entry[item.name]
    if (path && route.path !== path) router.navigate(path)
}
</script>

<style>
:root {
    --doc_side_width: 240px;
    --doc_side_padding: 10px;
    --doc_side_radius: 18px;
}
.doc_version {
    font-size: 12px;
    color: var(--wa_color_text_faint);
}

.doc_frosted_stage {
    margin: calc(var(--doc_demo_padding, 20px) * -1);
    padding: var(--doc_demo_padding, 20px);
    border-radius: 0;
    background:
        radial-gradient(circle at 18% 20%, #7c3aed66, transparent 42%),
        radial-gradient(circle at 82% 28%, #06b6d466, transparent 42%),
        radial-gradient(circle at 50% 88%, #f59e0b66, transparent 46%),
        var(--wa_color_soft);
}
.doc_stack {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
}
.doc_stack>* {
    min-width: 0;
}
.doc_row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}
.doc_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
    gap: 12px;
}
.doc_grid>* {
    min-width: 0;
}
.doc_gap {
    margin-top: 14px;
}
.doc_text {
    max-width: 760px;
    font-size: 14px;
    line-height: 1.75;
    color: var(--wa_color_text_muted);
}
.doc_text+.doc_text {
    margin-top: 8px;
}
.doc_h2 {
    margin: 30px 0 12px;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.4;
}
.doc_h3 {
    margin: 20px 0 10px;
    font-size: 15px;
    font-weight: 600;
}
.doc_list {
    display: grid;
    gap: 8px;
    max-width: 760px;
    padding-left: 20px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--wa_color_text_muted);
}
.doc_note {
    max-width: 760px;
    padding: 2px 0 2px 14px;
    border-left: 3px solid var(--wa_color_accent);
    font-size: 13px;
    line-height: 1.7;
    color: var(--wa_color_text_muted);
}
.doc_component_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
    gap: 12px;
}
.doc_component_grid>* {
    min-width: 0;
}
.doc_component_link {
    display: block;
    height: 100%;
    color: inherit;
    text-decoration: none;
}
.doc_component_link .wa_card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 18px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_popover);
    background: var(--wa_color_canvas);
    transition:
        transform var(--wa_duration_base) var(--wa_ease_out),
        box-shadow var(--wa_duration_base) var(--wa_ease_out),
        border-color var(--wa_duration_base) var(--wa_ease_out);
}
.doc_component_link .wa_card_head {
    margin-bottom: 10px;
}
.doc_component_link .wa_card_title {
    font-size: 15px;
}
.doc_component_link .wa_card_title::before {
    height: 13px;
}
.doc_component_link:hover .wa_card {
    transform: translateY(-2px);
    border-color: var(--wa_color_line_strong);
    box-shadow: 0 12px 28px #00000012;
}

.doc_component_link:active .wa_card {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px #00000010;
}

@media (prefers-reduced-motion: reduce) {
    .doc_component_link .wa_card {
        transition: none;
    }

    .doc_component_link:hover .wa_card,
    .doc_component_link:active .wa_card {
        transform: none;
    }
}
.doc_component_name {
    padding: 2px 6px;
    border-radius: 6px;
    background: var(--wa_color_soft);
    font: 11px var(--wa_font_mono);
    color: var(--wa_color_text_subtle);
}
.doc_component_go {
    display: block;
    margin-top: auto;
    padding-top: 14px;
    font-size: 12px;
    color: var(--wa_color_text_subtle);
    transition: color var(--wa_duration_fast);
}
.doc_component_link:hover .doc_component_go {
    color: var(--wa_color_accent);
}
.doc_code_inline {
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--wa_color_soft);
    font: 12px var(--wa_font_mono);
    color: var(--wa_color_text);
    white-space: nowrap;
}
/* 正文中直接放置的平铺代码块，补一点上下间距 */
.doc_article>.wa_code_plain {
    margin: 12px 0;
}
.doc_tokens {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr));
    gap: 10px;
}
.doc_tokens>* {
    min-width: 0;
}
.doc_token {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 8px 10px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}
.doc_swatch {
    flex: none;
    width: 28px;
    height: 28px;
    border: 1px solid var(--wa_color_line_strong);
    border-radius: 8px;
}
.doc_token code {
    overflow: hidden;
    font: 11px var(--wa_font_mono);
    color: var(--wa_color_text_muted);
    text-overflow: ellipsis;
    white-space: nowrap;
}
.doc_kv {
    display: grid;
    gap: 6px;
    max-width: 760px;
    font-size: 13px;
}
.doc_kv_row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 20px;
    min-width: 0;
    padding: 9px 0;
    border-bottom: 1px solid var(--wa_color_line);
}
.doc_kv_row:last-child {
    border-bottom: 0;
}
.doc_kv_row code {
    font-family: var(--wa_font_mono);
    color: var(--wa_color_text);
}
@media (max-width: 860px) {

    .doc_version {
        display: none;
    }

    .wa_header .wa_page_header:has(.doc_header_nav) h1 {
        display: none;
    }

    .wa_page_actions {
        flex: none;
    }
}
</style>
