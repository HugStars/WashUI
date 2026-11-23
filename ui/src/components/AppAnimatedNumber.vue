<template>
    <component :is="tag" class="wa_number" :aria-live="live ? 'polite' : undefined">{{ display }}</component>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.js'

const props = defineProps({
    value: {
        type: [Number, String],
        default: 0,
    },
    /** 初始值，启用入场动画时从这里开始 */
    from: {
        type: [Number, String],
        default: 0,
    },
    /** 动画时长，单位毫秒 */
    duration: {
        type: Number,
        default: 900,
    },
    decimals: {
        type: Number,
        default: 0,
    },
    /** 千分位分隔 */
    separator: Boolean,
    prefix: {
        type: String,
        default: '',
    },
    suffix: {
        type: String,
        default: '',
    },
    tag: {
        type: String,
        default: 'span',
    },
    animateOnMount: {
        type: Boolean,
        default: true,
    },
    /** 数值变化时用 aria-live 播报，适合实时统计 */
    live: Boolean,
})

const current = ref(0)
const reduceMotion = useReducedMotion()

let frame = 0
let startedAt = 0
let startValue = 0
let endValue = 0
let animationDuration = 0

const target = computed(() => {
    const value = Number(props.value)
    return Number.isFinite(value) ? value : 0
})

const decimals = computed(() => Math.max(0, Math.min(20, Math.floor(props.decimals || 0))))

const Formatter = computed(() => new Intl.NumberFormat('zh-CN', {
    useGrouping: props.separator,
    minimumFractionDigits: decimals.value,
    maximumFractionDigits: decimals.value,
}))

function Format(value) {
    return Formatter.value.format(value)
}

const display = computed(() => `${props.prefix}${Format(current.value)}${props.suffix}`)

function EaseOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
}

function Stop() {
    cancelAnimationFrame(frame)
    frame = 0
}

function Animate(from, to, duration) {
    Stop()

    if (reduceMotion.value || duration <= 0 || from === to) {
        current.value = to
        return
    }

    startValue = from
    endValue = to
    animationDuration = duration
    startedAt = performance.now()

    const step = now => {
        const progress = Math.min(1, (now - startedAt) / animationDuration)
        current.value = startValue + (endValue - startValue) * EaseOutCubic(progress)

        if (progress < 1) {
            frame = requestAnimationFrame(step)
        } else {
            current.value = endValue
            frame = 0
        }
    }

    frame = requestAnimationFrame(step)
}

onMounted(() => {
    const initial = Number(props.from)
    const start = Number.isFinite(initial) ? initial : 0

    if (props.animateOnMount) {
        current.value = start
        Animate(start, target.value, props.duration)
    } else {
        current.value = target.value
    }
})

watch(target, next => {
    Animate(current.value, next, props.duration)
})

onBeforeUnmount(Stop)
</script>

<style>
.wa_number {
    display: inline-block;
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum' 1;
    white-space: nowrap;
}
</style>
