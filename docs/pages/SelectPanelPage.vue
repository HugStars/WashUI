<template>
    <DocPage category="表单" name="AppSelectPanel" title="下拉面板"
        description="下拉框使用的选项面板。可独立使用，也可配合 AppPopover 自定义触发器；支持分组、自定义宽度、选中标记、尺寸与空状态。">
        <DemoBlock title="独立使用" description="不依赖浮层，直接作为普通选项列表；宽度由父容器决定。" :code="standaloneCode">
            <div class="doc_panel_box">
                <AppSelectPanel :options="basicOptions" :model-value="singleValue"
                    @select="item => singleValue = item.value" />
            </div>
            <p class="wa_hint doc_gap">当前：{{ singleValue || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="分组" description="groups 按标题分组渲染，组间距与选项间距、垂直内边距保持一致。" :code="groupCode">
            <div class="doc_panel_box">
                <AppSelectPanel :groups="groups" :model-value="groupValue"
                    @select="item => groupValue = item.value" />
            </div>
            <p class="wa_hint doc_gap">当前：{{ groupValue || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="配合 AppPopover" description="触发元素由业务层决定，面板负责选项、选中态与空状态。" :code="popoverCode">
            <AppPopover placement="bottom" :width="240" :padding="6" role="listbox" aria-label="选择环境">
                <template #trigger="{ open }">
                    <AppButton variant="line" :aria-expanded="open">选择环境</AppButton>
                </template>
                <template #default="{ close }">
                    <AppSelectPanel :options="basicOptions" :model-value="popoverValue"
                        @select="item => pick(item, close)" />
                </template>
            </AppPopover>
            <p class="wa_hint doc_gap">当前：{{ popoverValue || '未选择' }}</p>
        </DemoBlock>

        <DemoBlock title="自定义宽度" description="面板默认填满父容器；放在浮层中时也可以由 AppPopover 的 width 控制。" :code="widthCode">
            <div class="doc_panel_widths">
                <div class="doc_panel_narrow">
                    <AppSelectPanel :options="basicOptions" :model-value="narrowValue"
                        @select="item => narrowValue = item.value" />
                </div>
                <div class="doc_panel_wide">
                    <AppSelectPanel :options="basicOptions" :model-value="wideValue"
                        @select="item => wideValue = item.value" />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="选中标记"
            description="checkIcon 控制选中项标记：默认 ✓、false 关闭、短字符按文本显示、长名称按图标名渲染；checkPosition 控制标记在标签前或后。"
            :code="checkCode">
            <div class="doc_grid">
                <div>
                    <p class="doc_panel_caption">默认 ✓</p>
                    <AppSelectPanel :options="basicOptions" :model-value="markDefault"
                        @select="item => markDefault = item.value" />
                </div>
                <div>
                    <p class="doc_panel_caption">关闭</p>
                    <AppSelectPanel :options="basicOptions" :model-value="markNone" :check-icon="false"
                        @select="item => markNone = item.value" />
                </div>
                <div>
                    <p class="doc_panel_caption">自定义字符</p>
                    <AppSelectPanel :options="basicOptions" :model-value="markDot" check-icon="●"
                        @select="item => markDot = item.value" />
                </div>
                <div>
                    <p class="doc_panel_caption">图标名</p>
                    <AppSelectPanel :options="basicOptions" :model-value="markIcon" check-icon="check"
                        @select="item => markIcon = item.value" />
                </div>
                <div>
                    <p class="doc_panel_caption">标记在前</p>
                    <AppSelectPanel :options="basicOptions" :model-value="markBefore" check-icon="check"
                        check-position="before" @select="item => markBefore = item.value" />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸" description="默认小尺寸；size=md 时选项间距、内边距与滚动条更宽松。" :code="sizeCode">
            <div class="doc_grid">
                <div>
                    <p class="doc_panel_caption">默认（sm）</p>
                    <AppSelectPanel :options="basicOptions" :model-value="defaultPanel"
                        @select="item => defaultPanel = item.value" />
                </div>
                <div>
                    <p class="doc_panel_caption">md</p>
                    <AppSelectPanel :options="basicOptions" :model-value="mdPanel" size="md"
                        @select="item => mdPanel = item.value" />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="空状态" description="没有可用选项时显示 emptyText。" :code="emptyCode">
            <div class="doc_panel_box">
                <AppSelectPanel :options="[]" empty-text="暂无组件可选" />
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
import { AppSelectPanel } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const singleValue = ref('dev')
const groupValue = ref('button')
const popoverValue = ref('dev')
const narrowValue = ref('dev')
const wideValue = ref('dev')
const markDefault = ref('dev')
const markNone = ref('dev')
const markDot = ref('dev')
const markIcon = ref('dev')
const markBefore = ref('dev')
const defaultPanel = ref('dev')
const mdPanel = ref('dev')

const basicOptions = [
    { label: '开发环境', value: 'dev' },
    { label: '预发布环境', value: 'stage' },
    { label: '生产环境', value: 'prod' },
]

const groups = [
    {
        label: '基础',
        options: [
            { label: '按钮 AppButton', value: 'button' },
            { label: '卡片 AppCard', value: 'card' },
            { label: '标记 AppChip', value: 'chip' },
        ],
    },
    {
        label: '表单',
        options: [
            { label: '输入框 AppInput', value: 'input' },
            { label: '下拉框 AppSelect', value: 'select' },
            { label: '下拉面板 AppSelectPanel', value: 'select-panel' },
        ],
    },
]

function pick(item, close) {
    if (item.disabled) return
    popoverValue.value = item.value
    close()
}

const propsRows = [
    { name: 'modelValue', type: 'string | number | symbol', default: "''", desc: '选中值' },
    { name: 'options', type: 'Array<{ label, value, disabled, icon, badge }>', default: '[]', desc: '普通选项，icon 配合 iconComponent 使用；badge 支持 { text, dot, tone, max }' },
    { name: 'groups', type: 'Array<{ label, options }>', default: '[]', desc: '分组选项，组内 options 结构同上' },
    { name: 'emptyText', type: 'string', default: '暂无选项', desc: '空状态文案' },
    { name: 'size', type: 'md | sm', default: 'sm', desc: '默认小尺寸，md 时选项间距、内边距与滚动条更宽松' },
    { name: 'checkIcon', type: 'boolean | string', default: 'true', desc: '选中标记：true 显示 ✓，false 关闭，字符串按字符或图标名渲染' },
    { name: 'checkPosition', type: 'before | after', default: 'after', desc: '选中标记在标签前或后' },
    { name: 'iconComponent', type: 'Component', default: 'AppIcon', desc: '选项图标与 checkIcon 图标名所用的组件，默认内置 AppIcon，可覆盖' },
]

const eventRows = [
    { name: 'select', type: 'option', desc: '点击可用选项时返回选项对象' },
]

const standaloneCode = `<div style="max-width: 240px">
    <AppSelectPanel :options="options" :model-value="value" @select="item => value = item.value" />
</div>`

const groupCode = `<AppSelectPanel :groups="groups" :model-value="value" @select="item => value = item.value" />

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
]`

const popoverCode = `<AppPopover placement="bottom" :width="240" :padding="6" role="listbox" aria-label="选择环境">
    <template #trigger="{ open }">
        <AppButton variant="line" :aria-expanded="open">选择环境</AppButton>
    </template>
    <template #default="{ close }">
        <AppSelectPanel :options="options" :model-value="value" @select="item => pick(item, close)" />
    </template>
</AppPopover>`

const widthCode = `<!-- 面板宽度跟随父容器 -->
<div style="width: 190px">
    <AppSelectPanel :options="options" :model-value="narrow" />
</div>

<div style="width: 360px">
    <AppSelectPanel :options="options" :model-value="wide" />
</div>`

const checkCode = `<!-- 默认 ✓ -->
<AppSelectPanel :options="options" :model-value="value" />

<!-- 关闭 -->
<AppSelectPanel :options="options" :model-value="value" :check-icon="false" />

<!-- 自定义字符 -->
<AppSelectPanel :options="options" :model-value="value" check-icon="●" />

<!-- 图标名：默认由内置 AppIcon 渲染 -->
<AppSelectPanel :options="options" :model-value="value" check-icon="check" />`

const sizeCode = `<AppSelectPanel :options="options" :model-value="value" />
<AppSelectPanel :options="options" :model-value="value" size="md" />`

const emptyCode = `<AppSelectPanel :options="[]" empty-text="暂无组件可选" />`
</script>

<style>
.doc_panel_box {
    max-width: 240px;
}

.doc_panel_widths {
    display: grid;
    gap: 12px;
}

.doc_panel_narrow {
    width: 190px;
}

.doc_panel_wide {
    width: min(360px, 100%);
}

.doc_panel_caption {
    margin-bottom: 6px;
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}
</style>
