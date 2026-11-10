<template>
    <span ref="TriggerEl" class="wa_popover_trigger" @click="OnTriggerClick">
        <slot name="trigger" :open="Visible" :toggle="Toggle" />
    </span>

    <Teleport to="body">
        <Transition enter-active-class="wa_popover_enter_active" leave-active-class="wa_popover_leave_active"
            enter-from-class="wa_popover_enter_from" leave-to-class="wa_popover_leave_to" @after-leave="OnAfterLeave">
            <div v-if="Visible" ref="PanelEl" class="wa_popover_panel" :style="PanelStyles" :role="role"
                :aria-label="ariaLabel" tabindex="-1">
                <slot :close="Close" />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    /**
     * @type {'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right'}
     */
    placement: {
        type: String,
        default: 'top',
    },
    offset: {
        type: [Number, Object],
        default: 0,
    },
    /** 面板与触发器之间的间距，自动翻转时保持一致 */
    gap: {
        type: Number,
        default: 8,
    },
    width: {
        type: [Number, String],
        default: 220,
    },
    /** 面板内边距，默认使用 --wa_popover_padding；下拉框会按尺寸传 6/8 */
    padding: {
        type: [Number, String],
        default: null,
    },
    matchTrigger: Boolean,
    role: {
        type: String,
        default: 'dialog',
    },
    ariaLabel: {
        type: String,
        default: '弹出内容',
    },
    disabled: Boolean,
    closeOnOutside: {
        type: Boolean,
        default: true,
    },
    closeOnEsc: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['update:open', 'open', 'close'])

const PLACEMENTS = new Set([
    'top', 'top-left', 'top-right',
    'bottom', 'bottom-left', 'bottom-right',
    'left', 'right',
])

const PLACEMENT_ALIASES = {
    'top-start': 'top-left',
    'top-end': 'top-right',
    'bottom-start': 'bottom-left',
    'bottom-end': 'bottom-right',
}

const PLACEMENT_ORIGINS = {
    top: 'bottom center',
    'top-left': 'bottom left',
    'top-right': 'bottom right',
    bottom: 'top center',
    'bottom-left': 'top left',
    'bottom-right': 'top right',
    left: 'right center',
    right: 'left center',
}

function NormalizePlacement(value) {
    const next = PLACEMENT_ALIASES[value] || value
    return PLACEMENTS.has(next) ? next : 'top'
}

const Visible = ref(props.open)
const TriggerEl = ref(null)
const PanelEl = ref(null)
const PanelStyle = ref({
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    visibility: 'hidden',
})

const PaddingStyle = computed(() => {
    const value = props.padding
    if (value == null || value === '') return null
    return { padding: typeof value === 'number' ? `${value}px` : value }
})

const PanelStyles = computed(() => [PanelStyle.value, PaddingStyle.value].filter(Boolean))

let Listening = false
let PrevActive = null

function FocusableTrigger() {
    const el = TriggerEl.value
    if (!el) return null
    return el.querySelector('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        || el.firstElementChild
}

function RestoreFocus() {
    const el = PrevActive
    PrevActive = null

    if (el instanceof HTMLElement && document.contains(el)) {
        el.focus({ preventScroll: true })
        return
    }

    const trigger = FocusableTrigger()
    if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true })
}

function TriggerRect() {
    const el = TriggerEl.value
    if (!el) return null
    return el.firstElementChild?.getBoundingClientRect() || el.getBoundingClientRect()
}

function Position() {
    const rect = TriggerRect()
    const panel = PanelEl.value
    if (!rect || !panel) return

    if (props.matchTrigger) {
        const nextWidth = `${rect.width}px`
        if (PanelStyle.value.width !== nextWidth) {
            PanelStyle.value = { ...PanelStyle.value, width: nextWidth, visibility: 'hidden' }
            nextTick(Position)
            return
        }
    }

    const width = panel.offsetWidth
    const height = panel.offsetHeight
    const edge = 12
    const offset = typeof props.offset === 'number'
        ? { x: 0, y: props.offset }
        : { x: 0, y: 0, ...(props.offset || {}) }
    const gap = props.gap
    let placement = NormalizePlacement(props.placement)
    let left = 0
    let top = 0

    if (placement.startsWith('top') && rect.top - height - gap < edge) {
        placement = placement.replace('top', 'bottom')
    } else if (placement.startsWith('bottom') && rect.bottom + height + gap > window.innerHeight - edge) {
        placement = placement.replace('bottom', 'top')
    } else if (placement === 'left' && rect.left - width - gap < edge) {
        placement = 'right'
    } else if (placement === 'right' && rect.right + width + gap > window.innerWidth - edge) {
        placement = 'left'
    }

    if (placement.startsWith('top') || placement.startsWith('bottom')) {
        top = placement.startsWith('top') ? rect.top - height - gap : rect.bottom + gap

        if (placement.endsWith('left')) left = rect.left
        else if (placement.endsWith('right')) left = rect.right - width
        else left = rect.left + rect.width / 2 - width / 2
    } else if (placement === 'left') {
        left = rect.left - width - gap
        top = rect.top + rect.height / 2 - height / 2
    } else {
        left = rect.right + gap
        top = rect.top + rect.height / 2 - height / 2
    }

    left += offset.x
    top += offset.y

    left = Math.min(Math.max(edge, left), Math.max(edge, window.innerWidth - width - edge))
    top = Math.min(Math.max(edge, top), Math.max(edge, window.innerHeight - height - edge))

    PanelStyle.value = {
        ...PanelStyle.value,
        left: `${left}px`,
        top: `${top}px`,
        transformOrigin: PLACEMENT_ORIGINS[placement],
        visibility: 'visible',
    }
}

