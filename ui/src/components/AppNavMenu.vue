<template>
    <nav v-if="NormalizedGroups.length" class="wa_nav_menu" :class="`wa_nav_menu_${size}`" :aria-label="ariaLabel">
        <div ref="BodyEl" class="wa_nav_menu_body">
            <span class="wa_nav_menu_glider" :class="{ ready: GliderReady }" :style="GliderStyle" aria-hidden="true"></span>

            <div v-for="group in NormalizedGroups" :key="group.key" class="wa_nav_menu_group">
                <p v-if="group.title" class="wa_nav_menu_title">{{ group.title }}</p>

                <div class="wa_nav_menu_list">
                    <component :is="ItemTag(item)" v-for="(item, index) in group.items"
                        :key="ItemKey(item, index, group)" :ref="el => SetItemEl(ItemKey(item, index, group), el)"
                        v-bind="LinkProps(item)" class="wa_nav_menu_link"
                        :class="{ on: IsActive(item, index), off: item.disabled }"
                        :aria-current="IsActive(item, index) ? 'page' : undefined"
                        :aria-disabled="item.disabled || undefined" :tabindex="item.disabled ? -1 : undefined"
                        @click="OnClick(item, index, $event)">
                        <AppIcon v-if="item.icon" :name="item.icon" :size="IconSize" class="wa_nav_menu_icon" />
                        <span class="wa_nav_menu_text">{{ item.label }}</span>
                        <AppBadge v-if="item.badge" v-bind="BadgeProps(item)" readonly class="wa_nav_menu_badge"
                            aria-hidden="true" />
                    </component>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AppBadge from './AppBadge.vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    /** 当前选中的菜单值 */
    modelValue: {
        type: [String, Number, Symbol],
        default: '',
    },
    /** 分组菜单：[{ title, items: [...] }]，items 与 options 都兼容 */
    groups: {
        type: Array,
        default: () => [],
    },
    /** 无分组菜单：[{ label, value, href, icon?, badge?, disabled? }] */
    items: {
        type: Array,
        default: () => [],
    },
    /** 链接组件；默认 a，传 RouterLink 时自动改用 to */
    linkComponent: {
        type: [String, Object, Function],
        default: 'a',
    },
    /**
     * md 用于侧栏，sm 用于紧凑菜单
     * @type {'md' | 'sm'}
     */
    size: {
        type: String,
        default: 'md',
    },
    ariaLabel: {
        type: String,
        default: '导航菜单',
    },
})

const emit = defineEmits(['update:modelValue', 'change', 'select'])

const BodyEl = ref(null)
const GliderReady = ref(false)
const GliderStyle = ref({})
const ItemEls = new Map()
let ResizeObserverInstance = null
let FirstPaint = true
let FirstTimer = 0

const NormalizedGroups = computed(() => {
    const groups = props.groups.map((group, index) => ({
        key: `group-${index}-${group.title || group.label || ''}`,
        title: group.title ?? group.label ?? '',
        items: group.items || group.options || [],
    }))

    // 与 AppSelectPanel 一致：groups 和 items 可以同时使用
    if (props.items.length) {
        groups.push({ key: 'default', title: '', items: props.items })
    }

    return groups
})

const IconSize = computed(() => props.size === 'sm' ? 16 : 18)

const ActiveKey = computed(() => {
    for (const group of NormalizedGroups.value) {
        for (let index = 0; index < group.items.length; index++) {
            if (IsActive(group.items[index], index)) {
                return ItemKey(group.items[index], index, group)
            }
        }
    }
    return ''
})

function ValueOf(item, index) {
    return item.value ?? item.href ?? index
}

function ItemKey(item, index, group) {
    return `${group.key}-${index}-${String(ValueOf(item, index))}`
}

function IsActive(item, index) {
    return ValueOf(item, index) === props.modelValue
}

function ItemTag(item) {
    return item.href ? props.linkComponent : 'button'
}

function LinkProps(item) {
    if (!item.href) return { type: 'button' }

    if (props.linkComponent === 'a') {
        return {
            href: item.href,
            target: item.external ? '_blank' : undefined,
            rel: item.external ? 'noreferrer' : undefined,
        }
    }

    return { to: item.href }
}

function SetItemEl(key, el) {
    const node = el?.$el || el
    if (typeof HTMLElement !== 'undefined' && node instanceof HTMLElement) ItemEls.set(key, node)
    else ItemEls.delete(key)
}

function BadgeProps(item) {
    const badge = item.badge

    if (badge === true) return { dot: true, value: '' }
    if (typeof badge === 'string' || typeof badge === 'number') return { value: badge }
    if (!badge || typeof badge !== 'object') return {}

    return {
        value: badge.text ?? badge.value ?? '',
        dot: !!badge.dot,
        tone: badge.tone || 'danger',
        max: badge.max ?? 99,
    }
}

