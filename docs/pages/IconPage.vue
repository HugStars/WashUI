<template>
    <DocPage category="图标" name="AppIcon" title="图标" :description="`内置 ${icons.length} 个线性图标，支持全局新增或覆盖。`">
        <DemoBlock title="全部图标">
            <div class="doc_tokens">
                <div v-for="name in icons" :key="name" class="doc_token">
                    <AppIcon :name="name" :size="20" />
                    <code>{{ name }}</code>
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="尺寸与描边" description="size 与 strokeWidth 接受数字或字符串。">
            <div class="doc_row">
                <AppIcon name="speed" :size="16" />
                <AppIcon name="speed" :size="22" />
                <AppIcon name="speed" :size="32" />
                <AppIcon name="speed" :size="22" :stroke-width="1.2" />
            </div>
        </DemoBlock>

        <h2 class="doc_h2">全局配置</h2>
        <AppCode plain :code="configCode" lang="js" />
        <p class="doc_text doc_gap">icons 支持两种配置：数组形式会沿用 strokeWidth、currentColor 等规则；字符串 SVG 会原样渲染，不应用 strokeWidth，尺寸仍由 size 控制。</p>
        <p class="doc_note doc_gap">运行时也可以调用 configureIcons({ name: 配置 }) 覆盖或新增图标，传 null 可以移除图标。</p>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { computed } from 'vue'
import { iconNames } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const icons = computed(() => iconNames())

const propsRows = [
    { name: 'name', type: 'string', default: '必填', desc: '图标名，未知名称渲染空图标' },
    { name: 'size', type: 'number | string', default: '20', desc: '宽高，数字自动补 px' },
    { name: 'strokeWidth', type: 'number | string', default: '1.8', desc: '描边宽度' },
]

const configCode = `import { createUi } from '@wash/ui'

app.use(createUi({
    icons: {
        badge: [
            ['circle', { cx: 12, cy: 12, r: 9 }],
            ['path', { d: 'm8 12 3 3 5-6' }],
        ],
        logo: '<svg viewBox="0 0 24 24"><path d="..." fill="currentColor" /></svg>',
    },
}))`
</script>
