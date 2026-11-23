<template>
    <div class="wa_field">
        <span v-if="label || $slots.label" class="wa_field_label">
            <slot name="label">{{ label }}</slot>
        </span>

        <div ref="GroupEl" class="wa_choice_group" :class="[
            `wa_choice_group_${direction}`,
            {
                'wa_choice_group_right': direction === 'vertical' && align === 'right',
                'wa_choice_group_between': direction === 'vertical' && IsBetween,
                'wa_choice_group_segmented': variant === 'segmented',
                'wa_choice_group_segmented_sm': variant === 'segmented' && SegmentedSize === 'sm',
                'wa_choice_group_segmented_md': variant === 'segmented' && SegmentedSize === 'md',
                'wa_choice_group_segmented_rect': variant === 'segmented' && shape === 'rect',
                glider_ready: GliderReady,
            },
        ]" role="radiogroup" :aria-label="label || ariaLabel" @pointerdown="OnPressStart" @keydown="OnKeydown">
            <span v-if="variant === 'segmented'" class="wa_choice_group_glider"
                :class="{ ready: GliderReady }" :style="GliderStyle" aria-hidden="true">
                <span class="wa_choice_group_glider_inner" :class="{ bounce: GliderBounce, press: GliderPress }"
                    @animationend="OnGliderAnimationEnd"></span>
            </span>

            <slot />

            <AppRadio v-for="(item, index) in options" :key="item.value" :ref="el => SetRowEl(item.value, el)"
                :value="item.value" :label="item.label" :disabled="item.disabled"
                :tabindex="index === ActiveIndex ? 0 : -1"
                :class="{ pressed: variant === 'segmented' && PressedKey === item.value }" />
        </div>

        <p v-if="DisplayError" class="wa_field_error">{{ DisplayError }}</p>
        <p v-else-if="hint" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { createChoiceGroup, provideChoiceGroup } from '../composables/useChoiceGroup.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useReducedMotion } from '../composables/useReducedMotion.js'
import { useValidation } from '../composables/useValidation.js'
import AppRadio from './AppRadio.vue'

