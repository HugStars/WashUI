<template>
    <div ref="GroupEl" class="wa_choice_group" :class="[
        `wa_choice_group_${direction}`,
        {
            'wa_choice_group_right': direction === 'vertical' && align === 'right',
            'wa_choice_group_between': direction === 'vertical' && IsBetween,
            'wa_choice_group_segmented': variant === 'segmented',
            'wa_choice_group_segmented_sm': variant === 'segmented' && SegmentedSize === 'sm',
            'wa_choice_group_segmented_md': variant === 'segmented' && SegmentedSize === 'md',
            'wa_choice_group_segmented_rect': variant === 'segmented' && shape === 'rect',
        },
    ]" role="radiogroup" :aria-label="ariaLabel">
        <span v-if="variant === 'segmented'" class="wa_choice_group_glider" :class="{ ready: GliderReady }"
            :style="GliderStyle" aria-hidden="true"></span>

        <slot />

        <AppRadio v-for="item in options" :key="item.value" :value="item.value" :label="item.label"
            :disabled="item.disabled" />
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { createChoiceGroup, provideChoiceGroup } from '../composables/useChoiceGroup.js'
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
    /**
     * 单选框尺寸，数字按 px 处理；segmented 下支持 sm（紧凑）和 md（默认）
     * @type {number | 'sm' | 'md'}
     */
    size: {
        type: [Number, String],
        default: 20,
    },
    ariaLabel: {
        type: String,
        default: '单选框组',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])
const { group, IsBetween } = createChoiceGroup(props, emit, false)
provideChoiceGroup(group)

const GroupEl = ref(null)
const GliderReady = ref(false)
const GliderStyle = ref({})
const SegmentedSize = computed(() => props.size === 'sm' ? 'sm' : 'md')
let ResizeObserverInstance = null
let FirstPaint = true
let FirstTimer = 0

function UpdateGlider() {
    const groupEl = GroupEl.value
    const selected = groupEl?.querySelector('.wa_radio_segmented.on')

    if (!groupEl || !selected) {
        GliderReady.value = false
        return
    }

    const groupRect = groupEl.getBoundingClientRect()
    const rect = selected.getBoundingClientRect()
    const next = {
        transform: `translate(${rect.left - groupRect.left}px, ${rect.top - groupRect.top}px)`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
    }

    if (FirstPaint) {
        FirstPaint = false
        GliderStyle.value = { ...next, transition: 'none' }
        GliderReady.value = true
        FirstTimer = setTimeout(() => {
            GliderStyle.value = next
        }, 0)
        return
    }

    GliderStyle.value = next
    GliderReady.value = true
}

watch(
    [() => props.modelValue, () => props.options, () => props.size, () => props.shape, () => props.variant],
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

    window.addEventListener('resize', UpdateGlider)
})

onUnmounted(() => {
    clearTimeout(FirstTimer)
    ResizeObserverInstance?.disconnect()
    window.removeEventListener('resize', UpdateGlider)
})
</script>
