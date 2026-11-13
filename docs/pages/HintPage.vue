<template>
    <DocPage category="反馈" name="AppHint" title="文字提示"
        description="统一的小号提示文本，支持语义色、图标和带底色的提示块。用于替代文档站零散的 hint / note 样式。">
        <DemoBlock title="色调" description="tone 控制颜色；success / warning / help / danger 会自动带对应图标。">
            <div class="doc_stack">
                <AppHint text="默认提示：保存后立即生效。" />
                <AppHint tone="success" text="已同步到所有节点。" />
                <AppHint tone="warning" text="该操作会清理本地缓存。" />
                <AppHint tone="help" text="拖拽角标超过阈值后松手才会清除。" />
                <AppHint tone="danger" text="删除后无法恢复。" />
            </div>
        </DemoBlock>

        <DemoBlock title="提示块" description="box 增加淡色底和边框，适合页面级说明。">
            <div class="doc_stack">
                <AppHint tone="help" box text="提示：磨砂参数统一由 --wa_blur 和 --wa_frosted_saturate 控制，改一处即可全局生效。" />
                <AppHint tone="warning" box text="移动端手势隐藏导航只在 AppShell 的 auto-hide-nav 开启时生效。" />
            </div>
        </DemoBlock>

        <DemoBlock title="图标与插槽" description="icon 可以换成任意图标名，传 false 去掉图标；默认插槽支持富文本。">
            <div class="doc_stack">
                <AppHint icon="cpu" text="自定义图标：worker 正在连接。" />
                <AppHint tone="success" :icon="false" text="不显示图标的成功提示。" />
                <AppHint>
                    默认插槽可以放 <code class="wa_mono">code</code>、链接等内容。
                </AppHint>
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
    { name: 'text', type: 'string', default: "''", desc: '提示文本' },
    { name: 'tone', type: 'default | success | warning | help | danger', default: 'default', desc: '语义色' },
    { name: 'icon', type: 'string | false', default: '按 tone 自动', desc: '自定义图标名；false 关闭图标' },
    { name: 'box', type: 'boolean', default: 'false', desc: '带淡色底和边框的提示块' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '富文本内容，替代 text' },
]
</script>
