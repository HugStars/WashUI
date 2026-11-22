<template>
    <DocPage category="表单" name="AppDatePicker" title="日期选择"
        description="点击打开自绘日历面板，支持 v-model、校验、日期范围限制和可配置快捷按钮。">
        <DemoBlock title="基础" description="v-model 绑定 YYYY-MM-DD 字符串。">
            <AppDatePicker v-model="date" label="选择日期" />
            <p class="wa_hint doc_gap">当前：{{ date || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="快捷按钮" description="quick 支持字符串，或 { label, value }；value 可以是函数，适合“今天 / 明天”。">
            <AppDatePicker v-model="quickDate" label="入住日期" :quick="quickOptions" />
            <p class="wa_hint doc_gap">当前：{{ quickDate || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="范围与校验" description="min / max 使用 YYYY-MM-DD；rule 与 AppInput 一致。">
            <AppDatePicker v-model="rangeDate" label="活动日期" min="2026-11-01" max="2026-12-31"
                :rule="{ required: true, message: '请选择活动日期' }" />
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

const date = ref('')
const quickDate = ref('')
const rangeDate = ref('')

function offsetDate(days) {
    return formatDate(new Date(Date.now() + days * 86_400_000), 'YYYY-MM-DD')
}

const quickOptions = [
    { label: '今天', value: () => offsetDate(0) },
    { label: '明天', value: () => offsetDate(1) },
    { label: '一周后', value: () => offsetDate(7) }
]

const propsRows = [
    { name: 'modelValue', type: 'string', default: "''", desc: '日期字符串，格式 YYYY-MM-DD' },
    { name: 'label', type: 'string', default: "''", desc: '字段标签' },
    { name: 'hint / error', type: 'string', default: "''", desc: '提示与错误；错误优先' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '控件尺寸' },
    { name: 'min / max', type: 'string', default: "''", desc: '可选日期范围' },
    { name: 'quick', type: 'Array', default: '[]', desc: '快捷项：string 或 { label, value }，value 可为函数' },
    { name: 'rule', type: 'object | array', default: 'null', desc: '校验规则，与 AppInput 一致' },
    { name: 'disabled / readonly', type: 'boolean', default: 'false', desc: '禁用或只读' }
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '日期变化' },
    { name: 'change', type: 'string', desc: '日期变化或点击快捷项' }
]
</script>
