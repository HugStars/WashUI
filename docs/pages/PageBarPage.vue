<template>
    <DocPage category="布局" name="PageBar" title="页面操作栏"
        description="页面级操作栏。桌面端留在页面中书写的位置，移动端自动投递到 AppShell 顶部标题栏下方，并与标题栏共用磨砂背景。">
        <PageBar class="doc_page_bar">
            <AppTabs v-model="tab" transparent :items="tabs" />
        </PageBar>

        <DemoBlock title="标签联动" description="PageBar 只负责位置与响应式投递，内容由页面通过默认插槽决定；这里放入透明背景的 AppTabs。"
            :code="baseCode">
            <p class="wa_hint">当前标签：{{ current?.label }}</p>
            <p class="doc_text">{{ current?.text }}</p>
        </DemoBlock>

        <h2 class="doc_h2">使用方式</h2>
        <AppCode :code="usageCode" lang="html" />
        <ul class="doc_list doc_gap">
            <li>必须放在 AppShell 内，移动端才能找到顶部标题栏的投递目标。</li>
            <li>桌面端原地渲染，移动端（≤860px）Teleport 到标题栏下方，页面不会留下空占位。</li>
            <li>标题栏本身已有 backdrop-filter，PageBar 不再添加背景或模糊，避免两层玻璃。</li>
            <li>跨断点切换时插槽内容会重新挂载，选中值等状态请放在页面中。</li>
            <li>一个页面只放一个 PageBar；需要按钮、筛选器时同样放进默认插槽。</li>
        </ul>

        <template #api>
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

const baseCode = `<PageBar>
    <AppTabs v-model="tab" transparent :items="tabs" />
</PageBar>`

const usageCode = `<DocPage title="页面标题">
    <PageBar>
        <AppTabs v-model="tab" transparent :items="tabs" />
    </PageBar>

    <!-- 页面内容 -->
</DocPage>`

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
