<template>
    <div ref="PanelEl" class="wa_select_panel" :class="{ wa_select_sm: size === 'sm', has_scrollbar: HasScrollbar }">
        <div v-for="group in groups" :key="group.label" class="wa_select_group">
            <p v-if="group.label" class="wa_select_group_label">{{ group.label }}</p>
            <button v-for="item in group.options" :key="item.value" type="button" class="wa_select_option"
                :class="{ on: item.value === modelValue }" role="option" :aria-selected="item.value === modelValue"
                :disabled="item.disabled" @click="emit('select', item)">
                <component v-if="item.icon && iconComponent" :is="iconComponent" :name="item.icon" :size="17"
                    class="wa_select_option_icon" aria-hidden="true" />
                <span>{{ item.label }}</span>
                <template v-if="item.value === modelValue">
                    <span v-if="checkRender?.mode === 'text'" class="wa_select_check" aria-hidden="true">
                        {{ checkRender.value }}</span>
                    <component v-else-if="checkRender?.mode === 'icon'" :is="iconComponent" :name="checkRender.name"
                        class="wa_select_check" aria-hidden="true" />
                </template>
            </button>
        </div>

        <button v-for="item in options" :key="item.value" type="button" class="wa_select_option"
            :class="{ on: item.value === modelValue }" role="option" :aria-selected="item.value === modelValue"
            :disabled="item.disabled" @click="emit('select', item)">
            <component v-if="item.icon && iconComponent" :is="iconComponent" :name="item.icon" :size="17"
                class="wa_select_option_icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
            <template v-if="item.value === modelValue">
                <span v-if="checkRender?.mode === 'text'" class="wa_select_check" aria-hidden="true">
                    {{ checkRender.value }}</span>
                <component v-else-if="checkRender?.mode === 'icon'" :is="iconComponent" :name="checkRender.name"
                    class="wa_select_check" aria-hidden="true" />
            </template>
        </button>

        <p v-if="!HasOptions" class="wa_select_empty">{{ emptyText }}</p>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

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
     * 图标组件，用于渲染「图标名称」。
     * 默认使用内置 AppIcon；需要换图标库时可以覆盖。
     */
    iconComponent: {
        type: [Object, Function],
        default: () => AppIcon,
    },
    /** 与下拉触发器保持同一尺寸：默认 sm，md 时选项间距和内边距更宽松 */
    size: {
        type: String,
        default: 'sm',
        allows: ['md', 'sm'],
    },
})

const emit = defineEmits(['select'])

const PanelEl = ref(null)
const HasScrollbar = ref(false)
let ScrollObserver = null

function UpdateScrollbar() {
    const el = PanelEl.value
    if (!el) return
    HasScrollbar.value = el.scrollHeight > el.clientHeight + 1
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
        nextTick(ScrollSelectedToCenter)
    })

    if (typeof ResizeObserver !== 'undefined' && PanelEl.value) {
        ScrollObserver = new ResizeObserver(UpdateScrollbar)
        ScrollObserver.observe(PanelEl.value)
    }

    window.addEventListener('resize', UpdateScrollbar)
})

onUnmounted(() => {
    ScrollObserver?.disconnect()
    ScrollObserver = null
    window.removeEventListener('resize', UpdateScrollbar)
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

// 统一计算渲染方式：{ mode: 'text', value } | { mode: 'icon', name } | null
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
    overscroll-behavior: contain;
    scrollbar-width: none;
}

/* 只有出现滚动条时才留出与外侧等宽的内边距，让滚动条在右侧留白中居中 */
.wa_select_panel.has_scrollbar {
    padding-right: var(--wa_popover_padding);
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
    color: var(--wa_color_text_faint);
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
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.wa_select_option:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_select_option_icon {
    flex: none;
    color: var(--wa_color_text_subtle);
}

.wa_select_option.on .wa_select_option_icon {
    color: inherit;
}

.wa_select_option.on,
.wa_select_option.on:hover {
    color: var(--wa_color_on_text);
    background: var(--wa_color_text);
    font-weight: 600;
}

.wa_select_option:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_select_check {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    font-size: 12px;
    line-height: 1;
    animation: wa_select_check_in .18s var(--wa_ease_spring) both;
}

@keyframes wa_select_check_in {
    from {
        opacity: 0;
        transform: scale(.5);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.wa_select_check svg {
    width: 1em;
    height: 1em;
    display: block;
}

.wa_select_empty {
    padding: var(--wa_select_pad_y) var(--wa_select_pad_x);
    font-size: 12px;
    color: var(--wa_color_text_faint);
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
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_select_option {
        transition: none;
    }

    .wa_select_check {
        animation: none;
    }
}
</style>