<template>
    <Teleport v-if="InHeader" :to="Target">
        <div v-bind="$attrs" class="wa_page_bar wa_page_bar_header" :class="{ wa_page_bar_bleed: bleed }">
            <slot />
        </div>
    </Teleport>
    <div v-else v-bind="$attrs" class="wa_page_bar">
        <slot />
    </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, unref, watch } from 'vue'
import { HEADER_BAR_TARGET } from '../core/keys.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    /** 在标题栏中抵消 header 左右内边距，让内容横向铺满 */
    bleed: Boolean,
    /**
     * auto：移动端投递到 header；header：始终投递到 AppDeskShell / AppShell 的 header；inline：始终留在页面内
     * @type {'auto' | 'header' | 'inline'}
     */
    placement: {
        type: String,
        default: 'auto',
    },
})

const Target = inject(HEADER_BAR_TARGET, null)
const Media = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(max-width: 860px)')
    : null
const Mobile = ref(Media?.matches ?? false)
const InHeader = computed(() => {
    if (props.placement === 'inline') return false
    if (props.placement === 'header') return Boolean(unref(Target))
    return Mobile.value && Boolean(unref(Target))
})

function OnMedia(event) {
    Mobile.value = event.matches
}

watch(() => props.placement, value => {
    if (value !== 'auto') return
    if (!Media) return
    Mobile.value = Media.matches
})

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
    --wa_page_bar_pad_block: 0px;
}

.wa_page_bar_bleed {
    /* 把标题栏左右内边距暴露给插槽内容，AppTabs 等组件可自行取用 */
    --wa_page_bar_inset: var(--wa_header_pad_x, 0px);
}
</style>
