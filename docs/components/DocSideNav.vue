<template>
    <AppSelectPanel v-if="props.section" class="doc_side" role="listbox" aria-label="文档导航" :groups="Groups"
        :model-value="route.name" size="md" :check-icon="false" @select="Go" />
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
    if (item?.path && item.path !== route.path) router.navigate(item.path, { mode: 'push' })
}
</script>

<style>
.doc_side {
    position: sticky;
    top: 86px;
    align-self: start;
    max-height: calc(100vh - 110px);
    padding: var(--doc_side_padding);
    overflow-y: auto;
    border-radius: var(--doc_side_radius);
    background: var(--wa_color_surface);
}

@media (max-width: 860px) {

    .doc_side {
        display: none;
    }
}
</style>
