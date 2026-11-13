<template>
    <div class="wa_choice_row" :style="BetweenStyle" @click.self="Toggle">
        <label v-if="HasLabel && LabelPosition === 'before'" :id="`${CheckId}-label`" class="wa_choice_label"
            :for="CheckId">
            <slot>{{ label }}</slot>
        </label>

        <button :id="CheckId" type="button" class="wa_check"
            :class="{ on: Checked || Closing || Indeterminate, closing: Closing, drawing: Drawing, mixed: Indeterminate }"
            role="checkbox" :style="SizeStyle" :aria-checked="Indeterminate ? 'mixed' : Checked"
            :aria-labelledby="HasLabel ? `${CheckId}-label` : undefined"
            :aria-label="HasLabel ? undefined : AccessibleLabel" :disabled="Disabled" @click="Toggle">
            <span class="wa_check_mark" aria-hidden="true">
                <span class="wa_check_line wa_check_line_a"></span>
                <span class="wa_check_line wa_check_line_b"></span>
            </span>
        </button>

        <label v-if="HasLabel && LabelPosition !== 'before'" :id="`${CheckId}-label`" class="wa_choice_label"
            :for="CheckId">
            <slot>{{ label }}</slot>
        </label>
    </div>
</template>

<script setup>
import { computed, onUnmounted, ref, useId, useSlots, watch } from 'vue'
import { useChoiceItemState } from '../composables/useChoiceGroup.js'

