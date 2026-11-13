<template>
    <DocPage category="表单" name="AppSlider" title="滑块" description="在连续区间内选择数值。支持步长吸附、键盘操作、数值展示与两种尺寸。">
        <DemoBlock title="基础" description="v-model 绑定数值，suffix 追加单位。数值默认悬停时显示，避免平时占用视觉。">
            <div class="doc_slider_stack">
                <AppSlider v-model="volume" label="音量" suffix="%" />
                <p class="wa_hint">悬停轨道查看百分比，当前：{{ volume }}%</p>
            </div>
        </DemoBlock>

        <DemoBlock title="数值显示" description="value-display 控制数值：hover 悬停显示（默认）、always 常显、none 不占位。value-gap 控制数值与轨道的间距。">
            <div class="doc_slider_stack">
                <AppSlider v-model="hoverValue" label="悬停显示（默认）" suffix="%" />
                <AppSlider v-model="alwaysValue" label="常显" suffix="%" value-display="always" />
                <AppSlider v-model="noneValue" label="不显示" />
                <AppSlider v-model="gapValue" label="间距 20px" suffix="%"
                    value-display="always" :value-gap="20" />
            </div>
        </DemoBlock>

        <DemoBlock title="范围与步长" description="min / max 控制区间，step 控制每次变化的最小单位；不在步长上的值会自动吸附。">
            <div class="doc_slider_stack">
                <AppSlider v-model="ratio" :min="0" :max="1" :step="0.1" label="缩放比例"
                    value-display="always" :format="value => `${Math.round(value * 100)}%`" />
                <AppSlider v-model="price" :min="0" :max="1000" :step="50" label="预算"
                    value-display="always" suffix=" 元" />
            </div>
        </DemoBlock>

        <DemoBlock title="允许区间" description="allowed-ranges 控制可设置的范围：传单个区间 [20, 80]，或多段区间 [[0, 20], [80, 100]]。禁用区会变深，点击、拖动和键盘都会停在边界。">
            <div class="doc_slider_stack">
                <AppSlider v-model="allowedValue" label="只能 20-80" :allowed-ranges="[20, 80]"
                    value-display="always" suffix="%" />
                <AppSlider v-model="multiAllowed" label="只允许两端" :allowed-ranges="[[0, 20], [80, 100]]"
                    value-display="always" />
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸" description="默认 md 使用 6px 轨道与 20px 圆点；size=sm 更适合紧凑的工具条。">
            <div class="doc_slider_stack">
                <AppSlider v-model="medium" label="默认 md" value-display="always" />
                <AppSlider v-model="small" label="sm 紧凑尺寸" value-display="always" size="sm" />
            </div>
        </DemoBlock>

        <DemoBlock title="无标签与禁用" description="不传 label 时只渲染轨道；disabled 会阻止指针与键盘操作。">
            <div class="doc_slider_stack">
                <AppSlider v-model="bare" suffix="%" />
                <AppSlider v-model="disabledValue" label="禁用状态" value-display="always" disabled />
            </div>
        </DemoBlock>

        <DemoBlock title="自定义标签" description="label 插槽可以放图标和说明文字。">
            <div class="doc_slider_stack">
                <AppSlider v-model="speed" value-display="always" suffix=" km/h">
                    <template #label>
                        <span class="doc_slider_label">
                            <AppIcon name="speed" :size="15" />
                            <span>行驶速度</span>
                        </span>
                    </template>
                </AppSlider>
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

const volume = ref(40)
const hoverValue = ref(30)
const alwaysValue = ref(60)
const noneValue = ref(50)
const gapValue = ref(70)
const ratio = ref(0.6)
const price = ref(300)
const allowedValue = ref(50)
const multiAllowed = ref(90)
const small = ref(30)
const medium = ref(60)
const bare = ref(75)
const disabledValue = ref(45)
const speed = ref(80)

const propsRows = [
    { name: 'modelValue', type: 'number', default: '0', desc: '当前值，支持 v-model' },
    { name: 'min', type: 'number', default: '0', desc: '最小值' },
    { name: 'max', type: 'number', default: '100', desc: '最大值' },
    { name: 'allowedRanges', type: '[number, number] | Array<[number, number]>', default: '[]', desc: '允许选择的区间；空数组表示全范围' },
    { name: 'step', type: 'number', default: '1', desc: '步长，同时决定小数精度' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用指针与键盘操作' },
    { name: 'label', type: 'string', default: "''", desc: '标签文本；为空时不渲染标签' },
    { name: 'hideLabel', type: 'boolean', default: 'false', desc: '视觉隐藏标签，但保留无障碍名称' },
    { name: 'showValue', type: 'boolean', default: 'false', desc: '兼容旧写法；为 true 时等价于 valueDisplay="always"' },
    { name: 'valueDisplay', type: 'hover | always | none', default: 'hover', desc: '数值显示方式：悬停显示 / 常显 / 不占位' },
    { name: 'valueGap', type: 'number | string', default: '10', desc: '轨道与数值之间的间距，数字按 px 处理' },
    { name: 'format', type: 'function', default: 'null', desc: '自定义数值格式，参数为当前值' },
    { name: 'suffix', type: 'string', default: "''", desc: '数值后缀，例如 % 或 元' },
    { name: 'ariaLabel', type: 'string', default: "''", desc: '无可见标签时的无障碍名称' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '控件尺寸' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'number', desc: '拖动或键盘操作时持续触发' },
    { name: 'change', type: 'number', desc: '拖动结束、点击轨道或键盘提交时触发' },
]

const slotRows = [
    { name: 'label', type: '-', desc: '自定义标签内容，可放图标和文字' },
]
</script>

<style>
.doc_slider_stack {
    display: grid;
    gap: 18px;
    width: 100%;
    max-width: 420px;
}

.doc_slider_label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}
</style>
