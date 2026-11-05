<template>
    <div class="wa_check_row" :class="`wa_check_label_${labelPosition}`" :style="BetweenStyle">
        <label v-if="HasLabel && labelPosition === 'before'" :id="`${CheckId}-label`" class="wa_check_label"
            :for="CheckId">
            <slot>{{ label }}</slot>
        </label>

        <button :id="CheckId" type="button" class="wa_check"
            :class="{ on: modelValue || Closing, closing: Closing, drawing: Drawing }" role="checkbox"
            :style="SizeStyle" :aria-checked="modelValue"
            :aria-labelledby="HasLabel ? `${CheckId}-label` : undefined"
            :aria-label="HasLabel ? undefined : AccessibleLabel" :disabled="disabled" @click="Toggle">
            <span class="wa_check_mark" aria-hidden="true">
                <span class="wa_check_line wa_check_line_a"></span>
                <span class="wa_check_line wa_check_line_b"></span>
            </span>
        </button>

        <label v-if="HasLabel && labelPosition !== 'before'" :id="`${CheckId}-label`" class="wa_check_label"
            :for="CheckId">
            <slot>{{ label }}</slot>
        </label>
    </div>
</template>

<script setup>
import { computed, onUnmounted, ref, useId, useSlots, watch } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    label: {
        type: String,
        default: '',
    },
    /** before：标签在勾选框前；after：标签在勾选框后 */
    labelPosition: {
        type: String,
        default: 'after',
        allows: ['before', 'after'],
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    /** 复选框尺寸，数字按 px 处理 */
    size: {
        type: [Number, String],
        default: 20,
    },
    /** 纵向两端对齐时，让标签和复选框分别贴左右两侧 */
    between: Boolean,
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const CheckId = useId()
const HasLabel = computed(() => Boolean(props.label || slots.default))
const AccessibleLabel = computed(() => props.ariaLabel || props.label || '复选框')
const BetweenStyle = computed(() => props.between
    ? { width: '100%', justifyContent: 'space-between' }
    : undefined)
const SizeStyle = computed(() => ({
    '--wa_check_size': typeof props.size === 'number' ? `${props.size}px` : props.size,
}))

// 取消选中：✓ 变形为 × 后缩放消失；选中：两段线按顺序画出
const ReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
const Closing = ref(false)
const Drawing = ref(false)
let CloseTimer = 0
let DrawTimer = 0

watch(() => props.modelValue, (checked, wasChecked) => {
    clearTimeout(CloseTimer)
    clearTimeout(DrawTimer)

    if (checked) {
        // 从取消动画中途恢复时直接反向过渡，不重新播放“手写”
        const interrupted = Closing.value
        Closing.value = false
        Drawing.value = !interrupted && wasChecked === false && !ReducedMotion

        if (Drawing.value) {
            DrawTimer = setTimeout(() => {
                Drawing.value = false
            }, 320)
        }
        return
    }

    Drawing.value = false

    if (!wasChecked || ReducedMotion) {
        Closing.value = false
        return
    }

    Closing.value = true
    CloseTimer = setTimeout(() => {
        Closing.value = false
    }, 340)
})

onUnmounted(() => {
    clearTimeout(CloseTimer)
    clearTimeout(DrawTimer)
})

function Toggle() {
    if (props.disabled) return
    const next = !props.modelValue
    emit('update:modelValue', next)
    emit('change', next)
}
</script>

<style>
.wa_check_row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--wa_color_text);
}

.wa_check_label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
}

.wa_check {
    --wa_check_border: calc(var(--wa_check_size, 20px) * .1);
    --wa_check_r: calc(var(--wa_check_size, 20px) * .05);

    position: relative;
    display: grid;
    flex: none;
    place-items: center;
    width: var(--wa_check_size, 20px);
    height: var(--wa_check_size, 20px);
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: calc(var(--wa_check_size, 20px) * .3);
    box-shadow: inset 0 0 0 var(--wa_check_border) var(--wa_color_line_strong);
    color: transparent;
    background: var(--wa_color_field);
    cursor: pointer;
    transition:
        background var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_check::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--wa_color_text);
    opacity: 0;
    transform: scale(.35);
    pointer-events: none;
    transition:
        opacity var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_spring),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_check:hover:not(:disabled) {
    box-shadow: inset 0 0 0 var(--wa_check_border) var(--wa_color_text_muted);
    background: var(--wa_color_hover);
}

.wa_check.on {
    box-shadow: inset 0 0 0 var(--wa_check_border) var(--wa_color_text);
    color: var(--wa_color_on_text);
    background: var(--wa_color_text);
}

.wa_check.on::before {
    opacity: 1;
    transform: scale(1);
}

