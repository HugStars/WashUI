<template>
    <div class="wa_shell">
        <header class="wa_header">
            <div ref="HeaderTarget" class="wa_header_slot"></div>
        </header>

        <nav v-if="nav.length" ref="NavEl" class="wa_nav"
            :class="[{ slider_ready: SliderReady }, navLayout !== 'auto' && `wa_nav_${navLayout}`]" aria-label="主导航"
            @pointerdown="OnPressStart" @contextmenu="OnContextMenu">
            <span class="wa_nav_slider" :class="{ ready: SliderReady }" :style="SliderStyle" aria-hidden="true">
                <span class="wa_nav_slider_inner" :class="{ bounce: SliderBounce, press: SliderPress }"
                    @animationend="OnSliderAnimationEnd"></span>
            </span>

            <button v-for="item in VisibleNav" :key="item.name" :ref="el => SetItemEl(item.name, el)" type="button"
                class="wa_nav_item" :class="{ on: item.name === active, pressed: PressedKey === item.name }"
                :aria-current="item.name === active ? 'page' : undefined" :aria-label="item.label"
                :title="navLayout === 'icon' ? item.label : undefined" @click="emit('navigate', item)">
                <AppIcon :name="item.icon" :size="20" />
                <span class="wa_nav_label">{{ item.label }}</span>
            </button>

            <AppPopover v-if="MoreNav.length" v-model:open="MoreOpen" placement="top" :width="168" :offset="-12"
                :padding="6" role="listbox" aria-label="更多导航">
                <template #trigger="{ open }">
                    <button :ref="el => SetItemEl(MORE_KEY, el)" type="button" class="wa_nav_item"
                        :class="{ on: MoreActive, open, pressed: PressedKey === MORE_KEY }"
                        :aria-current="MoreActive ? 'page' : undefined" aria-label="更多" aria-haspopup="listbox"
                        :aria-expanded="open" title="更多">
                        <AppIcon name="more" :size="20" />
                        <span class="wa_nav_label">更多</span>
                    </button>
                </template>
                <template #default="{ close }">
                    <AppSelectPanel :options="MoreOptions" :model-value="active" :check-icon="false"
                        @select="item => SelectMore(item, close)" />
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
import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import AppPopover from '../components/AppPopover.vue'
import AppSelectPanel from '../components/AppSelectPanel.vue'
import { HEADER_TARGET } from '../core/keys.js'

const MAX_NAV = 4
const MORE_KEY = Symbol('wash-more')

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
const TouchMedia = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(hover: none)') : null
const ReducedMotion = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
const Mobile = ref(Media?.matches ?? false)
const HasMore = computed(() => Mobile.value && props.nav.length > MAX_NAV)
const VisibleNav = computed(() => HasMore.value ? props.nav.slice(0, MAX_NAV - 1) : props.nav)
const MoreNav = computed(() => HasMore.value ? props.nav.slice(MAX_NAV - 1) : [])
const MoreActive = computed(() => MoreNav.value.some(item => item.name === props.active))
const MoreOptions = computed(() => MoreNav.value.map(item => ({
    label: item.label,
    value: item.name,
    icon: item.icon,
})))

const NavEl = ref(null)
const ItemEls = new Map()
const SliderTarget = computed(() => MoreActive.value ? MORE_KEY : props.active)
const SliderStyle = ref({})
const SliderReady = ref(false)
const SliderBounce = ref(false)
const SliderPress = ref(false)
const PressedKey = ref(null)

let PressTimer = null
let BounceFrame = 0
let NavResizeObserver = null

function SetItemEl(name, el) {
    if (el) ItemEls.set(name, el)
    else ItemEls.delete(name)
}

function UpdateSlider() {
    const nav = NavEl.value
    const el = ItemEls.get(SliderTarget.value)

    if (!nav || !el) {
        SliderReady.value = false
        return
    }

    // 用布局尺寸而不是 getBoundingClientRect：后者会被 :hover/:active 的 transform 影响
    SliderStyle.value = {
        left: `${el.offsetLeft}px`,
        top: `${el.offsetTop}px`,
        width: `${el.offsetWidth}px`,
        height: `${el.offsetHeight}px`,
    }
    SliderReady.value = true
}

function PlayBounce() {
    cancelAnimationFrame(BounceFrame)
    SliderBounce.value = false

    if (ReducedMotion?.matches) return

    BounceFrame = requestAnimationFrame(() => {
        BounceFrame = requestAnimationFrame(() => {
            SliderBounce.value = true
        })
    })
}

function OnSliderAnimationEnd(event) {
    if (event.target === event.currentTarget) SliderBounce.value = false
}

function ClearPress() {
    clearTimeout(PressTimer)
    PressTimer = null
    SliderPress.value = false
    PressedKey.value = null
}

function OnPressStart(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const item = event.target.closest?.('.wa_nav_item')
    if (!item) return

    ClearPress()

    for (const [key, el] of ItemEls) {
        if (el === item) {
            PressedKey.value = key
            break
        }
    }

    PressTimer = setTimeout(() => {
        PressTimer = null
        SliderPress.value = true
    }, 320)
}