const props = defineProps({
    modelValue: Boolean,
    /** 在 AppCheckGroup / AppChoiceList 中使用时对应的值 */
    value: {
        type: [String, Number, Symbol, Boolean],
        default: undefined,
    },
    label: {
        type: String,
        default: '',
    },
    /**
     * before：标签在复选框前；after：标签在复选框后
     * @type {'before' | 'after'}
     */
    labelPosition: {
        type: String,
        default: null,
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    /** 复选框尺寸，数字按 px 处理；在分组中默认继承分组尺寸 */
    size: {
        type: [Number, String],
        default: null,
    },
    /** 半选状态，视觉为横杠 */
    indeterminate: Boolean,
    /** 纵向两端对齐时，让标签和复选框分别贴左右两侧 */
    between: Boolean,
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const CheckId = useId()
const { group, Checked, Disabled, Size, LabelPosition, BetweenStyle } = useChoiceItemState(props, true)
const HasLabel = computed(() => Boolean(props.label || slots.default))
const AccessibleLabel = computed(() => props.ariaLabel || props.label || '复选框')
const Indeterminate = computed(() => props.indeterminate)
const SizeStyle = computed(() => ({
    '--wa_check_size': typeof Size.value === 'number' ? `${Size.value}px` : Size.value,
}))

// 取消选中时先让 ✓ 变成 ×，再把整个标记缩到 0；动画结束后才移除选中底色
const ReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
const Closing = ref(false)
const Drawing = ref(false)
const PrevChecked = ref(Checked.value)
const PrevMixed = ref(Indeterminate.value)
let CloseTimer = 0
let DrawTimer = 0

function StartClosing() {
    if (ReducedMotion) {
        Closing.value = false
        return
    }

    Closing.value = true
    CloseTimer = setTimeout(() => {
        Closing.value = false
    }, 340)
}

function StartDrawing() {
    Drawing.value = true
    DrawTimer = setTimeout(() => {
        Drawing.value = false
    }, 320)
}

watch([Checked, Indeterminate], ([checked, mixed]) => {
    const wasChecked = PrevChecked.value
    const wasMixed = PrevMixed.value
    PrevChecked.value = checked
    PrevMixed.value = mixed

    clearTimeout(CloseTimer)
    clearTimeout(DrawTimer)

    // 选中：半选 -> 勾选时直接从短横拆分旋转，不播放手写
    if (checked && !wasChecked) {
        Closing.value = false
        if (!wasMixed && !mixed && !ReducedMotion) StartDrawing()
        else Drawing.value = false
        return
    }

    // 取消勾选，或勾选 -> 半选
    if (!checked && wasChecked) {
        Drawing.value = false
        if (mixed) {
            Closing.value = false
            return
        }
        StartClosing()
        return
    }

    // 半选 <-> 未选
    if (!checked && !wasChecked) {
        if (wasMixed && !mixed) {
            Drawing.value = false
            StartClosing()
            return
        }
        if (!wasMixed && mixed) {
            Closing.value = false
            Drawing.value = false
        }
        return
    }

    // 勾选状态不变，只在半选和勾选之间切换时反向过渡
    if (mixed !== wasMixed) {
        Closing.value = false
        Drawing.value = false
    }
})

onUnmounted(() => {
    clearTimeout(CloseTimer)
    clearTimeout(DrawTimer)
})

function Toggle() {
    if (Disabled.value) return

    const next = !Checked.value
    if (group) group.toggle(props.value, next)
    else {
        emit('update:modelValue', next)
        emit('change', next)
    }
}
</script>

<style>
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
    background: var(--wa_color_highlight);
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
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
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

.wa_check:disabled {
    opacity: .45;
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
        opacity var(--wa_duration_instant) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
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

/* 半选状态由两条线重叠成一根短横 */

.wa_check.on .wa_check_line {
    opacity: 1;
}

.wa_check.on .wa_check_mark {
    opacity: 1;
    transform: scale(1);
    transition:
        opacity var(--wa_duration_instant) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_spring);
}

.wa_check.on .wa_check_line_a {
    width: calc(29.4629% + var(--wa_check_r));
    transition:
        left var(--wa_duration_fast) var(--wa_ease_out),
        top var(--wa_duration_fast) var(--wa_ease_out),
        width var(--wa_duration_fast) var(--wa_ease_out),
        opacity var(--wa_duration_instant) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_check.on .wa_check_line_b {
    width: calc(64.8179% + var(--wa_check_r));
    transition:
        left var(--wa_duration_fast) var(--wa_ease_out),
        top var(--wa_duration_fast) var(--wa_ease_out),
        width var(--wa_duration_fast) var(--wa_ease_out),
        opacity var(--wa_duration_instant) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

/* 从空白状态选中时才播放“短横 → 长横”的手写顺序 */
.wa_check.on.drawing .wa_check_line_a {
    transition:
        width var(--wa_duration_instant) var(--wa_ease_out),
        opacity var(--wa_duration_instant) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_check.on.drawing .wa_check_line_b {
    transition:
        width var(--wa_duration_base) var(--wa_ease_out) .1s,
        opacity var(--wa_duration_instant) var(--wa_ease_out) .06s,
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

/* 取消选中：两段线分别延展/移动到 × 的位置，再整体缩放渐隐 */
.wa_check.closing .wa_check_line {
    transition:
        left var(--wa_duration_fast) var(--wa_ease_out),
        top var(--wa_duration_fast) var(--wa_ease_out),
        width var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
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

/* 半选状态：两条线重叠成一根短横；选中/取消时再拆分旋转 */
.wa_check.mixed .wa_check_line_a,
.wa_check.mixed .wa_check_line_b {
    left: 22%;
    top: calc(50% - var(--wa_check_r));
    width: 56%;
    transform: rotate(0deg);
    opacity: 1;
}

/* 缩放阶段同步让选中底色退场，避免标记消失后再闪一下 */
.wa_check.on.closing,
.wa_check.on.closing:hover:not(:disabled) {
    background: var(--wa_color_field);
    box-shadow: inset 0 0 0 var(--wa_check_border) var(--wa_color_line_strong);
    transition:
        background var(--wa_duration_fast) var(--wa_ease_out) var(--wa_duration_fast),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out) var(--wa_duration_fast);
}

.wa_check.on.closing::before {
    opacity: 0;
    transform: scale(.35);
    transition:
        opacity var(--wa_duration_fast) var(--wa_ease_out) var(--wa_duration_fast),
        transform var(--wa_duration_fast) var(--wa_ease_out) var(--wa_duration_fast);
}

.wa_check.closing .wa_check_mark {
    opacity: 0;
    transform: scale(0);
    transition:
        opacity var(--wa_duration_fast) var(--wa_ease_out) var(--wa_duration_fast),
        transform var(--wa_duration_fast) var(--wa_ease_out) var(--wa_duration_fast);
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
