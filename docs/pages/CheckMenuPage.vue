<template>
    <DocPage category="表单" name="AppCheckMenu" title="多选菜单"
        description="按钮触发的多选列表，复用 AppChoiceList / AppCheckPanel 渲染选项与选中动画。mode=popover 展示为浮层，mode=dialog 展示为弹框，适合移动端或需要更大操作区域的场景。">
        <DemoBlock title="浮层多选" description="默认 mode=popover，点击按钮展开面板；选择后面板不会关闭，可以连续勾选。" :code="baseCode">
            <div class="doc_check_menu_row">
                <AppCheckMenu v-model="basic" :options="options" />
                <p class="wa_hint">已选：{{ basic.length ? basic.join('、') : '无' }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="分组" description="groups 与 options 可以同时使用，分组只在面板中增加标题。" :code="groupCode">
            <AppCheckMenu v-model="grouped" :groups="groups" title="选择组件" />
        </DemoBlock>

        <DemoBlock title="弹出对齐" description="align 控制 popover 与触发器的左对齐、居中或右对齐。">
            <div class="doc_check_menu_row">
                <AppCheckMenu v-model="alignedLeft" :options="options" align="left" />
                <AppCheckMenu v-model="alignedCenter" :options="options" align="center" />
                <AppCheckMenu v-model="alignedRight" :options="options" align="right" />
            </div>
        </DemoBlock>

        <DemoBlock title="弹框模式"
            description="mode=dialog 时由 AppDialog 承载，底部提供清空与完成；适合移动端、全屏或选项较多的场景。" :code="dialogCode">
            <AppCheckMenu v-model="dialog" mode="dialog" title="选择通知方式" :options="options" />
        </DemoBlock>

        <DemoBlock title="自定义触发器" description="trigger 插槽可以替换按钮；点击由容器统一处理，无需在插槽内再次调用 toggle。">
            <div class="doc_check_menu_row">
                <AppCheckMenu v-model="custom" :options="options">
                    <template #trigger>
                        <AppChip :active="custom.length > 0">筛选{{ custom.length ? `（${custom.length}）` : '' }}</AppChip>
                    </template>
                </AppCheckMenu>
            </div>
        </DemoBlock>

        <DemoBlock title="禁用与空状态" description="disabled 禁用触发器；没有选项时面板显示 emptyText。">
            <div class="doc_check_menu_row">
                <AppCheckMenu :model-value="['email']" :options="options" disabled />
                <AppCheckMenu :model-value="[]" :options="[]" empty-text="暂无可选通知方式" />
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
import { AppCheckMenu } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const options = [
    { label: '邮件通知', value: 'email' },
    { label: '短信通知', value: 'sms' },
    { label: '站内消息', value: 'inbox' },
]

const groups = [
    {
        label: '基础',
        options: [
            { label: '按钮 AppButton', value: 'button' },
            { label: '卡片 AppCard', value: 'card' },
        ],
    },
    {
        label: '表单',
        options: [
            { label: '输入框 AppInput', value: 'input' },
            { label: '下拉框 AppSelect', value: 'select' },
        ],
    },
]

const basic = ref(['email'])
const grouped = ref(['button', 'select'])
const dialog = ref(['email', 'sms'])
const custom = ref(['sms'])
const alignedLeft = ref(['email'])
const alignedCenter = ref(['sms'])
const alignedRight = ref(['inbox'])

const propsRows = [
    { name: 'modelValue', type: 'Array', default: '[]', desc: '选中的 value 数组，支持 v-model' },
    { name: 'options', type: 'Array<{ label, value, disabled? }>', default: '[]', desc: '普通选项' },
    { name: 'groups', type: 'Array<{ label, options }>', default: '[]', desc: '分组选项，组内 options 结构同上' },
    { name: 'mode', type: 'popover | dialog', default: 'popover', desc: '浮层菜单或弹框选择' },
    { name: 'align', type: 'left | center | right', default: 'center', desc: 'popover 与触发器的对齐方式' },
    { name: 'width', type: 'number | string', default: '240', desc: 'popover 模式下的面板宽度' },
    { name: 'size', type: 'number | string', default: '18', desc: '复选框尺寸，数字按 px 处理；边框与勾线粗细按比例缩放' },
    { name: 'title', type: 'string', default: '选择', desc: 'dialog 模式下的弹框标题' },
    { name: 'placeholder', type: 'string', default: '请选择', desc: '未选择时触发器显示的文案' },
    { name: 'emptyText', type: 'string', default: '暂无选项', desc: '没有可选项时的提示文案' },
    { name: 'ariaLabel', type: 'string', default: '多选菜单', desc: '触发器与面板的无障碍名称' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用触发器' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'Array', desc: '选中的 value 数组变化' },
    { name: 'change', type: 'Array', desc: '选中的 value 数组变化' },
]

const slotRows = [
    { name: 'trigger', type: '{ open, toggle }', desc: '自定义触发器，open 为当前展开状态' },
]

const baseCode = `<AppCheckMenu v-model="values" :options="options" />

const options = [
    { label: '邮件通知', value: 'email' },
    { label: '短信通知', value: 'sms' },
]`

const groupCode = `<AppCheckMenu v-model="values" :groups="groups" />

const groups = [
    {
        label: '基础',
        options: [
            { label: '按钮 AppButton', value: 'button' },
            { label: '卡片 AppCard', value: 'card' },
        ],
    },
]`

const dialogCode = `<AppCheckMenu
    v-model="values"
    mode="dialog"
    title="选择通知方式"
    :options="options"
/>`
</script>

<style>
.doc_check_menu_row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}
</style>
