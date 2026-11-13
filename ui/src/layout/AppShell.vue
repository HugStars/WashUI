<template>
    <div class="wa_shell" :class="{ wa_shell_nav_hidden: NavHidden, wa_shell_nav_auto_hide: autoHideNav }">
        <header class="wa_header">
            <div ref="HeaderTarget" class="wa_header_slot"></div>
            <div ref="HeaderBarTarget" class="wa_header_bar"></div>
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

            <AppPopover v-if="MoreNav.length" v-model:open="MoreOpen" placement="top" :width="128" :gap="12"
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
                        autofocus @select="item => SelectMore(item, close)" />
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
import { HEADER_BAR_TARGET, HEADER_TARGET } from '../core/keys.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'

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
    /**
     * @type {'auto' | 'inline' | 'stacked' | 'icon' | 'text'}
     */
    navLayout: {
        type: String,
        default: 'auto',
    },
    // note 预留给顶部进度条；当前内置 AppRouteBar 已关闭，需要时单独挂载
    loading: {
        type: Boolean,
        default: undefined,
    },
    /** 移动端根据手指上滑 / 下滑自动隐藏或显示底部导航 */
    autoHideNav: Boolean,
    /** 手势判定阈值（px） */
    autoHideThreshold: {
        type: Number,
        default: 10,
    },
})

const emit = defineEmits(['navigate'])

const HeaderTarget = ref(null)
const HeaderBarTarget = ref(null)
const MoreOpen = ref(false)
const Media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 860px)') : null
const TouchMedia = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(hover: none)') : null
const ReducedMotion = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
const Mobile = ref(Media?.matches ?? false)
const NavHidden = ref(false)
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
const { Press: SliderPress, PressedKey, Start: OnPressStart } = usePressFeedback(
    '.wa_nav_item',
    ItemEls
)

let BounceFrame = 0
let SliderFrame = 0
let NavResizeObserver = null
let Unmounted = false

function SetItemEl(name, el) {
    if (el) ItemEls.set(name, el)
    else ItemEls.delete(name)
}

