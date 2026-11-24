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
import { composablePages, servicePages, utilsPages } from '../site.js'

const card = (item, extra = {}) => ({
    label: item.label,
    en: item.en,
    summary: item.summary,
    path: item.path,
    ...extra,
})

const groups = [
    {
        title: '全局服务',
        desc: '直接调用，操作全局单例、DOM 或副作用；不依赖组件生命周期，不返回响应式状态。',
        items: servicePages.map(item => card(item, {
            en: item.name === 'toast' || item.name === 'loading' ? item.en.toLowerCase() : item.en,
        })),
    },
    {
        title: '组合式函数',
        desc: '在 setup 中调用，返回 ref / 状态和操作函数；生命周期绑定到组件实例。',
        items: composablePages.map(item => card(item)),
    },
    {
        title: '工具函数',
        desc: '纯函数，输入输出明确，没有状态、没有副作用。',
        items: utilsPages.map(item => card(item)),
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
