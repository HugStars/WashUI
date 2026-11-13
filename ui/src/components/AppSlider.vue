<template>
    <div class="wa_slider" :class="Classes" :aria-disabled="disabled || undefined">
        <div v-if="HasLabel" class="wa_slider_head">
            <span :id="`${SliderId}-label`" class="wa_slider_label" @click="FocusThumb">
                <slot name="label">{{ label }}</slot>
            </span>
        </div>

        <div class="wa_slider_body" :style="BodyStyle">
            <div ref="TrackEl" class="wa_slider_track" @pointerdown="OnPointerDown"
                @pointermove="OnPointerMove" @pointerup="OnPointerUp" @pointercancel="OnPointerUp"
                @lostpointercapture="OnPointerUp">
                <div class="wa_slider_rail" aria-hidden="true"></div>
                <div class="wa_slider_fill" :style="{ width: `${Percent}%` }" aria-hidden="true"></div>
                <div v-for="segment in DisabledSegments" :key="segment.key" class="wa_slider_disabled_range"
                    :style="{ left: `${segment.left}%`, width: `${segment.width}%` }" aria-hidden="true"></div>

                <div ref="ThumbEl" class="wa_slider_thumb" :style="{ left: `${Percent}%` }" role="slider"
                    :tabindex="disabled ? -1 : 0" :aria-valuemin="min" :aria-valuemax="max"
                    :aria-valuenow="Current" :aria-valuetext="ValueText"
                    :aria-labelledby="HasLabel ? `${SliderId}-label` : undefined"
                    :aria-label="HasLabel ? undefined : AccessibleLabel"
                    :aria-disabled="disabled || undefined" @keydown="OnKeydown">
                </div>
            </div>

            <span v-if="ShowValue" class="wa_slider_value"
                :class="{ wa_slider_value_on_hover: DisplayMode === 'hover' }">{{ ValueText }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, useId, useSlots, watch } from 'vue'

const VALUE_DISPLAY = new Set(['hover', 'always', 'none'])

