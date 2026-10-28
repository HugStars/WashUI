<template>
    <DocPage category="表单" name="AppSelectPanel" title="下拉面板" description="下拉框使用的选项面板，可配合 AppPopover 自定义触发元素。">
        <DemoBlock title="配合 AppPopover" description="触发元素由业务层决定，面板负责分组、选中态与空状态。" :code="code">
            <AppPopover placement="bottom" :width="240" role="listbox" aria-label="组件选择">
                <template #trigger="{ open }">
                    <AppButton variant="line" :aria-expanded="open">选择组件</AppButton>
                </template>
                <template #default="{ close }">
                    <AppSelectPanel :groups="groups" :model-value="value" @select="item => pick(item, close)" />
                </template>
            </AppPopover>
            <p class="wa_hint doc_gap">当前：{{ value || '未选择' }}</p>
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

const value = ref('button')
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
            { label: '下拉面板 AppSelectPanel', value: 'select-panel' },
        ],
    },
]

function pick(item, close) {
    if (item.disabled) return
    value.value = item.value
    close()
}

const propsRows = [
    { name: 'modelValue', type: 'string | number', default: "''", desc: '选中值' },
    { name: 'options', type: 'Array<{ label, value, disabled }>', default: '[]', desc: '普通选项' },
    { name: 'groups', type: 'Array<{ label, options }>', default: '[]', desc: '分组选项' },
    { name: 'emptyText', type: 'string', default: '暂无选项', desc: '空状态文案' },
]

const eventRows = [
    { name: 'select', type: 'option', desc: '点击选项时返回选项对象' },
]

const code = `<AppPopover placement="bottom" :width="240" role="listbox">
    <template #trigger="{ open }">
        <AppButton variant="line" :aria-expanded="open">选择组件</AppButton>
    </template>
    <template #default="{ close }">
        <AppSelectPanel :groups="groups" :model-value="value"
            @select="item => pick(item, close)" />
    </template>
</AppPopover>`
</script>
