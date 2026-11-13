<template>
    <DocPage title="日期与时间" description="日期模板格式化与相对时间描述。">
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
import { formatDate, formatRelativeTime } from 'wash-ui/utils'
import { ApiTable, DocPage } from '../components/index.js'

const values = [
    { label: "formatDate('2026-11-13T13:00:00')", value: formatDate('2026-11-13T13:00:00') },
    { label: "formatDate(new Date(), 'YYYY/MM/DD')", value: formatDate(new Date(), 'YYYY/MM/DD') },
    { label: 'formatRelativeTime(now - 3min)', value: formatRelativeTime(Date.now() - 3 * 60 * 1000) },
    { label: 'formatRelativeTime(now - 3min, { short: true })', value: formatRelativeTime(Date.now() - 3 * 60 * 1000, { short: true }) }
]

const code = `formatDate('2026-11-13T13:00:00') // 2026-11-13 13:00:00
formatDate('2026-11-13T13:00:00', 'YYYY/MM/DD') // 2026/11/13
formatDate(Date.now(), 'MM-DD HH:mm') // 11-13 13:00

formatRelativeTime(Date.now() - 3 * 60 * 1000) // 3 分钟前
formatRelativeTime(Date.now() + 2 * 60 * 60 * 1000) // 2 小时后
formatRelativeTime(value, { base: someDate, short: true })`

const rows = [
    { name: 'formatDate(value, pattern?)', type: 'string', default: "YYYY-MM-DD HH:mm:ss", desc: '日期模板格式化，支持 YYYY、MM、DD、HH、mm、ss' },
    { name: 'formatRelativeTime(value, options?)', type: 'string', default: '—', desc: '刚刚 / N 分钟前 / N 天后；options 支持 base 与 short' }
]
</script>
