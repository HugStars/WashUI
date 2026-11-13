<template>
    <div ref="PanelEl" class="wa_select_panel" :class="{ wa_select_sm: size === 'sm', has_scrollbar: HasScrollbar }"
        @keydown="OnKeydown">
        <!-- * 分组选项和平铺选项共用 SelectOption，避免两份按钮结构 -->
        <div v-for="group in groups" :key="group.label" class="wa_select_group">
            <p v-if="group.label" class="wa_select_group_label">{{ group.label }}</p>
            <SelectOption v-for="item in group.options" :key="item.value" :item="item"
                :model-value="modelValue" :check-render="checkRender" :check-position="checkPosition"
                :icon-component="iconComponent" @select="emit('select', $event)" />
        </div>

        <SelectOption v-for="item in options" :key="item.value" :item="item" :model-value="modelValue"
            :check-render="checkRender" :check-position="checkPosition" :icon-component="iconComponent"
            @select="emit('select', $event)" />

        <p v-if="!HasOptions" class="wa_select_empty">{{ emptyText }}</p>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import SelectOption from './select/SelectOption.vue'

const props = defineProps({
    modelValue: {
        type: [String, Number, Symbol],
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    /**
     * 对号图标，一个属性覆盖三种场景：
     * - true（默认）：显示默认 ✓
     * - false：不显示
     * - 字符串：短字符（如 '✓' '✔' '√' '●'）按文本显示；
     *          长名称（如 'check' 'check-circle'）按图标名渲染
     */
    checkIcon: {
        type: [Boolean, String],
        default: true,
    },
    /**
     * 选中标记的位置：before 在标签前，after 在标签后
     * @type {'before' | 'after'}
     */
    checkPosition: {
        type: String,
        default: 'after',
    },
    /**
     * 图标组件，用于渲染「图标名称」。
     * 默认使用内置 AppIcon；需要换图标库时可以覆盖。
     */
    iconComponent: {
        type: [Object, Function],
        default: () => AppIcon,
    },
    /**
     * 与下拉触发器保持同一尺寸：默认 sm，md 时选项间距和内边距更宽松
     * @type {'md' | 'sm'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /** 挂载后聚焦选中项（或第一项）；下拉面板使用，常驻侧栏不要开启 */
    autofocus: Boolean,
})

const emit = defineEmits(['select'])

const PanelEl = ref(null)
const HasScrollbar = ref(false)
let ScrollObserver = null
let ScrollbarFrame = 0
let FocusFrame = 0

function OptionEls() {
    const el = PanelEl.value
    if (!el) return []
    return [...el.querySelectorAll('.wa_select_option')].filter(item => !item.disabled)
}

/** 移动 roving focus；Enter / Space 交给按钮原生 click */
function OnKeydown(event) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(event.key)) return

    const list = OptionEls()
    if (!list.length) return

    event.preventDefault()
    const index = list.indexOf(document.activeElement)
    let next = index

    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = list.length - 1
    else if (event.key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % list.length
    else if (event.key === 'ArrowUp') next = index < 0 ? list.length - 1 : (index - 1 + list.length) % list.length

    list[next].focus({ preventScroll: true })
}

function FocusSelected() {
    const list = OptionEls()
    if (!list.length) return

    const selected = list.find(item => item.getAttribute('aria-selected') === 'true')
    const target = selected || list[0]
    target.focus({ preventScroll: true })
}

function UpdateScrollbar() {
    // note 直接调用时取消排队中的帧，避免同一帧重复读取 scrollHeight
    cancelAnimationFrame(ScrollbarFrame)
    ScrollbarFrame = 0

    const el = PanelEl.value
    if (!el) return
    HasScrollbar.value = el.scrollHeight > el.clientHeight + 1
}

// * resize 只用于更新滚动条状态，合并到 rAF，避免和 ResizeObserver 重复测量
function ScheduleScrollbar() {
    if (ScrollbarFrame) return
    ScrollbarFrame = requestAnimationFrame(() => {
        ScrollbarFrame = 0
        UpdateScrollbar()
    })
}

// 打开时把已选项滚动到可视区中间，避免长列表里选中项在视野外
function ScrollSelectedToCenter() {
    const el = PanelEl.value
    if (!el) return

    const max = el.scrollHeight - el.clientHeight
    if (max <= 0) return

    const selected = el.querySelector('.wa_select_option.on')
    if (!selected) return

    const panelRect = el.getBoundingClientRect()
    const itemRect = selected.getBoundingClientRect()
    const itemTop = itemRect.top - panelRect.top + el.scrollTop
    const target = itemTop - (el.clientHeight - itemRect.height) / 2

    el.scrollTop = Math.max(0, Math.min(max, target))
}

onMounted(() => {
    nextTick(() => {
        UpdateScrollbar()
        nextTick(() => {
            ScrollSelectedToCenter()
            if (!props.autofocus) return
            // ! AppPopover 在 nextTick 里才把面板从 visibility:hidden 切到 visible；
            // ! 这里等一帧再聚焦，否则浏览器会拒绝 focus，方向键会留在触发器上
            FocusFrame = requestAnimationFrame(() => {
                FocusFrame = 0
                if (PanelEl.value) FocusSelected()
            })
        })
    })

    if (typeof ResizeObserver !== 'undefined' && PanelEl.value) {
        ScrollObserver = new ResizeObserver(UpdateScrollbar)
        ScrollObserver.observe(PanelEl.value)
    }

    window.addEventListener('resize', ScheduleScrollbar)
})

onUnmounted(() => {
    ScrollObserver?.disconnect()
    ScrollObserver = null
    window.removeEventListener('resize', ScheduleScrollbar)
    cancelAnimationFrame(ScrollbarFrame)
    cancelAnimationFrame(FocusFrame)
})

