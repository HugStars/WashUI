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

        <DemoBlock title="文本与插槽" description="text 适合纯文本，默认插槽可以放图标或组合内容；size=sm 用于表格等紧凑场景。">
            <div class="doc_row">
                <AppChip text="纯文本" />
                <AppChip text="紧凑标记" size="sm" />
                <AppChip active>
                    <AppIcon name="refresh" :size="14" />
                    <span>可刷新</span>
                </AppChip>
            </div>
        </DemoBlock>

        <DemoBlock title="磨砂" description="frosted 使用与 AppPopover 一致的玻璃表面。">
            <div class="doc_frosted_stage">
                <div class="doc_row">
                    <AppChip frosted>磨砂标记</AppChip>
                    <AppChip frosted>筛选</AppChip>
                </div>
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
import { AppChip } from 'wash-ui'
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
    { name: 'frosted', type: 'boolean', default: 'false', desc: '白色磨砂半透明表面，与 AppPopover 一致' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '标记尺寸；sm 为 26px 高' },
]

const eventRows = [
    { name: 'click', type: 'MouseEvent', desc: '原生点击事件' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '自定义内容，默认显示 text' },
]
</script>
