<template>
    <DocPage category="基础" name="AppBadge" title="消息角标"
        description="未读数量与状态角标。开启 draggable 后可以拖动：气泡和原位锚点之间会拉出粘性连接，松手回弹，拖过阈值则断开、爆开并触发 clear。">
        <DemoBlock title="基础" description="value 支持数字和短文本，超过 max 显示 max+；dot 只显示圆点。">
            <div class="doc_row">
                <AppBadge :value="12" />
                <AppBadge :value="120" />
                <AppBadge dot />
                <AppBadge :value="9" tone="accent" />
                <AppBadge :value="9" tone="neutral" />
                <AppBadge :value="28" size="md" />
            </div>
        </DemoBlock>

        <DemoBlock title="拖拽清除"
            description="按住角标拖动：超过阈值前松手会弹回原位，超过阈值后断开并爆开。拖动过程中原位置保留一个收缩的锚点，中间是粘性连接。">
            <div class="doc_badge_stage">
                <AppBadge v-if="dragCount > 0" :key="dragCount" :value="dragCount" draggable
                    :aria-label="`${dragCount} 条未读，可拖动清除`" @clear="dragCount = 0" />
                <span v-else class="wa_hint">已清除</span>
                <AppButton size="sm" variant="line" @click="dragCount = 8">重置</AppButton>
            </div>
        </DemoBlock>

        <DemoBlock title="接入标签页"
            description="items[].badge 支持数字、true（圆点）或对象；给对象加 draggable 即可拖拽清除。拖断后会触发 badge-clear，由业务决定如何更新数据。">
            <AppTabs v-model="tab" :items="tabs" @badge-clear="ClearBadge" />
            <p class="wa_hint doc_gap">当前未读：{{ totalUnread }}</p>
        </DemoBlock>

        <DemoBlock title="收进更多"
            description="overflow=more 时，被收起的标签未读会汇总到“更多”按钮上；圆点和数字同时存在时优先显示数字。">
            <AppTabs v-model="moreTab" overflow="more" :max="4" :items="manyTabs" />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const dragCount = ref(8)
const tab = ref('all')
const moreTab = ref('system')

const tabs = ref([
    { name: 'all', label: '全部', badge: 12 },
    { name: 'reply', label: '回复', badge: { text: 3, draggable: true } },
    { name: 'mention', label: '提到我', badge: { dot: true, tone: 'accent', draggable: true } },
    { name: 'system', label: '系统', badge: { text: 1, tone: 'neutral', draggable: true } },
])

const manyTabs = [
    { name: 'all', label: '全部', badge: 6 },
    { name: 'reply', label: '回复' },
    { name: 'mention', label: '提到我', badge: { dot: true, tone: 'accent' } },
    { name: 'system', label: '系统', badge: { text: 2 } },
    { name: 'follow', label: '关注', badge: 4 },
    { name: 'like', label: '点赞', badge: true },
]

const totalUnread = computed(() => tabs.value.reduce((sum, item) => {
    if (!item.badge) return sum
    if (typeof item.badge === 'number') return sum + item.badge
    return sum + (Number(item.badge.text) || 0)
}, 0))

function ClearBadge({ name }) {
    const item = tabs.value.find(item => item.name === name)
    if (item) item.badge = null
}

const propsRows = [
    { name: 'value', type: 'string | number', default: "''", desc: '未读数量或短文本；dot 模式下忽略' },
    { name: 'dot', type: 'boolean', default: 'false', desc: '只显示一个小圆点' },
    { name: 'tone', type: 'danger | accent | neutral', default: 'danger', desc: '语义色；danger 使用 --wa_color_danger，accent 使用 --wa_color_accent' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '角标尺寸' },
    { name: 'max', type: 'number', default: '99', desc: '数字上限，超过显示 max+' },
    { name: 'draggable', type: 'boolean', default: 'false', desc: '允许拖动；拖过阈值断开并触发 clear' },
    { name: 'maxDistance', type: 'number', default: '72', desc: '断开阈值（px）' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用角标交互' },
    { name: 'tabindex', type: 'number | string', default: '0', desc: '按钮的 tabindex；放进 tablist 时可设为 -1' },
    { name: 'ariaLabel', type: 'string', default: "''", desc: '无可见文字时的无障碍名称' },
]

const eventRows = [
    { name: 'click', type: '—', desc: '点击角标；拖动结束后不会触发' },
    { name: 'clear', type: '—', desc: '拖过阈值或按 Delete / Backspace 清除后触发' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '角标内容，优先于 value' },
]
</script>

<style>
.doc_badge_stage {
    display: flex;
    align-items: center;
    gap: 24px;
    min-height: 120px;
    padding: 32px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}
</style>
