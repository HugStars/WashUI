<template>
    <Teleport to="body">
        <Transition appear :duration="{ enter: 380, leave: 240 }"
            enter-active-class="wa_dialog_enter_active" leave-active-class="wa_dialog_leave_active"
            enter-from-class="wa_dialog_enter_from" leave-to-class="wa_dialog_leave_to" @after-leave="OnAfterLeave">
            <div v-if="Visible" class="wa_dialog_mask" :class="{ wa_dialog_frosted: frosted }"
                @click.self="OnMaskClick">
                <div ref="PanelEl" class="wa_dialog" :class="{ wa_dialog_dragging: Dragging }" role="dialog"
                    aria-modal="true" :aria-labelledby="HasHead ? TitleId : undefined"
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

                    <div ref="BodyEl" class="wa_dialog_body" @touchstart="OnBodyTouchStart"
                        @touchmove="OnBodyTouchMove" @touchend="OnBodyTouchEnd" @touchcancel="OnBodyTouchCancel">
                        <div class="wa_dialog_content">
                            <slot />
                            <footer v-if="$slots.footer && FooterInContent"
                                class="wa_dialog_foot wa_dialog_foot_in_content">
                                <slot name="footer" />
                            </footer>
                        </div>
                    </div>

                    <footer v-if="$slots.footer && !FooterInContent" class="wa_dialog_foot">
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
    /** bar：移动端操作栏固定在底部；content：操作栏放进内容区随内容滚动 */
    footerPlacement: {
        type: String,
        default: 'bar',
        allows: ['bar', 'content'],
    },
    /** 开启后弹框面板使用与 AppPopover 一致的磨砂玻璃背景 */
    frosted: Boolean,
    /** 移动端弹框高度，数字按 px 处理 */
    mobileHeight: {
        type: [Number, String],
        default: 'min(60vh, 720px)',
    },
})

const emit = defineEmits(['update:open', 'close'])

const slots = useSlots()
const TitleId = useId()
const Uid = Symbol('wa_dialog')

const Visible = ref(props.open)
const PanelEl = ref(null)
const BodyEl = ref(null)
const DragY = ref(0)
const Dragging = ref(false)

const HasHead = computed(() => Boolean(props.title || slots.title))
const FooterInContent = computed(() => props.footerPlacement === 'content')
const PanelStyle = computed(() => {
    const style = {
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        '--wa_drag_y': `${DragY.value}px`,
        '--wa_dialog_mobile_height': typeof props.mobileHeight === 'number'
            ? `${props.mobileHeight}px`
            : props.mobileHeight,
    }
    if (Dragging.value) style.transition = 'none'
    return style
})

let PrevActive = null
let Locked = false

let StartY = 0
let PointerId = null
let TouchId = null
let TouchStartY = 0
let TouchPulling = false

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
    ResetBodyDrag()
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

function ResetBodyDrag() {
    TouchId = null
    TouchStartY = 0
    TouchPulling = false
    Dragging.value = false
    DragY.value = 0
}

function OnBodyTouchStart(event) {
    if (!props.gesture || event.touches.length !== 1) return

    const body = BodyEl.value
    if (!body || body.scrollTop > 0) return

    ResetBodyDrag()
    TouchId = event.touches[0].identifier
    TouchStartY = event.touches[0].clientY
}

function OnBodyTouchMove(event) {
    if (TouchId === null) return

    const touch = [...event.touches].find(item => item.identifier === TouchId)
    if (!touch) return

    const body = BodyEl.value
    if (!body || body.scrollTop > 0) {
        ResetBodyDrag()
        return
    }

    const distance = touch.clientY - TouchStartY
    if (distance <= 0) {
        if (TouchPulling) ResetBodyDrag()
        return
    }

    if (!TouchPulling && distance < 4) return

    event.preventDefault()
    TouchPulling = true
    Dragging.value = true
    DragY.value = distance
}

function OnBodyTouchEnd() {
    if (TouchId === null) return

    const close = DragY.value > DRAG_CLOSE
    TouchId = null
    TouchStartY = 0
    TouchPulling = false
    Dragging.value = false

    if (close) RequestClose()
    else DragY.value = 0
}

function OnBodyTouchCancel() {
    ResetBodyDrag()
}

