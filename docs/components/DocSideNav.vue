<template>
    <AppNavMenu v-if="props.section" class="doc_side" :model-value="route.name" :groups="Groups"
        :link-component="RouterLink" aria-label="文档导航" />
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { AppNavMenu } from 'wash-ui'
import { pageLabel } from '../site.js'

const props = defineProps({
    section: {
        type: Object,
        required: true,
    },
})

const route = useRoute()
const Groups = computed(() => props.section.groups.map(group => ({
    title: group.title || props.section.title,
    items: group.items.map(item => ({
        label: pageLabel(item),
        value: item.name,
        href: item.path,
    })),
})))
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
