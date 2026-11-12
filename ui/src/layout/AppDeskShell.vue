<template>
    <div class="wa_desk" :class="Classes" :style="ShellStyle">
        <div v-if="ShowTitle" class="wa_desk_title" :data-tauri-drag-region="DragRegion">
            <slot name="title">
                <img v-if="TitleIconSrc" class="wa_desk_title_img" :src="TitleIconSrc" alt="" draggable="false"
                    :data-tauri-drag-region="DragRegion" />
                <AppIcon v-else-if="Array.isArray(TitleIcon)" :icon="TitleIcon" :size="18" />
                <AppIcon v-else-if="TitleIcon" :name="TitleIcon" :size="18" />
                <span v-if="TitleText" class="wa_desk_title_text" :data-tauri-drag-region="DragRegion">{{ TitleText }}</span>
            </slot>
        </div>

        <header class="wa_desk_header" :data-tauri-drag-region="DragRegion">
            <div class="wa_desk_header_left" :data-tauri-drag-region="DragRegion">
                <slot name="header-left">
                    <span v-if="ShowHeaderTitle && HeaderTitle" class="wa_desk_header_title"
                        :data-tauri-drag-region="DragRegion">{{ HeaderTitle }}</span>
                </slot>
            </div>

            <div class="wa_desk_header_center">
                <slot name="header-actions" />
                <div ref="HeaderBarTarget" class="wa_desk_header_actions"></div>
            </div>

            <div class="wa_desk_header_right">
                <slot name="win-actions">
                    <AppWindowControls :win-action="WinAction" :maximized="maximized"
                        @minimize="emit('minimize')" @maximize="emit('maximize')"
                        @close="emit('close', CloseMode)" />
                </slot>
            </div>
        </header>

        <aside v-if="HasAside" class="wa_desk_aside">
            <AppNavMenu class="wa_desk_aside_nav" :model-value="active" :items="items" :groups="groups"
                :link-component="linkComponent" :size="NavSize" :aria-label="ariaLabel"
                :layout-key="NavLayoutKey" @update:model-value="value => emit('update:active', value)"
                @select="item => emit('navigate', item)" />

            <div v-if="$slots['aside-footer']" class="wa_desk_aside_footer">
                <slot name="aside-footer" />
            </div>
        </aside>

        <main class="wa_desk_main" :class="{ wa_desk_main_padded: Padded }">
            <slot />
        </main>

        <div v-if="ShowToolbar" class="wa_desk_toolbar">
            <slot name="toolbar" />
        </div>
    </div>
</template>

<script setup>
import { computed, provide, ref, useSlots } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import AppNavMenu from '../components/AppNavMenu.vue'
import AppWindowControls from '../components/AppWindowControls.vue'
import { HEADER_BAR_TARGET } from '../core/keys.js'

const DEFAULT_CONFIG = {
    dragRegion: false,
    transparent: false,
    frosted: false,
    glass: '',
    glassOpacity: 100,
    title: {
        show: true,
        text: '',
        icon: '',
        iconSrc: '',
        height: 46,
        fallback: 'header',
    },
    header: {
        showTitle: true,
        title: '',
        height: 46,
        winAction: ['min', 'close'],
        closeMode: 'window',
    },
    aside: {
        mode: 'icon-text',
        variant: 'plain',
        iconWidth: 44,
        iconTextWidth: 200,
        textWidth: 160,
        navSize: 'md',
    },
    main: {
        padded: false,
        toolbar: {
            show: false,
            height: 40,
        },
    },
    window: {
        width: '100%',
        height: '100vh',
        minWidth: 0,
        minHeight: 0,
    },
}

const props = defineProps({
    /** 壳层配置，结构见 DEFAULT_CONFIG */
    config: {
        type: Object,
        default: () => ({}),
    },
    /** 无分组导航项，格式与 AppNavMenu 一致 */
    items: {
        type: Array,
        default: () => [],
    },
    /** 分组导航：[{ title, items }] */
    groups: {
        type: Array,
        default: () => [],
    },
    /** 当前选中的导航值 */
    active: {
        type: [String, Number, Symbol],
        default: '',
    },
    /** 透传给 AppNavMenu 的链接组件，例如 RouterLink */
    linkComponent: {
        type: [String, Object, Function],
        default: 'a',
    },
    /** 窗口是否最大化，用于切换最大化 / 还原图标 */
    maximized: Boolean,
    ariaLabel: {
        type: String,
        default: '主导航',
    },
})

const emit = defineEmits(['navigate', 'update:active', 'minimize', 'maximize', 'close'])

const slots = useSlots()
const HeaderBarTarget = ref(null)

provide(HEADER_BAR_TARGET, HeaderBarTarget)

const C = computed(() => MergeConfig(DEFAULT_CONFIG, props.config))

