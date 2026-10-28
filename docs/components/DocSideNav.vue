<template>
    <AppSelectPanel v-if="props.section" class="doc_side" role="listbox" aria-label="文档导航" :groups="Groups"
        :model-value="route.name" @select="Go" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppSelectPanel } from '@wash/ui'
import { pageLabel, sections } from '../site.js'

const props = defineProps({
    section: {
        type: Object,
        required: true,
    },
})

const route = useRoute()
const router = useRouter()
const Groups = computed(() => props.section.groups.map(group => ({
    label: group.title || props.section.title,
    options: group.items.map(item => ({
        label: pageLabel(item),
        value: item.name,
        path: item.path,
    })),
})))

function Go(item) {
    if (item?.path && item.path !== route.path) router.push(item.path)
}
</script>
