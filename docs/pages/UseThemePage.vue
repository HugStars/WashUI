<template>
    <DocPage category="能力" name="use-theme" title="主题"
        description="管理亮色、暗色与跟随系统，默认存储键为 wa_theme。">
        <DemoBlock title="切换主题" lang="js" :code="themeCode">
            <div class="doc_row">
                <AppButton :variant="mode === 'light' ? 'primary' : 'line'" @click="setTheme('light')">亮色</AppButton>
                <AppButton :variant="mode === 'dark' ? 'primary' : 'line'" @click="setTheme('dark')">暗色</AppButton>
                <AppButton :variant="mode === 'auto' ? 'primary' : 'line'" @click="setTheme('auto')">跟随系统</AppButton>
            </div>
            <div class="doc_row doc_gap">
                <span class="wa_tag">mode: {{ mode }}</span>
                <span class="wa_tag">theme: {{ theme }}</span>
            </div>
        </DemoBlock>
        <ApiTable title="返回" kind="values" :rows="themeRows" />
    </DocPage>
</template>

<script setup>
import { useTheme } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const { mode, theme, setTheme } = useTheme()

const themeRows = [
    { name: 'mode', desc: '当前模式：light / dark / auto' },
    { name: 'theme', desc: '当前实际主题：light / dark' },
    { name: 'setTheme(value)', desc: '设置模式并持久化' },
    { name: 'toggleTheme()', desc: '在亮色与暗色之间切换' },
]

const themeCode = `import { useTheme } from 'wash-ui'

const { mode, theme, setTheme, toggleTheme } = useTheme()`
</script>
