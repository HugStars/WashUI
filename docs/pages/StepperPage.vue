<template>
    <DocPage category="表单" name="AppStepper" title="步进器"
        description="加减按钮与可输入数字结合的步进控件，适合描边宽度、数量、比例等需要精确微调的参数。">
        <DemoBlock title="基础" description="v-model 绑定数字；min、max 控制边界，到达边界时对应按钮自动禁用。">
            <div class="doc_stepper_stack">
                <div class="doc_row">
                    <AppStepper v-model="count" :min="0" :max="10" aria-label="数量" />
                    <span class="wa_hint">当前：{{ count }}</span>
                </div>
                <div class="doc_row">
                    <AppStepper v-model="bounded" :min="1" :max="5" aria-label="评分" />
                    <span class="wa_hint">1 – 5</span>
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="步长与精度" description="step 决定每次加减的幅度；precision 不传时按 step 的小数位自动推导。">
            <div class="doc_stepper_stack">
                <div class="doc_row">
                    <AppStepper v-model="stroke" :min="1" :max="3" :step="0.1" aria-label="描边宽度" />
                    <span class="wa_hint">描边宽度：{{ stroke.toFixed(1) }}</span>
                </div>
                <div class="doc_row">
                    <AppStepper v-model="ratio" :min="0" :max="100" :step="5" aria-label="比例" />
                    <span class="wa_hint">5% 步进</span>
                </div>
                <div class="doc_row">
                    <AppStepper v-model="precise" :min="0" :max="1" :step="0.001" :precision="3" aria-label="精度值" />
                    <span class="wa_hint">显示 3 位小数</span>
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸与禁用" description="size 支持 sm、md；disabled 禁用整组。">
            <div class="doc_stepper_stack">
                <div class="doc_row">
                    <AppStepper v-model="large" :min="0" :max="10" size="md" aria-label="大号步进器" />
                    <span class="wa_hint">md</span>
                </div>
                <div class="doc_row">
                    <AppStepper v-model="disabled" disabled aria-label="禁用步进器" />
                    <span class="wa_hint">disabled</span>
                </div>
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="rows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { AppStepper } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const count = ref(3)
const bounded = ref(3)
const stroke = ref(1.8)
const ratio = ref(40)
const precise = ref(0.618)
const large = ref(5)
const disabled = ref(2)

const rows = [
    { name: 'modelValue', type: 'number', default: '0', desc: '当前值，支持 v-model' },
    { name: 'min', type: 'number', default: '-Infinity', desc: '最小值，到达后减少按钮禁用' },
    { name: 'max', type: 'number', default: 'Infinity', desc: '最大值，到达后增加按钮禁用' },
    { name: 'step', type: 'number', default: '1', desc: '每次加减的步长' },
    { name: 'precision', type: 'number', default: 'null', desc: '显示小数位；不传时按 step 推导' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '控件尺寸' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整组控件' },
    { name: 'ariaLabel', type: 'string', default: '步进器', desc: '控件的无障碍名称' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'number', desc: '值变化时触发，支持 v-model' },
    { name: 'change', type: 'number', desc: '与 update:modelValue 同步' },
]
</script>

<style>
.doc_stepper_stack {
    display: grid;
    gap: 14px;
}
</style>
