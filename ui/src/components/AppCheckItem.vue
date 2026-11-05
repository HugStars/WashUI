<template>
    <div class="wa_check_row" :class="`wa_check_label_${labelPosition}`" :style="BetweenStyle">
        <label v-if="HasLabel && labelPosition === 'before'" :id="`${CheckId}-label`" class="wa_check_label"
            :for="CheckId">
            <slot>{{ label }}</slot>
        </label>

        <button :id="CheckId" type="button" class="wa_check" :class="{ on: modelValue || Closing, closing: Closing }"
            role="checkbox" :style="SizeStyle" :aria-checked="modelValue"
            :aria-labelledby="HasLabel ? `${CheckId}-label` : undefined"
            :aria-label="HasLabel ? undefined : AccessibleLabel" :disabled="disabled" @click="Toggle">
            <span class="wa_check_mark" aria-hidden="true">
                <AppIcon name="check" size="calc(var(--wa_check_size) * .7)" stroke-width="3.4"
                    class="wa_check_icon" />
                <span class="wa_check_cross"></span>
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
import AppIcon from './AppIcon.vue'

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

// 取消选中时先让 ✓ 变成 ×，再把整个标记缩到 0；动画结束后才移除选中底色
const ReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
const Closing = ref(false)
let CloseTimer = 0

watch(() => props.modelValue, (checked, wasChecked) => {
    clearTimeout(CloseTimer)

    if (checked || !wasChecked || ReducedMotion) {
        Closing.value = false
        return
    }

    Closing.value = true
    CloseTimer = setTimeout(() => {
        Closing.value = false
    }, 260)
})

onUnmounted(() => clearTimeout(CloseTimer))

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
    --wa_check_border: 2px;

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
    display: grid;
    place-items: center;
    width: calc(var(--wa_check_size, 20px) * .7);
    height: calc(var(--wa_check_size, 20px) * .7);
    pointer-events: none;
}

.wa_check_icon {
    grid-area: 1 / 1;
    opacity: 0;
    transform: scale(.9);
    transition:
        opacity .12s var(--wa_ease_out) .16s,
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_check_icon polyline {
    stroke-dasharray: 24;
    stroke-dashoffset: 24;
    transition: stroke-dashoffset .24s var(--wa_ease_out);
}

.wa_check_cross {
    position: absolute;
    inset: 0;
    opacity: 0;
}

.wa_check_cross::before,
.wa_check_cross::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    margin-top: -1px;
    border-radius: 999px;
    background: currentColor;
}

.wa_check_cross::before {
    transform: rotate(45deg);
}

.wa_check_cross::after {
    transform: rotate(-45deg);
}

.wa_check.on .wa_check_icon {
    opacity: 1;
    transform: scale(1);
    transition:
        opacity .12s var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_check.on .wa_check_icon polyline {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset .28s cubic-bezier(.22, 1, .36, 1);
}

/* 取消选中：✓ 立即换成 ×，随后整个标记直接缩到 0 */
.wa_check.closing .wa_check_icon {
    opacity: 0;
    transition: none;
}

.wa_check.closing .wa_check_icon polyline {
    stroke-dashoffset: 24;
    transition: none;
}

.wa_check.closing .wa_check_cross {
    opacity: 1;
}

.wa_check.closing .wa_check_mark {
    animation: wa_check_collapse .16s var(--wa_ease_out) .06s forwards;
}

@keyframes wa_check_collapse {
    to {
        opacity: 0;
        transform: scale(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_check,
    .wa_check_icon,
    .wa_check_icon polyline,
    .wa_check_cross,
    .wa_check_cross::before,
    .wa_check_cross::after {
        transition: none;
    }

    .wa_check.closing .wa_check_mark {
        animation: none;
    }

    .wa_check:active:not(:disabled) {
        transform: none;
    }
}
</style>
