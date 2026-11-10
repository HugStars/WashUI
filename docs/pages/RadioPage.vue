<template>
    <DocPage category="表单" name="AppRadio / AppRadioGroup" title="单选框"
        description="单个 AppRadio 不生成外层分组容器，可直接放进任意布局；AppRadioGroup 负责标量 v-model、options 以及和复选框一致的排列、对齐与标签位置。">
        <DemoBlock title="单个单选框" description="v-model 绑定布尔值；label-position 控制标签在单选框前还是后。">
            <div class="doc_radio_stack">
                <AppRadio v-model="single" label="启用通知" />
                <AppRadio v-model="singleBefore" label="标签在前" label-position="before" />
                <p class="wa_hint">当前：{{ single ? '已选中' : '未选中' }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="分组" description="AppRadioGroup 用标量 v-model 绑定选中值，options 渲染选项。">
            <div class="doc_radio_stack">
                <AppRadioGroup v-model="plan" :options="options" />
                <p class="wa_hint">当前：{{ plan }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="分段选择" description="variant=segmented 把互斥选项渲染成等宽分段，适合 2–4 个短选项。">
            <div class="doc_radio_stack">
                <AppRadioGroup v-model="segmentedPeriod" :options="compactOptions" variant="segmented"
                    aria-label="计费周期" />
                <AppRadioGroup v-model="segmentedPlan" :options="options" variant="segmented" aria-label="套餐" />
                <p class="wa_hint">当前：{{ segmentedPeriod }} / {{ segmentedPlan }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="排列与排版"
            description="direction 控制横向/纵向；纵向时 align 控制靠左、靠右或两端对齐；label-position 控制标签位置。">
            <div class="doc_radio_stack">
                <p class="wa_hint">horizontal</p>
                <AppRadioGroup v-model="horizontal" :options="options" />

                <p class="wa_hint">vertical / left</p>
                <AppRadioGroup v-model="verticalLeft" :options="options" direction="vertical" />

                <p class="wa_hint">vertical / right</p>
                <AppRadioGroup v-model="verticalRight" :options="options" direction="vertical" align="right" />
            </div>
        </DemoBlock>

        <DemoBlock title="两端对齐" description="align=space-between 且标签在前时，标签贴左、单选框贴右。">
            <div class="doc_radio_between">
                <AppRadioGroup v-model="between" :options="options" direction="vertical" align="space-between"
                    label-position="before" />
            </div>
        </DemoBlock>

        <DemoBlock title="自定义选项" description="默认插槽可以放任意 AppRadio，分组会自动接管 value 与选中状态。">
            <AppRadioGroup v-model="custom">
                <AppRadio value="email" label="邮件通知" />
                <AppRadio value="sms">
                    <AppIcon name="send" :size="14" />
                    <span>短信通知</span>
                </AppRadio>
                <AppRadio value="inbox" label="站内消息" disabled />
            </AppRadioGroup>
            <p class="wa_hint doc_gap">当前：{{ custom }}</p>
        </DemoBlock>

        <DemoBlock title="面板形态" description="AppRadioPanel 复用共享的 AppChoiceList，适合弹框、筛选面板等纵向列表。">
            <div class="doc_radio_panel">
                <AppRadioPanel v-model="panelValue" :groups="panelGroups" />
            </div>
            <p class="wa_hint doc_gap">当前：{{ panelValue }}</p>
        </DemoBlock>

        <DemoBlock title="尺寸与禁用" description="size 会继承给分组内所有选项；支持单个选项禁用和整组禁用。">
            <div class="doc_radio_stack">
                <p class="wa_hint">18px</p>
                <AppRadioGroup v-model="smallSize" :options="compactOptions" :size="18" />
                <p class="wa_hint">24px</p>
                <AppRadioGroup v-model="largeSize" :options="compactOptions" :size="24" />
                <p class="wa_hint">禁用选项 / 整组禁用</p>
                <AppRadioGroup v-model="partDisabled" :options="disabledOptions" />
                <AppRadioGroup v-model="allDisabled" :options="compactOptions" disabled />
                <AppRadio v-model="singleDisabled" label="禁用单个单选框" disabled />
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable title="AppRadio" :rows="radioRows" />
            <ApiTable title="AppRadioGroup" :rows="groupRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { AppRadio, AppRadioGroup, AppRadioPanel } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const options = [
    { label: '基础版', value: 'basic' },
    { label: '专业版', value: 'pro' },
    { label: '企业版', value: 'enterprise' },
]

const compactOptions = [
    { label: '按月', value: 'month' },
    { label: '按年', value: 'year' },
]

const disabledOptions = [
    { label: '基础版', value: 'basic' },
    { label: '专业版（不可用）', value: 'pro', disabled: true },
    { label: '企业版', value: 'enterprise' },
]

const panelGroups = [
    {
        label: '个人',
        options: [
            { label: '基础版', value: 'basic' },
            { label: '专业版', value: 'pro' },
        ],
    },
    {
        label: '团队',
        options: [
            { label: '企业版', value: 'enterprise' },
        ],
    },
]

const single = ref(true)
const singleBefore = ref(false)
const plan = ref('pro')
const segmentedPeriod = ref('month')
const segmentedPlan = ref('pro')
const horizontal = ref('basic')
const verticalLeft = ref('basic')
const verticalRight = ref('basic')
const between = ref('basic')
const custom = ref('email')
const panelValue = ref('pro')
const smallSize = ref('month')
const largeSize = ref('year')
const partDisabled = ref('basic')
const allDisabled = ref('month')
const singleDisabled = ref(true)

const radioRows = [
    { name: 'modelValue', type: 'boolean', default: 'false', desc: '单个单选框的选中状态，支持 v-model' },
    { name: 'value', type: 'string | number | symbol | boolean', default: 'undefined', desc: '在 AppRadioGroup / AppChoiceList 中对应的值' },
    { name: 'label', type: 'string', default: "''", desc: '标签文本' },
    { name: 'labelPosition', type: 'before | after', default: 'after', desc: '标签在单选框前或后；分组中会继承分组设置' },
    { name: 'size', type: 'number | string', default: '20', desc: '单选框尺寸；分组中会继承分组 size' },
    { name: 'between', type: 'boolean', default: 'false', desc: '标签与单选框两端对齐' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用单个单选框' },
    { name: 'ariaLabel', type: 'string', default: '单选框', desc: '没有标签时的无障碍名称' },
]

const groupRows = [
    { name: 'modelValue', type: 'string | number | symbol | boolean', default: "''", desc: '选中的值，支持 v-model' },
    { name: 'options', type: 'Array<{ label, value, disabled? }>', default: '[]', desc: '单选项数据' },
    { name: 'direction', type: 'horizontal | vertical', default: 'horizontal', desc: '单选项横向或纵向排列' },
    { name: 'variant', type: 'default | segmented', default: 'default', desc: 'segmented 渲染为等宽分段单选' },
    { name: 'labelPosition', type: 'before | after', default: 'after', desc: '每个标签在单选框前或后' },
    { name: 'align', type: 'left | right | between | space-between', default: 'left', desc: '纵向排列时整组靠左/靠右，或让标签与单选框两端对齐' },
    { name: 'size', type: 'number | string', default: '20', desc: '单选框尺寸，数字按 px 处理' },
    { name: 'ariaLabel', type: 'string', default: '单选框组', desc: '组的无障碍名称' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整组' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'boolean | string | number | symbol', desc: '单个单选框为 boolean；分组为选中值' },
    { name: 'change', type: 'boolean | string | number | symbol', desc: '与 update:modelValue 同步' },
]

const slotRows = [
    { name: 'default', type: '—', desc: 'AppRadioGroup 中可以放自定义 AppRadio；AppRadio 中放标签内容' },
]
</script>

<style>
.doc_radio_stack {
    display: grid;
    gap: 14px;
}

.doc_radio_between {
    max-width: 320px;
    padding: 12px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}

.doc_radio_panel {
    max-width: 280px;
    padding: 4px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_field);
}
</style>
