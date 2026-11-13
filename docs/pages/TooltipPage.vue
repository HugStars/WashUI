<template>
    <DocPage category="反馈" name="AppTooltip" title="文字提示"
        description="模拟浏览器 title 的悬停提示：延迟出现、移出即隐藏、空间不足时自动翻转。默认出现在下方偏右，亮色主题深底白字、暗色主题浅底深字。">
        <DemoBlock title="基础" description="把触发元素放进默认插槽，content 提供提示文本；默认延迟 120ms。">
            <div class="doc_row">
                <AppTooltip content="这是一个文字提示">
                    <AppButton size="sm">悬停查看</AppButton>
                </AppTooltip>
                <AppTooltip content="也可以放在文本上">
                    <span class="doc_tooltip_text">悬停这段文字</span>
                </AppTooltip>
            </div>
        </DemoBlock>

        <DemoBlock title="方向与延迟" description="placement 控制优先方向，空间不足时自动翻转；delay 调整出现前的等待时间。">
            <div class="doc_row">
                <AppTooltip content="默认显示在上方" placement="top">
                    <AppButton size="sm" variant="line">top</AppButton>
                </AppTooltip>
                <AppTooltip content="优先显示在下方" placement="bottom">
                    <AppButton size="sm" variant="line">bottom</AppButton>
                </AppTooltip>
                <AppTooltip content="等待 500ms 后出现" :delay="500">
                    <AppButton size="sm" variant="line">delay 500</AppButton>
                </AppTooltip>
            </div>
        </DemoBlock>

        <DemoBlock title="对齐方式"
            description="placement 默认 bottom、align 默认 end，即优先出现在右下方；当面板宽度超出触发元素时，左边缘会与触发元素左侧对齐。">
            <div class="doc_row">
                <AppTooltip content="默认右下角，超宽时左侧对齐" :max-width="240">
                    <AppButton size="sm" variant="line">默认对齐</AppButton>
                </AppTooltip>
                <AppTooltip content="居中对齐" align="center">
                    <AppButton size="sm" variant="line">center</AppButton>
                </AppTooltip>
                <AppTooltip content="左侧对齐" align="start">
                    <AppButton size="sm" variant="line">start</AppButton>
                </AppTooltip>
            </div>
        </DemoBlock>

        <DemoBlock title="铺满容器" description="fill 让触发器宽度铺满父容器，适合表格单元格或整行设置项。">
            <div class="doc_tooltip_fill_demo">
                <AppTooltip fill content="悬停整行内容">
                    <span class="doc_tooltip_row">整行都可以触发提示</span>
                </AppTooltip>
            </div>
        </DemoBlock>

        <DemoBlock title="自定义内容" description="content 插槽可以放图标、格式化文本等；默认插槽只负责触发。">
            <AppTooltip>
                <AppButton size="sm" variant="line">自定义内容</AppButton>
                <template #content>
                    <span class="doc_tooltip_custom">提示内容 <b>加粗</b></span>
                </template>
            </AppTooltip>
        </DemoBlock>

        <DemoBlock title="禁用" description="disabled 时不再响应悬停和聚焦。">
            <AppTooltip content="不会显示" disabled>
                <AppButton size="sm" disabled>禁用提示</AppButton>
            </AppTooltip>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const propsRows = [
    { name: 'content', type: 'string', default: "''", desc: '提示文本；content 插槽优先' },
    { name: 'placement', type: 'top | bottom', default: 'bottom', desc: '优先显示方向，空间不足时自动翻转' },
    { name: 'align', type: 'start | center | end', default: 'end', desc: '水平对齐；end 为右对齐，面板超宽时左边缘与触发器对齐' },
    { name: 'delay', type: 'number', default: '120', desc: '悬停多久后出现，单位 ms；0 表示立即' },
    { name: 'gap', type: 'number', default: '6', desc: '面板与触发器之间的间距' },
    { name: 'maxWidth', type: 'number | string', default: '280', desc: '面板最大宽度，数字按 px 处理' },
    { name: 'fill', type: 'boolean', default: 'false', desc: '触发器铺满父容器宽度' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用提示' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '触发元素；鼠标悬停或内部元素聚焦时显示' },
    { name: 'content', type: '—', desc: '自定义提示内容，优先于 content' },
]
</script>

<style>
.doc_tooltip_text {
    border-bottom: 1px dashed var(--wa_color_text_faint);
    color: var(--wa_color_text_muted);
    cursor: help;
}

.doc_tooltip_fill_demo {
    width: min(360px, 100%);
    padding: 10px 12px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}

.doc_tooltip_row {
    display: block;
    color: var(--wa_color_text_muted);
    font-size: 13px;
    cursor: help;
}

.doc_tooltip_custom {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
}
</style>
