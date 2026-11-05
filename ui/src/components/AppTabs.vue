<template>
    <div class="wa_tabs" :class="[
        `wa_tabs_${variant}`,
        {
            wa_tabs_md: size === 'md',
            wa_tabs_transparent: transparent,
            wa_tabs_fill: ShouldFill,
        },
    ]">
        <div ref="ListEl" class="wa_tabs_list" :class="{ ready: SliderReady }" role="tablist" :aria-label="ariaLabel"
            @keydown="OnKeydown" @pointerdown="OnPressStart">
            <span class="wa_tabs_slider" :class="{ ready: SliderReady }" :style="SliderStyle" aria-hidden="true">
                <span class="wa_tabs_slider_inner" :class="{ bounce: SliderBounce, press: SliderPress }"
                    @animationend="OnSliderAnimationEnd"></span>
            </span>

            <button v-for="(item, index) in VisibleItems" :key="item.name" :ref="el => SetTabEl(item.name, el)"
                type="button" :id="TabId(index)" class="wa_tabs_tab"
                :class="{ on: item.name === modelValue, pressed: PressedKey === item.name }" role="tab"
                :aria-selected="item.name === modelValue" :aria-controls="HasPanel ? PanelId : undefined"
                :tabindex="item.name === modelValue ? 0 : -1" :disabled="item.disabled" @click="Choose(item, index)">
                <AppIcon v-if="item.icon" :name="item.icon" :size="IconSize" />
                <span>{{ item.label }}</span>
            </button>

            <!-- 与 AppShell 的更多菜单保持一致：固定 12px 间距，翻转时也不变 -->
            <AppPopover v-if="HiddenItems.length" v-model:open="MoreOpen" placement="bottom" :width="180" :gap="12"
                :padding="6" role="listbox" aria-label="更多标签">
                <template #trigger="{ open }">
                    <button :ref="el => SetTabEl(MORE_KEY, el)" :id="`${uid}-more`" type="button"
                        class="wa_tabs_tab wa_tabs_more"
                        :class="{ on: MoreActive, open, pressed: PressedKey === MORE_KEY }" role="tab"
                        :aria-selected="MoreActive" :aria-controls="HasPanel ? PanelId : undefined"
                        :aria-haspopup="'listbox'" :aria-expanded="open" :tabindex="MoreActive ? 0 : -1">
                        <AppIcon name="more" :size="18" />
                        <span>更多</span>
                    </button>
                </template>
                <template #default="{ close }">
                    <AppSelectPanel :options="MoreOptions" :model-value="modelValue" :size="size" :check-icon="false"
                        @select="item => SelectMore(item, close)" />
                </template>
            </AppPopover>
        </div>

        <div v-if="HasPanel" :id="PanelId" class="wa_tabs_panel" role="tabpanel"
            :aria-labelledby="PanelLabelledBy" tabindex="0">
            <slot :active="modelValue" :item="ActiveItem" />
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useId, useSlots, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import AppPopover from './AppPopover.vue'
import AppSelectPanel from './AppSelectPanel.vue'

const MORE_KEY = Symbol('wa-tabs-more')

