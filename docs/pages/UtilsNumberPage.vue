<template>
    <DocPage title="数字与文本" description="千分位、百分比、货币、补零、截断与区间限制。">
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
import { clamp, formatCurrency, formatNumber, formatPercent, padZero, truncate } from 'wash-ui/utils'
import { ApiTable, DocPage } from '../components/index.js'

const values = [
    { label: 'formatNumber(1234567.89)', value: formatNumber(1234567.89) },
    { label: 'formatNumber(1234567.89, 1)', value: formatNumber(1234567.89, 1) },
    { label: 'formatPercent(0.256)', value: formatPercent(0.256) },
    { label: 'formatCurrency(1234.5)', value: formatCurrency(1234.5) },
    { label: 'padZero(7)', value: padZero(7) },
    { label: 'truncate("WashUI 设计系统", 8)', value: truncate('WashUI 设计系统', 8) },
    { label: 'clamp(120, 0, 100)', value: clamp(120, 0, 100) }
]

const code = `formatNumber(1234567.89) // 1,234,567.89
formatNumber(1234567.89, 1) // 1,234,567.9

formatPercent(0.256) // 25.6%
formatPercent(0.256, 0) // 26%

formatCurrency(1234.5) // ¥1,234.50
formatCurrency(1234.5, { currency: 'USD', locale: 'en-US' }) // $1,234.50

padZero(7) // 07
truncate('WashUI 设计系统', 8) // WashUI 设…
clamp(120, 0, 100) // 100`

const rows = [
    { name: 'formatNumber(value, options?)', type: 'string', default: '—', desc: '千分位数字；支持 decimals、locale' },
    { name: 'formatPercent(value, options?)', type: 'string', default: '—', desc: '比例转百分比，0.256 → 25.6%' },
    { name: 'formatCurrency(value, options?)', type: 'string', default: '—', desc: '货币格式化，支持 currency、locale、decimals' },
    { name: 'padZero(value, length?)', type: 'string', default: '2', desc: '数字补零' },
    { name: 'truncate(text, max?, suffix?)', type: 'string', default: '24 / …', desc: '截断长文本' },
    { name: 'clamp(value, min, max)', type: 'number', default: '—', desc: '限制数字区间' }
]
</script>
