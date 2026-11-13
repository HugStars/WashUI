<template>
    <template v-if="mode === 'dialog'">
        <span class="wa_check_menu_trigger_wrap" @click="ToggleDialog">
            <slot name="trigger" :open="DialogOpen" :toggle="ToggleDialog">
                <AppButton ref="TriggerEl" class="wa_check_menu_trigger" variant="line" size="sm" :disabled="disabled"
                    :aria-expanded="DialogOpen" aria-haspopup="dialog">
                    <span class="wa_check_menu_text">{{ Summary }}</span>
                    <AppIcon name="chevron" :size="14" class="wa_check_menu_arrow" :class="{ on: DialogOpen }" />
                </AppButton>
            </slot>
        </span>

        <AppDialog v-model:open="DialogOpen" :title="title" :aria-label="title || ariaLabel" :gesture="false">
            <AppCheckPanel :groups="groups" :options="options" :model-value="Values" :size="size"
                :disabled="disabled" :empty-text="emptyText" @update:model-value="Update" />
            <template #footer>
                <AppButton variant="line" :disabled="!Values.length" @click="Clear">清空</AppButton>
                <AppButton variant="primary" @click="DialogOpen = false">完成</AppButton>
            </template>
        </AppDialog>
    </template>

    <AppPopover v-else :placement="PopoverPlacement" :width="width" :padding="6" role="dialog"
        :aria-label="ariaLabel" :disabled="disabled">
        <template #trigger="{ open, toggle }">
            <slot name="trigger" :open="open" :toggle="toggle">
                <AppButton ref="TriggerEl" class="wa_check_menu_trigger" variant="line" size="sm" :disabled="disabled"
                    :aria-expanded="open" aria-haspopup="dialog">
                    <span class="wa_check_menu_text">{{ Summary }}</span>
                    <AppIcon name="chevron" :size="14" class="wa_check_menu_arrow" :class="{ on: open }" />
                </AppButton>
            </slot>
        </template>

        <AppCheckPanel :groups="groups" :options="options" :model-value="Values" :size="size"
            :disabled="disabled" :empty-text="emptyText" @update:model-value="Update" />
    </AppPopover>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useChoiceSummary } from '../composables/useChoiceSummary.js'
import AppButton from './AppButton.vue'
import AppCheckPanel from './AppCheckPanel.vue'
import AppDialog from './AppDialog.vue'
import AppIcon from './AppIcon.vue'
import AppPopover from './AppPopover.vue'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    options: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    /**
     * popover：浮层菜单；dialog：弹框选择
     * @type {'popover' | 'dialog'}
     */
    mode: {
        type: String,
        default: 'popover',
    },
    /**
     * popover 的对齐方式
     * @type {'left' | 'center' | 'right'}
     */
    align: {
        type: String,
        default: 'center',
    },
    /** popover 模式下的面板宽度 */
    width: {
        type: [Number, String],
        default: 240,
    },
    size: {
        type: [Number, String],
        default: 18,
    },
    title: {
        type: String,
        default: '选择',
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    ariaLabel: {
        type: String,
        default: '多选菜单',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const DialogOpen = ref(false)
const TriggerEl = ref(null)
let LastWidth = 0
let WidthAnimation = null
const PopoverPlacement = computed(() => props.align === 'left'
    ? 'bottom-left'
    : props.align === 'right' ? 'bottom-right' : 'bottom')
const { Values, Summary } = useChoiceSummary(props)

const ReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

function TriggerNode() {
    return TriggerEl.value?.$el || TriggerEl.value || null
}

/**
 * 摘要文本变化时让按钮宽度平滑过渡
 * 使用 WAAPI 只覆盖渲染宽度，不改动组件自身的 transition 与内联样式
 */
async function AnimateWidth() {
    const el = TriggerNode()
    if (!el || typeof el.animate !== 'function' || ReducedMotion?.matches) return

    await nextTick()
    const next = el.offsetWidth
    const prev = LastWidth
    LastWidth = next

    if (!prev || prev === next) return

    WidthAnimation?.cancel()
    WidthAnimation = el.animate(
        [{ width: `${prev}px` }, { width: `${next}px` }],
        { duration: 200, easing: 'cubic-bezier(.3, 1.2, .5, 1)' }
    )
}

watch(Summary, AnimateWidth)

onMounted(() => {
    LastWidth = TriggerNode()?.offsetWidth || 0
})

onUnmounted(() => {
    WidthAnimation?.cancel()
})

function Update(values) {
    emit('update:modelValue', values)
    emit('change', values)
}

function Clear() {
    Update([])
}

function ToggleDialog() {
    if (props.disabled) return
    DialogOpen.value = !DialogOpen.value
}
</script>

<style>
.wa_check_menu_trigger_wrap {
    display: inline-flex;
    max-width: 100%;
}

.wa_check_menu_trigger {
    max-width: 100%;
}

.wa_check_menu_text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_check_menu_arrow {
    flex: none;
    transform: rotate(90deg);
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_check_menu_arrow.on {
    transform: rotate(-90deg);
}

@media (prefers-reduced-motion: reduce) {
    .wa_check_menu_arrow {
        transition: none;
    }
}
</style>