const props = defineProps({
    modelValue: {
        type: Number,
        default: 0,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },
    /** 允许选择的区间；单个 [20, 80] 或多段 [[0, 20], [80, 100]]，空数组表示全范围 */
    allowedRanges: {
        type: Array,
        default: () => [],
    },
    step: {
        type: Number,
        default: 1,
    },
    disabled: Boolean,
    label: {
        type: String,
        default: '',
    },
    /** 视觉隐藏标签，但保留无障碍名称 */
    hideLabel: Boolean,
    /** 兼容旧写法；为 true 时等价于 valueDisplay="always" */
    showValue: Boolean,
    /**
     * 数值显示方式：hover 悬停显示、always 常显、none 不显示
     * @type {'hover' | 'always' | 'none'}
     */
    valueDisplay: {
        type: String,
        default: 'hover',
    },
    /** 轨道与数值之间的间距，数字按 px 处理 */
    valueGap: {
        type: [Number, String],
        default: 10,
    },
    /** 自定义数值格式，优先级高于 suffix */
    format: {
        type: Function,
        default: null,
    },
    /** 数值后缀，例如 '%' */
    suffix: {
        type: String,
        default: '',
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const SliderId = useId()
const TrackEl = ref(null)
const ThumbEl = ref(null)
const Dragging = ref(false)

let Pressing = false
let PressStartX = 0
let DragStartValue = 0
let PointerId = null

const HasLabel = computed(() => !props.hideLabel && Boolean(props.label || slots.label))
const AccessibleLabel = computed(() => props.ariaLabel || props.label || '滑块')
const DisplayMode = computed(() => {
    if (props.showValue) return 'always'
    return VALUE_DISPLAY.has(props.valueDisplay) ? props.valueDisplay : 'hover'
})
const ShowValue = computed(() => DisplayMode.value !== 'none')
const BodyStyle = computed(() => ({
    '--wa_slider_gap': typeof props.valueGap === 'number' ? `${props.valueGap}px` : props.valueGap,
}))
const Classes = computed(() => ({
    wa_slider_sm: props.size === 'sm',
    is_disabled: props.disabled,
    wa_slider_dragging: Dragging.value,
}))

// - 规范化允许区间：支持 [20, 80] 与 [[0, 20], [80, 100]]，并合并重叠段
const NormalizedRanges = computed(() => {
    const raw = props.allowedRanges
    if (!Array.isArray(raw) || raw.length === 0) return [[props.min, props.max]]

    const list = typeof raw[0] === 'number' ? [raw] : raw
    const ranges = list
        .filter(item => Array.isArray(item) && item.length >= 2)
        .map(([a, b]) => {
            const start = Math.max(props.min, Math.min(Number(a), Number(b)))
            const end = Math.min(props.max, Math.max(Number(a), Number(b)))
            return [start, end]
        })
        .filter(([start, end]) => Number.isFinite(start) && Number.isFinite(end) && end >= start)
        .sort((a, b) => a[0] - b[0])

    const merged = []
    for (const range of ranges) {
        const last = merged[merged.length - 1]
        if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1])
        else merged.push([...range])
    }

    return merged.length ? merged : [[props.min, props.max]]
})

// - 按 step 的小数位推导精度，避免浮点误差
const Decimals = computed(() => {
    const text = String(props.step)
    return text.includes('.') ? text.split('.')[1].length : 0
})

const SafeStep = computed(() => (Number.isFinite(props.step) && props.step > 0 ? props.step : 1))

function Round(value) {
    const base = 10 ** Decimals.value
    return Math.round(value * base) / base
}

function Clamp(value) {
    return Math.min(props.max, Math.max(props.min, value))
}

// - 以 min 为基准吸附到最近的 step，再落到允许区间内
//   keepRange=true 时只在当前值所在的允许段内移动，避免拖动跨禁用区时跳到另一端
function Snap(value, keepRange = false) {
    const steps = Math.round((value - props.min) / SafeStep.value)
    return NearestAllowed(Round(Clamp(props.min + steps * SafeStep.value)), keepRange)
}

// - 取距离最近的可选值；落在禁用区时会吸附到最近的区间边界
function NearestAllowed(value, keepRange = false) {
    const ranges = NormalizedRanges.value

    if (keepRange) {
        const current = ranges.find(([start, end]) => Current.value >= start && Current.value <= end)
        if (current) return Math.min(current[1], Math.max(current[0], value))
    }

    let best = ranges[0][0]
    let bestDistance = Infinity

    for (const [start, end] of ranges) {
        const candidate = Math.min(end, Math.max(start, value))
        const distance = Math.abs(candidate - value)
        if (distance < bestDistance) {
            bestDistance = distance
            best = candidate
        }
    }

    return best
}

const Initial = Number(props.modelValue)
const LocalValue = ref(Snap(Number.isFinite(Initial) ? Initial : props.min))
const Current = computed(() => LocalValue.value)

function ToPercent(value) {
    const range = props.max - props.min
    if (!Number.isFinite(range) || range <= 0) return 0
    return Math.min(100, Math.max(0, ((value - props.min) / range) * 100))
}

const Percent = computed(() => ToPercent(Current.value))

// - 未被允许区间覆盖的轨道段，用于视觉提示
const DisabledSegments = computed(() => {
    const raw = props.allowedRanges
    if (!Array.isArray(raw) || raw.length === 0) return []

    const ranges = NormalizedRanges.value
    const segments = []
    let cursor = props.min

    for (const [start, end] of ranges) {
        if (start > cursor) segments.push([cursor, start])
        cursor = Math.max(cursor, end)
    }
    if (cursor < props.max) segments.push([cursor, props.max])

    return segments.map(([start, end]) => {
        const left = ToPercent(start)
        return {
            key: `${start}-${end}`,
            left,
            width: ToPercent(end) - left,
        }
    })
})

const ValueText = computed(() => {
    if (typeof props.format === 'function') return props.format(Current.value)
    return `${Current.value}${props.suffix}`
})

watch(() => props.modelValue, value => {
    // - 拖动期间忽略外部回写，避免 thumb 跳回上一帧
    if (Dragging.value) return
    const next = Number(value)
    LocalValue.value = Snap(Number.isFinite(next) ? next : props.min)
})

function Commit(value, withChange = false, keepRange = false) {
    const next = Snap(value, keepRange)
    if (next === LocalValue.value) return

    LocalValue.value = next
    emit('update:modelValue', next)
    if (withChange) emit('change', next)
}

function FocusThumb() {
    if (props.disabled) return
    ThumbEl.value?.focus({ preventScroll: true })
}

function UpdateFromPointer(clientX, keepRange = false) {
    const rect = TrackEl.value?.getBoundingClientRect()
    if (!rect || rect.width <= 0) return

    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    Commit(props.min + ratio * (props.max - props.min), false, keepRange)
}

function OnPointerDown(event) {
    if (props.disabled) return
    if (event.button !== undefined && event.button !== 0) return

    event.preventDefault()
    Pressing = true
    PressStartX = event.clientX
    DragStartValue = LocalValue.value
    PointerId = event.pointerId

    ThumbEl.value?.focus({ preventScroll: true })
    try {
        TrackEl.value?.setPointerCapture?.(event.pointerId)
    } catch (err) {
        console.warn('滑块指针捕获失败:', err)
    }

    // - 点击轨道时先按目标值播放滑行动画；移动超过阈值后再切换为拖动
    UpdateFromPointer(event.clientX)
}

function OnPointerMove(event) {
    if (!Pressing) return
    event.preventDefault()

    if (!Dragging.value && Math.abs(event.clientX - PressStartX) > 3) {
        Dragging.value = true
    }
    if (Dragging.value) UpdateFromPointer(event.clientX, true)
}

function OnPointerUp() {
    if (!Pressing) return

    Pressing = false
    Dragging.value = false
    if (PointerId !== null) {
        try {
            TrackEl.value?.releasePointerCapture?.(PointerId)
        } catch (err) {
            // - 指针已释放时忽略
        }
        PointerId = null
    }

    if (LocalValue.value !== DragStartValue) emit('change', LocalValue.value)
}

function OnKeydown(event) {
    if (props.disabled) return

    const step = SafeStep.value
    const bigStep = step * 10
    let next = null

    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
            next = Current.value + step
            break
        case 'ArrowLeft':
        case 'ArrowDown':
            next = Current.value - step
            break
        case 'PageUp':
            next = Current.value + bigStep
            break
        case 'PageDown':
            next = Current.value - bigStep
            break
        case 'Home':
            next = props.min
            break
        case 'End':
            next = props.max
            break
        default:
            return
    }

    event.preventDefault()
    // - Home / End 允许跨段跳转，其余按键保持在当前允许段内
    const globalJump = event.key === 'Home' || event.key === 'End'
    Commit(next, true, !globalJump)
}
</script>

