<template>
    <DocPage category="表单" name="AppSwitch" title="开关" description="二选一的状态切换。支持标签显隐、标签与开关的两种对齐方式、尺寸与禁用状态。">
        <DemoBlock title="基础" description="v-model 绑定开启状态，点击开关或标签都可以切换。">
            <div class="doc_switch_stack">
                <AppSwitch v-model="on" label="启用通知" />
                <p class="wa_hint">当前：{{ on ? '开启' : '关闭' }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="标签位置" description="align=inline 时标签与开关紧挨；align=between 时标签贴左、开关贴右。">
            <div class="doc_switch_stack">
                <AppSwitch v-model="inline" label="紧挨对齐" />
                <AppSwitch v-model="between" label="左右分别对齐" align="between" />
            </div>
        </DemoBlock>

        <DemoBlock title="标签显隐" description="不传 label 时不渲染标签；hide-label 视觉隐藏标签但保留无障碍名称。">
            <div class="doc_row">
                <AppSwitch v-model="noLabel" />
                <AppSwitch v-model="hidden" label="隐藏标签" hide-label />
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸" description="默认 sm 为 44×27 紧凑尺寸；size=md 为 52×32，与 Material Web 一致，两者保持相同宽高比例。">
            <div class="doc_row">
                <AppSwitch v-model="small" label="默认 sm" />
                <AppSwitch v-model="medium" label="md 52×32" size="md" />
            </div>
        </DemoBlock>

        <DemoBlock title="状态" description="支持开启、关闭与禁用。">
            <div class="doc_row">
                <AppSwitch v-model="stateOn" label="已开启" />
                <AppSwitch v-model="stateOff" label="已关闭" />
                <AppSwitch v-model="stateOn" label="禁用" disabled />
            </div>
        </DemoBlock>

        <DemoBlock title="自定义标签" description="默认插槽可以放图标和自定义内容；这里用开关直接切换深色模式。">
            <AppSwitch v-model="darkMode">
                <AppIcon :name="darkMode ? 'sun' : 'moon'" :size="15" />
                <span>深色模式</span>
            </AppSwitch>
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
import { useTheme } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const { theme, setTheme } = useTheme()
const darkMode = computed({
    get: () => theme.value === 'dark',
    set: value => setTheme(value ? 'dark' : 'light'),
})

const on = ref(true)
const inline = ref(true)
const between = ref(false)
const noLabel = ref(true)
const hidden = ref(true)
const small = ref(true)
const medium = ref(false)
const stateOn = ref(true)
const stateOff = ref(false)

const propsRows = [
    { name: 'modelValue', type: 'boolean', default: 'false', desc: '开启状态，支持 v-model' },
    { name: 'label', type: 'string', default: "''", desc: '标签文本；为空时不渲染标签' },
    { name: 'hideLabel', type: 'boolean', default: 'false', desc: '视觉隐藏标签，但保留无障碍名称' },
    { name: 'align', type: 'inline | between', default: 'inline', desc: 'inline 紧挨；between 标签与开关左右分开' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: 'sm 为 44×27 紧凑尺寸；md 为 52×32（Material Web）' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用开关' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'boolean', desc: '开启状态变化' },
    { name: 'change', type: 'boolean', desc: '开启状态变化' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '自定义标签内容，可放图标和文本' },
]
</script>

<style>
.doc_switch_stack {
    display: grid;
    gap: 12px;
}
</style>
