<template>
    <DocPage category="导航" name="AppTabs" title="标签页"
        description="参考 AppShell 导航实现的标签切换组件，选中背景会滑动并带弹性反馈。支持 nav / plain / group 三种外观、透明背景、尺寸与可选面板；fill 或 overflow=more 时标签等宽铺满，overflow=scroll 时标签栏滚到两端后还能拉出一段并回弹。">
        <DemoBlock title="基础" description="v-model 绑定选中项的 name；写入默认插槽时渲染面板，插槽可拿到当前项。">
            <AppTabs v-model="tab" :items="tabs">
                <template #default="{ active, item }">
                    <div class="doc_tabs_panel_demo">
                        当前面板：{{ item?.label }}（{{ active }}）
                    </div>
                </template>
            </AppTabs>
        </DemoBlock>

        <DemoBlock title="无边框样式" description="variant=plain：无边框、无外框、无阴影，只保留标签与滑动选中背景。">
            <AppTabs v-model="plainTab" variant="plain" :items="tabs">
                <div class="doc_tabs_panel_demo">当前：{{ plainTab }}</div>
            </AppTabs>
        </DemoBlock>

        <DemoBlock title="透明背景" description="transparent：去掉磨砂、背景、边框和阴影，只保留标签与滑动选中背景。">
            <AppTabs v-model="transparentTab" transparent :items="tabs" />
        </DemoBlock>

        <DemoBlock title="按钮组"
            description="variant=group：整体是一组按钮。未选中为描边按钮，选中切换为主按钮；容器本身透明，不再使用磨砂底和滑块。">
            <AppTabs v-model="groupTab" variant="group" :items="tabs" />
        </DemoBlock>

        <DemoBlock title="无面板" description="不写默认插槽时只渲染标签栏，不生成面板容器。">
            <AppTabs v-model="noPanelTab" :items="tabs" />
            <p class="wa_hint doc_gap">当前：{{ noPanelTab }}</p>
        </DemoBlock>

        <DemoBlock title="尺寸、图标与禁用" description="默认小尺寸，size=md 会放大标签；支持图标和禁用项。">
            <div class="doc_tabs_stack">
                <AppTabs v-model="mdTab" size="md" :items="iconTabs" />
                <AppTabs v-model="smTab" :items="iconTabs" />
            </div>
        </DemoBlock>

        <DemoBlock title="等宽铺满" description="fill 让每个标签等宽并填满可用宽度；overflow=more 时也会默认开启。">
            <AppTabs v-model="fillTab" fill :items="tabs" />
        </DemoBlock>

        <DemoBlock title="元素过多" description="overflow=scroll（默认）横向滚动；overflow=more 会把超出 max 的标签收进“更多”按钮，可见标签默认等宽铺满。">
            <div class="doc_tabs_stack">
                <AppTabs v-model="scrollTab" :items="manyTabs" />
                <AppTabs v-model="moreTab" overflow="more" :max="4" :items="manyTabs" />
            </div>
        </DemoBlock>

        <DemoBlock title="消息角标"
            description="items[].badge 支持数字、true（圆点）或对象；对象加 draggable 后可以拖拽断开清除，并通过 badge-clear 交给业务处理。">
            <AppTabs v-model="badgeTab" :items="badgeTabs" badge-draggable :badge-max-distance="80"
                @badge-clear="ClearTabBadge" />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const tab = ref('overview')
const plainTab = ref('usage')
const transparentTab = ref('overview')
const groupTab = ref('overview')
const noPanelTab = ref('api')
const smTab = ref('home')
const mdTab = ref('home')
const fillTab = ref('overview')
const scrollTab = ref('overview')
const moreTab = ref('settings')
const badgeTab = ref('all')

const tabs = [
    { value: 'overview', label: '概览' },
    { value: 'usage', label: '使用' },
    { value: 'api', label: 'API' },
]

const iconTabs = [
    { value: 'home', label: '开始', icon: 'home' },
    { value: 'components', label: '组件', icon: 'list' },
    { value: 'layout', label: '布局', icon: 'layout' },
    { value: 'disabled', label: '禁用', icon: 'close', disabled: true },
]

const manyTabs = [
    { value: 'overview', label: '概览' },
    { value: 'usage', label: '使用' },
    { value: 'api', label: 'API' },
    { value: 'examples', label: '示例' },
    { value: 'tokens', label: '变量' },
    { value: 'settings', label: '设置' },
    { value: 'icons', label: '图标' },
    { value: 'theme', label: '主题' },
    { value: 'about', label: '关于' },
]

const badgeTabs = ref([
    { value: 'all', label: '全部', badge: 12 },
    { value: 'reply', label: '回复', badge: { text: 3, draggable: true } },
    { value: 'mention', label: '提到我', badge: { dot: true, tone: 'accent', draggable: true } },
    { value: 'system', label: '系统', badge: { text: 1, tone: 'default' } },
])

function ClearTabBadge({ value }) {
    const item = badgeTabs.value.find(item => item.value === value)
    if (item) item.badge = null
}

const propsRows = [
    { name: 'modelValue', type: 'string | number | symbol', default: "''", desc: '当前选中项的 value' },
    { name: 'items', type: 'Array<{ value, label, icon?, disabled?, badge? }>', default: '[]', desc: '标签项；badge 支持数字、true 或 { text, dot, tone, draggable, max }' },
    { name: 'variant', type: 'nav | plain | group', default: 'nav', desc: 'nav 带外框；plain 无边框、无外框、无阴影；group 为按钮组样式（白磨砂底 + 黑色高亮 + hover 内描边）' },
    { name: 'transparent', type: 'boolean', default: 'false', desc: '去掉磨砂、背景、边框和阴影' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '标签尺寸' },
    { name: 'fill', type: 'boolean', default: 'false', desc: '标签等宽铺满；overflow=more 时默认开启' },
    { name: 'overflow', type: 'scroll | more', default: 'scroll', desc: '元素过多时横向滚动，或收进“更多”按钮；more 模式下可见标签等宽铺满' },
    { name: 'max', type: 'number', default: '4', desc: 'overflow=more 时最多显示的标签数（含“更多”）' },
    { name: 'badgeDraggable', type: 'boolean', default: 'false', desc: '所有角标默认可拖拽清除；单项 badge.draggable 优先' },
    { name: 'badgeMaxDistance', type: 'number', default: '72', desc: '角标拖拽断开阈值（px）' },
    { name: 'ariaLabel', type: 'string', default: '标签页', desc: '标签栏无障碍名称' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string | number | symbol', desc: '选中项变化' },
    { name: 'select', type: 'item', desc: '选中项变化，返回标签项' },
    { name: 'badge-clear', type: '{ value, item, index, more }', desc: '角标被拖拽或按键清除，由业务更新 items' },
]

const slotRows = [
    { name: 'default', type: 'active, item', desc: '面板内容；不写时不渲染面板' },
]
</script>

<style>
.doc_tabs_panel_demo {
    padding: 18px 20px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
    font-size: 13px;
    color: var(--wa_color_text_muted);
}

.doc_tabs_stack {
    display: grid;
    gap: 12px;
}
</style>
