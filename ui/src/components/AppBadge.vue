<template>
    <span class="wa_badge" :class="Classes">
        <span class="wa_badge_ghost" aria-hidden="true">{{ Label }}</span>
        <span class="wa_badge_anchor" :style="AnchorStyle" aria-hidden="true"></span>

        <svg class="wa_badge_goo" viewBox="0 0 320 320" aria-hidden="true" focusable="false">
            <path v-if="PathData" :d="PathData" />
        </svg>

        <component :is="readonly ? 'span' : 'button'" ref="BlobEl" :type="readonly ? undefined : 'button'"
            class="wa_badge_blob" :class="{ dragging: Dragging, flying: Flying }" :style="BlobStyle"
            :aria-label="AriaLabel" :disabled="readonly ? undefined : disabled"
            :tabindex="readonly ? undefined : tabindex" @pointerdown="OnPointerDown" @pointermove="OnPointerMove"
            @pointerup="OnPointerUp" @pointercancel="OnPointerUp" @click="OnClick" @keydown="OnKeydown">
            <span class="wa_badge_text"><slot>{{ Label }}</slot></span>
        </component>

        <span v-if="Bursting" class="wa_badge_burst" aria-hidden="true"></span>
    </span>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { createGooeyPath } from '../utils/gooey.js'

