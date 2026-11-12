<template>
    <AppShell :nav="nav" :active="active" @navigate="go">
        <PageHeader>
            <span>{{ title }}</span>
            <code v-if="currentName" class="doc_header_name">{{ currentName }}</code>
            <template #center>
                <DocNavSelect v-if="Mobile" />
            </template>
            <template #actions>
                <DocSearch />
                <span class="doc_version">v{{ Version }}</span>
                <AppThemeToggle />
            </template>
        </PageHeader>

        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>

        <template #footer>
            <span class="wa_mono">wash-ui</span>
            <a href="https://hugstars.top" target="_blank" rel="noopener noreferrer">✨ By Hugstars.</a>
        </template>
    </AppShell>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppThemeToggle } from 'wash-ui'
import pkg from '../ui/package.json'
import DocNavSelect from './components/DocNavSelect.vue'
import DocSearch from './components/DocSearch.vue'
import { nav, pageNav } from './site.js'

const Version = pkg.version

const route = useRoute()
const router = useRouter()
const active = computed(() => route.meta.nav || route.name)
const title = computed(() => route.meta.title || '文档')
// 组件页在顶部标题后补一个组件名，概览页没有 component 或不以大写开头时自动省略
const currentName = computed(() => {
    const component = pageNav.find(item => item.name === route.name)?.component
    return component && /^[A-Z]/.test(component) ? component : ''
})
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
    color: var(--wa_color_text_subtle);
}

.doc_header_name {
    display: inline-block;
    margin-left: 8px;
    padding: 1px 6px;
    border-radius: 6px;
    background: var(--wa_color_field);
    font: 500 12px var(--wa_font_mono);
    color: var(--wa_color_text_subtle);
    vertical-align: 3px;
}

@media (max-width: 640px) {
    .doc_version {
        display: none;
    }
}

/* 彩色光斑背景：模糊层独立于内容，避免 filter 把子元素一起糊掉 */
.doc_aurora,
.doc_frosted_stage {
    --doc_aurora_opacity: .68;
    position: relative;
    isolation: isolate;
    overflow: hidden;
}

.doc_frosted_stage {
    --doc_aurora_opacity: .76;
}

.doc_aurora::before,
.doc_frosted_stage::before {
    content: '';
    position: absolute;
    inset: -24%;
    z-index: -1;
    background:
        radial-gradient(38% 45% at 22% 28%, #007cf080, #0000 70%),
        radial-gradient(35% 42% at 78% 24%, #00dfd866, #0000 70%),
        radial-gradient(40% 48% at 30% 78%, #7928ca61, #0000 70%),
        radial-gradient(36% 44% at 76% 74%, #ff008052, #0000 70%),
        radial-gradient(30% 38% at 52% 52%, #f9cb2840, #0000 70%);
    filter: blur(36px) saturate(1.15);
    opacity: var(--doc_aurora_opacity);
    pointer-events: none;
}

/* 再压一层画布色，保证磨砂上的文字对比度，不让色斑抢内容 */
.doc_aurora::after,
.doc_frosted_stage::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(180deg,
            color-mix(in srgb, var(--wa_color_canvas) 6%, transparent),
            color-mix(in srgb, var(--wa_color_canvas) 28%, transparent));
    pointer-events: none;
}

[data-theme='dark'] .doc_aurora {
    --doc_aurora_opacity: .58;
}

[data-theme='dark'] .doc_frosted_stage {
    --doc_aurora_opacity: .64;
}

[data-theme='dark'] .doc_aurora::before,
[data-theme='dark'] .doc_frosted_stage::before {
    filter: blur(40px) saturate(1.1);
}

[data-theme='dark'] .doc_aurora::after,
[data-theme='dark'] .doc_frosted_stage::after {
    background: linear-gradient(180deg,
            color-mix(in srgb, var(--wa_color_canvas) 12%, transparent),
            color-mix(in srgb, var(--wa_color_canvas) 38%, transparent));
}

.doc_frosted_stage {
    margin: calc(var(--doc_demo_padding, 20px) * -1);
    padding: var(--doc_demo_padding, 20px);
    border-radius: 0;
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
    margin-bottom: 14px;
}

/* note 同时带 doc_gap 的 hint 沿用文档间距，覆盖库默认的 8px */
p.wa_hint.doc_gap {
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

/* * ComponentsPage 与 HomePage 共用卡片 hover 动画，边框颜色由各自页面覆盖 */
.doc_card_link .wa_card {
    transition:
        transform var(--wa_duration_base) var(--wa_ease_out),
        box-shadow var(--wa_duration_base) var(--wa_ease_out),
        border-color var(--wa_duration_base) var(--wa_ease_out);
}

.doc_component_link .wa_card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 18px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_popover);
    background: var(--wa_color_canvas);
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
.doc_card_link:hover .wa_card {
    transform: translateY(-2px);
    box-shadow: var(--wa_shadow_card_hover);
}

.doc_component_link:hover .wa_card {
    border-color: var(--wa_color_line_strong);
}

.doc_component_link:active .wa_card {
    transform: translateY(-1px);
    box-shadow: var(--wa_shadow_card_active);
}

@media (prefers-reduced-motion: reduce) {
    .doc_card_link .wa_card {
        transition: none;
    }

    .doc_card_link:hover .wa_card,
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
