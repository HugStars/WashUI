<template>
    <DocPage title="日期与时间" description="日期模板格式化、解析、周边界计算与相对时间描述。">
        <h2 class="doc_h2">结果</h2>
        <div class="doc_kv">
            <div v-for="item in values" :key="item.label" class="doc_kv_row">
                <span>{{ item.label }}</span>
                <code>{{ item.value }}</code>
            </div>
        </div>

        <h2 class="doc_h2">用法</h2>
        <AppCode lang="js" :code="code" />

        <h2 class="doc_h2">API</h2>
        <ApiTable :rows="rows" />
    </DocPage>
</template>

<script setup>
import {
    formatDate,
    formatRelativeTime,
    getISOWeekNumber,
    parseDateValue,
    parseTimeValue,
    startOfMonth,
    startOfWeek,
} from 'wash-ui/utils'
import { ApiTable, DocPage } from '../components/index.js'

const values = [
    { label: "formatDate('2026-11-13T13:00:00')", value: formatDate('2026-11-13T13:00:00') },
    { label: "formatDate(new Date(), 'YYYY/MM/DD')", value: formatDate(new Date(), 'YYYY/MM/DD') },
    { label: 'formatRelativeTime(now - 3min)', value: formatRelativeTime(Date.now() - 3 * 60 * 1000) },
    { label: 'formatRelativeTime(now - 3min, { short: true })', value: formatRelativeTime(Date.now() - 3 * 60 * 1000, { short: true }) },
    { label: 'startOfWeek(2026-11-24)', value: formatDate(startOfWeek(new Date(2026, 10, 24)), 'YYYY-MM-DD') },
    { label: "parseTimeValue('09:30')", value: JSON.stringify(parseTimeValue('09:30')) },
    { label: 'getISOWeekNumber(2024-01-01)', value: getISOWeekNumber(new Date(2024, 0, 1)) },
    { label: "formatDate(parseDateValue('2026-11-13T13:00:00'))", value: formatDate(parseDateValue('2026-11-13T13:00:00')) }
]

const code = `formatDate('2026-11-13T13:00:00') // 2026-11-13 13:00:00
formatDate('2026-11-13T13:00:00', 'YYYY/MM/DD') // 2026/11/13
formatDate(Date.now(), 'MM-DD HH:mm') // 11-13 13:00

formatRelativeTime(Date.now() - 3 * 60 * 1000) // 3 分钟前
formatRelativeTime(Date.now() + 2 * 60 * 60 * 1000) // 2 小时后
formatRelativeTime(value, { base: someDate, short: true })

startOfMonth(new Date()) // 当月第一天
startOfWeek(new Date()) // 本周一
getISOWeekNumber(new Date('2024-01-01')) // 1
parseTimeValue('09:30') // { hour: 9, minute: 30 }`

const rows = [
    { name: 'formatDate(value, pattern?)', type: 'string', default: "YYYY-MM-DD HH:mm:ss", desc: '日期模板格式化，支持 YYYY、MM、DD、HH、mm、ss' },
    { name: 'formatRelativeTime(value, options?)', type: 'string', default: '—', desc: '刚刚 / N 分钟前 / N 天后；options 支持 base 与 short' },
    { name: 'parseDateValue(value)', type: 'Date | null', default: '—', desc: '解析日期字符串或日期范围的第一项' },
    { name: 'parseTimeValue(value)', type: '{ hour, minute } | null', default: '—', desc: '解析 HH:mm 字符串' },
    { name: 'normalizeDateValue(value)', type: 'string', default: "''", desc: '截取 YYYY-MM-DD 部分' },
    { name: 'startOfMonth(date)', type: 'Date', default: '—', desc: '返回当月第一天' },
    { name: 'startOfWeek(date)', type: 'Date', default: '—', desc: '返回本周一' },
    { name: 'getISOWeekNumber(date)', type: 'number', default: '—', desc: '返回 ISO 周序号' }
]
</script>
