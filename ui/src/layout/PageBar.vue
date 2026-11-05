<template>
    <Teleport v-if="InHeader" :to="Target">
        <div v-bind="$attrs" class="wa_page_bar wa_page_bar_header">
            <slot />
        </div>
    </Teleport>
    <div v-else v-bind="$attrs" class="wa_page_bar">
        <slot />
    </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, unref } from 'vue'
import { HEADER_BAR_TARGET } from '../core/keys.js'

defineOptions({ inheritAttrs: false })

const Target = inject(HEADER_BAR_TARGET, null)
const Media = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(max-width: 860px)')
    : null
const Mobile = ref(Media?.matches ?? false)
const InHeader = computed(() => Mobile.value && Boolean(unref(Target)))

function OnMedia(event) {
    Mobile.value = event.matches
}

onMounted(() => {
    if (!Media) return
    Mobile.value = Media.matches
    Media.addEventListener('change', OnMedia)
})

onUnmounted(() => {
    Media?.removeEventListener('change', OnMedia)
})
</script>

<style>
.wa_page_bar {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.wa_page_bar_header {
    width: 100%;
}
</style>
