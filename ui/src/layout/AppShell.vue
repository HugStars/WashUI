<template>
    <div class="wa_shell">
        <header class="wa_header">
            <div ref="HeaderTarget" class="wa_header_slot"></div>
        </header>

        <nav v-if="nav.length" class="wa_nav" :class="navLayout !== 'auto' && `wa_nav_${navLayout}`" aria-label="主导航">
            <button v-for="item in VisibleNav" :key="item.name" type="button" class="wa_nav_item"
                :class="{ on: item.name === active }" :aria-current="item.name === active ? 'page' : undefined"
                :aria-label="item.label" :title="navLayout === 'icon' ? item.label : undefined"
                @click="emit('navigate', item)">
                <AppIcon :name="item.icon" :size="20" />
                <span class="wa_nav_label">{{ item.label }}</span>
            </button>

            <AppPopover v-if="MoreNav.length" v-model:open="MoreOpen" placement="top" :width="140" :offset="-12"
                role="menu" aria-label="更多导航">
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
import { HEADER_TARGET } from '../core/keys.js'

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
        allows: ['auto', 'inline', 'stacked', 'icon', 'text'],
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

<style>
.wa_shell {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        'header header'
        'nav main'
        'footer footer';
    column-gap: 22px;
    width: 100%;
    max-width: var(--wa_body_width);
    min-height: 100vh;
    margin: 0 auto;
    padding: 0 24px;
    font: 14px/1.6 var(--wa_font_family);
    color: var(--wa_color_text);
    background: var(--wa_color_canvas);
}

.wa_header {
    grid-area: header;
    position: sticky;
    top: 0;
    z-index: var(--wa_z_header);
    min-height: 68px;
    margin: 0 -24px 18px;
    padding: 16px 24px 12px;
    background: linear-gradient(to bottom, var(--wa_color_canvas), transparent);
    -webkit-backdrop-filter: blur(var(--wa_blur));
    backdrop-filter: blur(var(--wa_blur));
}

.wa_header_slot {
    min-width: 0;
}

.wa_nav {
    grid-area: nav;
    position: sticky;
    top: 86px;
    align-self: flex-start;
    z-index: var(--wa_z_nav);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 8px;
    border: 1px solid var(--wa_color_border);
    border-radius: 22px;
    background: var(--wa_color_glass);
    background: linear-gradient(to bottom, var(--wa_color_glass), color-mix(in srgb, var(--wa_color_glass) 68%, transparent));
    -webkit-backdrop-filter: blur(var(--wa_blur));
    backdrop-filter: blur(var(--wa_blur));
    box-shadow: var(--wa_shadow_nav);
}

.wa_nav_item {
    display: grid;
    flex: none;
    place-items: center;
    width: 42px;
    height: 42px;
    padding: 0;
    border: 0;
    border-radius: 14px;
    color: var(--wa_color_text_subtle);
    background: transparent;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast), transform var(--wa_duration_fast);
}

.wa_nav_item:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
    transform: translateY(-1px);
}

.wa_nav_item:active {
    transform: scale(.94);
}

.wa_nav_item.on,
.wa_nav_item.on:hover {
    color: var(--wa_color_on_nav_active);
    background: var(--wa_color_nav_active);
    transform: none;
}

.wa_nav_item:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_nav_label {
    display: none;
}

.wa_nav_inline .wa_nav_item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: auto;
    height: 42px;
    padding: 0 14px;
}

.wa_nav_stacked .wa_nav_item {
    gap: 4px;
    width: auto;
    min-width: 58px;
    height: auto;
    padding: 8px 10px;
}

.wa_nav_text .wa_nav_item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 42px;
    padding: 0 16px;
}

.wa_nav_text .wa_nav_item>svg {
    display: none;
}

.wa_nav_inline .wa_nav_label,
.wa_nav_stacked .wa_nav_label,
.wa_nav_text .wa_nav_label {
    display: block;
    max-width: 7em;
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_main {
    grid-area: main;
    min-width: 0;
    min-height: 300px;
}

.wa_footer {
    grid-area: footer;
    padding: 40px 0;
    font-size: 13px;
    text-align: center;
    color: var(--wa_color_text_faint);
    display: flex;
    justify-content: center;
    gap: var(--doc_side_padding);
}

.wa_footer a {
    color: var(--wa_color_text_subtle);
    text-decoration: none;
    transition: color var(--wa_duration_base);
}

.wa_footer a:hover {
    color: var(--wa_color_text);
}

@media (max-width: 860px) {
    .wa_shell {
        display: block;
        padding: 0 14px calc(18px + 78px + env(safe-area-inset-bottom));
    }

    .wa_header {
        margin-inline: -14px;
        padding: 16px 14px 12px;
    }

    .wa_nav {
        position: fixed;
        top: auto;
        right: 14px;
        bottom: calc(14px + env(safe-area-inset-bottom));
        left: 14px;
        flex-direction: row;
        justify-content: flex-start;
        gap: 6px;
        padding: 9px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        scroll-snap-type: x proximity;
        -webkit-overflow-scrolling: touch;
        border-radius: var(--wa_radius_pill);
        box-shadow: var(--wa_shadow_nav_mobile);
    }

    .wa_nav::-webkit-scrollbar {
        display: none;
    }

    .wa_nav_item {
        flex: 1 1 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-width: 0;
        width: auto;
        height: auto;
        padding: 12px 6px;
        scroll-snap-align: center;
        border-radius: var(--wa_radius_pill);
    }

    .wa_nav_item:hover {
        transform: none;
    }

    .wa_nav_item svg {
        width: 18px;
        height: 18px;
    }

    .wa_nav_label {
        display: inline-block;
        min-width: 0;
        max-width: 6em;
        overflow: hidden;
        font-size: 13px;
        font-weight: 500;
        line-height: 1;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
    }

    .wa_nav_icon {
        justify-content: center;
    }

    .wa_nav_icon .wa_nav_item {
        flex: none;
        width: 42px;
        height: 42px;
        padding: 0;
    }

    .wa_nav_icon .wa_nav_label {
        display: none;
    }

    .wa_nav_inline .wa_nav_item {
        flex: 0 0 auto;
        height: auto;
        padding: 12px;
    }

    .wa_nav_text .wa_nav_item {
        flex: 0 0 auto;
        padding: 12px 18px;
    }

    .wa_nav_stacked .wa_nav_item {
        flex: 0 0 auto;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
        padding: 7px 12px;
    }

    .wa_nav_stacked .wa_nav_label {
        font-size: 12px;
    }

    .wa_footer {
        padding: 24px 0;
    }
}

.wa_nav_more_list {
    display: grid;
    gap: 2px;
}

.wa_nav_more_item {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    padding: 9px 10px;
    border: 0;
    border-radius: 9px;
    color: var(--wa_color_text_muted);
    background: transparent;
    font: inherit;
    font-size: 13px;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.wa_nav_more_item>svg {
    flex: none;
}

.wa_nav_more_item:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_nav_more_item.on,
.wa_nav_more_item.on:hover {
    color: var(--wa_color_on_nav_active);
    background: var(--wa_color_nav_active);
    font-weight: 600;
}
</style>
