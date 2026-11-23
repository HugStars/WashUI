<template>
    <DocPage category="表单" name="AppTimePicker" title="时间选择"
        description="点击打开自绘时间面板，支持 v-model、校验、范围和可配置快捷按钮。">
        <DemoBlock title="基础" description="v-model 绑定 HH:mm 字符串。">
            <AppTimePicker v-model="time" label="选择时间" />
            <p class="wa_hint doc_gap">当前：{{ time || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="快捷按钮" description="quick 可以配置常用时间点，也可以传函数生成当前时间。">
            <AppTimePicker v-model="quickTime" label="开始时间" :quick="quickOptions" />
            <p class="wa_hint doc_gap">当前：{{ quickTime || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="范围与步长" description="min / max 使用 HH:mm；minuteStep 控制分钟列表的步长。">
            <AppTimePicker v-model="rangeTime" label="预约时间" min="09:00" max="18:00" :minute-step="10" />
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

const time = ref('')
const quickTime = ref('')
const rangeTime = ref('')

const quickOptions = [
    { label: '现在', value: () => formatDate(new Date(), 'HH:mm') },
    '09:00',
    '18:00'
]

const propsRows = [
    { name: 'modelValue', type: 'string', default: "''", desc: '时间字符串，格式 HH:mm' },
    { name: 'label', type: 'string', default: "''", desc: '字段标签' },
    { name: 'placeholder', type: 'string', default: "'请选择'", desc: '未选择时的占位文案' },
    { name: 'ariaLabel', type: 'string', default: "'日期时间选择'", desc: '没有 label 时的无障碍名称' },
    { name: 'hint / error', type: 'string', default: "''", desc: '提示与错误；错误优先' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '控件尺寸' },
    { name: 'min / max', type: 'string', default: "''", desc: '可选时间范围' },
    { name: 'minuteStep', type: 'number', default: '5', desc: '分钟列表的步长' },
    { name: 'quick', type: 'Array', default: '[]', desc: '快捷项：string 或 { label, value }，value 可为函数' },
    { name: 'rule', type: 'object | array', default: 'null', desc: '校验规则，与 AppInput 一致' },
    { name: 'disabled / readonly', type: 'boolean', default: 'false', desc: '禁用或只读' }
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '时间变化' },
    { name: 'change', type: 'string', desc: '时间变化或点击快捷项' }
]
</script>