const props = defineProps({
    modelValue: {
        type: [String, Number, Symbol, Boolean],
        default: '',
    },
    /** { label, value, disabled? } */
    options: {
        type: Array,
        default: () => [],
    },
    /**
     * horizontal：单选项横向排列；vertical：单选项纵向排列
     * @type {'horizontal' | 'vertical'}
     */
    direction: {
        type: String,
        default: 'horizontal',
    },
    /**
     * default：圆形单选框；segmented：等宽分段单选
     * @type {'default' | 'segmented'}
     */
    variant: {
        type: String,
        default: 'default',
    },
    /**
     * segmented 的外形：pill 胶囊；rect 小圆角矩形
     * @type {'pill' | 'rect'}
     */
    shape: {
        type: String,
        default: 'pill',
    },
    /**
     * before：每个标签在单选框前；after：标签在单选框后
     * @type {'before' | 'after'}
     */
    labelPosition: {
        type: String,
        default: 'after',
    },
    /**
     * 纵向排列时整组靠左/靠右，或让标签与单选框两端对齐
     * @type {'left' | 'right' | 'between' | 'space-between'}
     */
    align: {
        type: String,
        default: 'left',
    },
    /** 普通单选框尺寸，数字按 px 处理；segmented 使用下面的 size */
    checkSize: {
        type: [Number, String],
        default: 20,
    },
    /**
     * segmented 外观尺寸
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    label: {
        type: String,
        default: '',
    },
    hint: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: '',
    },
    rule: {
        type: [Object, Array],
        default: null,
    },
    ariaLabel: {
        type: String,
        default: '单选框组',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])
const { DisplayError, OnChange: ValidateChange } = useValidation(
    props,
    () => props.modelValue,
    { defaultTrigger: 'change' }
)
const { group, IsBetween } = createChoiceGroup(props, (event, value) => {
    emit(event, value)
    if (event === 'change') ValidateChange(value)
}, false)
provideChoiceGroup(group)

const GroupEl = ref(null)
const RowEls = new Map()
const GliderReady = ref(false)
const GliderBounce = ref(false)
const GliderStyle = ref({})
const { Press: GliderPress, PressedKey, Start: OnPressStart } = usePressFeedback(
    '.wa_choice_row',
    RowEls
)
const SegmentedSize = computed(() => props.size === 'md' ? 'md' : 'sm')
const ActiveIndex = computed(() => {
    const index = props.options.findIndex(item => item.value === props.modelValue)
    return index >= 0 ? index : 0
})
const ReducedMotion = useReducedMotion()
let ResizeObserverInstance = null
let GliderFrame = 0
let BounceFrame = 0

// section 键盘导航
// * roving tabindex：组内只有一个可 Tab 项，方向键切换焦点并选中
function OnKeydown(event) {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
    if (!keys.includes(event.key)) return

    const groupEl = GroupEl.value
    if (!groupEl) return

    const radios = [...groupEl.querySelectorAll('.wa_radio:not(:disabled)')]
    if (!radios.length) return

    event.preventDefault()

    const current = radios.indexOf(document.activeElement)
    let next = current < 0 ? 0 : current

    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = radios.length - 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        next = current <= 0 ? radios.length - 1 : current - 1
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        next = (current + 1) % radios.length
    }

    const target = radios[next]
    target.focus({ preventScroll: true })
    target.click()
}

// 记录每个选项的外层行元素，供长按反馈匹配当前按下的是哪一项
function SetRowEl(value, instance) {
    const el = instance?.$el || instance
    if (el) RowEls.set(value, el)
    else RowEls.delete(value)
}

function UpdateGlider() {
    // note 直接调用时取消排队中的帧，避免重复读取 offset 尺寸
    cancelAnimationFrame(GliderFrame)
    GliderFrame = 0

    const groupEl = GroupEl.value
    const selected = groupEl?.querySelector('.wa_radio_segmented.on')

    if (!groupEl || !selected) {
        GliderReady.value = false
        return
    }

    // * 与 AppTabs 一致：用布局尺寸定位，首帧从 0 尺寸过渡到选中项，不受按压缩放影响
    const target = selected.closest('.wa_choice_row') || selected
    GliderStyle.value = {
        left: `${target.offsetLeft}px`,
        top: `${target.offsetTop}px`,
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
    }
    GliderReady.value = true
}

// * resize 合并到 rAF，避免和 ResizeObserver 在同一帧重复测量滑块位置
function ScheduleGlider() {
    if (GliderFrame) return
    GliderFrame = requestAnimationFrame(() => {
        GliderFrame = 0
        UpdateGlider()
    })
}

// * 与 AppTabs 一致：切换后让选中背景轻微回弹，缩放围绕自身中心，不改变定位
function PlayBounce() {
    cancelAnimationFrame(BounceFrame)
    GliderBounce.value = false

    if (ReducedMotion.value) return

    BounceFrame = requestAnimationFrame(() => {
        BounceFrame = requestAnimationFrame(() => {
            GliderBounce.value = true
        })
    })
}

function OnGliderAnimationEnd(event) {
    if (event.target === event.currentTarget) GliderBounce.value = false
}

watch(() => props.modelValue, () => nextTick(() => {
    UpdateGlider()
    PlayBounce()
}))

watch(
    [() => props.options, () => props.size, () => props.shape, () => props.variant],
    () => nextTick(UpdateGlider),
    { deep: true }
)

onMounted(async () => {
    await nextTick()
    UpdateGlider()

    if (typeof ResizeObserver !== 'undefined' && GroupEl.value) {
        ResizeObserverInstance = new ResizeObserver(UpdateGlider)
        ResizeObserverInstance.observe(GroupEl.value)
    }

    window.addEventListener('resize', ScheduleGlider)
})

onUnmounted(() => {
    ResizeObserverInstance?.disconnect()
    window.removeEventListener('resize', ScheduleGlider)
    cancelAnimationFrame(GliderFrame)
    cancelAnimationFrame(BounceFrame)
})
</script>