watch(() => props.open, (open) => {
    Visible.value = open
    if (typeof document === 'undefined') return

    if (open) {
        DragY.value = 0
        Dragging.value = false
        PointerId = null
        TouchId = null
        TouchStartY = 0
        TouchPulling = false
        Activate()
    } else {
        Dragging.value = false
        PointerId = null
        TouchId = null
        TouchPulling = false
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
}

.wa_dialog_mask::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #0000006b;
    pointer-events: none;
}

.wa_dialog_mask.wa_dialog_frosted::before {
    background: #00000033;
}

.wa_dialog_frosted .wa_dialog {
    border-color: var(--wa_color_border);
    background: var(--wa_color_glass);
    background: linear-gradient(to bottom, var(--wa_color_glass), color-mix(in srgb, var(--wa_color_glass) 68%, transparent));
    -webkit-backdrop-filter: blur(var(--wa_blur));
    backdrop-filter: blur(var(--wa_blur));
}

.wa_dialog {
    position: relative;
    z-index: 1;
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
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
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
    transform-origin: center;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_dialog_close:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_dialog_close:active:not(:disabled) {
    transform: scale(.88);
}

.wa_dialog_body {
    min-width: 0;
}

.wa_dialog_content {
    min-width: 0;
    transform-origin: center top;
}

.wa_dialog_foot {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 2px;
}

.wa_dialog_foot_in_content {
    margin-top: 18px;
    padding-top: 12px;
}

.wa_dialog_grabber {
    display: none;
}

.wa_dialog_grabber::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 38px;
    height: 4px;
    margin-left: -19px;
    border-radius: var(--wa_radius_pill);
    background: var(--wa_color_line_strong);
    transition: transform var(--wa_duration_fast) var(--wa_ease_out), background var(--wa_duration_fast);
    transform-origin: center;
}

.wa_dialog_dragging .wa_dialog_grabber::before {
    transform: scale(.8, .65);
    background: var(--wa_color_text_faint);
}

.wa_dialog_enter_active::before {
    transition: opacity .32s var(--wa_ease_out);
}

.wa_dialog_leave_active::before {
    transition: opacity .24s var(--wa_ease_out);
}

.wa_dialog_enter_active .wa_dialog {
    /* 不要给带 backdrop-filter 的面板做 opacity 过渡，Chromium 会丢掉模糊 */
    /* 内容 scaleY 入场会撑出 20% 高度，先裁掉滚动溢出，避免动画期间闪出滚动条 */
    overflow: hidden;
    transition: transform .32s var(--wa_ease_spring);
}

.wa_dialog_leave_active .wa_dialog {
    transition: opacity .16s var(--wa_ease_out), transform .22s var(--wa_ease_out);
}

.wa_dialog_enter_from::before,
.wa_dialog_leave_to::before {
    opacity: 0;
}

.wa_dialog_enter_from .wa_dialog {
    transform: translateY(14px) scale(.94);
}

.wa_dialog_leave_to .wa_dialog {
    opacity: 0;
    transform: translateY(8px) scale(.98);
}

.wa_dialog_enter_active .wa_dialog_content {
    animation: wa_dialog_content_in .3s var(--wa_ease_out) both;
}

.wa_dialog_leave_active .wa_dialog_content {
    animation: wa_dialog_content_out .24s var(--wa_ease_out) both;
}

@keyframes wa_dialog_content_in {
    from {
        transform: scaleY(1.2);
    }

    to {
        transform: scaleY(1);
    }
}

@keyframes wa_dialog_content_out {
    to {
        opacity: 0;
        transform: scaleY(.96);
    }
}

@media (prefers-reduced-motion: reduce) {

    .wa_dialog,
    .wa_dialog_close,
    .wa_dialog_grabber,
    .wa_dialog_grabber::before,
    .wa_dialog_enter_active::before,
    .wa_dialog_leave_active::before,
    .wa_dialog_enter_active .wa_dialog,
    .wa_dialog_leave_active .wa_dialog {
        transition: none;
    }

    .wa_dialog_close:active:not(:disabled) {
        transform: none;
    }

    .wa_dialog_enter_active .wa_dialog_content,
    .wa_dialog_leave_active .wa_dialog_content {
        animation: none;
    }
}

@media (max-width: 860px) {
    .wa_dialog_mask {
        align-items: flex-end;
        padding: 0;
    }

    .wa_dialog_mask::before {
        background: linear-gradient(180deg, #00000000 0%, #00000040 35%, #000000a6 100%);
    }

    .wa_dialog_mask.wa_dialog_frosted::before {
        background: linear-gradient(180deg, #00000000 0%, #00000026 35%, #00000066 100%);
    }

    .wa_dialog {
        width: 100%;
        height: var(--wa_dialog_mobile_height, min(60vh, 720px));
        max-height: calc(100vh - 12px - env(safe-area-inset-top));
        padding: 20px 20px calc(12px + env(safe-area-inset-bottom));
        border-radius: var(--wa_radius_dialog) var(--wa_radius_dialog) 0 0;
        gap: 0;
        overflow: hidden;
        transition: transform var(--wa_duration_base) var(--wa_ease_out);
    }

    .wa_dialog_enter_active .wa_dialog {
        animation: wa_dialog_sheet_in .3s cubic-bezier(.22, 1, .36, 1) both;
    }

    /*
     * 面板整体从视口外上滑时，内容也同时在收拢，等内容露出来动画已经结束。
     * 延后 0.16s，让面板接近落位后再播放内容收拢，总时长 0.34s，
     * 仍在入场过渡的 380ms 内。
     */
    .wa_dialog_enter_active .wa_dialog_content {
        animation-delay: .16s;
        animation-duration: .18s;
    }

    .wa_dialog_leave_active .wa_dialog {
        animation: wa_dialog_sheet_out .24s cubic-bezier(.4, 0, 1, 1) both;
    }

    .wa_dialog_enter_from .wa_dialog,
    .wa_dialog_leave_to .wa_dialog {
        transform: translateY(100%);
    }

    .wa_dialog_grabber {
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        width: 72px;
        height: 24px;
        margin-left: -36px;
        background: transparent;
    }

    .wa_dialog_head {
        flex: none;
        padding: 4px 44px 12px 0;
    }

    .wa_dialog_title {
        padding-right: 0;
    }

    .wa_dialog_close {
        top: 20px;
        right: 16px;
    }

    .wa_dialog_body {
        flex: 1;
        min-height: 0;
        padding: 16px 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        touch-action: pan-y;
    }

    .wa_dialog_foot {
        flex: none;
        padding-top: 12px;
    }

    .wa_dialog_foot_in_content {
        margin-top: 16px;
    }
}

@keyframes wa_dialog_sheet_in {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

@keyframes wa_dialog_sheet_out {
    from {
        opacity: 1;
        transform: translateY(var(--wa_drag_y, 0px));
    }

    to {
        opacity: 0;
        transform: translateY(100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_dialog {
        transition: none;
    }

    .wa_dialog_enter_active .wa_dialog,
    .wa_dialog_leave_active .wa_dialog {
        transition: none;
        animation: none;
    }

    .wa_dialog_enter_active .wa_dialog_content,
    .wa_dialog_leave_active .wa_dialog_content {
        animation: none;
    }
}
</style>
