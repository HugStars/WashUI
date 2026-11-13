<template>
    <DocPage category="布局" name="AppShell" title="壳层" description="页面骨架，负责顶部栏、侧栏导航与页脚。">
        <h2 class="doc_h2">基本结构</h2>
        <AppCode :code="baseCode" lang="html" />

        <h2 class="doc_h2">导航项</h2>
        <AppCode :code="navCode" lang="js" />
        <p class="doc_text doc_gap">
            导航项格式为 { name, label, icon }。active 与 name 对应，支持字符串或 Symbol。
        </p>

        <h2 class="doc_h2">导航布局</h2>
        <ApiTable kind="values" :rows="navLayouts" />

        <h2 class="doc_h2">移动端手势隐藏导航</h2>
        <p class="doc_text">开启 auto-hide-nav 后，手指向上滑隐藏底部导航，向下滑或页面回到顶部时显示；只在移动端断点生效。</p>
        <AppCode :code="gestureCode" lang="html" />

        <h2 class="doc_h2">加载状态</h2>
        <p class="doc_text">
            AppShell 的 loading 属性预留给顶部进度条；当前 AppShell 内置的 AppRouteBar 已关闭。需要顶部进度条时，请按「路由进度条」页单独使用 AppRouteBar，并由 routeLoading 驱动。
        </p>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DocPage } from '../components/index.js'

const navLayouts = [
    { name: 'auto', desc: '默认。桌面仅图标，移动端图标和文本' },
    { name: 'inline', desc: '横向图标和文本' },
    { name: 'stacked', desc: '上下排列' },
    { name: 'icon', desc: '仅图标' },
    { name: 'text', desc: '仅文本' },
]

const propsRows = [
    { name: 'nav', type: 'Array', default: '[]', desc: '导航项 { name, label, icon }' },
    { name: 'active', type: 'string | symbol', default: "''", desc: '当前项 name' },
    { name: 'navLayout', type: 'auto | inline | stacked | icon | text', default: 'auto', desc: '导航布局' },
    { name: 'loading', type: 'boolean', default: 'undefined', desc: '预留给顶部进度条；当前内置 AppRouteBar 已关闭' },
    { name: 'autoHideNav', type: 'boolean', default: 'false', desc: '移动端手指上滑隐藏底部导航、下滑显示，页面回到顶部时强制显示' },
    { name: 'autoHideThreshold', type: 'number', default: '10', desc: '手势判定阈值（px）；横向位移大于纵向时不触发' },
]

const eventRows = [
    { name: 'navigate', type: 'item', desc: '点击导航项' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '页面主体' },
    { name: 'footer', type: '—', desc: '页脚，存在时才渲染' },
]

const gestureCode = `<AppShell :nav="nav" :active="route.name" auto-hide-nav :auto-hide-threshold="12">
    <!-- 页面内容 -->
</AppShell>`

const baseCode = `<AppShell :nav="nav" :active="route.name" :nav-layout="navLayout" @navigate="go">
    <PageHeader :title="title" />

    <RouterView v-slot="{ Component }">
        <PageTransition>
            <component :is="Component" />
        </PageTransition>
    </RouterView>

    <template #footer>
        页脚内容
    </template>
</AppShell>`

const navCode = `const nav = [
    { name: 'home', label: '开始', icon: 'home' },
    { name: 'components', label: '组件', icon: 'list' },
]

function go(item) {
    if (route.name !== item.name) router.navigate({ name: item.name })
}`
</script>
