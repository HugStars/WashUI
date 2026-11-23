<template>
    <DocPage category="表单" name="AppPinInput" title="验证码输入"
        description="逐格输入的验证码组件，正方形格子，支持自动跳格、退格回退、方向键、整段粘贴、密码模式与完成回调。点击任意格子都会聚焦到第一个未填写的位置。">
        <DemoBlock title="基础" description="v-model 绑定完整字符串，length 控制位数，填满后触发 complete。">
            <div class="doc_stack">
                <AppPinInput v-model="code" :length="6" />
                <p class="wa_hint">当前值：{{ code || '空' }}</p>
            </div>
        </DemoBlock>

        <DemoBlock title="数字与密码" description="type=number 只接受数字并唤起数字键盘；type=password 隐藏输入内容。">
            <div class="doc_stack">
                <AppPinInput v-model="numberCode" type="number" :length="4" />
                <AppPinInput v-model="secretCode" type="password" :length="4" />
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸与状态" description="size 支持 sm / md；error 为校验失败态，disabled 禁用全部输入。">
            <div class="doc_stack">
                <AppPinInput v-model="mdCode" size="md" :length="6" />
                <AppPinInput v-model="errorCode" :length="6" error />
                <AppPinInput :model-value="'1234'" :length="4" disabled />
            </div>
        </DemoBlock>

        <DemoBlock title="键盘类型"
            description="keyboard 控制移动端虚拟键盘：numeric 为数字键盘，alphanumeric 使用密码框强制英文 26 键并只接受字母数字，text 跟随系统语言；auto 会按 type / numeric 自动判断。">
            <div class="doc_stack">
                <AppPinInput v-model="numericKeyboardCode" :length="6" keyboard="numeric" />
                <AppPinInput v-model="textKeyboardCode" :length="6" keyboard="alphanumeric" />
            </div>
        </DemoBlock>

        <DemoBlock title="宽度自适应"
            description="默认按 size 输出固定正方形；width 设置总宽度，fluid 撑满父容器，格子随总宽度和位数均分并保持正方形。">
            <div class="doc_stack">
                <AppPinInput v-model="widthCode" :length="6" width="min(360px, 100%)" />
                <div class="doc_pin_fluid">
                    <AppPinInput v-model="fluidCode" :length="4" fluid />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="完成回调" description="六位填满后输出 complete，可以直接提交。">
            <AppPinInput v-model="submitCode" :length="6" @complete="OnComplete" />
            <p class="wa_hint doc_gap">提交状态：{{ submitted || '等待输入' }}</p>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="方法" kind="values" :rows="methodRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const code = ref('')
const numberCode = ref('')
const secretCode = ref('')
const mdCode = ref('')
const errorCode = ref('12')
const numericKeyboardCode = ref('')
const textKeyboardCode = ref('')
const widthCode = ref('')
const fluidCode = ref('')
const submitCode = ref('')
const submitted = ref('')

function OnComplete(value) {
    submitted.value = `已提交 ${value}`
}

const propsRows = [
    { name: 'modelValue', type: 'string', default: "''", desc: '完整验证码字符串' },
    { name: 'length', type: 'number', default: '6', desc: '验证码位数' },
    { name: 'type', type: 'text | number | password', default: 'text', desc: '输入类型；number 只接受数字' },
    { name: 'keyboard', type: 'auto | text | alphanumeric | numeric | tel', default: 'auto', desc: '虚拟键盘类型；alphanumeric 用密码框强制英文 26 键并只接受字母数字，numeric 默认只允许数字' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '固定正方形格子的基准尺寸' },
    { name: 'width', type: 'number | string', default: 'null', desc: '验证码总宽度；数字按 px，格子随宽度与位数均分并保持正方形' },
    { name: 'fluid', type: 'boolean', default: 'false', desc: '撑满父容器，格子随容器宽度与位数自适应' },
    { name: 'numeric', type: 'boolean', default: 'type=number / keyboard=numeric 时自动开启', desc: '只允许数字，传 false 可显式关闭' },
    { name: 'autofocus', type: 'boolean', default: 'false', desc: '挂载后聚焦第一格' },
    { name: 'error', type: 'boolean | string', default: 'false', desc: '校验失败态；字符串时显示具体错误文本' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用全部输入' },
    { name: 'ariaLabel', type: 'string', default: "'验证码'", desc: '无障碍名称' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '任意一位变化' },
    { name: 'change', type: 'string', desc: '任意一位变化，与 v-model 同步' },
    { name: 'complete', type: 'string', desc: '所有位都填满时触发' },
]

const methodRows = [
    { name: 'focus()', desc: '聚焦第一个未填写的位置；全部填满时聚焦最后一格' },
    { name: 'clear()', desc: '清空全部输入并触发 change' },
]
</script>

<style>
.doc_pin_fluid {
    width: 100%;
    max-width: 300px;
    min-width: 0;
}
</style>
