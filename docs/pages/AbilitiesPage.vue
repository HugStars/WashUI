<template>
    <DocPage title="能力"
        description="全局服务、组合式函数、工具函数与设计变量。全局服务直接调用，组合式函数在组件中使用，工具函数为纯函数。">
        <section v-for="group in groups" :key="group.title" class="doc_entry_group">
            <h2 class="doc_h2">{{ group.title }}</h2>
            <p class="doc_text doc_ability_desc">{{ group.desc }}</p>
            <div class="doc_entry_grid">
                <DocEntryCard v-for="item in group.items" :key="item.path" :title="item.label" :name="item.en"
                    :summary="item.summary" :path="item.path" />
            </div>
        </section>
    </DocPage>
</template>

<script setup>
import { DocEntryCard, DocPage } from '../components/index.js'

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
            { label: '字节与速率', en: 'Bytes', summary: '字节数、传输速率、耗时与大数字，支持小数位、固定单位与链式格式化器。', path: '/utils/bytes' },
            { label: '数字与文本', en: 'Number', summary: '千分位、百分比、货币、补零、截断与区间限制。', path: '/utils/number' },
            { label: '日期与时间', en: 'Date', summary: '按模板格式化日期，输出“刚刚 / N 分钟前”等相对时间。', path: '/utils/date' },
            { label: '防抖与节流', en: 'Async', summary: '限制输入、滚动等高频函数的执行次数，返回函数带 cancel()。', path: '/utils/async' },
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
