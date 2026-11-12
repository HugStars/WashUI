<template>
    <DocPage category="表单" name="AppChoiceList" title="选择列表"
        description="AppChoiceList 是复选框和单选框共享的列表面板核心，负责分组、选项、空状态、滚动与选中动画。AppCheckPanel / AppRadioPanel 是它的薄封装。">
        <DemoBlock title="多选列表" description="multiple 时 v-model 绑定数组，常用于下拉多选、筛选面板和多选菜单。">
            <div class="doc_choice_list_box">
                <AppChoiceList v-model="multiple" multiple :groups="groups" />
            </div>
            <p class="wa_hint doc_gap">已选：{{ multiple.length ? multiple.join('、') : '无' }}</p>
        </DemoBlock>

        <DemoBlock title="单选列表" description="multiple=false 时 v-model 绑定标量，渲染为圆形单选框。">
            <div class="doc_choice_list_box">
                <AppChoiceList v-model="single" :groups="groups" />
            </div>
            <p class="wa_hint doc_gap">当前：{{ single }}</p>
        </DemoBlock>

        <DemoBlock title="薄封装" description="AppCheckPanel 和 AppRadioPanel 分别固定多选/单选，适合直接嵌进弹框或 Popover。">
            <div class="doc_choice_list_grid">
                <AppCheckPanel v-model="panelMultiple" :options="options" />
                <AppRadioPanel v-model="panelSingle" :options="options" />
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { AppCheckPanel, AppChoiceList, AppRadioPanel } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const groups = [
    {
        label: '通知方式',
        options: [
            { label: '邮件通知', value: 'email' },
            { label: '短信通知', value: 'sms' },
            { label: '站内消息', value: 'inbox' },
        ],
    },
    {
        label: '其他',
        options: [
            { label: '桌面推送', value: 'desktop' },
            { label: 'Webhook', value: 'webhook', disabled: true },
        ],
    },
]

const options = [
    { label: '基础版', value: 'basic' },
    { label: '专业版', value: 'pro' },
    { label: '企业版', value: 'enterprise' },
]

const multiple = ref(['email'])
const single = ref('sms')
const panelMultiple = ref(['email'])
const panelSingle = ref('pro')

const propsRows = [
    { name: 'modelValue', type: 'Array | string | number | symbol | boolean', default: '—', desc: 'multiple 时为数组，单选时为标量' },
    { name: 'multiple', type: 'boolean', default: 'false', desc: 'true 渲染复选框，false 渲染单选框' },
    { name: 'options', type: 'Array<{ label, value, disabled? }>', default: '[]', desc: '普通选项' },
    { name: 'groups', type: 'Array<{ label, options }>', default: '[]', desc: '分组选项' },
    { name: 'size', type: 'number | string', default: '18', desc: '选项尺寸，数字按 px 处理' },
    { name: 'labelPosition', type: 'before | after', default: 'after', desc: '标签位置' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整个列表' },
    { name: 'emptyText', type: 'string', default: '暂无选项', desc: '空列表文案' },
    { name: 'ariaLabel', type: 'string', default: '选项列表', desc: '列表无障碍名称' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'Array | string | number | symbol | boolean', desc: '选中值变化' },
    { name: 'change', type: 'Array | string | number | symbol | boolean', desc: '选中值变化' },
]
</script>

<style>
.doc_choice_list_box {
    max-width: 280px;
    padding: 4px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_field);
}

.doc_choice_list_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
}
</style>