.wa_check.on:hover:not(:disabled) {
    box-shadow: inset 0 0 0 var(--wa_check_border) var(--wa_color_primary_hover);
    background: var(--wa_color_primary_hover);
}

.wa_check.on:hover:not(:disabled)::before {
    background: var(--wa_color_primary_hover);
}

.wa_check:active:not(:disabled) {
    transform: scale(.9);
}

.wa_check:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_check:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_check_row:has(.wa_check:disabled) .wa_check_label {
    cursor: not-allowed;
}

.wa_check_mark {
    position: relative;
    z-index: 1;
    display: block;
    width: calc(var(--wa_check_size, 20px) * .7);
    height: calc(var(--wa_check_size, 20px) * .7);
    opacity: 0;
    transform: scale(.9);
    pointer-events: none;
    transition:
        opacity .12s var(--wa_ease_out),
        transform .14s var(--wa_ease_out);
}

.wa_check_line {
    position: absolute;
    height: calc(var(--wa_check_r) * 2);
    border-radius: 999px;
    background: currentColor;
    opacity: 0;
    transform-origin: 0 50%;
}

/* 勾的两段：左下短横 + 右上长横 */
.wa_check_line_a {
    left: 16.6667%;
    top: calc(50% - var(--wa_check_r));
    width: 0;
    transform: rotate(45deg);
}

.wa_check_line_b {
    left: calc(37.5% - var(--wa_check_r) * .7071);
    top: calc(70.8333% - var(--wa_check_r) * .2929);
    width: 0;
    transform: rotate(-45deg);
}

.wa_check.on .wa_check_line {
    opacity: 1;
}

.wa_check.on .wa_check_mark {
    opacity: 1;
    transform: scale(1);
    transition:
        opacity .12s var(--wa_ease_out),
        transform .18s var(--wa_ease_spring);
}

.wa_check.on .wa_check_line_a {
    width: calc(29.4629% + var(--wa_check_r));
    transition:
        left .14s var(--wa_ease_out),
        top .14s var(--wa_ease_out),
        width .14s var(--wa_ease_out),
        opacity .04s var(--wa_ease_out);
}

.wa_check.on .wa_check_line_b {
    width: calc(64.8179% + var(--wa_check_r));
    transition:
        left .14s var(--wa_ease_out),
        top .14s var(--wa_ease_out),
        width .14s var(--wa_ease_out),
        opacity .04s var(--wa_ease_out);
}

/* 从空白状态选中时才播放“短横 → 长横”的手写顺序 */
.wa_check.on.drawing .wa_check_line_a {
    transition:
        width .12s var(--wa_ease_out),
        opacity .04s var(--wa_ease_out);
}

.wa_check.on.drawing .wa_check_line_b {
    transition:
        width .2s var(--wa_ease_out) .1s,
        opacity .04s var(--wa_ease_out) .08s;
}

/* 取消选中：两段线分别延展/移动到 × 的位置，再整体缩放渐隐 */
.wa_check.closing .wa_check_line {
    transition:
        left .14s var(--wa_ease_out),
        top .14s var(--wa_ease_out),
        width .14s var(--wa_ease_out);
}

.wa_check.closing .wa_check_line_a {
    left: 20.8333%;
    top: calc(20.8333% - var(--wa_check_r));
    width: 82.4958%;
}

.wa_check.closing .wa_check_line_b {
    left: 20.8333%;
    top: calc(79.1667% - var(--wa_check_r));
    width: 82.4958%;
}

/* 缩放阶段同步让选中底色退场，避免标记消失后再闪一下 */
.wa_check.on.closing,
.wa_check.on.closing:hover:not(:disabled) {
    background: var(--wa_color_field);
    box-shadow: inset 0 0 0 var(--wa_check_border) var(--wa_color_line_strong);
    transition:
        background .16s var(--wa_ease_out) .14s,
        box-shadow .16s var(--wa_ease_out) .14s;
}

.wa_check.on.closing::before {
    opacity: 0;
    transform: scale(.35);
    transition:
        opacity .14s var(--wa_ease_out) .14s,
        transform .16s var(--wa_ease_out) .14s;
}

.wa_check.closing .wa_check_mark {
    opacity: 0;
    transform: scale(0);
    transition:
        opacity .16s var(--wa_ease_out) .14s,
        transform .16s var(--wa_ease_out) .14s;
}

@media (prefers-reduced-motion: reduce) {
    .wa_check,
    .wa_check_mark,
    .wa_check.on .wa_check_line,
    .wa_check.closing .wa_check_line {
        transition: none;
    }

    .wa_check:active:not(:disabled) {
        transform: none;
    }
}
</style>
