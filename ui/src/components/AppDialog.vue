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
