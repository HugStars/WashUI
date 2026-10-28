<template>
    <DocPage title="工具函数" description="无副作用的纯函数，可从主入口或 @wash/ui/utils 子路径导入。">
        <h2 class="doc_h2">导入</h2>
        <pre class="doc_pre"><code>import { formatBytes, formatSpeed, formatMbps, formatDuration, formatCount } from '@wash/ui/utils'</code></pre>

        <h2 class="doc_h2">结果</h2>
        <div class="doc_kv">
            <div v-for="item in values" :key="item.label" class="doc_kv_row">
                <span>{{ item.label }}</span>
                <code>{{ item.value }}</code>
            </div>
        </div>

        <h2 class="doc_h2">API</h2>
        <ApiTable :rows="rows" />
    </DocPage>
</template>

<script setup>
import { formatBytes, formatCount, formatDuration, formatMbps, formatSpeed } from '@wash/ui/utils'
import { ApiTable, DocPage } from '../components/index.js'

const values = [
    { label: 'formatBytes(1536)', value: formatBytes(1536) },
    { label: 'formatSpeed(1048576)', value: formatSpeed(1048576) },
    { label: 'formatMbps(1048576)', value: formatMbps(1048576) },
    { label: 'formatDuration(1536)', value: formatDuration(1536) },
    { label: 'formatCount(12345)', value: formatCount(12345) },
]

const rows = [
    { name: 'formatBytes(bytes)', type: 'string', default: '—', desc: '字节数转为 B / KB / MB / GB / TB' },
    { name: 'formatSpeed(bytes)', type: 'string', default: '—', desc: '字节数转为速率并追加 /s' },
    { name: 'formatMbps(bytes)', type: 'string', default: '—', desc: '字节数转为 Mbps，保留两位小数' },
    { name: 'formatDuration(ms)', type: 'string', default: '—', desc: '毫秒转为 ms 或 s' },
    { name: 'formatCount(n)', type: 'string', default: '—', desc: '数字转为 k / 万 / 亿' },
]
</script>
