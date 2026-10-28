<template>
    <DocPage category="加载" name="AppSpinner" title="加载圈" description="行内加载指示，使用 currentColor，跟随父级文字颜色。">
        <DemoBlock title="尺寸" description="size 接受数字或字符串。" :code="sizeCode">
            <div class="doc_row">
                <AppSpinner :size="14" />
                <AppSpinner :size="20" />
                <AppSpinner :size="28" />
            </div>
        </DemoBlock>

        <DemoBlock title="在按钮与文本中使用" description="AppButton 的 loading 已内置加载圈。" :code="inlineCode">
            <div class="doc_row">
                <AppButton variant="primary" loading>加载中</AppButton>
                <span class="wa_hint"><AppSpinner :size="14" /> 正在同步</span>
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
]

const sizeCode = `<AppSpinner :size="14" />
<AppSpinner :size="20" />
<AppSpinner :size="28" />`

const inlineCode = `<AppButton variant="primary" loading>加载中</AppButton>
<span><AppSpinner :size="14" /> 正在同步</span>`
</script>
