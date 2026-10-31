<template>
    <div class="doc_stack">
        <section class="doc_hero">
            <div class="doc_hero_head">
                <h1 class="doc_hero_title">WashUI</h1>
                <span class="wa_tag doc_hero_tag">Vue 3 · 私有设计系统</span>
            </div>
            <p class="doc_hero_lead">
                WashUI 的界面基础层：设计变量、布局壳、组件、表单、反馈、主题、路由与组合式函数。
            </p>
            <div class="doc_actions">
                <AppButton variant="primary" @click="router.push('/guide/quick-start')">快速开始</AppButton>
                <AppButton variant="line" @click="router.push('/components')">浏览组件</AppButton>
            </div>
            <div class="doc_tags">
                <span class="wa_tag">Vue 3.5+</span>
                <span class="wa_tag">Vite 7</span>
                <span class="wa_tag">纯 CSS 变量</span>
                <span class="wa_tag">按需导入</span>
            </div>
        </section>

        <div class="doc_feature_grid">
            <RouterLink v-for="item in features" :key="item.path" :to="item.path" class="doc_feature_link">
                <AppCard compact>
                    <template #title>{{ item.title }}</template>
                    <template #extra>
                        <AppIcon name="chevron" :size="16" class="doc_feature_arrow" />
                    </template>
                    <p class="wa_hint">{{ item.text }}</p>
                </AppCard>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = [
    { label: '组件', value: '16' },
    { label: '布局', value: '4' },
    { label: '内置图标', value: '16' },
    { label: '组合式函数', value: '3' },
]

const features = [
    { title: '安装与初始化', text: '安装依赖、引入样式、注册组件与配置主题。', path: '/guide/install' },
    { title: '主题与变量', text: '亮暗主题、CSS tokens 与加载时配置。', path: '/guide/theme' },
    { title: '组件', text: '按钮、卡片、表单与反馈组件。', path: '/components' },
    { title: '布局', text: '壳层、页面标题、进度条与路由过渡。', path: '/layout' },
    { title: '能力', text: '全局服务、组合式函数、工具函数与设计变量。', path: '/abilities' },
    { title: '图标', text: '内置图标与全局图标配置。', path: '/icons' },
]

</script>

<style>
.doc_stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
    gap: 12px;
}

.doc_stats>* {
    min-width: 0;
}

.doc_hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding: 34px;
    border: 1px solid var(--wa_color_border);
    border-radius: var(--wa_radius_card);
    background:
        radial-gradient(110% 130% at 100% 0%, var(--wa_color_soft), transparent 58%),
        var(--wa_color_surface);
}

.doc_hero_head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
}

.doc_hero_title {
    font-size: clamp(34px, 6vw, 54px);
    font-weight: 600;
    letter-spacing: -.03em;
    line-height: 1.05;
}

.doc_hero_tag {
    flex: none;
    margin-right: auto;
}

.doc_hero_lead {
    max-width: 680px;
    font-size: 15px;
    line-height: 1.75;
    color: var(--wa_color_text_muted);
}

.doc_actions,
.doc_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.doc_actions {
    gap: 10px;
}

.doc_hero>* {
    min-width: 0;
}

.doc_feature_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(175px, 100%), 1fr));
    gap: 14px;
}

.doc_feature_grid>* {
    min-width: 0;
}

.doc_feature_grid .wa_card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.doc_feature_grid .wa_card_foot {
    margin-top: auto;
    padding-top: 16px;
}

.doc_feature_link {
    display: block;
    height: 100%;
    color: inherit;
    text-decoration: none;
}

.doc_feature_link .wa_card {
    border: 1px solid transparent;
    transition: transform var(--wa_duration_base), border-color var(--wa_duration_base), box-shadow var(--wa_duration_base);
}

.doc_feature_link:hover .wa_card {
    transform: translateY(-2px);
    border-color: var(--wa_color_line);
    box-shadow: 0 12px 28px #00000012;
}

.doc_feature_arrow {
    color: var(--wa_color_text_faint);
    transition: color var(--wa_duration_fast), transform var(--wa_duration_fast);
}

.doc_feature_link:hover .doc_feature_arrow {
    color: var(--wa_color_text);
    transform: translateX(2px);
}

.doc_feature_link:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 3px;
    border-radius: var(--wa_radius_card);
}

@media (max-width: 860px) {

    .doc_hero {
        padding: 24px 20px;
    }
}
</style>
