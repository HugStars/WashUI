<template>
    <DocPage category="加载" name="AppSkeleton" title="骨架屏" description="内容占位与渐进加载，默认使用小圆角和 shimmer 动画。">
        <DemoBlock title="基础" description="width、height、radius 接受数字或字符串。" :code="baseCode">
            <div class="doc_stack">
                <AppSkeleton :width="220" :height="18" />
                <AppSkeleton :width="360" :height="12" />
                <AppSkeleton :width="280" :height="12" />
            </div>
        </DemoBlock>

        <DemoBlock title="加载切换" description="加载完成后替换为真实内容。" :code="toggleCode">
            <div class="doc_row">
                <AppButton size="sm" variant="line" @click="loading = !loading">{{ loading ? '显示内容' : '显示骨架' }}</AppButton>
            </div>
            <div v-if="loading" class="doc_stack doc_gap">
                <AppSkeleton :height="54" />
                <AppSkeleton :height="54" />
                <AppSkeleton :height="54" />
            </div>
            <div v-else class="doc_stack doc_gap">
                <div v-for="item in items" :key="item" class="doc_kv_row">
                    <span>{{ item }}</span>
                    <code>正常</code>
                </div>
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const loading = ref(true)
const items = ['边缘节点', '缓存命中', '源站响应']

const propsRows = [
    { name: 'width', type: 'number | string', default: "'100%'", desc: '宽度' },
    { name: 'height', type: 'number | string', default: '14', desc: '高度' },
    { name: 'radius', type: 'number | string', default: 'var(--wa_radius_small)', desc: '圆角' },
]

const baseCode = `<AppSkeleton :width="220" :height="18" />
<AppSkeleton :width="360" :height="12" />`

const toggleCode = `<div v-if="loading">
    <AppSkeleton :height="54" />
    <AppSkeleton :height="54" />
</div>
<div v-else>
    真实内容
</div>`
</script>
