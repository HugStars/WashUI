<template>
    <DocPage category="基础" name="AppEmpty" title="空状态" description="无数据时的占位，支持默认文案、自定义内容与操作按钮。">
        <DemoBlock title="基础" description="默认高度 420px，可以在宿主样式中按页面需要调整。" :code="baseCode">
            <AppEmpty class="doc_empty_demo" text="没有匹配的数据">
                <template #action>
                    <AppButton size="sm" variant="line" @click="toast.success('已重新加载')">重新加载</AppButton>
                </template>
            </AppEmpty>
        </DemoBlock>

        <DemoBlock title="自定义内容" description="默认插槽可以完全替换占位内容。" :code="slotCode">
            <AppEmpty class="doc_empty_demo">
                <AppIcon name="file" :size="30" />
                <p>还没有文件</p>
                <template #action>
                    <AppButton size="sm" variant="primary">上传文件</AppButton>
                </template>
            </AppEmpty>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { toast } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const propsRows = [
    { name: 'text', type: 'string', default: '暂无数据', desc: '默认文案' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '替换默认文案' },
    { name: 'action', type: '—', desc: '操作区内容' },
]

const baseCode = `<AppEmpty text="没有匹配的数据">
    <template #action>
        <AppButton size="sm" variant="line">重新加载</AppButton>
    </template>
</AppEmpty>`

const slotCode = `<AppEmpty>
    <AppIcon name="file" :size="30" />
    <p>还没有文件</p>
    <template #action>
        <AppButton size="sm" variant="primary">上传文件</AppButton>
    </template>
</AppEmpty>`
</script>
