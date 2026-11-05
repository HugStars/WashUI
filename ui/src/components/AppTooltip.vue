<template>
    <span ref="TriggerEl" class="wa_tooltip" :class="{ wa_tooltip_fill: fill }"
        :aria-describedby="Visible ? TooltipId : undefined" @mouseenter="OnEnter" @mouseleave="OnLeave"
        @focusin="OnEnter" @focusout="OnFocusOut">
        <slot />
    </span>

    <Teleport to="body">
        <Transition enter-active-class="wa_tooltip_enter_active" leave-active-class="wa_tooltip_leave_active"
            enter-from-class="wa_tooltip_enter_from" leave-to-class="wa_tooltip_leave_to">
            <div v-if="Visible" :id="TooltipId" ref="PanelEl" class="wa_tooltip_panel" role="tooltip" :style="PanelStyle">
                <slot name="content">{{ content }}</slot>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref, useId, useSlots, watch } from 'vue'

const props = defineProps({
    content: {
        type: String,
        default: '',
    },
    placement: {
        type: String,
        default: 'top',
        allows: ['top', 'bottom'],
    },
    /** 悬停多久后出现，模拟浏览器 title 的延迟 */
    delay: {
        type: Number,
        default: 120,
    },
    /** 面板与触发器之间的间距 */
    gap: {
        type: Number,
        default: 6,
    },
    maxWidth: {
        type: [Number, String],
        default: 280,
    },
    /** 触发器铺满父容器，适合表格单元格等需要整块悬停的区域 */
    fill: Boolean,
    disabled: Boolean,
})

const slots = useSlots()
const uid = useId()
const TooltipId = `${uid}-tooltip`

const TriggerEl = ref(null)
const PanelEl = ref(null)
const Visible = ref(false)
const PanelStyle = ref({
    position: 'fixed',
    left: '0px',
    top: '0px',
    visibility: 'hidden',
})

const HasContent = computed(() => Boolean(props.content || slots.content))
const MaxWidth = computed(() => ToSize(props.maxWidth))

let ShowTimer = null
let Listening = false

function ToSize(value) {
    return typeof value === 'number' ? `${value}px` : value
}

function ClearTimer() {
    if (ShowTimer) {
        clearTimeout(ShowTimer)
        ShowTimer = null
    }
}

function OnEnter() {
    if (props.disabled || !HasContent.value || Visible.value) return
    ClearTimer()
    ShowTimer = setTimeout(() => {
        ShowTimer = null
        Open()
    }, Math.max(0, Number(props.delay) || 0))
}

function OnLeave() {
    ClearTimer()
    Close()
}

function OnFocusOut(event) {
    if (TriggerEl.value?.contains(event.relatedTarget)) return
    OnLeave()
}

function Open() {
    if (props.disabled || !HasContent.value || Visible.value) return

    Visible.value = true
    nextTick(() => {
        Position()
        Listen()
    })
}

function Close() {
    if (!Visible.value) return

    Visible.value = false
    Unlisten()
    PanelStyle.value = { ...PanelStyle.value, visibility: 'hidden' }
}

function Listen() {
    if (Listening) return
    Listening = true
    window.addEventListener('resize', Close)
    window.addEventListener('scroll', Close, true)
}

function Unlisten() {
    if (!Listening) return
    Listening = false
    window.removeEventListener('resize', Close)
    window.removeEventListener('scroll', Close, true)
}

function Position() {
    const trigger = TriggerEl.value
    const panel = PanelEl.value
    if (!trigger || !panel) return

    const rect = trigger.getBoundingClientRect()
    if (!rect.width && !rect.height) return

    const width = panel.offsetWidth
    const height = panel.offsetHeight
    const edge = 8
    const gap = Math.max(0, Number(props.gap) || 0)
    let placement = props.placement === 'bottom' ? 'bottom' : 'top'

    if (placement === 'top' && rect.top - height - gap < edge) {
        placement = 'bottom'
    } else if (placement === 'bottom' && rect.bottom + height + gap > window.innerHeight - edge) {
        placement = 'top'
    }

    let top = placement === 'top' ? rect.top - height - gap : rect.bottom + gap
    let left = rect.left + rect.width / 2 - width / 2

    left = Math.min(Math.max(edge, left), Math.max(edge, window.innerWidth - width - edge))
    top = Math.min(Math.max(edge, top), Math.max(edge, window.innerHeight - height - edge))

    PanelStyle.value = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        maxWidth: MaxWidth.value,
        transformOrigin: placement === 'top' ? 'bottom center' : 'top center',
        visibility: 'visible',
    }
}

watch(() => props.content, () => {
    if (Visible.value) nextTick(Position)
})

watch(() => props.disabled, value => {
    if (value) Close()
})

onUnmounted(() => {
    ClearTimer()
    Unlisten()
})
</script>

<style>
.wa_tooltip {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
}

.wa_tooltip_fill {
    display: block;
    width: 100%;
}

.wa_tooltip_panel {
    position: fixed;
    z-index: var(--wa_z_toast);
    max-width: min(280px, calc(100vw - 16px));
    padding: 4px 8px;
    border: 1px solid var(--wa_color_border);
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text);
    background: var(--wa_color_glass);
    background: linear-gradient(to bottom, var(--wa_color_glass), color-mix(in srgb, var(--wa_color_glass) 68%, transparent));
    -webkit-backdrop-filter: blur(var(--wa_blur));
    backdrop-filter: blur(var(--wa_blur));
    box-shadow: var(--wa_shadow_nav);
    font-size: 12px;
    line-height: 1.4;
    white-space: normal;
    overflow-wrap: anywhere;
    pointer-events: none;
}

.wa_tooltip_enter_active {
    transition:
        opacity var(--wa_duration_fast) linear,
        transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_tooltip_leave_active {
    transition:
        opacity var(--wa_duration_fast) linear,
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_tooltip_enter_from {
    opacity: 0;
    transform: scale(.92);
}

.wa_tooltip_leave_to {
    opacity: 0;
    transform: scale(.96);
}

@media (prefers-reduced-motion: reduce) {

    .wa_tooltip_enter_active,
    .wa_tooltip_leave_active {
        transition: none;
    }
}
</style>
