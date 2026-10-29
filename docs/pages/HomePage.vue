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
            <AppCard v-for="item in features" :key="item.path" compact>
                <template #title>{{ item.title }}</template>
                <template #extra>
                    <AppButton size="sm" variant="icon" aria-label="跳转" @click="router.push(item.path)">
                        <AppIcon name="chevron" :size="16" />
                    </AppButton>
                </template>
                <p class="wa_hint">{{ item.text }}</p>
            </AppCard>
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
    { title: '组件', text: '按钮、卡片、表单与反馈组件。', path: '/components' },
    { title: '图标', text: '内置图标与全局图标配置。', path: '/icons' },
    { title: '布局', text: '壳层、页面标题、进度条与路由过渡。', path: '/layout' },
    { title: '主题与变量', text: '亮暗主题、CSS tokens 与加载时配置。', path: '/guide/theme' },
    { title: '组合式函数', text: '请求、剪贴板与主题状态。', path: '/composables' },
    { title: '设计变量', text: '颜色、圆角、阴影、层级与断点。', path: '/tokens' },
]

</script>
