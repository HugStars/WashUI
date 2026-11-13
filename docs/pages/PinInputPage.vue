<template>
    <DocPage category="表单" name="AppPinInput" title="验证码输入"
        description="逐格输入的验证码组件，支持自动跳格、退格回退、方向键、整段粘贴、密码模式与完成回调。">
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
const submitCode = ref('')
const submitted = ref('')

function OnComplete(value) {
    submitted.value = `已提交 ${value}`
}

const propsRows = [
    { name: 'modelValue', type: 'string', default: "''", desc: '完整验证码字符串' },
    { name: 'length', type: 'number', default: '6', desc: '验证码位数' },
    { name: 'type', type: 'text | number | password', default: 'text', desc: '输入类型；number 只接受数字' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '格子尺寸' },
    { name: 'numeric', type: 'boolean', default: 'type=number 时自动开启', desc: '只允许数字，可显式覆盖' },
    { name: 'autofocus', type: 'boolean', default: 'false', desc: '挂载后聚焦第一格' },
    { name: 'error', type: 'boolean', default: 'false', desc: '校验失败态' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用全部输入' },
    { name: 'ariaLabel', type: 'string', default: "'验证码'", desc: '无障碍名称' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '任意一位变化' },
    { name: 'change', type: 'string', desc: '任意一位变化，与 v-model 同步' },
    { name: 'complete', type: 'string', desc: '所有位都填满时触发' },
]

const methodRows = [
    { name: 'focus()', desc: '聚焦第一格' },
    { name: 'clear()', desc: '清空全部输入并触发 change' },
]
</script>
