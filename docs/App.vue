<template>
    <AppShell :nav="nav" :active="active" @navigate="go">
        <PageHeader :title="title">
            <template #center>
                <DocNavSelect />
            </template>
            <template #actions>
                <span class="doc_version">v0.1.0</span>
                <AppThemeToggle />
            </template>
        </PageHeader>

        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>

        <template #footer>
            WashUI · <span class="wa_mono">@wash/ui</span> ·
            <a href="https://hugstars.top" target="_blank" rel="noopener noreferrer">©HugStars</a>
        </template>
    </AppShell>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppThemeToggle } from '@wash/ui'
import DocNavSelect from './components/DocNavSelect.vue'
import { nav } from './site.js'

const route = useRoute()
const router = useRouter()
const active = computed(() => route.meta.nav || route.name)
const title = computed(() => route.meta.title || '文档')

const entry = {
    home: '/',
    guide: '/guide/install',
    components: '/components',
    icons: '/icons',
    layout: '/layout',
    abilities: '/composables',
}

function go(item) {
    const path = entry[item.name]
    if (path && route.path !== path) router.push(path)
}
</script>