<style>
.wa_slider {
    --wa_slider_track: 6px;
    --wa_slider_thumb: 20px;
    --wa_slider_ring: 3px;
    --wa_slider_hit: 34px;
    --wa_slider_color: var(--wa_color_highlight);

    display: grid;
    gap: 2px;
    width: 100%;
    min-width: 120px;
    color: var(--wa_color_text);
    user-select: none;
}

.wa_slider.wa_slider_sm {
    --wa_slider_track: 4px;
    --wa_slider_thumb: 16px;
    --wa_slider_ring: 2px;
    --wa_slider_hit: 28px;
}

.wa_slider.is_disabled {
    opacity: .45;
}

.wa_slider_head {
    display: flex;
    align-items: center;
    min-width: 0;
}

.wa_slider_label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    line-height: 1.4;
    color: var(--wa_color_text);
    cursor: pointer;
}

.wa_slider.wa_slider_sm .wa_slider_label {
    font-size: 13px;
}

.wa_slider_body {
    display: flex;
    align-items: center;
    gap: var(--wa_slider_gap, 10px);
    min-width: 0;
}

.wa_slider_track {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    height: var(--wa_slider_hit);
    cursor: pointer;
    touch-action: none;
}

.wa_slider.is_disabled .wa_slider_track {
    cursor: not-allowed;
}

