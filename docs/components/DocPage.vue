<template>
    <div class="doc_layout" :class="{ doc_layout_side: section }">
        <DocSideNav v-if="section" :section="section" />

        <article class="doc_article">
            <header class="doc_head">
                <div class="doc_head_title">
                    <h1 class="doc_title">{{ title }}</h1>
                    <p v-if="category || name" class="doc_meta">
                        <span v-if="category" class="wa_tag">{{ category }}</span>
                        <code v-if="name" class="doc_meta_name">{{ name }}</code>
                    </p>
                </div>
                <p v-if="description" class="doc_desc">{{ description }}</p>
            </header>

            <slot />

            <section v-if="$slots.api" class="doc_block">
                <h2 class="doc_h2">API</h2>
                <slot name="api" />
            </section>

            <footer v-if="prev || next" class="doc_pager">
                <RouterLink v-if="prev" :to="prev.path" class="doc_pager_link">
                    <span>上一页</span>
                    <b>{{ pageLabel(prev) }}</b>
                </RouterLink>
                <RouterLink v-if="next" :to="next.path" class="doc_pager_link doc_pager_next">
                    <span>下一页</span>
                    <b>{{ pageLabel(next) }}</b>
                </RouterLink>
            </footer>
        </article>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { pageLabel, pageNav, sections } from '../site.js'
import DocSideNav from './DocSideNav.vue'

defineProps({
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
})

const route = useRoute()
// 桌面端左侧面板与移动端 Header 下拉共用同一份 section 配置。
const section = computed(() => sections[route.meta.section] || null)
const index = computed(() => pageNav.findIndex(item => item.name === route.name))
const prev = computed(() => index.value > 0 ? pageNav[index.value - 1] : null)
const next = computed(() => index.value >= 0 && index.value < pageNav.length - 1 ? pageNav[index.value + 1] : null)
</script>