function OnClick(item, index, event) {
    if (item.disabled) {
        event.preventDefault()
        return
    }

    const value = ValueOf(item, index)
    emit('update:modelValue', value)
    emit('change', value)
    emit('select', item)

    // 没有 href 的菜单项是动作按钮，不应该尝试跳转
    if (!item.href) event.preventDefault()
}

function UpdateGlider() {
    const body = BodyEl.value
    const el = ItemEls.get(ActiveKey.value)

    if (!body || !el) {
        GliderReady.value = false
        return
    }

    const bodyRect = body.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const next = {
        transform: `translate(${rect.left - bodyRect.left}px, ${rect.top - bodyRect.top}px)`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
    }

    // 首次直接落位，不要从左上角滑进来
    if (FirstPaint) {
        FirstPaint = false
        GliderStyle.value = { ...next, transition: 'none' }
        GliderReady.value = true
        FirstTimer = setTimeout(() => {
            GliderStyle.value = next
        }, 0)
        return
    }

    GliderStyle.value = next
    GliderReady.value = true
}

watch(ActiveKey, () => nextTick(UpdateGlider))
watch(() => props.size, () => nextTick(UpdateGlider))

onMounted(async () => {
    await nextTick()
    UpdateGlider()

    if (typeof ResizeObserver !== 'undefined' && BodyEl.value) {
        ResizeObserverInstance = new ResizeObserver(UpdateGlider)
        ResizeObserverInstance.observe(BodyEl.value)
    }

    window.addEventListener('resize', UpdateGlider)
})

onUnmounted(() => {
    clearTimeout(FirstTimer)
    ResizeObserverInstance?.disconnect()
    window.removeEventListener('resize', UpdateGlider)
    ItemEls.clear()
})
</script>

<style>
.wa_nav_menu {
    --wa_nav_gap: var(--wa_space_2);
    --wa_nav_pad_y: var(--wa_space_2);
    --wa_nav_pad_x: var(--wa_space_3);

    min-width: 0;
}

.wa_nav_menu_sm {
    --wa_nav_gap: 6px;
    --wa_nav_pad_y: 6px;
    --wa_nav_pad_x: 10px;
}

.wa_nav_menu_body {
    position: relative;
    display: grid;
    gap: var(--wa_nav_gap);
    min-width: 0;
}

.wa_nav_menu_glider {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_text);
    opacity: 0;
    pointer-events: none;
    transition:
        transform var(--wa_duration_base) var(--wa_ease_in_out),
        width var(--wa_duration_base) var(--wa_ease_in_out),
        height var(--wa_duration_base) var(--wa_ease_in_out),
        opacity var(--wa_duration_fast) var(--wa_ease_out);
    will-change: transform;
}

.wa_nav_menu_glider.ready {
    opacity: 1;
}

.wa_nav_menu_group {
    display: grid;
    gap: var(--wa_nav_gap);
    min-width: 0;
}

.wa_nav_menu_list {
    display: grid;
    gap: var(--wa_nav_gap);
    min-width: 0;
}

.wa_nav_menu_title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 var(--wa_nav_pad_x);
    color: var(--wa_color_text_muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    line-height: 1.5;
    white-space: nowrap;
}

/* 右侧细线把分组标题和菜单项分开，避免标题看起来像第一个选项 */
.wa_nav_menu_title::after {
    content: '';
    flex: 1;
    min-width: 12px;
    height: 1px;
    background: var(--wa_color_line);
}

.wa_nav_menu_link {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: var(--wa_space_2);
    width: 100%;
    min-width: 0;
    min-height: 36px;
    padding: var(--wa_nav_pad_y) var(--wa_nav_pad_x);
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_muted);
    background: transparent;
    font: inherit;
    font-size: 13px;
    line-height: 1.6;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_nav_menu_sm .wa_nav_menu_link {
    min-height: 30px;
    font-size: 12px;
}

.wa_nav_menu_link:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_nav_menu_link:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_nav_menu_link.on,
.wa_nav_menu_link.on:hover {
    color: var(--wa_color_on_text);
    background: transparent;
    font-weight: 600;
}

.wa_nav_menu_link.off {
    opacity: .45;
    cursor: not-allowed;
}

.wa_nav_menu_icon {
    flex: none;
    color: var(--wa_color_text_subtle);
}

.wa_nav_menu_link.on .wa_nav_menu_icon {
    color: inherit;
}

.wa_nav_menu_text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_nav_menu_badge {
    flex: none;
}

/* 选中项是反色底，neutral 角标需要同步反转，否则会和链接背景融在一起 */
.wa_nav_menu_link.on .wa_nav_menu_badge.wa_badge_neutral {
    --wa_badge_bg: var(--wa_color_on_text);
    --wa_badge_color: var(--wa_color_text);
}

@media (prefers-reduced-motion: reduce) {
    .wa_nav_menu_glider,
    .wa_nav_menu_link {
        transition: none;
    }
}
</style>
