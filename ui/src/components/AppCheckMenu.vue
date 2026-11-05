<template>
    <template v-if="mode === 'dialog'">
        <span class="wa_check_menu_trigger_wrap" @click="ToggleDialog">
            <slot name="trigger" :open="DialogOpen" :toggle="ToggleDialog">
                <AppButton class="wa_check_menu_trigger" variant="line" size="sm" :disabled="disabled"
                    :aria-expanded="DialogOpen" aria-haspopup="dialog">
                    <span class="wa_check_menu_text">{{ Summary }}</span>
                    <AppIcon name="chevron" :size="14" class="wa_check_menu_arrow" :class="{ on: DialogOpen }" />
                </AppButton>
            </slot>
        </span>

        <AppDialog v-model:open="DialogOpen" :title="title" :aria-label="title || ariaLabel">
            <AppCheckPanel :groups="groups" :options="options" :model-value="Values" :size="size"
                :disabled="disabled" :empty-text="emptyText" @update:model-value="Update" />
            <template #footer>
                <AppButton variant="line" :disabled="!Values.length" @click="Clear">清空</AppButton>
                <AppButton variant="primary" @click="DialogOpen = false">完成</AppButton>
            </template>
        </AppDialog>
    </template>

    <AppPopover v-else placement="bottom" :width="width" :padding="6" role="dialog" :aria-label="ariaLabel"
        :disabled="disabled">
        <template #trigger="{ open, toggle }">
            <slot name="trigger" :open="open" :toggle="toggle">
                <AppButton class="wa_check_menu_trigger" variant="line" size="sm" :disabled="disabled"
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
import { ref } from 'vue'
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
    /** popover：浮层菜单；dialog：弹框选择 */
    mode: {
        type: String,
        default: 'popover',
        allows: ['popover', 'dialog'],
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
const { Values, Summary } = useChoiceSummary(props)

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
