<template>
    <DocPage category="表单" name="AppSelect" title="下拉框" description="自定义浮层的下拉选择，不使用原生 select；支持标签、提示、校验与分组。">
        <DemoBlock title="基础" description="v-model 绑定选中值。" :code="baseCode">
            <div class="doc_grid">
                <AppSelect v-model="env" label="环境" :options="envOptions" hint="用于区分部署环境" />
                <AppSelect v-model="empty" label="占位" placeholder="请选择" :options="envOptions" />
            </div>
            <p class="wa_hint doc_gap">当前环境：{{ env || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="分组" description="groups 会渲染为 optgroup。" :code="groupCode">
            <AppSelect v-model="component" label="组件" :groups="groups" hint="按分类选择组件" />
        </DemoBlock>

        <DemoBlock title="尺寸与状态" description="支持小尺寸、错误、禁用。" :code="stateCode">
            <div class="doc_grid">
                <AppSelect v-model="sm" label="小尺寸" size="sm" :options="envOptions" />
                <AppSelect v-model="invalid" label="校验" error="请选择一个环境" :options="envOptions" />
                <AppSelect model-value="prod" label="禁用" disabled :options="envOptions" />
            </div>
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

const env = ref('prod')
const empty = ref('')
const sm = ref('dev')
const invalid = ref('')
const component = ref('button')

const envOptions = [
    { label: '开发环境', value: 'dev' },
    { label: '预发布环境', value: 'stage' },
    { label: '生产环境', value: 'prod' },
]

const groups = [
    {
        label: '基础',
        options: [
            { label: '按钮 AppButton', value: 'button' },
            { label: '卡片 AppCard', value: 'card' },
            { label: '标记 AppChip', value: 'chip' },
        ],
    },
    {
        label: '表单',
        options: [
            { label: '输入框 AppInput', value: 'input' },
            { label: '下拉框 AppSelect', value: 'select' },
        ],
    },
]

const propsRows = [
    { name: 'modelValue', type: 'string | number', default: "''", desc: '选中值' },
    { name: 'options', type: 'Array<{ label, value, disabled }>', default: '[]', desc: '普通选项' },
    { name: 'groups', type: 'Array<{ label, options }>', default: '[]', desc: '分组选项' },
    { name: 'label', type: 'string', default: "''", desc: '标签' },
    { name: 'hint', type: 'string', default: "''", desc: '提示文案' },
    { name: 'error', type: 'string', default: "''", desc: '错误文案，优先于 hint' },
    { name: 'placeholder', type: 'string', default: "''", desc: '占位选项' },
    { name: 'size', type: 'md | sm', default: 'md', desc: '尺寸' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '选中值变化' },
    { name: 'change', type: 'string', desc: '选中值变化' },
]

const slotRows = [
    { name: 'label', type: '—', desc: '自定义标签' },
]

const baseCode = `<AppSelect v-model="env" label="环境" :options="envOptions" hint="用于区分部署环境" />

const envOptions = [
    { label: '开发环境', value: 'dev' },
    { label: '预发布环境', value: 'stage' },
    { label: '生产环境', value: 'prod' },
]`

const groupCode = `<AppSelect v-model="component" label="组件" :groups="groups" />

const groups = [
    {
        label: '基础',
        options: [
            { label: '按钮 AppButton', value: 'button' },
            { label: '卡片 AppCard', value: 'card' },
        ],
    },
]`

const stateCode = `<AppSelect v-model="sm" label="小尺寸" size="sm" :options="envOptions" />
<AppSelect v-model="invalid" label="校验" error="请选择一个环境" :options="envOptions" />
<AppSelect model-value="prod" label="禁用" disabled :options="envOptions" />`
</script>
