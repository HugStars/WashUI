<template>
    <DocPage category="反馈" name="AppPanel" title="展示框" description="用于展示只读信息、状态或分组内容。variant 支持带左侧色条的默认形态、文本提示条、灰色半透明内容块和透明背景 + 细边框。">
        <DemoBlock title="色调" description="tone 支持 default / success / warning / help / danger。">
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

        <DemoBlock title="操作区与页脚" description="actions 显示在标题右侧，footer 显示在正文下方。">
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

        <DemoBlock title="文本提示"
            description="variant=tip：去掉左侧粗色条，改为淡色底 + 细边框的提示条，适合表单说明、注意事项。">
            <div class="doc_stack">
                <AppPanel variant="tip" title="提示" tone="help">
                    <p>拖拽角标超过阈值后松手才会清除，拖回范围内可以取消。</p>
                </AppPanel>
                <AppPanel variant="tip" tone="warning">
                    <p>保存后需要重新构建才能生效。</p>
                </AppPanel>
            </div>
        </DemoBlock>

        <DemoBlock title="内容块"
            description="variant=soft 为灰色半透明内容块；variant=plain 为透明背景 + 细边框，适合设置页分组。">
            <div class="doc_stack">
                <AppPanel variant="soft" title="通知">
                    <p>只接收与当前项目相关的提醒。</p>
                </AppPanel>
                <AppPanel variant="plain" title="缓存">
                    <p>清理后需要重新下载资源。</p>
                </AppPanel>
            </div>
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
    { name: 'variant', type: 'default | tip | soft | plain', default: 'default', desc: 'default 带左侧色条；tip 文本提示条；soft 灰色半透明内容块；plain 透明背景 + 细边框' },
    { name: 'compact', type: 'boolean', default: 'false', desc: '紧凑间距' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '正文' },
    { name: 'title', type: '—', desc: '自定义标题' },
    { name: 'actions', type: '—', desc: '标题右侧操作' },
    { name: 'footer', type: '—', desc: '页脚' },
]
</script>
