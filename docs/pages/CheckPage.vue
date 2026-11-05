<template>
    <DocPage category="表单" name="AppCheck" title="复选框组"
        description="复选项支持横向/纵向排列，标签可放在复选框前或后；纵向排列时整体可左右对齐。">
        <DemoBlock title="基础" description="v-model 绑定选中的 value 数组，标签默认在复选框后。">
            <div class="doc_check_stack">
                <AppCheck v-model="basic" :options="options" />
                <p class="wa_hint">已选：{{ basic.length ? basic.join('、') : '无' }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="标签位置" description="label-position=before 时标签在复选框前，默认 after 时标签在后。">
            <div class="doc_check_groups">
                <AppCheck v-model="before" :options="compactOptions" label-position="before" />
                <AppCheck v-model="after" :options="compactOptions" />
            </div>
        </DemoBlock>

        <DemoBlock title="竖向排列" description="direction=vertical 时复选项纵向排列；align 控制整组靠左或靠右。">
            <div class="doc_check_vertical">
                <AppCheck v-model="left" :options="options" direction="vertical" align="left" />
                <AppCheck v-model="right" :options="options" direction="vertical" align="right" />
            </div>
        </DemoBlock>

        <DemoBlock title="禁用" description="支持单个选项禁用，也支持整组禁用。">
            <div class="doc_check_stack">
                <AppCheck v-model="partDisabled" :options="disabledOptions" />
                <AppCheck v-model="allDisabled" :options="compactOptions" disabled />
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

const options = [
    { label: '邮件通知', value: 'email' },
    { label: '短信通知', value: 'sms' },
    { label: '站内消息', value: 'inbox' },
]

const compactOptions = [
    { label: '邮件', value: 'email' },
    { label: '短信', value: 'sms' },
]

const disabledOptions = [
    { label: '邮件', value: 'email' },
    { label: '短信（不可用）', value: 'sms', disabled: true },
    { label: '站内消息', value: 'inbox' },
]

const basic = ref(['email'])
const before = ref(['email'])
const after = ref(['email'])
const left = ref(['email'])
const right = ref(['email'])
const partDisabled = ref(['email'])
const allDisabled = ref(['email'])

const propsRows = [
    { name: 'modelValue', type: 'Array', default: '[]', desc: '选中的 value 数组，支持 v-model' },
    { name: 'options', type: 'Array<{ label, value, disabled? }>', default: '[]', desc: '复选项数据' },
    { name: 'direction', type: 'horizontal | vertical', default: 'horizontal', desc: '复选项横向或纵向排列' },
    { name: 'labelPosition', type: 'before | after', default: 'after', desc: '每个标签在复选框前或后' },
    { name: 'align', type: 'left | right', default: 'left', desc: '纵向排列时整组靠左或靠右' },
    { name: 'ariaLabel', type: 'string', default: '复选框组', desc: '组的无障碍名称' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整组' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'Array', desc: '选中的 value 数组变化' },
    { name: 'change', type: 'Array', desc: '选中的 value 数组变化' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '自定义复选项，可配合 AppCheckItem 使用' },
]
</script>

<style>
.doc_check_stack,
.doc_check_groups {
    display: grid;
    gap: 12px;
}

.doc_check_vertical {
    display: grid;
    gap: 16px;
    max-width: 320px;
    padding: 12px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}
</style>