.wa_slider_rail {
    width: 100%;
    height: var(--wa_slider_track);
    border-radius: var(--wa_radius_pill);
    background: var(--wa_slider_track_color, var(--wa_color_active));
}

.wa_slider_fill {
    position: absolute;
    top: 50%;
    left: 0;
    height: var(--wa_slider_track);
    border-radius: var(--wa_radius_pill);
    background: var(--wa_slider_color);
    translate: 0 -50%;
    transition: width var(--wa_duration_base) var(--wa_ease_out);
}

.wa_slider_disabled_range {
    position: absolute;
    top: 50%;
    height: var(--wa_slider_track);
    border-radius: var(--wa_radius_pill);
    background: var(--wa_color_line_strong);
    opacity: .55;
    translate: 0 -50%;
    pointer-events: none;
}

.wa_slider_thumb {
    position: absolute;
    top: 50%;
    width: var(--wa_slider_thumb);
    height: var(--wa_slider_thumb);
    border-radius: 50%;
    background: var(--wa_color_dialog);
    box-shadow:
        0 0 0 var(--wa_slider_ring) var(--wa_color_dialog),
        var(--wa_shadow_thumb_soft);
    translate: -50% -50%;
    cursor: grab;
    outline: none;
    transition: left var(--wa_duration_base) var(--wa_ease_out);
}

.wa_slider_thumb::before {
    content: '';
    position: absolute;
    inset: calc((var(--wa_slider_thumb) - 14px) / 2);
    border-radius: 50%;
    background: var(--wa_slider_color);
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_slider.wa_slider_sm .wa_slider_thumb::before {
    inset: calc((var(--wa_slider_thumb) - 12px) / 2);
}

.wa_slider_dragging .wa_slider_thumb {
    cursor: grabbing;
    transition: none;
}

.wa_slider_dragging .wa_slider_fill {
    transition: none;
}

.wa_slider_thumb:hover::before {
    transform: scale(1.3);
}

.wa_slider_thumb:active::before {
    transform: scale(.8);
    transition-duration: var(--wa_duration_fast);
    transition-timing-function: var(--wa_ease_out);
}

.wa_slider_thumb:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 3px;
}

.wa_slider.is_disabled .wa_slider_thumb {
    cursor: not-allowed;
}

.wa_slider_value {
    flex: none;
    min-width: var(--wa_slider_value_width, 40px);
    padding-left: 4px;
    text-align: right;
    white-space: nowrap;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    line-height: 1.4;
    color: var(--wa_color_text_muted);
    transition:
        opacity var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_slider.wa_slider_sm .wa_slider_value {
    min-width: var(--wa_slider_value_width, 36px);
    font-size: 12px;
}

.wa_slider_value_on_hover {
    opacity: 0;
}

.wa_slider:hover .wa_slider_value_on_hover,
.wa_slider_dragging .wa_slider_value_on_hover {
    opacity: 1;
}

.wa_slider:hover .wa_slider_value {
    color: var(--wa_color_text);
}

@media (prefers-reduced-motion: reduce) {
    .wa_slider_fill,
    .wa_slider_thumb,
    .wa_slider_thumb::before,
    .wa_slider_value {
        transition-duration: 0s;
    }

    .wa_slider_thumb:hover::before,
    .wa_slider_thumb:active::before {
        transform: none;
    }
}
</style>
