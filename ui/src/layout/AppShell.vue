<template>
    <div class="wa_shell">
        <AppRouteBar :loading="loading" />

        <header class="wa_header">
            <div ref="HeaderTarget" class="wa_header_slot"></div>
        </header>

        <nav v-if="nav.length" class="wa_nav" :class="navLayout !== 'auto' && `wa_nav_${navLayout}`"
            aria-label="主导航">
            <button v-for="item in VisibleNav" :key="item.name" type="button" class="wa_nav_item"
                :class="{ on: item.name === active }"
                :aria-current="item.name === active ? 'page' : undefined" :aria-label="item.label"
                :title="navLayout === 'icon' ? item.label : undefined" @click="emit('navigate', item)">
                <AppIcon :name="item.icon" :size="20" />
                <span class="wa_nav_label">{{ item.label }}</span>
            </button>

            <AppPopover v-if="MoreNav.length" v-model:open="MoreOpen" placement="top" :width="200" role="menu"
                aria-label="更多导航">
                <template #trigger="{ open }">
                    <button type="button" class="wa_nav_item" :class="{ on: MoreActive || open }"
                        :aria-current="MoreActive ? 'page' : undefined" aria-label="更多" aria-haspopup="menu"
                        :aria-expanded="open" title="更多">
                        <AppIcon name="more" :size="20" />
                        <span class="wa_nav_label">更多</span>
                    </button>
                </template>
                <template #default="{ close }">
                    <div class="wa_nav_more_list">
                        <button v-for="item in MoreNav" :key="item.name" type="button" class="wa_nav_more_item"
                            :class="{ on: item.name === active }" role="menuitem" @click="Select(item, close)">
                            <AppIcon :name="item.icon" :size="18" />
                            <span>{{ item.label }}</span>
                        </button>
                    </div>
                </template>
            </AppPopover>
        </nav>

        <main class="wa_main">
            <slot />
        </main>

        <footer v-if="$slots.footer" class="wa_footer">
            <slot name="footer" />
        </footer>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import AppPopover from '../components/AppPopover.vue'
import AppRouteBar from './AppRouteBar.vue'
import { HEADER_TARGET } from '../keys.js'

const MAX_NAV = 4

const props = defineProps({
    nav: {
        type: Array,
        default: () => [],
    },
    active: {
        type: [String, Symbol],
        default: '',
    },
    navLayout: {
        type: String,
        default: 'auto',
    },
    loading: {
        type: Boolean,
        default: undefined,
    },
})

const emit = defineEmits(['navigate'])

const HeaderTarget = ref(null)
const MoreOpen = ref(false)
const Media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 860px)') : null
const Mobile = ref(Media?.matches ?? false)
const HasMore = computed(() => Mobile.value && props.nav.length > MAX_NAV)
const VisibleNav = computed(() => HasMore.value ? props.nav.slice(0, MAX_NAV - 1) : props.nav)
const MoreNav = computed(() => HasMore.value ? props.nav.slice(MAX_NAV - 1) : [])
const MoreActive = computed(() => MoreNav.value.some(item => item.name === props.active))

function OnMedia(event) {
    Mobile.value = event.matches
}

onMounted(() => {
    Media?.addEventListener('change', OnMedia)
})

onUnmounted(() => {
    Media?.removeEventListener('change', OnMedia)
})

function Select(item, close) {
    close()
    emit('navigate', item)
}

watch(() => props.active, () => {
    MoreOpen.value = false
})

watch(HasMore, value => {
    if (!value) MoreOpen.value = false
})

provide(HEADER_TARGET, HeaderTarget)
</script>
