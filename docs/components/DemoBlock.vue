<template>
    <section class="doc_demo" :class="{ 'is-expanded': expanded }">
        <header v-if="title || description" class="doc_demo_head">
            <h3 v-if="title" class="doc_demo_title">{{ title }}</h3>
            <p v-if="description" class="doc_demo_desc">{{ description }}</p>
        </header>

        <div class="doc_demo_view">
            <slot />
        </div>

        <div v-if="code" class="doc_demo_code">
            <div class="doc_demo_bar">
                <AppButton variant="line" size="sm" :aria-expanded="expanded" @click="expanded = !expanded">
                    <AppIcon name="chevron" :size="13" class="doc_demo_chevron" :class="{ on: expanded }" />
                    <span>{{ expanded ? '收起代码' : '查看代码' }}</span>
                </AppButton>
            </div>

            <div class="doc_demo_code_body">
                <div class="doc_demo_code_inner">
                    <AppCode plain :code="code" :lang="lang" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    // 不传时由 Vite 插件自动注入默认插槽源码
    code: {
        type: String,
        default: '',
    },
    lang: {
        type: String,
        default: 'html',
    },
    // 是否默认展开代码
    defaultExpanded: {
        type: Boolean,
        default: false,
    },
})

const expanded = ref(props.defaultExpanded)
</script>

<style>
.doc_demo {
    display: grid;
    gap: 10px;
}

.doc_demo+.doc_demo {
    margin-top: 34px;
}

.doc_demo_head {
    display: grid;
    gap: 4px;
}

.doc_demo_title {
    font-size: 15px;
    font-weight: 600;
}

.doc_demo_desc {
    max-width: 72ch;
    font-size: 12.5px;
    line-height: 1.65;
    color: var(--wa_color_text_subtle);
}

.doc_demo_view {
    padding: 20px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}

.doc_demo_code {
    border-top: 1px solid var(--wa_color_line);
}

.doc_demo_bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 0;
}

.doc_demo_chevron {
    transition: transform var(--wa_duration_fast);
}

.doc_demo_chevron.on {
    transform: rotate(90deg);
}

.doc_demo_code_body {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    visibility: hidden;
    transition: grid-template-rows .25s ease, visibility .25s;
}

.doc_demo.is-expanded .doc_demo_code_body {
    grid-template-rows: 1fr;
    visibility: visible;
}

.doc_demo_code_inner {
    min-height: 0;
    overflow: hidden;
    transition: padding .25s ease;
}

.doc_demo.is-expanded .doc_demo_code_inner {
    padding-bottom: 14px;
}

@media (max-width: 860px) {

    .doc_demo_view {
        padding: 16px;
    }
}
</style>
