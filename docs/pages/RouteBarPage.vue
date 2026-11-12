<template>
    <DocPage category="布局" name="AppRouteBar" title="路由进度条" description="固定在视口顶部的加载进度条，默认跟随 routeLoading，也可以手动控制。">
        <DemoBlock title="手动控制" description="AppShell 已内置 AppRouteBar；这里直接模拟 routeLoading。" lang="js"
            :code="manualCode">
            <AppButton variant="line" :loading="loading" @click="start">模拟加载</AppButton>
        </DemoBlock>

        <h2 class="doc_h2">使用方式</h2>
        <AppCode :code="autoCode" lang="html" />
        <p class="doc_text doc_gap">不使用 AppShell 时，把 AppRouteBar 放在应用根部一次即可。</p>
        <p class="doc_note doc_gap">AppShell 已内置一个 AppRouteBar，使用 AppShell 时不要再重复添加。</p>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { routeLoading } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const loading = ref(false)
let timer = null

function start() {
    loading.value = true
    routeLoading.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
        loading.value = false
        routeLoading.value = false
    }, 1200)
}

onUnmounted(() => clearTimeout(timer))

const propsRows = [
    { name: 'loading', type: 'boolean', default: '跟随 routeLoading', desc: '手动控制进度条显示' },
]

const autoCode = `<AppRouteBar />`

const manualCode = `import { routeLoading } from 'wash-ui'

routeLoading.value = true

setTimeout(() => {
    routeLoading.value = false
}, 1200)`
</script>
