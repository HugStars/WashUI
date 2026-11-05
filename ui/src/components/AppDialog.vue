<template>
    <Teleport to="body">
        <Transition appear enter-active-class="wa_dialog_enter_active" leave-active-class="wa_dialog_leave_active"
            enter-from-class="wa_dialog_enter_from" leave-to-class="wa_dialog_leave_to" @after-leave="OnAfterLeave">
            <div v-if="Visible" class="wa_dialog_mask" @click.self="OnMaskClick">
                <div ref="PanelEl" class="wa_dialog" role="dialog" aria-modal="true"
                    :aria-labelledby="HasHead ? TitleId : undefined"
                    :aria-label="HasHead ? undefined : (ariaLabel || '对话框')"
                    :aria-describedby="describedBy || undefined" :style="PanelStyle" tabindex="-1"
                    @pointerdown="OnPointerDown" @pointermove="OnPointerMove" @pointerup="OnPointerEnd"
                    @pointercancel="OnPointerCancel">
                    <span v-if="gesture" class="wa_dialog_grabber" aria-hidden="true"></span>

                    <header v-if="HasHead" class="wa_dialog_head">
                        <h2 :id="TitleId" class="wa_dialog_title">
                            <slot name="title">{{ title }}</slot>
                        </h2>
                    </header>

                    <button v-if="closable" type="button" class="wa_dialog_close" aria-label="关闭"
                        @click="RequestClose">
                        <AppIcon name="close" :size="17" />
                    </button>

                    <div class="wa_dialog_body">
                        <slot />
                    </div>

                    <footer v-if="$slots.footer" class="wa_dialog_foot">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref, useId, useSlots, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
const DRAG_CLOSE = 100
const Stack = []

let LockCount = 0
let LockSnapshot = null

function LockPage() {
    if (typeof document === 'undefined') return
    if (LockCount++ > 0) return

    const root = document.documentElement
    const body = document.body
    const nodes = []

    for (const el of body.children) {
        if (el.classList.contains('wa_toast_box') || el.classList.contains('wa_dialog_mask')) continue
        nodes.push({
            el,
            inert: el.hasAttribute('inert'),
            ariaHidden: el.getAttribute('aria-hidden'),
        })
        el.setAttribute('inert', '')
        el.setAttribute('aria-hidden', 'true')
    }

    LockSnapshot = {
        overflow: root.style.overflow,
        overscroll: root.style.overscrollBehavior,
        bodyOverscroll: body.style.overscrollBehavior,
        nodes,
    }

    root.style.overflow = 'hidden'
    root.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
}

function UnlockPage() {
    if (typeof document === 'undefined' || LockCount === 0) return
    if (--LockCount > 0) return

    const snapshot = LockSnapshot
    LockSnapshot = null
    if (!snapshot) return

    const root = document.documentElement
    root.style.overflow = snapshot.overflow
    root.style.overscrollBehavior = snapshot.overscroll
    document.body.style.overscrollBehavior = snapshot.bodyOverscroll

    for (const item of snapshot.nodes) {
        if (!item.inert) item.el.removeAttribute('inert')
        if (item.ariaHidden === null) item.el.removeAttribute('aria-hidden')
        else item.el.setAttribute('aria-hidden', item.ariaHidden)
    }
}

const props = defineProps({
    open: Boolean,
    title: {
        type: String,
        default: '',
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    describedBy: {
        type: String,
        default: '',
    },
    width: {
        type: [Number, String],
        default: 760,
    },
    closable: {
        type: Boolean,
        default: true,
    },
    closeOnMask: {
        type: Boolean,
        default: true,
    },
    closeOnEsc: {
        type: Boolean,
        default: true,
    },
    gesture: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['update:open', 'close'])

const slots = useSlots()
const TitleId = useId()
const Uid = Symbol('wa_dialog')

const Visible = ref(props.open)
const PanelEl = ref(null)
const DragY = ref(0)
const Dragging = ref(false)

const HasHead = computed(() => Boolean(props.title || slots.title))
const PanelStyle = computed(() => {
    const style = {
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        '--wa_drag_y': `${DragY.value}px`,
    }
    if (Dragging.value) style.transition = 'none'
    return style
})

let PrevActive = null
let Locked = false

let StartY = 0
let PointerId = null

function Focusables() {
    const root = PanelEl.value
    if (!root) return []
    return [...root.querySelectorAll(FOCUSABLE)].filter(el => el.getClientRects().length > 0)
}

function OnKeydown(e) {
    if (Stack[Stack.length - 1] !== Uid) return

    if (e.key === 'Escape' && props.closeOnEsc) {
        e.preventDefault()
        RequestClose()
        return
    }

    if (e.key !== 'Tab') return

    const root = PanelEl.value
    if (!root) return

    const list = Focusables()
    if (!list.length) {
        e.preventDefault()
        root.focus({ preventScroll: true })
        return
    }

    const first = list[0]
    const last = list[list.length - 1]
    const active = document.activeElement

    if (!root.contains(active) || active === root) {
        e.preventDefault()
        const target = e.shiftKey ? last : first
        target.focus()
        return
    }

    if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
    } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
    }
}

function Activate() {
    if (typeof document === 'undefined') return

    PrevActive = document.activeElement
    if (!Stack.includes(Uid)) Stack.push(Uid)
    if (!Locked) {
        LockPage()
        Locked = true
    }

    document.addEventListener('keydown', OnKeydown)
    nextTick(() => PanelEl.value?.focus({ preventScroll: true }))
}

