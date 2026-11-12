<template>
    <DocPage category="表单" name="AppCheck / AppCheckGroup" title="复选框"
        description="单个 AppCheck 不生成外层分组容器，可直接放进任意布局；需要横向/纵向排列、左右对齐或两端对齐时，使用 AppCheckGroup 承载数组与排版。">
        <DemoBlock title="单个复选框" description="v-model 绑定布尔值；label-position 控制标签在复选框前还是后。">
            <div class="doc_choice_stack">
                <AppCheck v-model="checked" label="同意服务条款" />
                <AppCheck v-model="checkedBefore" label="标签在前" label-position="before" />
                <p class="wa_hint">当前：{{ checked ? '已选中' : '未选中' }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="半选状态"
            description="indeterminate 显示为横杠，常用于「全选 / 部分选中」；点击后由父级同时更新 indeterminate 与 v-model。">
            <div class="doc_choice_stack">
                <div class="doc_choice_row">
                    <AppCheck v-model="allChecked" label="全选" :indeterminate="mixed" @change="ToggleAll" />
                    <AppButton size="sm" variant="line" @click="SetMixed">设为半选</AppButton>
                    <AppButton size="sm" variant="line" @click="SetAll">设为全选</AppButton>
                    <AppButton size="sm" variant="line" @click="SetNone">设为未选</AppButton>
                </div>
                <p class="wa_hint">allChecked：{{ allChecked }} · indeterminate：{{ mixed }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="分组" description="AppCheckGroup 用 v-model 绑定数组，options 渲染选项；默认插槽也可以直接放 AppCheck。">
            <div class="doc_choice_stack">
                <AppCheckGroup v-model="basic" :options="options" />
                <p class="wa_hint">已选：{{ basic.length ? basic.join('、') : '无' }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="排列与排版"
            description="direction 控制横向/纵向；纵向时 align 控制靠左、靠右或两端对齐；label-position 控制标签位置。">
            <div class="doc_choice_stack">
                <p class="wa_hint">horizontal</p>
                <AppCheckGroup v-model="horizontal" :options="options" />

                <p class="wa_hint">vertical / left</p>
                <AppCheckGroup v-model="verticalLeft" :options="options" direction="vertical" />

                <p class="wa_hint">vertical / right</p>
                <AppCheckGroup v-model="verticalRight" :options="options" direction="vertical" align="right" />
            </div>
        </DemoBlock>

        <DemoBlock title="两端对齐"
            description="align=space-between 且标签在前时，标签贴左、复选框贴右；align=between 是等价写法。">
            <div class="doc_choice_between">
                <AppCheckGroup v-model="between" :options="options" direction="vertical" align="space-between"
                    label-position="before" />
            </div>
        </DemoBlock>

        <DemoBlock title="自定义选项" description="默认插槽可以放任意 AppCheck，分组会自动接管 value 与选中状态。">
            <AppCheckGroup v-model="custom">
                <AppCheck value="email" label="邮件通知" />
                <AppCheck value="sms">
                    <AppIcon name="send" :size="14" />
                    <span>短信通知</span>
                </AppCheck>
                <AppCheck value="inbox" label="站内消息" disabled />
            </AppCheckGroup>
            <p class="wa_hint doc_gap">已选：{{ custom.length ? custom.join('、') : '无' }}</p>
        </DemoBlock>

        <DemoBlock title="尺寸与禁用" description="size 会继承给分组内所有选项；支持单个选项禁用和整组禁用。">
            <div class="doc_choice_stack">
                <p class="wa_hint">18px</p>
                <AppCheckGroup v-model="smallSize" :options="compactOptions" :size="18" />
                <p class="wa_hint">24px</p>
                <AppCheckGroup v-model="largeSize" :options="compactOptions" :size="24" />
                <p class="wa_hint">禁用选项 / 整组禁用</p>
                <AppCheckGroup v-model="partDisabled" :options="disabledOptions" />
                <AppCheckGroup v-model="allDisabled" :options="compactOptions" disabled />
                <AppCheck v-model="singleDisabled" label="禁用单个复选框" disabled />
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable title="AppCheck" :rows="checkRows" />
            <ApiTable title="AppCheckGroup" :rows="groupRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { AppCheck, AppCheckGroup } from 'wash-ui'
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

const checked = ref(true)
const checkedBefore = ref(false)
const allChecked = ref(false)
const mixed = ref(false)
const basic = ref(['email'])
const horizontal = ref(['email'])
const verticalLeft = ref(['email'])
const verticalRight = ref(['email'])
const between = ref(['email'])
const custom = ref(['email'])
const smallSize = ref(['email'])
const largeSize = ref(['email'])
const partDisabled = ref(['email'])
const allDisabled = ref(['email'])
const singleDisabled = ref(true)

function ToggleAll(checked) {
    allChecked.value = checked
    mixed.value = false
}

function SetMixed() {
    allChecked.value = false
    mixed.value = true
}

function SetAll() {
    allChecked.value = true
    mixed.value = false
}

function SetNone() {
    allChecked.value = false
    mixed.value = false
}

const checkRows = [
    { name: 'modelValue', type: 'boolean', default: 'false', desc: '单个复选框的选中状态，支持 v-model' },
    { name: 'value', type: 'string | number | symbol | boolean', default: 'undefined', desc: '在 AppCheckGroup / AppChoiceList 中对应的值' },
    { name: 'label', type: 'string', default: "''", desc: '标签文本' },
    { name: 'labelPosition', type: 'before | after', default: 'after', desc: '标签在复选框前或后；分组中会继承分组设置' },
    { name: 'indeterminate', type: 'boolean', default: 'false', desc: '半选状态，显示为横杠' },
    { name: 'size', type: 'number | string', default: '20', desc: '复选框尺寸；分组中会继承分组 size' },
    { name: 'between', type: 'boolean', default: 'false', desc: '标签与复选框两端对齐' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用单个复选框' },
    { name: 'ariaLabel', type: 'string', default: '复选框', desc: '没有标签时的无障碍名称' },
]

const groupRows = [
    { name: 'modelValue', type: 'Array', default: '[]', desc: '选中的 value 数组，支持 v-model' },
    { name: 'options', type: 'Array<{ label, value, disabled? }>', default: '[]', desc: '复选项数据' },
    { name: 'direction', type: 'horizontal | vertical', default: 'horizontal', desc: '复选项横向或纵向排列' },
    { name: 'labelPosition', type: 'before | after', default: 'after', desc: '每个标签在复选框前或后' },
    { name: 'align', type: 'left | right | between | space-between', default: 'left', desc: '纵向排列时整组靠左/靠右，或让标签与复选框两端对齐' },
    { name: 'size', type: 'number | string', default: '20', desc: '复选框尺寸，数字按 px 处理' },
    { name: 'ariaLabel', type: 'string', default: '复选框组', desc: '组的无障碍名称' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整组' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'boolean | Array', desc: '单个复选框为 boolean；分组为 value 数组' },
    { name: 'change', type: 'boolean | Array', desc: '与 update:modelValue 同步' },
]

const slotRows = [
    { name: 'default', type: '—', desc: 'AppCheckGroup 中可以放自定义 AppCheck；AppCheck 中放标签内容' },
]
</script>

<style>
.doc_choice_stack {
    display: grid;
    gap: 14px;
}

.doc_choice_row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.doc_choice_between {
    max-width: 320px;
    padding: 12px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}
</style>
