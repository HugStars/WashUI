<template>
    <DocPage category="加载" name="AppSpinner" title="加载指示" description="行内加载指示，使用 currentColor，跟随父级文字颜色；dot 模式直接渲染一个呼吸绿点，不显示旋转圈。">
        <DemoBlock title="尺寸" description="size 接受数字或字符串。">
            <div class="doc_row">
                <AppSpinner :size="14" />
                <AppSpinner :size="20" />
                <AppSpinner :size="28" />
            </div>
        </DemoBlock>

        <DemoBlock title="在按钮与文本中使用" description="AppButton 的 loading 已内置加载圈。">
            <div class="doc_row">
                <AppButton variant="primary" loading>加载中</AppButton>
                <span class="wa_hint"><AppSpinner :size="14" /> 正在同步</span>
            </div>
        </DemoBlock>

        <DemoBlock title="状态点"
            description="dot 直接渲染一个呼吸绿点，不显示旋转加载圈，适合在线状态场景；size 同时控制点的占位大小。">
            <div class="doc_row">
                <AppSpinner dot :size="16" />
                <AppSpinner dot :size="22" />
                <span class="wa_hint"><AppSpinner dot :size="14" /> 在线 </span>
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const propsRows = [
    { name: 'size', type: 'number | string', default: '20', desc: '宽高，数字自动补 px' },
    { name: 'dot', type: 'boolean', default: 'false', desc: '直接渲染呼吸绿点，不显示旋转加载圈' },
]
</script>
