<template>
    <DocPage category="指南" title="主题" description="亮色、暗色与跟随系统；主题状态由 useTheme 提供，颜色和尺寸来自 CSS tokens。">
        <DemoBlock title="切换主题" description="mode 为 light / dark / auto，theme 为当前实际主题。" lang="js" :code="themeCode">
            <div class="doc_row">
                <AppButton :variant="mode === 'light' ? 'primary' : 'line'" @click="setTheme('light')">亮色</AppButton>
                <AppButton :variant="mode === 'dark' ? 'primary' : 'line'" @click="setTheme('dark')">暗色</AppButton>
                <AppButton :variant="mode === 'auto' ? 'primary' : 'line'" @click="setTheme('auto')">跟随系统</AppButton>
                <AppButton variant="line" @click="toggleTheme">切换</AppButton>
            </div>
            <div class="doc_row doc_gap">
                <span class="wa_tag">mode: {{ mode }}</span>
                <span class="wa_tag">theme: {{ theme }}</span>
            </div>
        </DemoBlock>

        <h2 class="doc_h2">首屏防闪</h2>
        <AppCode :code="inlineCode" lang="html" />

        <h2 class="doc_h2">加载时配置 tokens</h2>
        <p class="doc_text">createUi 接受 tokens 与 themes。键名会自动补 --wa_ 前缀，也可以直接传完整变量名。</p>
        <AppCode class="doc_gap" :code="tokenCode" lang="js" />
        <p class="doc_text doc_gap">tokens 在所有主题生效；themes.light 与 themes.dark 只对应各自主题，并覆盖同名 tokens。运行时可以调用 configureTokens 重新应用。</p>

        <h2 class="doc_h2">颜色变量</h2>
        <div class="doc_tokens">
            <div v-for="token in colors" :key="token.name" class="doc_token">
                <span class="doc_swatch" :style="{ background: `var(${token.name})` }"></span>
                <code>{{ token.name }}</code>
            </div>
        </div>

        <h2 class="doc_h2">覆盖变量</h2>
        <AppCode :code="overrideCode" lang="css" />
        <p class="doc_note doc_gap">变量使用 --wa_ 前缀与下划线命名。组件样式只引用变量和修饰类，不会因为主题或尺寸切换互相覆盖。</p>
    </DocPage>
</template>

<script setup>
import { useTheme } from 'wash-ui'
import { DocPage, DemoBlock } from '../components/index.js'

const { mode, theme, setTheme, toggleTheme } = useTheme()

const colors = [
    { name: '--wa_color_canvas' },
    { name: '--wa_color_surface' },
    { name: '--wa_color_text' },
    { name: '--wa_color_text_muted' },
    { name: '--wa_color_accent' },
    { name: '--wa_color_success' },
    { name: '--wa_color_warning' },
    { name: '--wa_color_help' },
    { name: '--wa_color_danger' },
]

const themeCode = `import { useTheme } from 'wash-ui'

const { mode, theme, setTheme, toggleTheme } = useTheme()

setTheme('dark')
setTheme('auto')
toggleTheme()`

const inlineCode = `<script>
    try {
        var saved = localStorage.getItem('wa_theme')
        var dark = saved === 'dark' || (saved !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    } catch (e) { }
<\/script>`

const tokenCode = `app.use(createUi({
    theme: 'auto',
    tokens: {
        color_accent: '#6366f1',
        radius_card: '20px',
        font_family: 'Inter, system-ui, sans-serif',
    },
    themes: {
        light: { color_canvas: '#f7f7f8' },
        dark: { color_canvas: '#101012' },
    },
}))`

const overrideCode = `:root {
    --wa_color_accent: #6366f1;
    --wa_radius_card: 20px;
}

[data-theme='dark'] {
    --wa_color_canvas: #101012;
}`
</script>
