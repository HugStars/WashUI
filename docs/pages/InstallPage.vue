<template>
    <DocPage category="指南" name="@wash/ui" title="安装" description="安装包、引入样式，并在应用入口完成组件注册与主题配置。">
        <h2 class="doc_h2">环境要求</h2>
        <ul class="doc_list">
            <li>Node.js 20.19 或更高版本（Vite 7 要求）</li>
            <li>pnpm 12（仓库根已声明 packageManager）</li>
            <li>Vue 3.5+ 与 Vite 7+</li>
        </ul>

        <h2 class="doc_h2">安装</h2>
        <pre class="doc_pre"><code>pnpm add @wash/ui</code></pre>

        <h2 class="doc_h2">引入样式</h2>
        <pre class="doc_pre"><code>import '@wash/ui/style.css'</code></pre>
        <p class="doc_text doc_gap">style.css 已经包含 tokens.css，Vue 项目只需要引这一行。只使用变量或非 Vue 项目时，改为引入 tokens.css，两者不要同时引入。</p>

        <h2 class="doc_h2">初始化</h2>
        <pre class="doc_pre"><code>{{ initCode }}</code></pre>
        <p class="doc_text doc_gap">createUi 会全局注册全部组件、初始化主题，并应用 tokens。主题默认读取 wa_theme，没有保存值时跟随系统。</p>

        <h2 class="doc_h2">按需导入</h2>
        <pre class="doc_pre"><code>import { AppButton, AppCard, AppDialog } from '@wash/ui'</code></pre>

        <h2 class="doc_h2">子路径</h2>
        <ApiTable kind="values" :rows="exports" />

        <h2 class="doc_h2">私有源</h2>
        <p class="doc_text">包发布在私有源时，先在项目 .npmrc 中配置作用域：</p>
        <pre class="doc_pre doc_gap"><code>@wash:registry=https://你的私有源地址</code></pre>

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
]

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