const props = defineProps({
    /** 未读数量或短文本；dot 模式下忽略 */
    value: {
        type: [String, Number],
        default: '',
    },
    /** 只显示一个小圆点 */
    dot: Boolean,
    /**
     * danger | accent | neutral
     * @type {'danger' | 'accent' | 'neutral'}
     */
    tone: {
        type: String,
        default: 'danger',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /** 数字上限，超出显示 max+ */
    max: {
        type: Number,
        default: 99,
    },
    /** 拖拽后产生粘性连接，松手回弹；拖过 maxDistance 断开并触发 clear */
    draggable: Boolean,
    /** 断开阈值（px） */
    maxDistance: {
        type: Number,
        default: 72,
    },
    disabled: Boolean,
    /** 只读展示：渲染为 span，不参与点击、拖动和键盘交互 */
    readonly: Boolean,
    /** 按钮的 tabindex；放在 tablist 等组合控件里时可设为 -1 */
    tabindex: {
        type: [Number, String],
        default: 0,
    },
    /** 无可见文字时的无障碍名称 */
    ariaLabel: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['click', 'clear'])

const SIZE_MAP = { sm: 16, md: 20 }
const DOT_MAP = { sm: 8, md: 10 }

const BlobEl = ref(null)
const Dragging = ref(false)
const Broken = ref(false)
const Flying = ref(false)
const Dismissed = ref(false)
const Bursting = ref(false)
const DragX = ref(0)
const DragY = ref(0)
const AnchorScale = ref(1)

let PointerId = null
let StartX = 0
let StartY = 0
let LastX = 0
let LastY = 0
let LastTime = 0
let VelocityX = 0
let VelocityY = 0
let Active = false
let SuppressClick = false
let SpringFrame = 0
let BurstTimer = null
let FinishTimer = null

const ReducedMotion = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const BaseRadius = computed(() => (props.dot ? DOT_MAP[props.size] || DOT_MAP.sm : SIZE_MAP[props.size] || SIZE_MAP.sm) / 2)
const Label = computed(() => {
    if (props.dot) return ''
    const number = Number(props.value)
    if (Number.isFinite(number) && number > props.max) return `${props.max}+`
    return String(props.value ?? '')
})
const AriaLabel = computed(() => {
    if (props.ariaLabel) return props.ariaLabel
    const base = props.dot ? '有新消息' : `${props.value} 条未读`
    return props.draggable ? `${base}，可拖动清除` : base
})

const Classes = computed(() => [
    `wa_badge_${props.tone}`,
    {
        wa_badge_md: props.size === 'md',
        wa_badge_dot: props.dot,
        wa_badge_draggable: props.draggable,
        wa_badge_out: Dismissed.value,
    },
])

const PathData = computed(() => {
    if (!Dragging.value || Broken.value || Dismissed.value) return ''
    const radius = BaseRadius.value
    return createGooeyPath({
        x1: 160,
        y1: 160,
        r1: radius * AnchorScale.value,
        x2: 160 + DragX.value,
        y2: 160 + DragY.value,
        r2: radius,
        maxDistance: props.maxDistance,
    })
})

const AnchorStyle = computed(() => ({
    opacity: Dragging.value && !Broken.value && !Dismissed.value ? 1 : 0,
    transform: `translate(-50%, -50%) scale(${AnchorScale.value})`,
}))

const BlobStyle = computed(() => ({
    transform: `translate3d(${DragX.value}px, ${DragY.value}px, 0)`,
}))

function AnchorFor(distance) {
    return Math.max(0.3, 1 - distance / Math.max(1, props.maxDistance) * 0.7)
}

function OnPointerDown(event) {
    if (!props.draggable || props.disabled || Dismissed.value || Flying.value) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    Active = true
    PointerId = event.pointerId
    StartX = event.clientX
    StartY = event.clientY
    LastX = StartX
    LastY = StartY
    LastTime = performance.now()
    VelocityX = 0
    VelocityY = 0

    try {
        event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
        // 合成事件或指针已经失效时忽略
    }
}

function OnPointerMove(event) {
    if (!Active || event.pointerId !== PointerId) return

    const dx = event.clientX - StartX
    const dy = event.clientY - StartY
    const distance = Math.hypot(dx, dy)

    if (!Dragging.value) {
        if (distance < 4) return
        cancelAnimationFrame(SpringFrame)
        Dragging.value = true
        DragX.value = dx
        DragY.value = dy
        AnchorScale.value = AnchorFor(distance)
        event.preventDefault()
        return
    }

    const now = performance.now()
    const gap = Math.max(1, now - LastTime)
    VelocityX = (event.clientX - LastX) / gap
    VelocityY = (event.clientY - LastY) / gap
    LastX = event.clientX
    LastY = event.clientY
    LastTime = now

    DragX.value = dx
    DragY.value = dy
    AnchorScale.value = AnchorFor(distance)

    if (!Broken.value && distance >= props.maxDistance) Break()
}

function OnPointerUp(event) {
    if (!Active || event.pointerId !== PointerId) return

    Active = false
    PointerId = null
    try {
        BlobEl.value?.releasePointerCapture(event.pointerId)
    } catch {
        // 指针已经释放时忽略
    }

    if (!Dragging.value) return

    Dragging.value = false
    SuppressClick = true
    setTimeout(() => {
        SuppressClick = false
    }, 0)

    if (!Broken.value) {
        SpringBack()
        return
    }

    Explode()
}

function Break() {
    Broken.value = true
    Bursting.value = true
    clearTimeout(BurstTimer)
    BurstTimer = setTimeout(() => {
        Bursting.value = false
    }, 340)
}

function SpringBack() {
    cancelAnimationFrame(SpringFrame)

    if (ReducedMotion) {
        Settle()
        return
    }

    let x = DragX.value
    let y = DragY.value
    let vx = Clamp(VelocityX * 1000, -1600, 1600)
    let vy = Clamp(VelocityY * 1000, -1600, 1600)
    let last = performance.now()

    const tick = now => {
        const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000))
        last = now

        vx += (-320 * x - 32 * vx) * dt
        vy += (-320 * y - 32 * vy) * dt
        x += vx * dt
        y += vy * dt

        DragX.value = x
        DragY.value = y
        AnchorScale.value = AnchorFor(Math.hypot(x, y))

        if (Math.hypot(x, y) < 0.4 && Math.hypot(vx, vy) < 8) {
            Settle()
            return
        }

        SpringFrame = requestAnimationFrame(tick)
    }

    SpringFrame = requestAnimationFrame(tick)
}

function Settle() {
    cancelAnimationFrame(SpringFrame)
    DragX.value = 0
    DragY.value = 0
    AnchorScale.value = 1
}

function Explode() {
    const speed = Math.hypot(VelocityX, VelocityY)
    let ux
    let uy

    if (speed > 0.05) {
        ux = VelocityX / speed
        uy = VelocityY / speed
    } else {
        const distance = Math.hypot(DragX.value, DragY.value) || 1
        ux = DragX.value / distance
        uy = DragY.value / distance
    }

    clearTimeout(FinishTimer)

    if (ReducedMotion) {
        Finish()
        return
    }

    Flying.value = true
    requestAnimationFrame(() => {
        DragX.value += ux * 56
        DragY.value += uy * 56
    })
    FinishTimer = setTimeout(Finish, 240)
}

function Finish() {
    clearTimeout(FinishTimer)
    Flying.value = false
    Dismissed.value = true
    Dragging.value = false
    Settle()
    emit('clear')
}

function OnClick() {
    if (SuppressClick) {
        SuppressClick = false
        return
    }
    if (Dismissed.value) return
    emit('click')
}

function OnKeydown(event) {
    if (!props.draggable || (event.key !== 'Delete' && event.key !== 'Backspace')) return
    event.preventDefault()
    if (Dismissed.value) return
    Break()
    Explode()
}