function OnContextMenu(event) {
    // 触屏长按会触发 contextmenu，这里只保留导航自己的长按反馈
    if (Mobile.value || TouchMedia?.matches) event.preventDefault()
}

function OnMedia(event) {
    Mobile.value = event.matches
}

onMounted(async () => {
    Media?.addEventListener('change', OnMedia)
    window.addEventListener('pointerup', ClearPress)
    window.addEventListener('pointercancel', ClearPress)
    window.addEventListener('resize', UpdateSlider)

    if (typeof ResizeObserver !== 'undefined') {
        NavResizeObserver = new ResizeObserver(UpdateSlider)
        if (NavEl.value) NavResizeObserver.observe(NavEl.value)
    }

    await nextTick()
    UpdateSlider()
    document.fonts?.ready?.then(UpdateSlider)
})

onUnmounted(() => {
    Media?.removeEventListener('change', OnMedia)
    window.removeEventListener('pointerup', ClearPress)
    window.removeEventListener('pointercancel', ClearPress)
    window.removeEventListener('resize', UpdateSlider)
    NavResizeObserver?.disconnect()
    NavResizeObserver = null
    cancelAnimationFrame(BounceFrame)
    clearTimeout(PressTimer)
})

function SelectMore(item, close) {
    close()
    const target = MoreNav.value.find(nav => nav.name === item.value)
    if (target) emit('navigate', target)
}

watch(() => props.active, () => {
    MoreOpen.value = false
})

watch(SliderTarget, () => {
    nextTick(() => {
        UpdateSlider()
        PlayBounce()
    })
})

watch(HasMore, value => {
    if (!value) MoreOpen.value = false
    nextTick(UpdateSlider)
})

watch([VisibleNav, () => props.navLayout], () => {
    nextTick(UpdateSlider)
})

watch(NavEl, (el, old) => {
    if (old) NavResizeObserver?.unobserve(old)
    if (el) {
        NavResizeObserver?.observe(el)
        nextTick(UpdateSlider)
    }
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
    --wa_nav_item_radius: 14px;

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

.wa_nav_slider {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 0;
    height: 0;
    border-radius: var(--wa_nav_item_radius);
    opacity: 0;
    pointer-events: none;
    transition:
        left .34s var(--wa_ease_spring),
        top .34s var(--wa_ease_spring),
        width .34s var(--wa_ease_spring),
        height .34s var(--wa_ease_spring),
        opacity var(--wa_duration_fast) linear;
}

.wa_nav_slider.ready {
    opacity: 1;
}

.wa_nav_slider_inner {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--wa_color_nav_active);
    transition: transform var(--wa_duration_base) ease;
}

.wa_nav_slider_inner.press {
    transform: scale(.9);
}

.wa_nav_slider_inner.bounce {
    animation: wa_nav_slider_bounce .45s cubic-bezier(.22, .61, .36, 1);
}

.wa_nav_item {
    position: relative;
    z-index: 1;
    display: grid;
    flex: none;
    place-items: center;
    width: 42px;
    height: 42px;
    padding: 0;
    border: 0;
    border-radius: var(--wa_nav_item_radius);
    color: var(--wa_color_text_subtle);
    background: transparent;
    cursor: pointer;
    user-select: none;
    -webkit-touch-callout: none;
    white-space: nowrap;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast), transform var(--wa_duration_fast);
}

.wa_nav_item:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

@media (hover: hover) {
    .wa_nav_item:hover {
        transform: translateY(-1px);
    }
}

.wa_nav_item.open {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_nav_item.on,
.wa_nav_item.on:hover {
    color: var(--wa_color_text);
    transform: none;
}

.wa_nav.slider_ready .wa_nav_item.on,
.wa_nav.slider_ready .wa_nav_item.on:hover {
    color: var(--wa_color_on_nav_active);
}

/* 放在 .on 之后并提高特异性：触屏上 hover 背景会保持，不能让它覆盖按下的缩放 */
.wa_nav_item:active,
.wa_nav_item.pressed,
.wa_nav_item.on:active,
.wa_nav_item.on.pressed,
.wa_nav_item.open:active,
.wa_nav_item.open.pressed {
    transform: scale(.94);
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
        --wa_nav_item_radius: var(--wa_radius_pill);

        position: fixed;
        top: auto;
        right: 14px;
        bottom: calc(14px + env(safe-area-inset-bottom));
        left: 14px;
        flex-direction: row;
        justify-content: flex-start;
        gap: 6px;
        padding: 4px;
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

@keyframes wa_nav_slider_bounce {
    0% {
        scale: 1 1;
    }

    35% {
        scale: 1.08 .93;
    }

    58% {
        scale: .98 1.02;
    }

    78% {
        scale: 1.015 .99;
    }

    100% {
        scale: 1 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_nav_slider {
        transition: opacity var(--wa_duration_fast) linear;
    }

    .wa_nav_slider_inner {
        transition: none;
    }

    .wa_nav_slider_inner.bounce {
        animation: none;
    }
}
</style>
