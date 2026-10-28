<template>
    <DocPage category="布局" title="布局概览" description="布局负责页面骨架，与业务组件分开：AppShell、PageHeader、AppRouteBar 与 PageTransition。">
        <div class="doc_component_grid">
            <RouterLink v-for="item in entries" :key="item.name" :to="item.path" class="doc_component_link">
                <AppCard :title="item.label" compact>
                    <template #extra>
                        <code class="doc_component_name">{{ item.component }}</code>
                    </template>
                    <p class="wa_hint">{{ item.summary }}</p>
                    <span class="doc_component_go">查看文档 →</span>
                </AppCard>
            </RouterLink>
        </div>

        <h2 class="doc_h2">基本结构</h2>
        <pre class="doc_pre"><code>{{ shellCode }}</code></pre>

        <h2 class="doc_h2">导航项</h2>
        <pre class="doc_pre"><code>{{ navCode }}</code></pre>

        <h2 class="doc_h2">导航布局</h2>
        <ApiTable kind="values" :rows="navLayouts" />
        <p class="doc_text doc_gap">桌面端默认只显示图标，移动端显示图标和文本；其他模式在两端保持一致。</p>

        <h2 class="doc_h2">页面标题</h2>
        <pre class="doc_pre"><code>{{ headerCode }}</code></pre>
        <ul class="doc_list doc_gap">
            <li>PageHeader 必须放在 AppShell 内，会自动投递到顶部栏。</li>
            <li>不要把它放进被 PageTransition 包裹的页面组件，out-in 会先卸载旧页面，标题会短暂消失。</li>
            <li>标题跟随路由时放在 meta.title；依赖页面内部状态的操作需要把状态提升到布局层。</li>
        </ul>

        <h2 class="doc_h2">页面过渡</h2>
        <pre class="doc_pre"><code>{{ transitionCode }}</code></pre>
        <p class="doc_text doc_gap">PageTransition 使用 Vue 的 Transition，mode 为 out-in。页面组件必须是单根元素，否则过渡不会生效。</p>
    </DocPage>
</template>

<script setup>
import { ApiTable, DocPage } from '../components/index.js'
import { layoutPages } from '../site.js'

const entries = layoutPages.filter(item => item.name !== 'layout')

const navLayouts = [
    { name: 'auto', desc: '默认。桌面仅图标，移动端图标和文本' },
    { name: 'inline', desc: '横向图标和文本' },
    { name: 'stacked', desc: '上下排列' },
    { name: 'icon', desc: '仅图标' },
    { name: 'text', desc: '仅文本' },
]

const shellCode = `<AppShell :nav="nav" :active="route.name" @navigate="go">
    <PageHeader :title="title">
        <template #actions>
            <AppThemeToggle size="sm" />
        </template>
    </PageHeader>

    <RouterView v-slot="{ Component }">
        <PageTransition>
            <component :is="Component" />
        </PageTransition>
    </RouterView>

    <template #footer>
        页脚内容
    </template>
</AppShell>`

const navCode = `const nav = [
    { name: 'home', label: '开始', icon: 'home' },
    { name: 'components', label: '组件', icon: 'list' },
]

function go(item) {
    if (route.name !== item.name) router.push({ name: item.name })
}`

const headerCode = `<PageHeader :title="route.meta.title">
    <template #actions>
        <AppButton size="sm" variant="line">操作</AppButton>
    </template>
</PageHeader>`

const transitionCode = `<RouterView v-slot="{ Component }">
    <PageTransition>
        <component :is="Component" />
    </PageTransition>
</RouterView>`
</script>