const props = defineProps({
    modelValue: {
        type: [String, Number, Symbol],
        default: '',
    },
    /** { name, label, icon?, disabled? } */
    items: {
        type: Array,
        default: () => [],
    },
    /** nav：带外框与玻璃背景；plain：无边框、无外框、无阴影 */
    variant: {
        type: String,
        default: 'nav',
        allows: ['nav', 'plain'],
    },
    /** 去掉磨砂、背景、边框和阴影 */
    transparent: Boolean,
    size: {
        type: String,
        default: 'sm',
        allows: ['sm', 'md'],
    },
    /** 标签项等宽铺满 */
    fill: Boolean,
    /** 元素过多时的处理：scroll 横向滚动；more 收进“更多”按钮 */
    overflow: {
        type: String,
        default: 'scroll',
        allows: ['scroll', 'more'],
    },
    /** overflow=more 时最多显示的标签数（含“更多”） */
    max: {
        type: Number,
        default: 4,
    },
    ariaLabel: {
        type: String,
        default: '标签页',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const uid = useId()

const PanelId = `${uid}-panel`
const HasPanel = computed(() => !!slots.default)
const ActiveIndex = computed(() => props.items.findIndex(item => item.name === props.modelValue))
const ActiveItem = computed(() => props.items[ActiveIndex.value] || null)
const IconSize = computed(() => props.size === 'md' ? 17 : 16)
const ShouldFill = computed(() => props.fill || props.overflow === 'more')
const TabId = index => `${uid}-tab-${index}`

const Limit = computed(() => Math.max(2, props.max))
const VisibleItems = computed(() => {
    if (props.overflow !== 'more' || props.items.length <= Limit.value) return props.items
    return props.items.slice(0, Limit.value - 1)
})
const HiddenItems = computed(() => props.items.slice(VisibleItems.value.length))
const MoreActive = computed(() => HiddenItems.value.some(item => item.name === props.modelValue))
const SliderTarget = computed(() => MoreActive.value ? MORE_KEY : props.modelValue)
const PanelLabelledBy = computed(() => {
    if (MoreActive.value) return `${uid}-more`
    return ActiveIndex.value >= 0 ? TabId(ActiveIndex.value) : undefined
})
const MoreOptions = computed(() => HiddenItems.value.map(item => ({
    label: item.label,
    value: item.name,
    icon: item.icon,
    disabled: item.disabled,
})))

const ListEl = ref(null)
const TabEls = new Map()
const SliderStyle = ref({})
const SliderReady = ref(false)
const SliderBounce = ref(false)
const SliderPress = ref(false)
const PressedKey = ref(null)
const MoreOpen = ref(false)

let PressTimer = null
let BounceFrame = 0
let ResizeObserverInstance = null

function SetTabEl(name, el) {
    if (el) TabEls.set(name, el)
    else TabEls.delete(name)
}

function UpdateSlider() {
    const list = ListEl.value
    const el = TabEls.get(SliderTarget.value)

    if (!list || !el) {
        SliderReady.value = false
        return
    }

    SliderStyle.value = {
        left: `${el.offsetLeft}px`,
        top: `${el.offsetTop}px`,
        width: `${el.offsetWidth}px`,
        height: `${el.offsetHeight}px`,
    }
    SliderReady.value = true
}

function ScrollActiveIntoView() {
    const list = ListEl.value
    const el = TabEls.get(SliderTarget.value)
    if (!list || !el) return

    const max = list.scrollWidth - list.clientWidth
    if (max <= 1) return

    const target = el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2
    list.scrollTo({
        left: Math.max(0, Math.min(max, target)),
        behavior: 'smooth',
    })
}

function Choose(item, index) {
    if (item.disabled) return
    if (item.name === props.modelValue) return
    emit('update:modelValue', item.name)
    emit('change', item, index)
}

function OnKeydown(event) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return

    const enabled = props.items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.disabled)
    if (!enabled.length) return

    event.preventDefault()

    const current = enabled.findIndex(({ item }) => item.name === props.modelValue)
    let next = 0

    if (event.key === 'End') next = enabled.length - 1
    else if (event.key === 'ArrowRight') next = current < 0 ? 0 : (current + 1) % enabled.length
    else if (event.key === 'ArrowLeft') next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length

    const target = enabled[next]
    Choose(target.item, target.index)
    nextTick(() => {
        const el = TabEls.get(target.item.name) || TabEls.get(MORE_KEY)
        el?.focus()
    })
}

function SelectMore(option, close) {
    if (option.disabled) return
    const index = props.items.findIndex(item => item.name === option.value)
    if (index >= 0) Choose(props.items[index], index)
    close()
}

function PlayBounce() {
    cancelAnimationFrame(BounceFrame)
    SliderBounce.value = false

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

    const tab = event.target.closest?.('.wa_tabs_tab')
    if (!tab) return

    ClearPress()

    for (const [key, el] of TabEls) {
        if (el === tab) {
            PressedKey.value = key
            break
        }
    }

    PressTimer = setTimeout(() => {
        PressTimer = null
        SliderPress.value = true
    }, 320)
}

onMounted(() => {
    nextTick(() => {
        UpdateSlider()
        ScrollActiveIntoView()
    })

    window.addEventListener('pointerup', ClearPress)
    window.addEventListener('pointercancel', ClearPress)
    window.addEventListener('resize', UpdateSlider)
    document.fonts?.ready?.then(UpdateSlider)

    if (typeof ResizeObserver !== 'undefined' && ListEl.value) {
        ResizeObserverInstance = new ResizeObserver(UpdateSlider)
        ResizeObserverInstance.observe(ListEl.value)
    }
})

onUnmounted(() => {
    window.removeEventListener('pointerup', ClearPress)
    window.removeEventListener('pointercancel', ClearPress)
    window.removeEventListener('resize', UpdateSlider)
    ResizeObserverInstance?.disconnect()
    ResizeObserverInstance = null
    cancelAnimationFrame(BounceFrame)
    clearTimeout(PressTimer)
})

watch(ListEl, (el, old) => {
    if (old) ResizeObserverInstance?.unobserve(old)
    if (el) {
        ResizeObserverInstance?.observe(el)
        nextTick(UpdateSlider)
    }
})

watch(() => props.modelValue, () => {
    MoreOpen.value = false
    nextTick(() => {
        UpdateSlider()
        PlayBounce()
        ScrollActiveIntoView()
    })
})

watch(
    [() => props.items, () => props.size, () => props.variant, () => props.fill, () => props.overflow, () => props.max],
    () => nextTick(UpdateSlider),
    { deep: true },
)
</script>

<style>
.wa_tabs {
    --wa_tabs_height: 34px;
    --wa_tabs_font: 13px;

    display: grid;
    gap: 12px;
    min-width: 0;
}

.wa_tabs_md {
    --wa_tabs_height: 40px;
    --wa_tabs_font: 14px;
}

.wa_tabs_list {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid var(--wa_color_border);
    border-radius: var(--wa_radius_pill);
    background: var(--wa_color_glass);
    background: linear-gradient(to bottom, var(--wa_color_glass), color-mix(in srgb, var(--wa_color_glass) 68%, transparent));
    -webkit-backdrop-filter: blur(var(--wa_blur));
    backdrop-filter: blur(var(--wa_blur));
    box-shadow: var(--wa_shadow_nav);
    scrollbar-width: none;
}

.wa_tabs_list::-webkit-scrollbar {
    display: none;
}

.wa_tabs_plain .wa_tabs_list {
    gap: 4px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
}

.wa_tabs_transparent .wa_tabs_list {
    border: 0;
    background: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
}

.wa_tabs_slider {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 0;
    height: 0;
    border-radius: var(--wa_radius_pill);
    opacity: 0;
    pointer-events: none;
    transition:
        left var(--wa_duration_slow) var(--wa_ease_spring),
        top var(--wa_duration_slow) var(--wa_ease_spring),
        width var(--wa_duration_slow) var(--wa_ease_spring),
        height var(--wa_duration_slow) var(--wa_ease_spring),
        opacity var(--wa_duration_fast) linear;
}

.wa_tabs_slider.ready {
    opacity: 1;
}

.wa_tabs_slider_inner {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--wa_color_nav_active);
    transition: transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_tabs_slider_inner.press {
    transform: scale(.9);
}

.wa_tabs_slider_inner.bounce {
    animation: wa_tabs_bounce .45s var(--wa_ease_out);
}

.wa_tabs_tab {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex: none;
    height: var(--wa_tabs_height);
    padding: 0 14px;
    border: 0;
    border-radius: var(--wa_radius_pill);
    color: var(--wa_color_text_subtle);
    background: transparent;
    font: inherit;
    font-size: var(--wa_tabs_font);
    white-space: nowrap;
    cursor: pointer;
    transform-origin: center;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

/* 图标不参与压缩；“更多”固定 18×18，与 AppShell 导航一致 */
.wa_tabs_tab>svg,
.wa_tabs_tab>.wa_icon_raw {
    flex: none;
}

.wa_tabs_more>svg,
.wa_tabs_more>.wa_icon_raw {
    width: 18px;
    height: 18px;
}

.wa_tabs_md .wa_tabs_tab {
    padding: 0 18px;
}

.wa_tabs_fill .wa_tabs_tab {
    flex: 1 1 0;
    min-width: 0;
}

@media (hover: hover) and (pointer: fine) {
    .wa_tabs_tab:hover {
        color: var(--wa_color_text);
        background: var(--wa_color_hover);
    }
}

.wa_tabs_tab:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_tabs_tab.open {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_tabs_tab.on,
.wa_tabs_tab.on:hover {
    color: var(--wa_color_text);
    background: transparent;
    transform: none;
}

.wa_tabs_list.ready .wa_tabs_tab.on,
.wa_tabs_list.ready .wa_tabs_tab.on:hover {
    color: var(--wa_color_on_nav_active);
}

.wa_tabs_tab:active,
.wa_tabs_tab.pressed,
.wa_tabs_tab.on:active,
.wa_tabs_tab.on.pressed {
    transform: scale(.94);
}

.wa_tabs_tab:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_tabs_panel {
    min-width: 0;
}

.wa_tabs_panel:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 4px;
    border-radius: var(--wa_radius_control);
}

@keyframes wa_tabs_bounce {
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
    .wa_tabs_slider {
        transition: opacity var(--wa_duration_fast) linear;
    }

    .wa_tabs_slider_inner,
    .wa_tabs_tab {
        transition: none;
    }

    .wa_tabs_slider_inner.bounce {
        animation: none;
    }

    .wa_tabs_slider_inner.press,
    .wa_tabs_tab:active,
    .wa_tabs_tab.pressed,
    .wa_tabs_tab.on:active,
    .wa_tabs_tab.on.pressed {
        transform: none;
    }
}
</style>
