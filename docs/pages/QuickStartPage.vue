<template>
    <DocPage category="指南" title="快速开始" description="从应用入口到页面骨架，完成一个可运行的最小结构。">
        <h2 class="doc_h2">应用入口</h2>
        <AppCode :code="mainCode" lang="js" />

        <h2 class="doc_h2">页面骨架</h2>
        <AppCode :code="appCode" lang="html" />
        <p class="doc_text doc_gap">AppShell 负责顶部栏、侧栏导航与页脚；PageHeader 会自动投递到顶部栏。</p>

        <h2 class="doc_h2">一个页面</h2>
        <AppCode :code="pageCode" lang="html" />

        <h2 class="doc_h2">路由</h2>
        <AppCode :code="routerCode" lang="js" />

        <h2 class="doc_h2">注意</h2>
        <ul class="doc_list">
            <li>PageHeader 必须放在 AppShell 内，并且要放在 RouterView 与 PageTransition 外。</li>
            <li>PageTransition 要求页面组件是单根元素；多块内容请用一个元素包住。</li>
            <li>主入口不自动加载发布后的 CSS，必须显式引入 @wash/ui/style.css。</li>
            <li>需要 tree-shaking 时使用 @wash/ui/components/* 和 @wash/ui/layout/* 子路径；createUi 会全量注册。</li>
            <li>AppDialog 是受控组件，关闭需要绑定 v-model:open。</li>
        </ul>

        <p class="doc_note doc_gap">下一步可以查看页面布局、主题配置或组件总览。</p>
    </DocPage>
</template>

<script setup>
import { DocPage } from '../components/index.js'

const mainCode = `import { createApp } from 'vue'
import '@wash/ui/style.css'
import { createUi } from '@wash/ui'
import { createAppRouter } from '@wash/ui/router'
import App from './App.vue'
import Home from './views/Home.vue'

const app = createApp(App)
app.use(createUi({ theme: 'auto' }))

const router = createAppRouter({
    routes: [
        { name: 'home', path: '/', component: Home, meta: { title: '首页' } },
    ],
    title: '我的应用',
})

app.use(router)
router.isReady().then(() => app.mount('#app'))`

const appCode = `<template>
    <AppShell :nav="nav" :active="route.name" @navigate="go">
        <PageHeader :title="route.meta.title || '首页'" />
        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>
    </AppShell>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const nav = [
    { name: 'home', label: '首页', icon: 'home' },
    { name: 'list', label: '列表', icon: 'list' },
]

function go(item) {
    if (route.name !== item.name) router.push({ name: item.name })
}
<\/script>`

const pageCode = `<template>
    <div>
        <AppCard title="今日数据">
            <AppStat label="请求数" :value="1280" />
        </AppCard>
    </div>
</template>`

const routerCode = `import { createAppRouter } from '@wash/ui/router'

const router = createAppRouter({
    routes,
    history: 'web',
    title: to => \`\${to.meta?.title || '概览'} · 我的应用\`,
    onNavigate(to) {
        console.info(to.fullPath)
    },
})`
</script>
