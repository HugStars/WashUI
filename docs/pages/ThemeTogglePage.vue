<template>
    <DocPage category="基础" name="AppThemeToggle" title="主题切换" description="封装亮暗主题切换的按钮，内置太阳与月亮图标切换动画。">
        <DemoBlock title="基础" description="默认小尺寸，传 size=md 可放大；图标会随主题过渡。">
            <div class="doc_row">
                <AppThemeToggle />
                <AppThemeToggle size="md" />
                <span class="wa_tag">当前主题：{{ theme }}</span>
            </div>
        </DemoBlock>

        <DemoBlock title="切换事件" description="change 返回切换后的实际主题。">
            <div class="doc_row">
                <AppThemeToggle @change="onChange" />
                <span class="wa_hint">最近切换：{{ last }}</span>
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
import { useTheme } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const { theme } = useTheme()
const last = ref('无')

function onChange(value) {
    last.value = value
}

const propsRows = [
    { name: 'size', type: 'md | sm', default: 'sm', desc: '按钮尺寸，默认小尺寸' },
]

const eventRows = [
    { name: 'change', type: 'light | dark', desc: '切换后的实际主题' },
]
</script>
