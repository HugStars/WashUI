<template>
    <section class="doc_demo">
        <header v-if="title || description" class="doc_demo_head">
            <h3 v-if="title" class="doc_demo_title">{{ title }}</h3>
            <p v-if="description" class="doc_demo_desc">{{ description }}</p>
        </header>

        <div class="doc_demo_view">
            <slot />
        </div>

        <div v-if="code" class="doc_demo_code">
            <button type="button" class="doc_copy" @click="copyCode">{{ copied ? '已复制' : '复制代码' }}</button>
            <pre class="doc_pre"><code>{{ code }}</code></pre>
        </div>
    </section>
</template>

<script setup>
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
})

const { copied, copy } = useClipboard()

function copyCode() {
    copy(props.code)
}
</script>
