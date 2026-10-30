<template>
    <DocPage category="基础" name="AppChip" title="标记" description="轻量筛选与状态标记，根元素是 button，点击事件直接透传。">
        <DemoBlock title="单选筛选" description="active 控制选中态，使用 .on 类表示。">
            <div class="doc_row">
                <AppChip v-for="item in filters" :key="item.value" :active="filter === item.value"
                    @click="filter = item.value">
                    {{ item.label }}
                </AppChip>
            </div>
            <p class="wa_hint doc_gap">当前筛选：{{ filter }}</p>
        </DemoBlock>

        <DemoBlock title="文本与插槽" description="text 适合纯文本，默认插槽可以放图标或组合内容。">
            <div class="doc_row">
                <AppChip text="纯文本" />
                <AppChip active>
                    <AppIcon name="refresh" :size="14" />
                    <span>可刷新</span>
                </AppChip>
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const filter = ref('all')
const filters = [
    { value: 'all', label: '全部' },
    { value: 'api', label: '接口' },
    { value: 'page', label: '页面' },
    { value: 'other', label: '其他' },
]

const propsRows = [
    { name: 'active', type: 'boolean', default: 'false', desc: '选中状态' },
    { name: 'text', type: 'string', default: "''", desc: '文本内容；默认插槽优先' },
]

const eventRows = [
    { name: 'click', type: 'MouseEvent', desc: '原生点击事件' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '自定义内容，默认显示 text' },
]
</script>
