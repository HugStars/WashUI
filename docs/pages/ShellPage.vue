<template>
    <DocPage category="布局" name="AppShell" title="壳层" description="页面骨架，负责顶部栏、侧栏导航、页脚与路由进度条。">
        <h2 class="doc_h2">基本结构</h2>
        <AppCode :code="baseCode" lang="html" />

        <h2 class="doc_h2">导航项</h2>
        <AppCode :code="navCode" lang="js" />
        <p class="doc_text doc_gap">
            导航项格式为 { name, label, icon }。active 与 name 对应，支持字符串或 Symbol。
        </p>

        <h2 class="doc_h2">导航布局</h2>
        <ApiTable kind="values" :rows="navLayouts" />

        <h2 class="doc_h2">加载状态</h2>
        <p class="doc_text">
            loading 不传时自动跟随路由进度条，传 false 可以关闭。顶部进度条由 routeLoading 驱动，createAppRouter 会保证最短 320ms 的可见时间。
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
    { name: 'loading', type: 'boolean', default: '跟随 routeLoading', desc: '顶部进度条状态' },
]

const eventRows = [
    { name: 'navigate', type: 'item', desc: '点击导航项' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '页面主体' },
    { name: 'footer', type: '—', desc: '页脚，存在时才渲染' },
]

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
    if (route.name !== item.name) router.push({ name: item.name })
}`
</script>
