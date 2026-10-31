<template>
    <DocPage category="反馈" name="AppPopover" title="弹出框" description="点击触发、浮层展示内容，支持方位、宽度、遮罩外关闭与 Esc 关闭。">
        <DemoBlock title="基础" description="默认点击触发，点击浮层外部或按 Esc 关闭。">
            <AppPopover placement="bottom" :width="240">
                <template #trigger="{ open }">
                    <AppButton variant="line" :aria-expanded="open">打开弹出框</AppButton>
                </template>
                <template #default="{ close }">
                    <div class="doc_popover_list">
                        <AppButton v-for="item in actions" :key="item" size="sm" variant="line"
                            @click="choose(item, close)">
                            {{ item }}
                        </AppButton>
                    </div>
                </template>
            </AppPopover>
        </DemoBlock>

        <DemoBlock title="方位" description="placement 支持 top / bottom / left / right，空间不足时会自动翻转。">
            <div class="doc_row">
                <AppChip v-for="item in placements" :key="item" :active="placement === item"
                    @click="placement = item">
                    {{ item }}
                </AppChip>
            </div>
            <div class="doc_row doc_gap">
                <AppPopover :placement="placement" :width="200">
                    <template #trigger="{ open }">
                        <AppButton size="sm" :aria-expanded="open">当前：{{ placement }}</AppButton>
                    </template>
                    <p class="wa_hint">浮层方位：{{ placement }}</p>
                </AppPopover>
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
import { toast } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const actions = ['查看详情', '复制链接', '删除记录']
const placements = ['top', 'bottom', 'left', 'right']
const placement = ref('bottom')

function choose(item, close) {
    close()
    toast.success(`已选择：${item}`)
}

const propsRows = [
    { name: 'open', type: 'boolean', default: 'false', desc: '是否打开，支持 v-model:open' },
    { name: 'placement', type: 'top | bottom | left | right', default: 'top', desc: '浮层方位' },
    { name: 'offset', type: 'number | { x, y }', default: '0', desc: '定位偏移；数字表示 x 偏移，对象可传 x / y' },
    { name: 'width', type: 'number | string', default: '220', desc: '浮层宽度' },
    { name: 'padding', type: 'number | string', default: 'var(--wa_popover_padding)', desc: '浮层内边距，可跟随内容尺寸传入' },
    { name: 'matchTrigger', type: 'boolean', default: 'false', desc: '浮层宽度跟随触发元素' },
    { name: 'role', type: 'string', default: 'dialog', desc: '浮层 role' },
    { name: 'ariaLabel', type: 'string', default: '弹出内容', desc: '浮层无障碍名称' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用触发' },
    { name: 'closeOnOutside', type: 'boolean', default: 'true', desc: '点击外部关闭' },
    { name: 'closeOnEsc', type: 'boolean', default: 'true', desc: '按 Esc 关闭' },
]

const eventRows = [
    { name: 'update:open', type: 'boolean', desc: '打开状态变化' },
    { name: 'open', type: '—', desc: '打开后触发' },
    { name: 'close', type: '—', desc: '关闭后触发' },
]

const slotRows = [
    { name: 'trigger', type: '{ open, toggle }', desc: '触发元素' },
    { name: 'default', type: '{ close }', desc: '浮层内容' },
]
</script>

<style>
.doc_popover_list {
    display: grid;
    gap: 6px;
}
</style>
