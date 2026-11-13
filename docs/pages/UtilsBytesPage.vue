<template>
    <DocPage title="字节与速率" description="字节数、传输速度、耗时和大数字的格式化。">
        <h2 class="doc_h2">结果</h2>
        <div class="doc_kv">
            <div v-for="item in values" :key="item.label" class="doc_kv_row">
                <span>{{ item.label }}</span>
                <code>{{ item.value }}</code>
            </div>
        </div>

        <h2 class="doc_h2">小数位与单位</h2>
        <p class="doc_text">
            第二个参数可以传小数位数，或 <code class="wa_mono">{ decimals, trimZeros, space, unit }</code>。
            默认保留两位小数并去掉末尾零；需要固定位数时用 <code class="wa_mono">formatBytesFixed(decimals)</code>
            生成格式化器。
        </p>
        <AppCode lang="js" :code="code" />

        <h2 class="doc_h2">API</h2>
        <ApiTable :rows="rows" />
    </DocPage>
</template>

<script setup>
import {
    formatBytes,
    formatBytesFixed,
    formatCount,
    formatDuration,
    formatMbps,
    formatSpeed
} from 'wash-ui/utils'
import { ApiTable, DocPage } from '../components/index.js'

const values = [
    { label: 'formatBytes(1536)', value: formatBytes(1536) },
    { label: 'formatBytes(1536, 2)', value: formatBytes(1536, 2) },
    { label: 'formatBytesFixed(2)(1536)', value: formatBytesFixed(2)(1536) },
    { label: "formatBytes(1536, { unit: 'MB' })", value: formatBytes(1536, { unit: 'MB' }) },
    { label: 'formatSpeed(1048576)', value: formatSpeed(1048576) },
    { label: 'formatMbps(1048576)', value: formatMbps(1048576) },
    { label: 'formatDuration(1536)', value: formatDuration(1536) },
    { label: "formatDuration(1536, { unit: 'ms', decimals: 0 })", value: formatDuration(1536, { unit: 'ms', decimals: 0 }) },
    { label: 'formatCount(12345)', value: formatCount(12345) }
]

const code = `import { formatBytes, formatBytesFixed } from 'wash-ui/utils'

formatBytes(1536) // 1.5 KB
formatBytes(1536, 2) // 1.50 KB
formatBytes(1536, { trimZeros: false }) // 1.50 KB
formatBytes(1536, { unit: 'MB' }) // 0 MB

// 生成固定两位小数的格式化器，之后可以复用
const fixed2 = formatBytesFixed(2)
fixed2(1536) // 1.50 KB`

const rows = [
    { name: 'formatBytes(bytes, options?)', type: 'string', default: '—', desc: '字节数转 B / KB / MB / GB / TB；options 支持 decimals、trimZeros、space、unit' },
    { name: 'formatBytesFixed(decimals, options?)', type: 'Function', default: '—', desc: '生成固定小数位的字节格式化器，不是直接返回字符串的函数' },
    { name: 'formatSpeed(bytes, options?)', type: 'string', default: '—', desc: '字节速率并追加 /s' },
    { name: 'formatMbps(bytes, options?)', type: 'string', default: '—', desc: '字节速率转 Mbps' },
    { name: 'formatDuration(ms, options?)', type: 'string', default: '—', desc: '毫秒转 ms / s，可指定 unit 与 decimals' },
    { name: 'formatCount(n, options?)', type: 'string', default: '—', desc: '数字转 k / 万 / 亿' }
]
</script>
