<template>
    <DocPage category="布局" name="PageBar" title="页面操作栏"
        description="页面级操作栏。默认桌面端留在页面中，移动端自动投递到 AppShell 顶部标题栏下方；placement='header' 可强制投递到 AppShell / AppDeskShell 的 Header 中间。">
        <PageBar class="doc_page_bar" bleed>
            <AppTabs v-model="tab" transparent :items="tabs" overflow="more" :max="3"  />
        </PageBar>

        <DemoBlock title="标签联动" description="PageBar 只负责位置与响应式投递，内容由页面通过默认插槽决定；这里放入透明背景的 AppTabs。" :code="baseCode">
            <p class="wa_hint">当前标签：{{ current?.label }}</p>
            <p class="doc_text">{{ current?.text }}</p>
        </DemoBlock>

        <h2 class="doc_h2">使用方式</h2>
        <AppCode :code="usageCode" lang="html" />
        <ul class="doc_list doc_gap">
            <li>必须放在 AppShell / AppDeskShell 内，投递时才能找到目标。</li>
            <li><code>placement="header"</code> 时，桌面端也强制投递到 Header 中间，适合 AppDeskShell 的顶部路由操作。</li>
            <li>桌面端原地渲染，移动端（≤860px）Teleport 到标题栏下方，页面不会留下空占位。</li>
            <li>标题栏本身已有 backdrop-filter，PageBar 不再添加背景或模糊，避免两层玻璃。</li>
            <li><code>bleed</code> 会抵消标题栏左右内边距，并把同样的内边距写入 <code>--wa_page_bar_inset</code>；AppTabs 已内置适配，其他组件也可以读取这个变量。
            </li>
            <li>跨断点切换时插槽内容会重新挂载，选中值等状态请放在页面中。</li>
            <li>一个页面只放一个 PageBar；需要按钮、筛选器时同样放进默认插槽。</li>
        </ul>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const tabs = [
    { name: 'overview', label: '概览', text: '页面操作栏用于承载当前页面的主要操作或子级导航。' },
    { name: 'usage', label: '使用', text: '通过默认插槽放入任意内容，例如透明 AppTabs、按钮组或筛选器。' },
    { name: 'examples', label: '示例', text: '移动端会移动到顶部标题栏下方，并复用标题栏的磨砂背景。' },
    { name: 'api', label: 'API', text: '只有一个默认插槽，不引入额外状态。' },
]

const tab = ref('overview')
const current = computed(() => tabs.find(item => item.name === tab.value))

const baseCode = `<PageBar bleed>
    <AppTabs v-model="tab" transparent :items="tabs" />
</PageBar>`

const usageCode = `<DocPage title="页面标题">
    <PageBar placement="header">
        <AppButton>新增</AppButton>
        <AppButton variant="line">导出</AppButton>
    </PageBar>

    <!-- 页面内容 -->
</DocPage>`

const propsRows = [
    { name: 'bleed', type: 'boolean', default: 'false', desc: '移动端投递到标题栏时抵消 header 左右内边距，让内容横向铺满' },
    { name: 'placement', type: 'auto | header | inline', default: 'auto', desc: 'auto 跟随断点；header 始终投递到顶栏；inline 始终留在页面内' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '操作栏内容，例如透明 AppTabs、按钮组或筛选器' },
]
</script>

<style>
@media (min-width: 861px) {
    .doc_page_bar {
        margin-bottom: 16px;
    }
}
</style>
