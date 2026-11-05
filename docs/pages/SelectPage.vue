<template>
    <DocPage category="表单" name="AppSelect" title="下拉框"
        description="基于 AppPopover 与 AppSelectPanel 的自定义下拉选择，不使用原生 select。支持 v-model、标签、提示、校验、分组、多选与自定义选中标记。">
        <DemoBlock title="基础" description="v-model 绑定选中值；选项较多时面板内部滚动，并自动把已选项滚动到中间。" :code="baseCode">
            <div class="doc_grid">
                <AppSelect v-model="env" label="环境" :options="envOptions" hint="用于区分部署环境" />
                <AppSelect v-model="empty" label="占位" placeholder="请选择" :options="envOptions" />
            </div>
            <p class="wa_hint doc_gap">当前环境：{{ env || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="多选"
            description="multiple 开启多选，v-model 绑定数组；触发器显示首项与总数，面板复用 AppChoiceList / AppCheckPanel，复选框图标与动画和 AppCheck 一致。"
            :code="multipleCode">
            <div class="doc_grid">
                <AppSelect v-model="multi" multiple label="通知方式" :options="notifyOptions" hint="可同时选择多项" />
                <AppSelect v-model="multiGrouped" multiple label="组件（分组）" :groups="groups" />
            </div>
            <p class="wa_hint doc_gap">已选：{{ multi.length ? multi.join('、') : '无' }}</p>
        </DemoBlock>

        <DemoBlock title="分组" description="groups 用于分组展示；options 和 groups 可以同时使用。" :code="groupCode">
            <AppSelect v-model="component" label="组件" :groups="groups" hint="按分类选择组件" />
        </DemoBlock>

        <DemoBlock title="选中标记" description="默认在选中项右侧显示 ✓，check-icon 可关闭、换成自定义字符，或用图标名由内置 AppIcon 渲染。" :code="checkCode">
            <div class="doc_grid">
                <AppSelect v-model="marked" label="默认对勾" :options="envOptions" />
                <AppSelect v-model="plain" label="不显示对勾" :check-icon="false" :options="envOptions" />
                <AppSelect v-model="dot" label="自定义字符" check-icon="●" :options="envOptions" />
                <AppSelect v-model="iconChecked" label="图标名" check-icon="check" :options="envOptions" />
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸与状态" description="默认小尺寸，size=md 可放大；支持错误与禁用状态。" :code="stateCode">
            <div class="doc_grid">
                <AppSelect v-model="sm" label="默认尺寸" :options="envOptions" />
                <AppSelect v-model="mdSize" label="中尺寸" size="md" :options="envOptions" />
                <AppSelect v-model="invalid" label="校验" error="请选择一个环境" :options="envOptions" />
                <AppSelect model-value="prod" label="禁用" disabled :options="envOptions" />
            </div>
        </DemoBlock>

        <DemoBlock title="空状态" description="options 为空时面板显示 emptyText。" :code="emptyCode">
            <AppSelect model-value="" label="空列表" :options="[]" empty-text="暂无可选环境" />
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
const multi = ref(['email'])
const multiGrouped = ref(['button', 'input'])
const sm = ref('dev')
const mdSize = ref('dev')
const invalid = ref('')
const component = ref('button')
const marked = ref('stage')
const plain = ref('dev')
const dot = ref('dev')
const iconChecked = ref('dev')

const envOptions = [
    { label: '开发环境', value: 'dev' },
    { label: '预发布环境', value: 'stage' },
    { label: '生产环境', value: 'prod' },
]

const notifyOptions = [
    { label: '邮件通知', value: 'email' },
    { label: '短信通知', value: 'sms' },
    { label: '站内消息', value: 'inbox', disabled: true },
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
    { name: 'modelValue', type: 'string | number | symbol | Array', default: "''", desc: '选中值，绑定 v-model；multiple 时为数组' },
    { name: 'options', type: 'Array<{ label, value, disabled, icon }>', default: '[]', desc: '普通选项，icon 配合 iconComponent 使用' },
    { name: 'groups', type: 'Array<{ label, options }>', default: '[]', desc: '分组选项，组内 options 结构同上' },
    { name: 'label', type: 'string', default: "''", desc: '触发器标签' },
    { name: 'hint', type: 'string', default: "''", desc: '无错误时显示的提示文案' },
    { name: 'error', type: 'string', default: "''", desc: '错误文案，显示时优先于 hint' },
    { name: 'placeholder', type: 'string', default: "''", desc: '未选中时的占位文本' },
    { name: 'size', type: 'md | sm', default: 'sm', desc: '默认小尺寸，md 时触发器与面板间距更宽松' },
    { name: 'multiple', type: 'boolean', default: 'false', desc: '开启多选；选项以复选框呈现，选择后不关闭面板' },
    { name: 'checkIcon', type: 'boolean | string', default: 'true', desc: '选中标记：true 显示 ✓，false 关闭，字符串自定义字符或图标名；多选时忽略' },
    { name: 'iconComponent', type: 'Component', default: 'AppIcon', desc: '选项图标与 checkIcon 图标名所用的组件，默认内置 AppIcon，可覆盖' },
    { name: 'emptyText', type: 'string', default: '暂无选项', desc: '没有可选项时面板的提示文案' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用触发器' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string | number | symbol | Array', desc: '选中值变化；multiple 时为数组' },
    { name: 'change', type: 'string | number | symbol | Array', desc: '选中值变化；multiple 时为数组' },
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

const multipleCode = `<AppSelect v-model="values" multiple label="通知方式" :options="notifyOptions" />

const notifyOptions = [
    { label: '邮件通知', value: 'email' },
    { label: '短信通知', value: 'sms' },
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

const checkCode = `<AppSelect v-model="value" :options="envOptions" />

// 关闭选中对勾
<AppSelect v-model="value" :check-icon="false" :options="envOptions" />

// 自定义字符
<AppSelect v-model="value" check-icon="●" :options="envOptions" />

// 图标名：默认由内置 AppIcon 渲染
<AppSelect v-model="value" check-icon="check" :options="envOptions" />`

const emptyCode = `<AppSelect v-model="value" label="空列表" :options="[]" empty-text="暂无可选环境" />`

const stateCode = `<AppSelect v-model="value" label="默认尺寸" :options="envOptions" />
<AppSelect v-model="mdValue" label="中尺寸" size="md" :options="envOptions" />
<AppSelect v-model="invalid" label="校验" error="请选择一个环境" :options="envOptions" />
<AppSelect model-value="prod" label="禁用" disabled :options="envOptions" />`
</script>
