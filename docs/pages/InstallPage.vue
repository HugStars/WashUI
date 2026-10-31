<template>
    <DocPage category="指南" name="@wash/ui" title="安装" description="安装包、引入样式，并在应用入口完成组件注册与主题配置。">
        <h2 class="doc_h2">环境要求</h2>
        <ul class="doc_list">
            <li>Node.js 20.19 或更高版本（Vite 7 要求）</li>
            <li>pnpm 12（仓库根已声明 packageManager）</li>
            <li>Vue 3.5+ 与 Vite 7+</li>
        </ul>

        <h2 class="doc_h2">安装</h2>
        <AppCode lang="bash" code="pnpm add @wash/ui" />

        <h2 class="doc_h2">引入样式</h2>
        <AppCode lang="js" code="import '@wash/ui/style.css'" />

        <p class="doc_text doc_gap">style.css 已经包含 tokens.css，Vue 项目只需要引这一行。只使用变量或非 Vue 项目时，改为引入 tokens.css，两者不要同时引入。
        </p>

        <h2 class="doc_h2">初始化</h2>
        <AppCode lang="js" :code="initCode" />

        <p class="doc_text doc_gap">createUi 会全局注册全部组件、初始化主题，并应用 tokens。主题默认读取 wa_theme，没有保存值时跟随系统。</p>

        <h2 class="doc_h2">按需引入</h2>
        <p class="doc_text">组件与布局都有独立子路径入口，适合需要 tree-shaking 的项目；样式统一引入一次 style.css。</p>
        <AppCode lang="js" :code="onDemandCode" />

        <p class="doc_text doc_gap">也可以在主入口使用命名导入；打包器可 tree-shake 未使用的组件。createUi 会全量注册，不需要 tree-shaking 时更省事。</p>
        <AppCode lang="js" code="import { AppButton, AppCard, AppDialog } from '@wash/ui'" />

        <h2 class="doc_h2">子路径</h2>
        <ApiTable kind="values" :rows="exports" />

        <p class="doc_note doc_gap">本仓库根目录就是文档站，ui/ 是库源码。文档站通过 Vite alias 直接读取 ui/src，修改库源码会即时生效，不需要先构建。</p>
    </DocPage>
</template>

<script setup>
import { DocPage, ApiTable } from '../components/index.js'

const exports = [
    { name: '@wash/ui', desc: '主入口：组件、createUi、toast、主题、组合式函数与工具' },
    { name: '@wash/ui/style.css', desc: '全部样式，已包含 tokens.css' },
    { name: '@wash/ui/tokens.css', desc: '仅设计变量与暗色主题' },
    { name: '@wash/ui/tokens.js', desc: '图表配色、断点与层级常量' },
    { name: '@wash/ui/router', desc: 'createAppRouter 路由工厂' },
    { name: '@wash/ui/utils', desc: '纯格式化函数' },
    { name: '@wash/ui/components/*', desc: '单个组件的独立入口，例如 AppButton' },
    { name: '@wash/ui/layout/*', desc: '单个布局的独立入口，例如 AppShell' },
]

const onDemandCode = `import { createApp } from 'vue'
import '@wash/ui/style.css'
import AppButton from '@wash/ui/components/AppButton'
import AppShell from '@wash/ui/layout/AppShell'

const app = createApp(App)
app.component('AppButton', AppButton)
app.component('AppShell', AppShell)`

const initCode = `import { createApp } from 'vue'
import '@wash/ui/style.css'
import { createUi } from '@wash/ui'
import App from './App.vue'

const app = createApp(App)

app.use(createUi({
    theme: 'auto',
    storageKey: 'wa_theme',
    tokens: {
        color_accent: '#6366f1',
        radius_card: '20px',
    },
    themes: {
        light: { color_canvas: '#f7f7f8' },
        dark: { color_canvas: '#101012' },
    },
}))

app.mount('#app')`
</script>