const ShowTitle = computed(() => C.value.title.show !== false)
const TitleIcon = computed(() => C.value.title.icon)
const TitleIconSrc = computed(() => C.value.title.iconSrc)
const TitleText = computed(() => C.value.title.text)
const ShowHeaderTitle = computed(() => C.value.header.showTitle !== false)
const HeaderTitle = computed(() => C.value.header.title)
const WinAction = computed(() => C.value.header.winAction)
const CloseMode = computed(() => C.value.header.closeMode === 'app' ? 'app' : 'window')
const DragRegion = computed(() => C.value.dragRegion || undefined)
const Padded = computed(() => Boolean(C.value.main.padded))
const ShowToolbar = computed(() => Boolean(C.value.main.toolbar.show))
const NavSize = computed(() => C.value.aside.navSize === 'sm' ? 'sm' : 'md')

const AsideMode = computed(() => {
    const mode = C.value.aside.mode
    if (mode === 'icon' || mode === 'text') return mode
    return 'icon-text'
})
const AsideVariant = computed(() => C.value.aside.variant === 'bordered' ? 'bordered' : 'plain')

const AsideWidth = computed(() => {
    const aside = C.value.aside
    if (AsideMode.value === 'icon') return aside.iconWidth
    if (AsideMode.value === 'text') return aside.textWidth
    return aside.iconTextWidth
})

const HasAside = computed(() => {
    return props.items.length > 0
        || props.groups.length > 0
        || Boolean(slots['aside-footer'])
})

const NavLayoutKey = computed(() => `${AsideMode.value}-${AsideWidth.value}-${NavSize.value}`)

const Classes = computed(() => ({
    wa_desk_title_show: ShowTitle.value,
    wa_desk_title_hide: !ShowTitle.value,
    wa_desk_fallback_header: C.value.title.fallback !== 'aside',
    wa_desk_fallback_aside: C.value.title.fallback === 'aside',
    wa_desk_aside_icon: AsideMode.value === 'icon',
    wa_desk_aside_icon_text: AsideMode.value === 'icon-text',
    wa_desk_aside_text: AsideMode.value === 'text',
    wa_desk_aside_plain: AsideVariant.value === 'plain',
    wa_desk_aside_bordered: AsideVariant.value === 'bordered',
    wa_desk_has_toolbar: ShowToolbar.value,
    wa_desk_no_aside: !HasAside.value,
    wa_desk_transparent: C.value.transparent,
    wa_desk_frosted: C.value.frosted,
}))

const ShellStyle = computed(() => {
    const c = C.value
    const topHeight = ShowTitle.value
        ? `max(${ToSize(c.title.height, '46px')}, ${ToSize(c.header.height, '46px')})`
        : ToSize(c.header.height, '46px')

    return {
        '--wa_desk_title_height': ToSize(c.title.height, '46px'),
        '--wa_desk_header_height': ToSize(c.header.height, '46px'),
        '--wa_desk_top_height': topHeight,
        '--wa_desk_aside_width': ToSize(AsideWidth.value, '44px'),
        '--wa_desk_toolbar_height': ToSize(ShowToolbar.value ? c.main.toolbar.height : 0, '0px'),
        '--wa_desk_window_width': ToSize(c.window.width, '100%'),
        '--wa_desk_window_height': ToSize(c.window.height, '100vh'),
        '--wa_desk_window_min_width': ToSize(c.window.minWidth, '0px'),
        '--wa_desk_window_min_height': ToSize(c.window.minHeight, '0px'),
        '--wa_desk_glass': c.glass || `color-mix(in srgb, var(--wa_color_glass) ${ClampPercent(c.glassOpacity)}%, transparent)`,
    }
})

/**
 * 把透明度限制在 0-100，异常值回退到 100
 * @param {number | string} value 百分比
 * @returns {number} 可用的百分比
 */
function ClampPercent(value) {
    const number = Number(value)
    if (!Number.isFinite(number)) return 100
    return Math.min(100, Math.max(0, number))
}

function ToSize(value, fallback = '') {
    if (value === null || value === undefined || value === '') return fallback
    return typeof value === 'number' ? `${value}px` : value
}

function MergeConfig(base, patch) {
    const result = { ...base }

    for (const [key, value] of Object.entries(patch || {})) {
        const isObject = value && typeof value === 'object' && !Array.isArray(value)
        const baseIsObject = base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])
        result[key] = isObject && baseIsObject ? MergeConfig(base[key], value) : value
    }

    return result
}
</script>

<style>
.wa_desk {
    --wa_desk_title_height: 46px;
    --wa_desk_header_height: 46px;
    --wa_desk_top_height: 46px;
    --wa_desk_aside_width: 200px;
    --wa_desk_toolbar_height: 0px;
    --wa_desk_glass: var(--wa_color_glass);

    display: grid;
    grid-template-columns: var(--wa_desk_aside_width) minmax(0, 1fr);
    grid-template-rows: var(--wa_desk_top_height) minmax(0, 1fr) var(--wa_desk_toolbar_height);
    grid-template-areas:
        'title header'
        'aside main'
        'aside toolbar';
    width: var(--wa_desk_window_width);
    min-width: var(--wa_desk_window_min_width);
    height: var(--wa_desk_window_height);
    min-height: var(--wa_desk_window_min_height);
    overflow: hidden;
    color: var(--wa_color_text);
    background: var(--wa_color_canvas);
    transition:
        grid-template-columns var(--wa_duration_base) var(--wa_ease_out),
        grid-template-rows var(--wa_duration_base) var(--wa_ease_out);
}

