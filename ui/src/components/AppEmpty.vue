<template>
    <div class="wa_empty" :class="{ wa_empty_compact: compact }" :style="Style">
        <slot>
            <p>{{ text }}</p>
        </slot>
        <slot name="action" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    text: {
        type: String,
        default: '暂无数据',
    },
    /** 紧凑高度，适合弹窗/小容器 */
    compact: Boolean,
    /** 自定义最小高度，数字按 px 处理 */
    minHeight: {
        type: [Number, String],
        default: '',
    },
})

const Style = computed(() => {
    if (!props.minHeight) return undefined
    return { minHeight: typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight }
})
</script>

<style>
.wa_empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-height: var(--wa_size_empty);
    color: var(--wa_color_text_subtle);
}

.wa_empty_compact {
    min-height: var(--wa_size_empty_compact);
}

.wa_empty p {
    font-size: var(--wa_font_size_base);
}
</style>
