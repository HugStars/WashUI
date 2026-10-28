<template>
    <DocPage category="反馈" name="AppPanel" title="展示框" description="用于展示只读信息、状态或分组内容，左侧色条由 tone 控制。">
        <DemoBlock title="色调" description="tone 支持 default / success / warning / help / danger。" :code="toneCode">
            <div class="doc_stack">
                <AppPanel title="运行状态" description="最近一次检查：2 分钟前" tone="success">
                    <p>所有节点在线，延迟稳定。</p>
                </AppPanel>
                <AppPanel title="容量提醒" description="存储使用率 86%" tone="warning">
                    <p>建议清理历史日志，或扩容存储。</p>
                </AppPanel>
                <AppPanel title="部署失败" description="构建在 12:40 中止" tone="danger">
                    <p>查看日志以定位依赖安装失败的原因。</p>
                </AppPanel>
            </div>
        </DemoBlock>

        <DemoBlock title="操作区与页脚" description="actions 显示在标题右侧，footer 显示在正文下方。" :code="slotCode">
            <AppPanel title="同步任务" description="上次同步：今天 09:20" tone="help">
                <template #actions>
                    <AppButton size="sm" variant="line">立即同步</AppButton>
                </template>
                <p>共有 3 个任务等待执行。</p>
                <template #footer>
                    <AppButton size="sm" variant="line">查看日志</AppButton>
                </template>
            </AppPanel>
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
    { name: 'title', type: 'string', default: "''", desc: '标题' },
    { name: 'description', type: 'string', default: "''", desc: '副标题或状态说明' },
    { name: 'tone', type: 'default | success | warning | help | danger', default: 'default', desc: '色条色调' },
    { name: 'compact', type: 'boolean', default: 'false', desc: '紧凑间距' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '正文' },
    { name: 'title', type: '—', desc: '自定义标题' },
    { name: 'actions', type: '—', desc: '标题右侧操作' },
    { name: 'footer', type: '—', desc: '页脚' },
]

const toneCode = `<AppPanel title="运行状态" description="最近一次检查：2 分钟前" tone="success">
    <p>所有节点在线，延迟稳定。</p>
</AppPanel>
<AppPanel title="容量提醒" tone="warning">
    <p>建议清理历史日志。</p>
</AppPanel>`

const slotCode = `<AppPanel title="同步任务" tone="help">
    <template #actions>
        <AppButton size="sm" variant="line">立即同步</AppButton>
    </template>
    <p>共有 3 个任务等待执行。</p>
    <template #footer>
        <AppButton size="sm" variant="line">查看日志</AppButton>
    </template>
</AppPanel>`
</script>
