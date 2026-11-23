<template>
    <DocPage category="表单" name="AppColorPicker" title="颜色选择"
        description="自绘颜色弹层，支持 HEX / RGB / HSL、色相与明度拖拽、预设色和校验。">
        <DemoBlock title="基础" description="默认输出 HEX；点击触发按钮打开颜色面板。">
            <AppColorPicker v-model="color" label="主题色" />
            <p class="wa_hint doc_gap">当前：{{ color || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="输出格式" description="format 控制输出：hex / rgb / hsl。">
            <div class="doc_color_row">
                <AppColorPicker v-model="hexColor" label="HEX" format="hex" />
                <AppColorPicker v-model="rgbColor" label="RGB" format="rgb" />
                <AppColorPicker v-model="hslColor" label="HSL" format="hsl" />
            </div>
            <p class="wa_hint doc_gap">{{ hexColor }} · {{ rgbColor }} · {{ hslColor }}</p>
        </DemoBlock>

        <DemoBlock title="自定义预设" description="presets 接受任意可解析的颜色字符串。">
            <AppColorPicker v-model="presetColor" label="品牌色"
                :presets="['#05cfa4', '#14b8a6', '#6366f1', '#f97316', '#ec4899', '#111827']" />
        </DemoBlock>

        <DemoBlock title="校验与禁用" description="rule 与 AppInput 一致；disabled 禁用整个控件。">
            <div class="doc_color_row">
                <AppColorPicker v-model="requiredColor" label="必填"
                    :rule="{ required: true, message: '请选择颜色' }" />
                <AppColorPicker :model-value="'#05cfa4'" label="禁用" disabled />
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const color = ref('')
const hexColor = ref('#05cfa4')
const rgbColor = ref('rgb(5, 207, 164)')
const hslColor = ref('hsl(169, 95%, 42%)')
const presetColor = ref('#05cfa4')
const requiredColor = ref('')

const propsRows = [
    { name: 'modelValue', type: 'string', default: "''", desc: '颜色字符串，格式由 format 决定' },
    { name: 'label', type: 'string', default: "''", desc: '字段标签' },
    { name: 'placeholder', type: 'string', default: "'请选择颜色'", desc: '未选择颜色时的占位文案' },
    { name: 'ariaLabel', type: 'string', default: "'颜色选择'", desc: '没有 label 时的无障碍名称' },
    { name: 'format', type: 'hex | rgb | hsl', default: 'hex', desc: '输出格式' },
    { name: 'presets', type: 'Array', default: '内置 8 色', desc: '预设颜色，支持 HEX / RGB / HSL' },
    { name: 'hint / error', type: 'string', default: "''", desc: '提示与错误；错误优先' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '控件尺寸' },
    { name: 'rule', type: 'object | array', default: 'null', desc: '校验规则，与 AppInput 一致' },
    { name: 'disabled / readonly', type: 'boolean', default: 'false', desc: '禁用或只读' }
]

const eventRows = [
    { name: 'update:modelValue', type: 'string', desc: '颜色变化' },
    { name: 'change', type: 'string', desc: '颜色变化或点击预设色' }
]
</script>

<style>
.doc_color_row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}

@media (max-width: 860px) {
    .doc_color_row {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
