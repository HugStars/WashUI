<template>
    <DocPage category="布局" name="PageHeader" title="页面标题" description="自动投递到 AppShell 顶部栏的标题组件，可以附带操作区。">
        <DemoBlock title="标题与操作" description="默认插槽替换标题，actions 显示在右侧。" :code="baseCode">
            <div class="doc_header_demo">
                <div class="wa_page_header">
                    <h1>页面标题</h1>
                    <div class="wa_page_actions">
                        <AppButton size="sm" variant="line">操作</AppButton>
                    </div>
                </div>
            </div>
        </DemoBlock>

        <h2 class="doc_h2">使用位置</h2>
        <AppCode :code="layoutCode" lang="html" />
        <ul class="doc_list doc_gap">
            <li>必须放在 AppShell 内，否则不会渲染。</li>
            <li>放在 RouterView 与 PageTransition 外，切换路由时标题不会闪空。</li>
            <li>标题文案跟随路由时放在 meta.title；依赖页面内部状态的操作需要把状态提升到布局层。</li>
        </ul>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const propsRows = [
    { name: 'title', type: 'string', default: "''", desc: '标题文案' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '自定义标题内容' },
    { name: 'center', type: '—', desc: '标题与操作之间的中间区域' },
    { name: 'actions', type: '—', desc: '标题右侧操作' },
]

const baseCode = `<PageHeader :title="route.meta.title">
    <template #actions>
        <AppButton size="sm" variant="line">操作</AppButton>
    </template>
</PageHeader>`

const layoutCode = `<AppShell :nav="nav" :active="route.name" @navigate="go">
    <PageHeader :title="title" />

    <RouterView v-slot="{ Component }">
        <PageTransition>
            <component :is="Component" />
        </PageTransition>
    </RouterView>
</AppShell>`
</script>

<style>
.doc_header_demo {
    padding: 14px 18px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}

.doc_header_demo .wa_page_header h1 {
    font-size: 18px;
}
</style>
