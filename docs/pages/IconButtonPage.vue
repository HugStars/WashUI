<template>
    <DocPage category="基础" name="AppIconButton" title="图标按钮"
        description="只承载图标的独立按钮，支持 xs / sm / md / lg 尺寸、描边、磨砂、选中与加载态。图标尺寸默认跟随按钮尺寸，也可以用 iconSize 单独覆盖。">
        <DemoBlock title="尺寸" description="xs / sm / md / lg 对应 24 / 28 / 32 / 36 的正方形按钮，图标尺寸自动适配。">
            <div class="doc_row">
                <AppIconButton name="settings" label="设置" size="xs" />
                <AppIconButton name="settings" label="设置" size="sm" />
                <AppIconButton name="settings" label="设置" size="md" />
                <AppIconButton name="settings" label="设置" size="lg" />
            </div>
        </DemoBlock>

        <DemoBlock title="类型" description="ghost 透明底、line 描边、solid 主按钮、danger 危险操作。">
            <div class="doc_row">
                <AppIconButton name="refresh" label="刷新" variant="ghost" />
                <AppIconButton name="chevron" label="查看" variant="line" />
                <AppIconButton name="play-fill" label="运行" variant="solid" />
                <AppIconButton name="trash" label="删除" variant="danger" />
            </div>
        </DemoBlock>

        <DemoBlock title="磨砂" description="frosted 使用与 AppPopover 一致的白色磨砂半透明表面，可和 line 组合。">
            <div class="doc_frosted_stage">
                <div class="doc_row">
                    <AppIconButton name="settings" label="设置" frosted />
                    <AppIconButton name="chevron" label="查看" variant="line" frosted />
                    <AppIconButton name="close" label="关闭" variant="line" frosted />
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="状态" description="active 表示选中/开启；loading 时显示加载圈并禁用点击；disabled 为禁用态。">
            <div class="doc_row">
                <AppIconButton name="star" label="收藏" active />
                <AppIconButton name="refresh" label="刷新" loading />
                <AppIconButton name="trash" label="删除" disabled />
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const propsRows = [
    { name: 'name', type: 'string', default: "''", desc: '内置图标名称' },
    { name: 'icon', type: 'IconNode[] | string', default: '—', desc: '直接传图标数据，优先级高于 name' },
    { name: 'label', type: 'string', default: "''", desc: '无障碍名称，同时作为 title' },
    { name: 'ariaLabel', type: 'string', default: "''", desc: 'label 未填写时使用' },
    { name: 'iconSize', type: 'number | string', default: '跟随 size', desc: '图标尺寸，覆盖按按钮尺寸自动计算的值' },
    { name: 'size', type: 'xs | sm | md | lg', default: 'sm', desc: '按钮尺寸，对应 24 / 28 / 32 / 36px' },
    { name: 'variant', type: 'ghost | line | solid | danger', default: 'ghost', desc: '视觉类型' },
    { name: 'type', type: 'button | submit | reset', default: 'button', desc: '原生 button type' },
    { name: 'frosted', type: 'boolean', default: 'false', desc: '白色磨砂半透明表面' },
    { name: 'active', type: 'boolean', default: 'false', desc: '选中/开启态，同时输出 aria-pressed' },
    { name: 'loading', type: 'boolean', default: 'false', desc: '显示加载圈并自动禁用' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
]

const eventRows = [
    { name: 'click', type: 'MouseEvent', desc: '原生点击事件' },
]
</script>