function UpdateSlider() {
    // note 直接调用时取消排队中的帧，避免和 ResizeObserver 同帧重复读取 offsetLeft/offsetTop
    cancelAnimationFrame(SliderFrame)
    SliderFrame = 0

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

// * resize 合并到 rAF，避免和 ResizeObserver 在同一帧重复测量导航滑块
function ScheduleSlider() {
    if (SliderFrame) return
    SliderFrame = requestAnimationFrame(() => {
        SliderFrame = 0
        UpdateSlider()
    })
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

function OnContextMenu(event) {
    // 触屏长按会触发 contextmenu，这里只保留导航自己的长按反馈
    if (Mobile.value || TouchMedia?.matches) event.preventDefault()
}

function OnMedia(event) {
    Mobile.value = event.matches
    if (!event.matches) NavHidden.value = false
}

// section 手势隐藏底部导航
// * 只认手指移动方向：上滑隐藏、下滑显示，页面滚动到顶部时强制显示
let TouchStartY = 0
let TouchStartX = 0

function OnTouchStart(event) {
    if (!props.autoHideNav || !Mobile.value || event.touches.length !== 1) return
    TouchStartY = event.touches[0].clientY
    TouchStartX = event.touches[0].clientX
}

function OnTouchMove(event) {
    if (!props.autoHideNav || !Mobile.value || event.touches.length !== 1) return

    const dy = event.touches[0].clientY - TouchStartY
    const dx = event.touches[0].clientX - TouchStartX
    const threshold = Math.max(4, Number(props.autoHideThreshold) || 10)

    if (Math.abs(dy) < threshold || Math.abs(dy) <= Math.abs(dx)) return

    NavHidden.value = dy < 0
}

function OnScrollTop() {
    if (window.scrollY <= 0) NavHidden.value = false
}

function BindGesture() {
    window.addEventListener('touchstart', OnTouchStart, { passive: true })
    window.addEventListener('touchmove', OnTouchMove, { passive: true })
    window.addEventListener('scroll', OnScrollTop, { passive: true })
}

function UnbindGesture() {
    window.removeEventListener('touchstart', OnTouchStart)
    window.removeEventListener('touchmove', OnTouchMove)
    window.removeEventListener('scroll', OnScrollTop)
}

watch(() => props.autoHideNav, value => {
    if (value) {
        BindGesture()
    } else {
        UnbindGesture()
        NavHidden.value = false
    }
})

onMounted(async () => {
    Media?.addEventListener('change', OnMedia)
    window.addEventListener('resize', ScheduleSlider)

    if (props.autoHideNav) {
        BindGesture()
    }

    if (typeof ResizeObserver !== 'undefined') {
        NavResizeObserver = new ResizeObserver(UpdateSlider)
        if (NavEl.value) NavResizeObserver.observe(NavEl.value)
    }

    await nextTick()
    UpdateSlider()
    document.fonts?.ready?.then(() => {
        if (!Unmounted) UpdateSlider()
    })
})

onUnmounted(() => {
    Unmounted = true
    Media?.removeEventListener('change', OnMedia)
    window.removeEventListener('resize', ScheduleSlider)
    window.removeEventListener('touchstart', OnTouchStart)
    window.removeEventListener('touchmove', OnTouchMove)
    window.removeEventListener('scroll', OnScrollTop)
    NavResizeObserver?.disconnect()
    NavResizeObserver = null
    cancelAnimationFrame(BounceFrame)
    cancelAnimationFrame(SliderFrame)
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
provide(HEADER_BAR_TARGET, HeaderBarTarget)
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
    --wa_header_pad_x: 24px;
    z-index: var(--wa_z_header);
    min-height: 68px;
    margin: 0 -24px 18px;
    padding: 16px var(--wa_header_pad_x) 12px;
    background: linear-gradient(to bottom, var(--wa_color_canvas), transparent);
    -webkit-backdrop-filter: var(--wa_frosted_filter);
    backdrop-filter: var(--wa_frosted_filter);
}

.wa_header_slot {
    min-width: 0;
}

.wa_header_bar {
    margin-top: 8px;
}

.wa_header_bar:empty {
    display: none;
}

/* bleed 时让操作栏抵消 header 的左右内边距，横向铺满 */
.wa_header_bar:has(> .wa_page_bar_bleed) {
    margin-inline: calc(var(--wa_header_pad_x) * -1);
}

.wa_nav {
    --wa_nav_item_radius: var(--wa_radius_popover);

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
    border-radius: var(--wa_radius_card);
    background: var(--wa_color_glass);
    background: var(--wa_glass_gradient);
    -webkit-backdrop-filter: var(--wa_frosted_filter);
    backdrop-filter: var(--wa_frosted_filter);
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
        left var(--wa_duration_slow) var(--wa_ease_spring),
        top var(--wa_duration_slow) var(--wa_ease_spring),
        width var(--wa_duration_slow) var(--wa_ease_spring),
        height var(--wa_duration_slow) var(--wa_ease_spring),
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
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_nav_slider_inner.press {
    transform: scale(.9);
}

.wa_nav_slider_inner.bounce {
    animation: wa_nav_slider_bounce var(--wa_duration_slower) cubic-bezier(.22, .61, .36, 1);
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
    transform-origin: center;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_nav_item:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

@media (hover: hover) {
    .wa_nav_item:hover {
        transform: translateY(-1px);
        box-shadow: var(--wa_shadow_thumb_soft);
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

/* * 触屏没有 hover，用按下态补上阴影反馈 */
@media (hover: none) {

    .wa_nav_item:active,
    .wa_nav_item.pressed {
        box-shadow: var(--wa_shadow_thumb_soft);
    }
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
    color: var(--wa_color_text_subtle);
    display: flex;
    justify-content: center;
    /* note 使用组件自己的变量并保留 10px 默认值，不再依赖文档站的 --doc_side_padding */
    gap: var(--wa_footer_gap, 10px);
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
        padding: 0 14px calc(18px + 68px + env(safe-area-inset-bottom));
    }

    .wa_header {
        --wa_header_pad_x: 14px;

        margin-inline: -14px;
        padding: calc(16px + env(safe-area-inset-top)) var(--wa_header_pad_x) 12px;
    }

    .wa_header:has(.wa_header_bar > *) {
        /* 有操作栏时收紧底部内边距，避免与 tabs 自身留白叠加 */
        padding-bottom: 8px;
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
        transition:
            translate var(--wa_duration_base) var(--wa_ease_out),
            opacity var(--wa_duration_fast) var(--wa_ease_out);
    }

    /* * autoHideNav：手指上滑隐藏、下滑或回到顶部显示 */
    .wa_shell_nav_hidden .wa_nav {
        translate: 0 calc(100% + 28px);
        opacity: 0;
        pointer-events: none;
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

    .wa_nav_item:active,
    .wa_nav_item.pressed,
    .wa_nav_item.on.pressed,
    .wa_nav_item.open.pressed {
        transform: none;
    }
}
</style>