function Reset() {
    cancelAnimationFrame(SpringFrame)
    clearTimeout(BurstTimer)
    clearTimeout(FinishTimer)
    Active = false
    PointerId = null
    Dragging.value = false
    Broken.value = false
    Flying.value = false
    Dismissed.value = false
    Bursting.value = false
    DragX.value = 0
    DragY.value = 0
    AnchorScale.value = 1
}

function Clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

watch(() => props.value, Reset)

onUnmounted(() => {
    cancelAnimationFrame(SpringFrame)
    clearTimeout(BurstTimer)
    clearTimeout(FinishTimer)
})
</script>

<style>
.wa_badge {
    --wa_badge_size: 16px;
    --wa_badge_font: 10px;
    --wa_badge_bg: var(--wa_color_danger);
    --wa_badge_color: var(--wa_color_on_text);

    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    min-width: var(--wa_badge_size);
    height: var(--wa_badge_size);
    font-family: inherit;
    font-size: var(--wa_badge_font);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    vertical-align: middle;
    user-select: none;
    -webkit-user-select: none;
}

.wa_badge_md {
    --wa_badge_size: 20px;
    --wa_badge_font: 11px;
}

/* 用不可见文本决定角标宽度，blob 绝对定位铺满 */
.wa_badge_ghost {
    padding: 0 4px;
    font-size: var(--wa_badge_font);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    white-space: nowrap;
    visibility: hidden;
}

.wa_badge_dot .wa_badge_ghost {
    display: none;
}

.wa_badge_dot {
    --wa_badge_size: 8px;
    --wa_badge_font: 0;
}

.wa_badge_dot.wa_badge_md {
    --wa_badge_size: 10px;
}

.wa_badge_accent {
    --wa_badge_bg: var(--wa_color_accent);
    --wa_badge_color: var(--wa_color_on_accent);
}

.wa_badge_neutral {
    --wa_badge_bg: var(--wa_color_text);
    --wa_badge_color: var(--wa_color_on_text);
}

.wa_badge_blob {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--wa_badge_size);
    height: 100%;
    padding: 0 4px;
    border: 0;
    border-radius: var(--wa_radius_pill);
    color: var(--wa_badge_color);
    background: var(--wa_badge_bg);
    font: inherit;
    font-size: var(--wa_badge_font);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    transform-origin: center;
    will-change: transform;
}

.wa_badge_dot .wa_badge_blob {
    padding: 0;
}

.wa_badge_text {
    display: block;
    line-height: 1;
}

/* 数字按 cap 高度裁剪行盒，避免不同移动端字体的基线差异 */
@supports (text-box-trim: trim-both) {
    .wa_badge_text {
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
    }
}

/* 旧内核没有 text-box，数字在行盒里通常偏上 */
@supports not (text-box-trim: trim-both) {
    .wa_badge_text {
        padding-top: .06em;
    }
}

/* 小角标的可点 / 可拖区域比视觉尺寸大一圈 */
.wa_badge_blob::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: inherit;
}

.wa_badge_draggable .wa_badge_blob {
    cursor: grab;
}

.wa_badge_draggable .wa_badge_blob.dragging,
.wa_badge_draggable .wa_badge_blob:active {
    cursor: grabbing;
}

.wa_badge_blob:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_badge_blob:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_badge_anchor {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: var(--wa_badge_size);
    height: var(--wa_badge_size);
    border-radius: 50%;
    background: var(--wa_badge_bg);
    pointer-events: none;
}

.wa_badge_goo {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 0;
    width: 320px;
    height: 320px;
    overflow: visible;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.wa_badge_goo path {
    fill: var(--wa_badge_bg);
}

.wa_badge_burst {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 3;
    width: var(--wa_badge_size);
    height: var(--wa_badge_size);
    border: 1px solid var(--wa_badge_bg);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: wa_badge_burst .34s var(--wa_ease_out) forwards;
}

.wa_badge_blob.flying {
    scale: .35;
    opacity: 0;
    transition:
        transform .24s var(--wa_ease_out),
        scale .24s var(--wa_ease_out),
        opacity .2s linear;
}

.wa_badge_out {
    visibility: hidden;
}

@keyframes wa_badge_burst {
    from {
        opacity: .65;
        scale: 1;
    }

    to {
        opacity: 0;
        scale: 2.4;
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_badge_blob.flying {
        transition: opacity var(--wa_duration_fast) linear;
    }

    .wa_badge_burst {
        animation: none;
    }
}
</style>