watch([() => props.options, () => props.groups, () => props.modelValue, () => props.size], () => {
    nextTick(() => {
        UpdateScrollbar()
        ScrollSelectedToCenter()
    })
})

const HasOptions = computed(
    () => props.groups.some(group => group.options?.length) || props.options.length > 0
)

// 常见可直接作为文本显示的字符图标
const CHECK_TEXT_ICONS = new Set(['✓', '✔', '√', '☑', '●', '•', '★', '×', '✕'])

// 是否显示对号
const showCheck = computed(() => props.checkIcon !== false && props.checkIcon != null)

// section 选中标记
// * 父级算好渲染方式后传给 SelectOption，子组件只负责展示
// - { mode: 'text', value } | { mode: 'icon', name } | null
const checkRender = computed(() => {
    if (!showCheck.value) return null
    const v = props.checkIcon

    // 默认 true：文本 ✓
    if (v === true) return { mode: 'text', value: '✓' }
    if (typeof v !== 'string') return null

    // 短字符或白名单：按文本显示
    const isText = CHECK_TEXT_ICONS.has(v) || [...v].length <= 2
    if (isText) return { mode: 'text', value: v }

    // 长字符串：按图标名渲染；没有图标组件时降级为 ✓
    if (props.iconComponent) return { mode: 'icon', name: v }
    return { mode: 'text', value: '✓' }
})
</script>

<style>
.wa_select_panel {
    --wa_select_gap: var(--wa_space_2);
    --wa_select_pad_y: var(--wa_space_2);
    --wa_select_pad_x: var(--wa_space_3);
    --wa_select_scrollbar: 8px;

    display: grid;
    gap: var(--wa_select_gap);
    min-width: 0;
    max-height: min(320px, calc(100vh - 120px));
    overflow-y: auto;
    /* warning 不要设置 overscroll-behavior: contain：面板没有滚动条时会拦截滚轮，页面滚不动 */
    /* note 内容滚到边界后允许继续滚动页面；AppPopover 会跟随页面滚动重新定位 */
    scrollbar-width: thin;
}

/* 出现滚动条时预留稳定槽位，避免内容宽度来回跳 */
.wa_select_panel.has_scrollbar {
    scrollbar-gutter: stable;
}

.wa_select_panel.wa_select_sm {
    --wa_select_gap: 6px;
    --wa_select_pad_y: 6px;
    --wa_select_pad_x: 10px;
    --wa_select_scrollbar: 6px;
}

.wa_select_panel::-webkit-scrollbar {
    width: var(--wa_select_scrollbar);
    height: var(--wa_select_scrollbar);
}

.wa_select_panel::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
}

.wa_select_panel::-webkit-scrollbar-button:vertical:start:decrement,
.wa_select_panel::-webkit-scrollbar-button:vertical:end:increment {
    display: none;
    width: 0;
    height: 0;
}

.wa_select_panel::-webkit-scrollbar-track {
    margin-top: var(--wa_radius_popover);
    margin-bottom: var(--wa_radius_popover);
    background: transparent;
}

.wa_select_panel::-webkit-scrollbar-thumb {
    border-radius: var(--wa_radius_pill);
    background-color: var(--wa_color_scroll);
}

.wa_select_group {
    display: grid;
    gap: var(--wa_select_gap);
}

.wa_select_group_label {
    padding: 0 var(--wa_select_pad_x);
    font-size: 11px;
    color: var(--wa_color_text_subtle);
}

.wa_select_option {
    display: flex;
    align-items: center;
    gap: var(--wa_space_2);
    width: 100%;
    padding: var(--wa_select_pad_y) var(--wa_select_pad_x);
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_muted);
    background: transparent;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        padding-left var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_select_option:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

/* * 面板本身是滚动容器，外扩 outline 会被裁掉；聚焦态改为内缩 */
.wa_select_option:focus-visible {
    outline-offset: -2px;
}

.wa_select_option_icon {
    order: 0;
    flex: none;
    color: var(--wa_color_text_subtle);
}

.wa_select_label {
    flex: 1;
    min-width: 0;
    order: 1;
}

.wa_select_label_before {
    order: 2;
}

.wa_select_option.on .wa_select_option_icon {
    color: inherit;
}

.wa_select_option.on,
.wa_select_option.on:hover {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
    font-weight: 600;
}

.wa_select_option:disabled {
    color: var(--wa_color_text_faint);
    opacity: .55;
    cursor: not-allowed;
}

.wa_select_badge {
    order: 2;
    flex: none;
}

.wa_select_option.on .wa_select_badge.wa_badge_neutral {
    --wa_badge_bg: var(--wa_color_on_highlight);
    --wa_badge_color: var(--wa_color_highlight);
}

.wa_select_check {
    order: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 0;
    height: 1em;
    overflow: hidden;
    opacity: 0;
    font-size: 12px;
    line-height: 1;
    transition:
        width var(--wa_duration_fast) var(--wa_ease_out),
        opacity var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_select_check.present {
    width: 1em;
    opacity: 1;
}

.wa_select_check_before {
    order: 1;
}

.wa_select_check svg {
    width: 1em;
    height: 1em;
    display: block;
}

.wa_select_empty {
    padding: var(--wa_select_pad_y) var(--wa_select_pad_x);
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}

/* 移动端不显示滚动条，也就不需要给滚动条预留右侧内边距 */
@media (max-width: 860px) {
    .wa_select_panel {
        scrollbar-width: none;
    }

    .wa_select_panel::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }

    .wa_select_panel.has_scrollbar {
        padding-right: 0;
        scrollbar-gutter: auto;
    }
}

@media (prefers-reduced-motion: reduce) {

    .wa_select_option,
    .wa_select_check {
        transition: none;
    }
}
</style>