.wa_desk.wa_desk_transparent {
    background: transparent;
}

.wa_desk.wa_desk_title_hide.wa_desk_fallback_header {
    grid-template-areas:
        'header header'
        'aside main'
        'aside toolbar';
}

.wa_desk.wa_desk_title_hide.wa_desk_fallback_aside {
    grid-template-areas:
        'aside header'
        'aside main'
        'aside toolbar';
}

.wa_desk.wa_desk_no_aside {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: var(--wa_desk_title_height) var(--wa_desk_header_height) minmax(0, 1fr) var(--wa_desk_toolbar_height);
    grid-template-areas:
        'title'
        'header'
        'main'
        'toolbar';
}

.wa_desk.wa_desk_no_aside.wa_desk_title_hide {
    grid-template-rows: var(--wa_desk_header_height) minmax(0, 1fr) var(--wa_desk_toolbar_height);
    grid-template-areas:
        'header'
        'main'
        'toolbar';
}

.wa_desk_title {
    grid-area: title;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 0 12px;
    border-bottom: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
    user-select: none;
}

.wa_desk_title_img {
    width: 20px;
    height: 20px;
    flex: none;
    object-fit: contain;
    pointer-events: none;
    -webkit-user-drag: none;
}

.wa_desk_title_text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
}

.wa_desk_header {
    grid-area: header;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 0 12px;
    border-bottom: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
    user-select: none;
}

.wa_desk_header_left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.wa_desk_header_title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
}

.wa_desk_header_center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 0;
    -webkit-app-region: no-drag;
}

.wa_desk_header_actions {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.wa_desk_header_actions:empty {
    display: none;
}

.wa_desk_header_right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    min-width: 0;
    -webkit-app-region: no-drag;
}

.wa_desk_aside {
    grid-area: aside;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
    padding: 8px 6px;
    overflow: hidden;
}

.wa_desk_aside_plain {
    background: transparent;
}

.wa_desk_aside_bordered {
    border-right: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
}

.wa_desk_frosted .wa_desk_title,
.wa_desk_frosted .wa_desk_header,
.wa_desk_frosted .wa_desk_aside,
.wa_desk_frosted .wa_desk_toolbar {
    background: var(--wa_desk_glass);
    -webkit-backdrop-filter: blur(var(--wa_blur)) saturate(1.4);
    backdrop-filter: blur(var(--wa_blur)) saturate(1.4);
}

.wa_desk_aside_nav {
    min-width: 0;
}

.wa_desk_aside_footer {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    margin-top: auto;
}

.wa_desk_aside_icon .wa_desk_title {
    justify-content: center;
    padding: 0;
}

.wa_desk_aside_icon .wa_desk_title_text {
    display: none;
}

.wa_desk_aside_icon .wa_desk_aside_nav {
    --wa_nav_pad_x: 0px;
    --wa_nav_gap: 4px;
    --wa_nav_group_gap: 8px;
    --wa_nav_hover_shift: 0px;
    --wa_nav_active_shift: 0px;
}

.wa_desk_aside_icon .wa_desk_aside_nav .wa_nav_menu_link {
    justify-content: center;
    gap: 0;
    min-height: 34px;
    padding-left: 0;
    padding-right: 0;
}

.wa_desk_aside_icon .wa_desk_aside_nav .wa_nav_menu_text,
.wa_desk_aside_icon .wa_desk_aside_nav .wa_nav_menu_title {
    display: none;
}

.wa_desk_aside_icon .wa_desk_aside_nav .wa_nav_menu_badge {
    position: absolute;
    top: 2px;
    right: 2px;
    margin: 0;
}

.wa_desk_aside_icon .wa_desk_aside_footer {
    align-items: center;
}

.wa_desk_aside_icon_text .wa_desk_aside_nav,
.wa_desk_aside_text .wa_desk_aside_nav {
    --wa_nav_hover_shift: 4px;
    --wa_nav_active_shift: 8px;
}

.wa_desk_aside_text .wa_desk_aside_nav .wa_nav_menu_icon {
    display: none;
}

.wa_desk_main {
    grid-area: main;
    min-width: 0;
    min-height: 0;
    overflow: auto;
}

.wa_desk_main_padded {
    padding: var(--wa_space_3);
}

.wa_desk_toolbar {
    grid-area: toolbar;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    height: var(--wa_desk_toolbar_height);
    padding: 0 12px;
    border-top: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
    overflow: hidden;
}

/* 磨砂模式下 Toolbar 与 Title / Header / Aside 使用同一层玻璃 */
.wa_desk_frosted .wa_desk_toolbar {
    border-top-color: color-mix(in srgb, var(--wa_color_border) 68%, transparent);
}

@media (prefers-reduced-motion: reduce) {
    .wa_desk {
        transition: none;
    }
}
</style>
