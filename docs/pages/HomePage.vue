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

        <div class="doc_stats">
            <AppStat v-for="item in stats" :key="item.label" :label="item.label" :value="item.value" />
        </div>

        <div class="doc_feature_grid">
            <AppCard v-for="item in features" :key="item.path" :title="item.title" compact>
                <p class="wa_hint">{{ item.text }}</p>
                <template #footer>
                    <AppButton size="sm" variant="line" @click="router.push(item.path)">{{ item.action }}</AppButton>
                </template>
            </AppCard>
        </div>

        <AppCard title="安装">
            <pre class="doc_pre"><code>{{ installCode }}</code></pre>
            <p class="wa_hint doc_gap">style.css 已包含 tokens.css。createUi 会注册全部组件、初始化主题，并应用自定义 tokens。</p>
        </AppCard>

        <AppCard title="页面骨架">
            <pre class="doc_pre"><code>{{ shellCode }}</code></pre>
            <p class="wa_hint doc_gap">PageHeader 放在页面过渡外，切换路由时标题不会闪空。</p>
        </AppCard>
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
    { title: '安装与初始化', text: '安装依赖、引入样式、注册组件与配置主题。', path: '/guide/install', action: '查看安装' },
    { title: '组件', text: '按钮、卡片、表单与反馈组件。', path: '/components', action: '浏览组件' },
    { title: '图标', text: '内置图标与全局图标配置。', path: '/icons', action: '浏览图标' },
    { title: '布局', text: '壳层、页面标题、进度条与路由过渡。', path: '/layout', action: '浏览布局' },
    { title: '主题与变量', text: '亮暗主题、CSS tokens 与加载时配置。', path: '/guide/theme', action: '查看主题' },
    { title: '组合式函数', text: '请求、剪贴板与主题状态。', path: '/composables', action: '查看能力' },
    { title: '设计变量', text: '颜色、圆角、阴影、层级与断点。', path: '/tokens', action: '查看变量' },
]

const installCode = `pnpm add @wash/ui`

const shellCode = `<AppShell :nav="nav" :active="route.name" @navigate="go">
    <PageHeader :title="route.meta.title" />
    <RouterView v-slot="{ Component }">
        <PageTransition>
            <component :is="Component" />
        </PageTransition>
    </RouterView>
</AppShell>`
</script>