function RestoreFocus() {
    const el = PrevActive
    PrevActive = null
    if (!(el instanceof HTMLElement) || !document.contains(el)) return
    el.focus({ preventScroll: true })
}

function Deactivate() {
    if (typeof document === 'undefined') return

    document.removeEventListener('keydown', OnKeydown)

    const index = Stack.indexOf(Uid)
    if (index >= 0) Stack.splice(index, 1)

    if (Locked) {
        UnlockPage()
        Locked = false
    }

    RestoreFocus()
}

function RequestClose() {
    if (!Visible.value) return
    emit('update:open', false)
}

function OnMaskClick() {
    if (props.closeOnMask) RequestClose()
}

function OnAfterLeave() {
    DragY.value = 0
    Deactivate()
    emit('close')
}

function OnPointerDown(e) {
    if (!props.gesture || e.pointerType === 'mouse' || e.button !== 0) return
    if (!(e.target instanceof Element) || e.target.closest('button, a, input, textarea, select')) return
    if (!e.target.closest('.wa_dialog_grabber, .wa_dialog_head')) return

    PointerId = e.pointerId
    StartY = e.clientY
    Dragging.value = true
    e.currentTarget.setPointerCapture(e.pointerId)
}

function OnPointerMove(e) {
    if (!Dragging.value || e.pointerId !== PointerId) return
    const distance = e.clientY - StartY
    DragY.value = distance > 0 ? distance : 0
}

function OnPointerEnd(e) {
    if (!Dragging.value || e.pointerId !== PointerId) return

    Dragging.value = false
    PointerId = null

    if (DragY.value > DRAG_CLOSE) RequestClose()
    else DragY.value = 0
}

function OnPointerCancel() {
    Dragging.value = false
    PointerId = null
    DragY.value = 0
}

watch(() => props.open, (open) => {
    Visible.value = open
    if (typeof document === 'undefined') return

    if (open) {
        DragY.value = 0
        Dragging.value = false
        PointerId = null
        Activate()
    } else {
        Dragging.value = false
        PointerId = null
        document.removeEventListener('keydown', OnKeydown)
    }
}, { immediate: true })

onUnmounted(() => {
    if (typeof document === 'undefined') return

    document.removeEventListener('keydown', OnKeydown)
    const index = Stack.indexOf(Uid)
    if (index >= 0) Stack.splice(index, 1)
    if (Locked) {
        UnlockPage()
        Locked = false
    }
    RestoreFocus()
})
</script>

<style>
.wa_dialog_close:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_dialog_mask {
    position: fixed;
    inset: 0;
    z-index: var(--wa_z_dialog);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #0000006b;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
}

.wa_dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    padding: 26px;
    border: 1px solid var(--wa_color_dialog_line);
    border-radius: var(--wa_radius_dialog);
    background: var(--wa_color_dialog);
    box-shadow: var(--wa_shadow_dialog);
    touch-action: pan-y;
    transform: translateY(var(--wa_drag_y, 0px));
    transition: transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_dialog:focus {
    outline: 0;
}

.wa_dialog_head,
.wa_dialog_grabber {
    touch-action: none;
}

.wa_dialog_head {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.wa_dialog_title {
    min-width: 0;
    padding-right: 36px;
    overflow: hidden;
    font-size: 17px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_dialog_close {
    position: absolute;
    top: 18px;
    right: 18px;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: var(--wa_radius_small);
    color: var(--wa_color_text_subtle);
    background: transparent;
    cursor: pointer;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.wa_dialog_close:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_dialog_body {
    min-width: 0;
}

.wa_dialog_foot {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 2px;
}

.wa_dialog_grabber {
    display: none;
}

.wa_dialog_enter_active,
.wa_dialog_leave_active {
    transition: opacity .18s var(--wa_ease_out);
}

.wa_dialog_enter_active .wa_dialog,
.wa_dialog_leave_active .wa_dialog {
    transition: opacity .2s ease, transform .2s var(--wa_ease_out);
}

.wa_dialog_enter_from,
.wa_dialog_leave_to {
    opacity: 0;
}

.wa_dialog_enter_from .wa_dialog,
.wa_dialog_leave_to .wa_dialog {
    opacity: 0;
    transform: translateY(12px) scale(.97);
}

@media (prefers-reduced-motion: reduce) {

    .wa_dialog_enter_active,
    .wa_dialog_leave_active,
    .wa_dialog_enter_active .wa_dialog,
    .wa_dialog_leave_active .wa_dialog {
        transition: none;
    }
}

@media (max-width: 860px) {
    .wa_dialog_mask {
        align-items: flex-end;
        padding: 0;
        background: linear-gradient(180deg, #00000000 0%, #00000040 35%, #000000a6 100%);
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
    }

    .wa_dialog {
        width: 100%;
        max-height: 70vh;
        padding: 22px 20px calc(22px + env(safe-area-inset-bottom));
        border-radius: var(--wa_radius_dialog) var(--wa_radius_dialog) 0 0;
    }

    .wa_dialog_enter_from .wa_dialog,
    .wa_dialog_leave_to .wa_dialog {
        transform: translateY(100%);
    }

    .wa_dialog_grabber {
        display: block;
        position: absolute;
        top: 8px;
        left: 50%;
        width: 38px;
        height: 4px;
        margin-left: -19px;
        border-radius: var(--wa_radius_pill);
        background: var(--wa_color_line_strong);
    }

    .wa_dialog_head {
        padding-top: 6px;
    }
}
</style>
