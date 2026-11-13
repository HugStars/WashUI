<template>
    <DocPage category="基础" name="AppTag" title="标签"
        description="静态属性与状态标签，默认等宽、小号、浅底，贴近文档 API 表格里的属性 / 类型 / 默认值。与可点击的 AppChip 不同，AppTag 本身不承载交互。">
        <DemoBlock title="基础" description="默认尺寸为 sm，使用等宽字体和 --wa_color_soft 底色；text 或默认插槽都可以提供内容。">
            <div class="doc_row">
                <AppTag text="string" />
                <AppTag text="boolean" tone="success" />
                <AppTag text="false" tone="warning" />
                <AppTag text="—" />
            </div>
        </DemoBlock>

        <DemoBlock title="色彩" description="tone 提供 default、success、warning、help、danger 五种语义色。">
            <div class="doc_row">
                <AppTag text="默认" />
                <AppTag text="成功" tone="success" />
                <AppTag text="警告" tone="warning" />
                <AppTag text="帮助" tone="help" />
                <AppTag text="危险" tone="danger" />
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸与字体" description="sm 为默认尺寸，md 增加字号与上下内边距；mono=false 切换为界面字体。">
            <div class="doc_row">
                <AppTag text="sm 等宽" />
                <AppTag text="md 等宽" size="md" />
                <AppTag text="sm 常规" :mono="false" />
                <AppTag text="md 常规" size="md" :mono="false" />
            </div>
        </DemoBlock>

        <DemoBlock title="胶囊角标" description="pill 使用胶囊圆角，适合状态角标，或与消息角标、圆形头像并排。">
            <div class="doc_row">
                <AppTag text="进行中" tone="success" pill />
                <AppTag text="待审核" tone="warning" pill />
                <AppTag text="已失败" tone="danger" pill />
                <AppTag text="Beta" pill />
                <AppTag text="12" tone="danger" pill />
                <AppTag text="md 胶囊" size="md" pill />
            </div>
        </DemoBlock>

        <DemoBlock title="磨砂" description="frosted 使用与 AppPopover 一致的玻璃表面，适合叠在内容或渐变背景上。">
            <div class="doc_frosted_stage">
                <div class="doc_row">
                    <AppTag text="玻璃标签" frosted />
                    <AppTag text="成功" tone="success" frosted />
                    <AppTag text="危险" tone="danger" frosted />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="展开动画" description="expand 默认开启，在挂载时从左向右展开；减少动态时自动跳过，设为 false 可关闭。">
            <div class="doc_row">
                <AppButton size="sm" variant="line" @click="tagKey++">重新播放</AppButton>
                <AppTag :key="`published-${tagKey}`" text="已发布" tone="success" />
                <AppTag :key="`review-${tagKey}`" text="待审核" tone="warning" />
                <AppTag text="不展开" :expand="false" />
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const tagKey = ref(0)

const propsRows = [
    { name: 'text', type: 'string', default: "''", desc: '标签文本；默认插槽优先' },
    { name: 'tone', type: 'default | success | warning | help | danger', default: 'default', desc: '语义色' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '字号与上下内边距' },
    { name: 'mono', type: 'boolean', default: 'false', desc: '使用等宽字体；默认关闭，避免中文回退到其他字体' },
    { name: 'frosted', type: 'boolean', default: 'false', desc: '白色磨砂半透明表面' },
    { name: 'pill', type: 'boolean', default: 'false', desc: '胶囊圆角，适合状态角标' },
    { name: 'expand', type: 'boolean', default: 'true', desc: '挂载时从左向右展开；设为 false 关闭' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '标签内容，可以放图标或组合内容' },
]
</script>
