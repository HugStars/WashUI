<template>
    <AppShell :nav="nav" :active="active" @navigate="go">
        <PageHeader :title="title">
            <template #center>
                <DocNavSelect v-if="Mobile" />
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
            <span class="wa_mono">@wash/ui</span>
            <a href="https://hugstars.top" target="_blank" rel="noopener noreferrer">✨ By Hugstars.</a>
        </template>
    </AppShell>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppThemeToggle } from '@wash/ui'
import DocNavSelect from './components/DocNavSelect.vue'
import { nav } from './site.js'

const route = useRoute()
const router = useRouter()
const active = computed(() => route.meta.nav || route.name)
const title = computed(() => route.meta.title || '文档')
// Header 导航下拉只在移动端使用，桌面端使用 DocSideNav。
const Media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 860px)') : null
const Mobile = ref(Media?.matches ?? false)

function OnMedia(event) {
    Mobile.value = event.matches
}

onMounted(() => {
    Media?.addEventListener('change', OnMedia)
})

onUnmounted(() => {
    Media?.removeEventListener('change', OnMedia)
})

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
