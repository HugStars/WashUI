<template>
    <DocPage category="表单" name="AppDateTimePicker" title="日期时间选择"
        description="点击打开自绘的日历 + 时间面板，值格式为 YYYY-MM-DDTHH:mm，支持快捷项与校验。">
        <DemoBlock title="基础" description="v-model 绑定 datetime-local 格式字符串。">
            <AppDateTimePicker v-model="value" label="选择时间" />
            <p class="wa_hint doc_gap">当前：{{ value || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="快捷按钮" description="常用时间点通过 quick 配置，value 可以是函数。">
            <AppDateTimePicker v-model="quickValue" label="提醒时间" :quick="quickOptions" />
            <p class="wa_hint doc_gap">当前：{{ quickValue || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="范围与校验" description="min / max 使用 YYYY-MM-DDTHH:mm；rule 与 AppInput 一致。">
            <AppDateTimePicker v-model="rangeValue" label="开始时间" min="2026-11-01T00:00"
                max="2026-12-31T23:59" :rule="{ required: true, message: '请选择时间' }" />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { formatDate } from 'wash-ui/utils'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const value = ref('')
const quickValue = ref('')
const rangeValue = ref('')

function offsetDateTime(days, hour, minute = 0) {
    const date = new Date(Date.now() + days * 86_400_000)
    date.setHours(hour, minute, 0, 0)
    return formatDate(date, 'YYYY-MM-DDTHH:mm')
}

const quickOptions = [
    { label: '现在', value: () => formatDate(new Date(), 'YYYY-MM-DDTHH:mm') },
    { label: '今天 18:00', value: () => offsetDateTime(0, 18) },
    { label: '明天 09:00', value: () => offsetDateTime(1, 9) }
]

const propsRows = [
    { name: 'modelValue', type: 'string', default: "''", desc: '日期时间字符串，格式 YYYY-MM-DDTHH:mm' },
    { name: 'label', type: 'string', default: "''", desc: '字段标签' },
    { name: 'placeholder', type: 'string', default: "'请选择'", desc: '未选择时的占位文案' },
    { name: 'ariaLabel', type: 'string', default: "'日期时间选择'", desc: '没有 label 时的无障碍名称' },
    { name: 'hint / error', type: 'string', default: "''", desc: '提示与错误；错误优先' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '控件尺寸' },
    { name: 'min / max', type: 'string', default: "''", desc: '可选范围，格式 YYYY-MM-DDTHH:mm' },
    { name: 'minuteStep', type: 'number', default: '5', desc: '分钟列表的步长' },
    { name: 'quick', type: 'Array', default: '[]', desc: '快捷项：string 或 { label, value }，value 可为函数' },
    { name: 'rule', type: 'object | array', default: 'null', desc: '校验规则，与 AppInput 一致' },
    { name: 'disabled / readonly', type: 'boolean', default: 'false', desc: '禁用或只读' }
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '日期时间变化' },
    { name: 'change', type: 'string', desc: '日期时间变化或点击快捷项' }
]
</script>
