<template>
    <DocPage category="表单" name="AppDatePicker" title="日期选择"
        description="点击打开自绘日历面板，支持日 / 周 / 月 / 年粒度、日期范围、校验和可配置快捷按钮。">
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

        <DemoBlock title="年 / 月 / 周" description="picker 控制选择粒度；输出分别为 YYYY、YYYY-MM、YYYY-Www。">
            <div class="doc_grid">
                <AppDatePicker v-model="yearValue" picker="year" label="年份" />
                <AppDatePicker v-model="monthValue" picker="month" label="月份" />
                <AppDatePicker v-model="weekValue" picker="week" label="周" />
            </div>
            <p class="wa_hint doc_gap">
                年份：{{ yearValue || '未选择' }}；月份：{{ monthValue || '未选择' }}；周：{{ weekValue || '未选择' }}
            </p>
        </DemoBlock>

        <DemoBlock title="日期范围" description="range 时 modelValue 为 [开始, 结束]。">
            <AppDatePicker v-model="rangeValue" range label="活动周期" />
            <p class="wa_hint doc_gap">当前：{{ rangeValue.length ? rangeValue.join(' ~ ') : '未选择' }}</p>
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
const yearValue = ref('')
const monthValue = ref('')
const weekValue = ref('')
const rangeValue = ref([])

function offsetDate(days) {
    return formatDate(new Date(Date.now() + days * 86_400_000), 'YYYY-MM-DD')
}

const quickOptions = [
    { label: '今天', value: () => offsetDate(0) },
    { label: '明天', value: () => offsetDate(1) },
    { label: '一周后', value: () => offsetDate(7) }
]

const propsRows = [
    { name: 'modelValue', type: 'string | string[]', default: "''", desc: '日期值；range 时为 [开始, 结束]' },
    { name: 'picker', type: 'day | week | month | year', default: 'day', desc: '选择粒度；输出分别为 YYYY-MM-DD、YYYY-Www、YYYY-MM、YYYY' },
    { name: 'range', type: 'boolean', default: 'false', desc: '范围选择，modelValue 为 [start, end]' },
    { name: 'label', type: 'string', default: "''", desc: '字段标签' },
    { name: 'placeholder', type: 'string', default: "'请选择'", desc: '未选择时的占位文案' },
    { name: 'ariaLabel', type: 'string', default: "'日期时间选择'", desc: '没有 label 时的无障碍名称' },
    { name: 'hint / error', type: 'string', default: "''", desc: '提示与错误；错误优先' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '控件尺寸' },
    { name: 'min / max', type: 'string', default: "''", desc: '可选日期范围' },
    { name: 'quick', type: 'Array', default: '[]', desc: '快捷项：string 或 { label, value }，value 可为函数' },
    { name: 'rule', type: 'object | array', default: 'null', desc: '校验规则，与 AppInput 一致' },
    { name: 'disabled / readonly', type: 'boolean', default: 'false', desc: '禁用或只读' }
]

const eventRows = [
    { name: 'update:modelValue', type: 'string | string[]', desc: '日期变化' },
    { name: 'change', type: 'string | string[]', desc: '日期变化或点击快捷项' }
]
</script>
