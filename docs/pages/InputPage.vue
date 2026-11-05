<template>
    <DocPage category="表单" name="AppInput" title="输入框"
        description="带标签、提示与校验的输入框，支持前后缀、清空、尺寸、禁用与只读；rule 支持 required、长度、正则和自定义 validator。">
        <DemoBlock title="基础" description="hint 显示在输入框下方；rule 校验失败会替换 hint，error 仍可手动覆盖。">
            <div class="doc_grid">
                <AppInput v-model="name" label="名称" placeholder="例如：生产环境" hint="用于标识当前环境" clearable />
                <AppInput v-model="invalid" label="校验" placeholder="输入任意内容" :rule="requiredRule" />
            </div>
        </DemoBlock>

        <DemoBlock title="前缀、后缀与清空" description="前后缀通过插槽传入，clearable 在有值时显示清空按钮。">
            <div class="doc_grid">
                <AppInput v-model="endpoint" label="地址" placeholder="https://example.com" clearable>
                    <template #prefix>
                        <AppIcon name="link" :size="15" />
                    </template>
                </AppInput>
                <AppInput v-model="timeout" label="超时" placeholder="3000">
                    <template #suffix>
                        <span class="wa_hint">ms</span>
                    </template>
                </AppInput>
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸、类型与状态"
            description="默认小尺寸，传 size=md 可放大；其余原生属性会透传到 input。密码输入建议放在 form 中，避免浏览器密码管理器警告。">
            <div class="doc_grid">
                <form class="doc_form_reset" @submit.prevent>
                    <AppInput v-model="token" label="密钥" type="password" placeholder="请输入密钥"
                        autocomplete="new-password" clearable />
                </form>
                <AppInput v-model="small" label="中尺寸" size="md" placeholder="md" />
                <AppInput model-value="只读内容" label="只读" readonly />
                <AppInput model-value="禁用内容" label="禁用" disabled />
            </div>
        </DemoBlock>

        <DemoBlock title="磨砂" description="frosted 使用与 AppPopover 一致的玻璃表面与模糊。">
            <div class="doc_frosted_stage">
                <div class="doc_grid">
                    <AppInput v-model="frostedValue" label="磨砂输入框" placeholder="输入内容" clearable frosted />
                    <AppInput v-model="frostedInvalid" label="磨砂 + 校验" placeholder="失焦后校验" :rule="requiredRule"
                        frosted />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="校验规则"
            description="rule 支持 required、min、max、pattern、validator 与自定义 message；失焦或触发对应 trigger 时自动校验，error 仍可手动覆盖。">
            <div class="doc_grid">
                <AppInput v-model="ruleName" label="用户名" placeholder="2-12 个字符" :rule="nameRule"
                    hint="失焦后校验" />
                <AppInput v-model="ruleEmail" label="邮箱" placeholder="name@example.com" :rule="emailRule" />
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
import { AppInput } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const name = ref('')
const invalid = ref('')
const endpoint = ref('')
const timeout = ref('3000')
const token = ref('')
const small = ref('')
const frostedValue = ref('')
const frostedInvalid = ref('')
const ruleName = ref('')
const ruleEmail = ref('')

const requiredRule = { required: true, message: '该字段不能为空' }
const nameRule = { required: true, min: 2, max: 12, message: '请输入 2-12 个字符' }
const emailRule = { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱地址' }

const propsRows = [
    { name: 'modelValue', type: 'string | number', default: "''", desc: '输入值' },
    { name: 'label', type: 'string', default: "''", desc: '标签文案' },
    { name: 'hint', type: 'string', default: "''", desc: '提示文案' },
    { name: 'error', type: 'string', default: "''", desc: '错误文案，优先于 hint' },
    { name: 'rule', type: 'Object | Array', default: 'null', desc: '校验规则；支持 required、min、max、pattern、validator、message、trigger' },
    { name: 'type', type: 'string', default: 'text', desc: '原生 input type' },
    { name: 'size', type: 'string', default: 'sm', desc: '默认 sm，可选 md' },
    { name: 'clearable', type: 'boolean', default: 'false', desc: '显示清空按钮' },
    { name: 'frosted', type: 'boolean', default: 'false', desc: '白色磨砂半透明表面，与 AppPopover 一致' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '输入值变化' },
    { name: 'clear', type: '—', desc: '点击清空按钮' },
]

const slotRows = [
    { name: 'label', type: '—', desc: '自定义标签' },
    { name: 'prefix', type: '—', desc: '输入框前缀' },
    { name: 'suffix', type: '—', desc: '输入框后缀' },
]
</script>

<style>
.doc_form_reset {
    display: contents;
}
</style>
