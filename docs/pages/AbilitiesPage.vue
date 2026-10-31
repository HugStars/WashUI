<template>
    <DocPage title="能力"
        description="全局服务、组合式函数、工具函数与设计变量。全局服务直接调用，组合式函数在组件中使用，工具函数为纯函数。">
        <section v-for="group in groups" :key="group.title">
            <h2 class="doc_h2">{{ group.title }}</h2>
            <p class="doc_text doc_ability_desc">{{ group.desc }}</p>
            <div class="doc_component_grid">
                <RouterLink v-for="item in group.items" :key="item.path" :to="item.path" class="doc_component_link">
                    <AppCard :title="item.label" compact>
                        <template #extra>
                            <code class="doc_component_name">{{ item.en }}</code>
                        </template>
                        <p class="wa_hint">{{ item.summary }}</p>
                        <span class="doc_component_go">查看文档 →</span>
                    </AppCard>
                </RouterLink>
            </div>
        </section>
    </DocPage>
</template>

<script setup>
import { DocPage } from '../components/index.js'

const groups = [
    {
        title: '全局服务',
        desc: '直接调用，操作全局单例、DOM 或副作用；不依赖组件生命周期，不返回响应式状态。',
        items: [
            { label: '轻提示', en: 'toast', summary: '全局消息提示，支持类型、停留与更新。', path: '/services/toast' },
            { label: '加载', en: 'loading', summary: '全局加载遮罩，支持多任务与优先级。', path: '/services/loading' },
        ],
    },
    {
        title: '组合式函数',
        desc: '在 setup 中调用，返回 ref / 状态和操作函数；生命周期绑定到组件实例。',
        items: [
            { label: '主题', en: 'useTheme', summary: '亮暗模式与跟随系统。', path: '/composables/theme' },
            { label: '剪贴板', en: 'useClipboard', summary: '复制文本与 copied 状态。', path: '/composables/clipboard' },
            { label: '请求', en: 'useRequest', summary: '加载、错误与取消状态。', path: '/composables/request' },
        ],
    },
    {
        title: '工具函数',
        desc: '纯函数，输入输出明确，没有状态、没有副作用。',
        items: [
            { label: '格式化函数', en: 'utils', summary: '字节、时间和常用格式化。', path: '/utils' },
        ],
    },
    {
        title: '设计变量',
        desc: '页面使用的颜色、圆角、阴影、层级与断点等设计令牌。',
        items: [
            { label: '设计变量', en: 'tokens', summary: '颜色、圆角、阴影、层级与断点。', path: '/tokens' },
        ],
    },
]
</script>

<style>
.doc_ability_desc {
    margin-bottom: 12px;
}
</style>