function Listen() {
    if (Listening) return
    Listening = true
    window.addEventListener('resize', Position)
    window.addEventListener('scroll', Position, true)
    document.addEventListener('pointerdown', OnPointerDown, true)
    document.addEventListener('keydown', OnKeydown)
}

function Unlisten() {
    if (!Listening) return
    Listening = false
    window.removeEventListener('resize', Position)
    window.removeEventListener('scroll', Position, true)
    document.removeEventListener('pointerdown', OnPointerDown, true)
    document.removeEventListener('keydown', OnKeydown)
}

function OnPointerDown(event) {
    if (!props.closeOnOutside) return
    if (TriggerEl.value?.contains(event.target) || PanelEl.value?.contains(event.target)) return
    // 外部点击会由浏览器把焦点交给目标元素，这里不要抢回触发器
    Close({ restoreFocus: false })
}

function OnKeydown(event) {
    if (event.key !== 'Escape' || !props.closeOnEsc) return
    event.preventDefault()
    Close()
}

function AfterOpen() {
    nextTick(() => {
        Position()
        Listen()
        // 非模态 dialog 也应有初始焦点；listbox 等由具体面板自己管理
        // 定位会先写 visibility，等本次 patch 完成后再聚焦
        if (props.role === 'dialog') {
            nextTick(() => PanelEl.value?.focus({ preventScroll: true }))
        }
    })
}

function Open() {
    if (Visible.value || props.disabled) return
    if (props.matchTrigger) {
        const rect = TriggerRect()
        if (rect) PanelStyle.value = { ...PanelStyle.value, width: `${rect.width}px` }
    }
    if (typeof document !== 'undefined') PrevActive = document.activeElement
    Visible.value = true
    emit('update:open', true)
    emit('open')
    AfterOpen()
}

function Close(options = {}) {
    if (!Visible.value) return

    const restoreFocus = options.restoreFocus !== false
    const focusInPanel = typeof document !== 'undefined'
        && PanelEl.value?.contains(document.activeElement)

    Visible.value = false
    emit('update:open', false)
    emit('close')
    Unlisten()

    if (restoreFocus && focusInPanel) RestoreFocus()
}

function Toggle() {
    if (Visible.value) Close()
    else Open()
}

function OnTriggerClick() {
    if (props.disabled) return
    Toggle()
}

function OnAfterLeave() {
    Unlisten()
    PanelStyle.value = { ...PanelStyle.value, visibility: 'hidden' }
}

watch(() => props.open, value => {
    if (value === Visible.value) return
    if (value) Open()
    else Close()
})

watch(() => props.placement, () => {
    if (Visible.value) nextTick(Position)
})

onMounted(() => {
    if (!Visible.value) return
    if (typeof document !== 'undefined') PrevActive = document.activeElement
    AfterOpen()
})

onUnmounted(Unlisten)
</script>

<style>
.wa_popover_trigger {
    display: contents;
}

.wa_popover_panel {
    position: fixed;
    z-index: var(--wa_z_popover);
    max-width: calc(100vw - 24px);
    padding: var(--wa_popover_padding);
    border: 1px solid var(--wa_color_border);
    border-radius: var(--wa_radius_popover);
    background: var(--wa_color_glass);
    background: linear-gradient(to bottom, var(--wa_color_glass), color-mix(in srgb, var(--wa_color_glass) 68%, transparent));
    -webkit-backdrop-filter: blur(var(--wa_blur));
    backdrop-filter: blur(var(--wa_blur));
    box-shadow: var(--wa_shadow_nav);
    outline: 0;
}

.wa_popover_enter_active {
    transition:
        opacity var(--wa_duration_base) linear,
        transform var(--wa_duration_slow) var(--wa_ease_spring);
}

.wa_popover_leave_active {
    transition:
        opacity var(--wa_duration_fast) linear,
        transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_popover_enter_from {
    opacity: 0;
    transform: scale(.88);
}

.wa_popover_leave_to {
    opacity: 0;
    transform: scale(.96);
}

@media (prefers-reduced-motion: reduce) {

    .wa_popover_enter_active,
    .wa_popover_leave_active {
        transition: none;
    }
}
</style>
