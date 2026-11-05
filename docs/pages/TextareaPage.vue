<template>
    <DocPage category="表单" name="AppTextarea" title="文本域"
        description="多行文本输入，属性与样式和 AppInput 对齐，支持 rows、cols、resize、字数统计、校验规则、尺寸、只读、禁用与磨砂表面。">
        <DemoBlock title="基础与字数统计"
            description="show-count 在底部右侧显示字数；有 maxlength 时显示当前/上限，没有时只显示当前字数。">
            <div class="doc_textarea_stack">
                <AppTextarea v-model="basic" label="备注" placeholder="输入备注内容..." hint="最多 200 字" :maxlength="200"
                    show-count />
                <AppTextarea v-model="countOnly" label="只显示字数" placeholder="没有 maxlength 时只显示当前字数" show-count />
            </div>
        </DemoBlock>

        <DemoBlock title="行数与列数" description="rows 控制初始行数；cols 透传给原生 textarea，实际宽度仍由父容器控制。">
            <div class="doc_textarea_grid">
                <AppTextarea v-model="short" label="rows=2" :rows="2" placeholder="两行文本域" />
                <AppTextarea v-model="tall" label="rows=6" :rows="6" placeholder="六行文本域" />
                <AppTextarea v-model="columns" label="cols=40" :rows="3" cols="40" placeholder="cols 透传" />
            </div>
        </DemoBlock>

        <DemoBlock title="缩放" description="resize 支持 none、both、horizontal、vertical，默认 none；缩放作用于整个文本域外壳，边框与背景会一起变化。">
            <div class="doc_textarea_grid">
                <AppTextarea v-model="resizeNone" label="none（默认）" resize="none" :rows="3" />
                <AppTextarea v-model="resizeBoth" label="both" resize="both" :rows="3" />
                <AppTextarea v-model="resizeHorizontal" label="horizontal" resize="horizontal" :rows="3" />
                <AppTextarea v-model="resizeVertical" label="vertical" resize="vertical" :rows="3" />
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸" description="默认 sm；size=md 使用更大的字号与内边距。">
            <div class="doc_textarea_grid">
                <AppTextarea v-model="small" label="默认 sm" :rows="3" placeholder="sm" />
                <AppTextarea v-model="medium" label="md" size="md" :rows="3" placeholder="md" />
            </div>
        </DemoBlock>

        <DemoBlock title="校验、只读与禁用" description="rule 校验失败会显示错误边框与文案；readonly 和 disabled 都会阻止编辑。">
            <div class="doc_textarea_grid">
                <AppTextarea v-model="invalid" label="校验" :rule="requiredRule" :rows="2" />
                <AppTextarea model-value="只读内容" label="只读" readonly :rows="2" />
                <AppTextarea model-value="禁用内容" label="禁用" disabled :rows="2" />
            </div>
        </DemoBlock>

        <DemoBlock title="校验规则" description="rule 在失焦后自动校验；show-count 同时显示字数统计。">
            <div class="doc_textarea_grid">
                <AppTextarea v-model="ruleText" label="反馈内容" :rows="3" :maxlength="200" show-count
                    :rule="textRule" hint="至少输入 5 个字" />
            </div>
        </DemoBlock>

        <DemoBlock title="磨砂" description="frosted 使用与 AppPopover 一致的玻璃表面与模糊。">
            <div class="doc_frosted_stage">
                <div class="doc_textarea_grid">
                    <AppTextarea v-model="frosted" label="磨砂文本域" :rows="3" placeholder="输入内容" frosted />
                    <AppTextarea v-model="frostedInvalid" label="磨砂 + 校验" :rule="requiredRule" :rows="2"
                        placeholder="失焦后校验" frosted />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="原生属性" description="placeholder、autocomplete、spellcheck、required、wrap、maxlength 等原生属性会透传到 textarea。">
            <AppTextarea v-model="wrapped" label="wrap=off" wrap="off" :rows="2" placeholder="关闭自动换行"
                autocomplete="off" spellcheck="false" />
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
import { AppTextarea } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const basic = ref('')
const countOnly = ref('')
const short = ref('')
const tall = ref('')
const columns = ref('')
const resizeNone = ref('')
const resizeBoth = ref('')
const resizeHorizontal = ref('')
const resizeVertical = ref('')
const small = ref('')
const medium = ref('')
const invalid = ref('')
const frosted = ref('')
const frostedInvalid = ref('')
const wrapped = ref('')
const ruleText = ref('')
const requiredRule = { required: true, message: '内容不能为空' }
const textRule = { required: true, min: 5, message: '至少输入 5 个字' }

const propsRows = [
    { name: 'modelValue', type: 'string | number', default: "''", desc: '输入值，支持 v-model' },
    { name: 'label', type: 'string', default: "''", desc: '标签文案' },
    { name: 'hint', type: 'string', default: "''", desc: '提示文案' },
    { name: 'error', type: 'string', default: "''", desc: '错误文案，优先于 hint' },
    { name: 'rule', type: 'Object | Array', default: 'null', desc: '校验规则；支持 required、min、max、pattern、validator、message、trigger' },
    { name: 'rows', type: 'number | string', default: '3', desc: '初始行数' },
    { name: 'cols', type: 'number | string', default: 'undefined', desc: '原生 cols；实际宽度由父容器控制' },
    { name: 'wrap', type: 'soft | hard | off', default: 'soft', desc: '原生换行方式' },
    { name: 'maxlength', type: 'number | string', default: 'undefined', desc: '原生最大长度' },
    { name: 'showCount', type: 'boolean', default: 'false', desc: '在底部右侧显示字数统计' },
    { name: 'resize', type: 'none | both | horizontal | vertical', default: 'none', desc: '拖动缩放方向' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '默认 sm，md 使用更大字号与内边距' },
    { name: 'frosted', type: 'boolean', default: 'false', desc: '白色磨砂半透明表面，与 AppPopover 一致' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
    { name: 'ariaLabel', type: 'string', default: '文本域', desc: '没有标签时的无障碍名称' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '输入值变化' },
]

const slotRows = [
    { name: 'label', type: '—', desc: '自定义标签' },
]
</script>

<style>
.doc_textarea_stack {
    display: grid;
    gap: 12px;
}

.doc_textarea_grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
    gap: 12px;
}
</style>
