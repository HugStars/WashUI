<template>
    <DocPage category="导航" name="AppNavMenu" title="导航菜单"
        description="分组导航链接，默认渲染为 a，也可以传入 RouterLink。支持图标、角标、选中态和 disabled，适合侧边栏、设置页与文档导航。">
        <DemoBlock title="基础" description="v-model 绑定当前项；没有 href 时渲染为 button，只触发选择，不跳转。">
            <AppNavMenu v-model="basic" class="doc_nav_demo" aria-label="基础导航" :items="[
                { label: '概览', value: 'overview' },
                { label: '成员', value: 'members' },
                { label: '设置', value: 'settings' },
            ]" />
            <p class="wa_hint">当前：{{ basic }}</p>
        </DemoBlock>

        <DemoBlock title="分组" description="groups 适合侧边栏；分组标题和分隔节奏由组件统一处理。">
            <AppNavMenu v-model="grouped" class="doc_nav_demo" aria-label="分组导航" :groups="[
                {
                    title: '项目', items: [
                        { label: '概览', value: 'overview' },
                        { label: '任务', value: 'tasks' },
                    ],
                },
                {
                    title: '团队', items: [
                        { label: '成员', value: 'members' },
                        { label: '权限', value: 'roles' },
                    ],
                },
            ]" />
            <p class="wa_hint">当前：{{ grouped }}</p>
        </DemoBlock>

        <DemoBlock title="图标与角标" description="icon 使用内置图标名，badge 支持数字、true（圆点）和 { text, dot, tone, max }。">
            <AppNavMenu v-model="decorated" class="doc_nav_demo" aria-label="带角标的导航" :items="[
                { label: '概览', value: 'overview', icon: 'home' },
                { label: '通知', value: 'notice', icon: 'bell', badge: 3 },
                { label: '消息', value: 'message', icon: 'mail', badge: { dot: true, tone: 'neutral' } },
                { label: '设置', value: 'settings', icon: 'settings' },
                { label: '归档', value: 'archive', icon: 'folder', disabled: true },
            ]" />
            <p class="wa_hint">当前：{{ decorated }}</p>
        </DemoBlock>

        <DemoBlock title="路由链接" description="传 RouterLink 后自动把 href 映射为 to；支持 Ctrl/中键新标签页和右键复制链接。">
            <AppNavMenu :model-value="route.name" class="doc_nav_demo" :link-component="RouterLink"
                aria-label="文档导航示例" :items="[
                    { label: '按钮 AppButton', value: 'button', href: '/components/button' },
                    { label: '输入框 AppInput', value: 'input', href: '/components/input' },
                    { label: '表格 AppTable', value: 'table', href: '/components/table' },
                ]" />
            <p class="wa_hint">点击会真实跳转；Ctrl 或中键可在新标签页打开。</p>
        </DemoBlock>

        <DemoBlock title="紧凑尺寸" description="size=sm 减小间距和字号，适合空间有限的弹出菜单。">
            <AppNavMenu v-model="compact" size="sm" class="doc_nav_demo" aria-label="紧凑导航" :items="[
                { label: '全部', value: 'all' },
                { label: '进行中', value: 'active' },
                { label: '已完成', value: 'done' },
            ]" />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { AppNavMenu } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const route = useRoute()
const basic = ref('overview')
const grouped = ref('overview')
const decorated = ref('message')
const compact = ref('all')

const propsRows = [
    { name: 'modelValue', type: 'string | number | symbol', default: "''", desc: '当前选中的菜单值' },
    { name: 'groups', type: 'Array<{ title, items }>', default: '[]', desc: '分组导航；items 与 options 都兼容' },
    { name: 'items', type: 'Array<NavItem>', default: '[]', desc: '无分组导航项' },
    { name: 'linkComponent', type: 'string | Component', default: "'a'", desc: '链接组件；传 RouterLink 时使用 to' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: 'md 用于宽松侧栏，sm 用于紧凑菜单' },
    { name: 'ariaLabel', type: 'string', default: "'导航菜单'", desc: '导航区域的 aria-label' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string | number | symbol', desc: '选中项变化' },
    { name: 'change', type: 'string | number | symbol', desc: '选中项变化，便于业务监听' },
    { name: 'select', type: 'NavItem', desc: '点击菜单项，回调完整 item' },
]
</script>

<style>
.doc_nav_demo {
    width: 100%;
    max-width: 280px;
    padding: 8px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_popover);
    background: var(--wa_color_surface);
}
</style>
