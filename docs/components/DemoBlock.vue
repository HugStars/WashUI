<template>
    <section class="doc_demo">
        <header v-if="title || description" class="doc_demo_head">
            <h3 v-if="title" class="doc_demo_title">{{ title }}</h3>
            <p v-if="description" class="doc_demo_desc">{{ description }}</p>
        </header>

        <div class="doc_demo_view">
            <slot />
        </div>

        <div v-if="code" class="doc_demo_code" :class="{ 'is-expanded': expanded }">
            <div class="doc_demo_code_head">
                <AppButton :aria-expanded="expanded" @click="expanded = !expanded">
                    {{ expanded ? '收起代码' : '展开代码' }}
                </AppButton>
                <AppButton v-if="expanded" @click="copyCode">
                    {{ copied ? '已复制' : '复制代码' }}
                </AppButton>
            </div>

            <div class="doc_demo_code_body">
                <div class="doc_demo_code_inner">
                    <AppCode plain :code="code" lang="htm" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { useClipboard } from '@wash/ui'

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    code: {
        type: String,
        default: '',
    },
    // 是否默认展开代码
    defaultExpanded: {
        type: Boolean,
        default: false,
    },
})

const expanded = ref(props.defaultExpanded)
const { copied, copy } = useClipboard()

function copyCode() {
    copy(props.code)
}
</script>

<style>
.doc_demo {
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_card);
    background: var(--wa_color_dialog);
}

.doc_demo+.doc_demo,
.doc_demo+.doc_h2,
.doc_h2+.doc_demo {
    margin-top: 16px;
}

.doc_demo_head {
    display: grid;
    gap: 4px;
    padding: 18px 22px 0;
}

.doc_demo_title {
    font-size: 15px;
    font-weight: 600;
}

.doc_demo_desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--wa_color_text_subtle);
}

.doc_demo_view {
    padding: 22px;
}

.doc_demo_code {
    border-top: 1px solid var(--wa_color_line);
    background: var(--wa_color_soft);
}

.doc_demo_code_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 36px;
    padding: 8px 12px;
}

.doc_demo_code_body {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    padding: 0;
    visibility: hidden;
    transition: grid-template-rows .25s ease, padding .25s ease, visibility .25s;
}

.doc_demo_code.is-expanded .doc_demo_code_body {
    grid-template-rows: 1fr;
    padding: 8px 12px;
    visibility: visible;
}

.doc_demo_code_inner {
    min-height: 0;
    overflow: auto hidden;
}

@media (max-width: 860px) {

    .doc_demo_head {
        padding: 16px 16px 0;
    }

    .doc_demo_view {
        padding: 16px;
    }
}
</style>