<template>
    <div v-if="section" class="doc_header_nav">
        <AppSelect :model-value="route.name" :groups="Groups" aria-label="文档导航" @change="Go" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppSelect } from '@wash/ui'
import { pageLabel, sections } from '../site.js'

const route = useRoute()
const router = useRouter()
const section = computed(() => sections[route.meta.section] || null)
const Groups = computed(() => {
    if (!section.value) return []
    return section.value.groups.map(group => ({
        label: group.title || section.value.title,
        options: group.items.map(item => ({
            label: pageLabel(item),
            value: item.name,
        })),
    }))
})

function Go(value) {
    const items = section.value?.groups.flatMap(group => group.items) || []
    const item = items.find(entry => entry.name === value)
    if (item && item.path !== route.path) router.push(item.path)
}
</script>
