<template>
    <DocPage category="表单" name="AppEditor" title="富文本" description="基于 contenteditable 的轻量编辑器，v-model 是 HTML 字符串。">
        <DemoBlock title="基础" description="工具栏支持加粗、斜体、下划线、删除线、标题、列表、链接、清除格式、撤销与重做。" :code="baseCode">
            <AppEditor v-model="content" label="正文" placeholder="输入正文..." :min-height="220"
                hint="渲染到页面前请按业务需要过滤 HTML。" />
            <div class="doc_stack doc_gap">
                <span class="wa_tag">HTML 长度：{{ content.length }}</span>
                <AppCode plain :code="content || '（空）'" lang="html" :max-height="180" />
            </div>
        </DemoBlock>

        <DemoBlock title="只读与禁用" description="readonly 保留内容与工具栏，disabled 进一步降低透明度。" :code="stateCode">
            <AppEditor :model-value="readonlyHtml" label="只读" readonly :min-height="100" />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const content = ref('')
const readonlyHtml = '<p>只读内容</p>'

const propsRows = [
    { name: 'modelValue', type: 'string', default: "''", desc: 'HTML 字符串' },
    { name: 'label', type: 'string', default: "''", desc: '标签文案' },
    { name: 'hint', type: 'string', default: "''", desc: '提示文案' },
    { name: 'error', type: 'string', default: "''", desc: '错误文案' },
    { name: 'placeholder', type: 'string', default: '输入内容...', desc: '空内容占位' },
    { name: 'minHeight', type: 'number | string', default: '180', desc: '编辑区最小高度' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '内容变化，返回 HTML' },
]

const baseCode = `<AppEditor v-model="content" label="正文" :min-height="220" />`

const stateCode = `<AppEditor :model-value="readonlyHtml" label="只读" readonly :min-height="100" />`
</script>
