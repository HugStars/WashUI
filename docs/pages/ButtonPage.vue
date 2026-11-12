<template>
    <DocPage category="基础" name="AppButton" title="按钮" description="触发操作的基础组件。类型与尺寸通过独立修饰类组合，不会互相覆盖。">
        <DemoBlock title="类型" description="variant 控制视觉层级。">
            <div class="doc_row">
                <AppButton>默认</AppButton>
                <AppButton variant="primary">主要</AppButton>
                <AppButton variant="line">描边</AppButton>
                <AppButton variant="danger">危险</AppButton>
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸与图标" description="sm 使用紧凑尺寸；icon 用于纯图标操作。">
            <div class="doc_row">
                <AppButton variant="primary" size="sm">小号</AppButton>
                <AppButton variant="line" size="md">中号描边</AppButton>
                <AppButton variant="icon" aria-label="刷新">
                    <AppIcon name="refresh" :size="17" />
                </AppButton>
                <AppButton variant="icon" size="sm" aria-label="查看">
                    <AppIcon name="chevron" :size="15" />
                </AppButton>
            </div>
        </DemoBlock>

        <DemoBlock title="磨砂" description="frosted 使用与 AppPopover 相同的白色磨砂半透明表面。">
            <div class="doc_frosted_stage">
                <div class="doc_row">
                    <AppButton frosted>磨砂按钮</AppButton>
                    <AppButton frosted variant="line">磨砂描边</AppButton>
                    <AppButton frosted variant="icon" aria-label="刷新">
                        <AppIcon name="refresh" :size="17" />
                    </AppButton>
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="加载与禁用" description="loading 时自动禁用并显示加载圈。">
            <div class="doc_row">
                <AppButton variant="primary" :loading="saving" @click="save">
                    {{ saving ? '保存中' : '保存' }}
                </AppButton>
                <AppButton disabled>禁用</AppButton>
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
import { onUnmounted, ref } from 'vue'
import { toast } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const saving = ref(false)
let timer = null

function save() {
    saving.value = true
    timer = setTimeout(() => {
        saving.value = false
        toast.success('保存成功')
    }, 900)
}

onUnmounted(() => clearTimeout(timer))

const propsRows = [
    { name: 'variant', type: 'default | primary | line | danger | icon', default: 'default', desc: '视觉类型' },
    { name: 'size', type: 'md | sm', default: 'sm', desc: '尺寸' },
    { name: 'type', type: 'button | submit | reset', default: 'button', desc: '原生 button type' },
    { name: 'loading', type: 'boolean', default: 'false', desc: '加载中，自动禁用' },
    { name: 'frosted', type: 'boolean', default: 'false', desc: '白色磨砂半透明表面，与 AppPopover 一致' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
]

const eventRows = [
    { name: 'click', type: 'MouseEvent', desc: '原生点击事件' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '按钮内容' },
]
</script>
