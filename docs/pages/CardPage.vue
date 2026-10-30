<template>
    <DocPage category="基础" name="AppCard" title="卡片" description="内容分组容器，支持标题、标题插槽、额外区与页脚。">
        <DemoBlock title="基础" description="只传 title 时渲染默认标题栏。">
            <AppCard title="运行状态">
                <p>所有节点在线，最近一次检查在 2 分钟前。</p>
            </AppCard>
        </DemoBlock>

        <DemoBlock title="标题、额外区与页脚" description="title、extra、footer 三个插槽可以独立使用。">
            <AppCard title="今日数据">
                <template #extra>
                    <AppChip active>全部</AppChip>
                </template>
                <div class="doc_grid">
                    <AppStat label="请求数" value="12.3k" />
                    <AppStat label="耗时" value="1.2 s" />
                    <AppStat label="体积" value="1.5 MB" />
                </div>
                <template #footer>
                    <AppButton size="sm" variant="line">查看详情</AppButton>
                </template>
            </AppCard>
        </DemoBlock>

        <DemoBlock title="紧凑模式" description="compact 使用更小的内边距，适合密集列表。">
            <AppCard title="紧凑卡片" compact>
                <p>内容区域使用 18px 22px 的内边距。</p>
            </AppCard>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const propsRows = [
    { name: 'title', type: 'string', default: "''", desc: '标题文案；也可以使用 title 插槽' },
    { name: 'compact', type: 'boolean', default: 'false', desc: '使用紧凑内边距' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '卡片正文' },
    { name: 'title', type: '—', desc: '自定义标题内容' },
    { name: 'extra', type: '—', desc: '标题右侧额外内容' },
    { name: 'footer', type: '—', desc: '页脚内容' },
]
</script>
