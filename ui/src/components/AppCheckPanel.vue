<template>
    <div ref="PanelEl" class="wa_check_panel" role="group" :aria-label="ariaLabel">
        <div v-for="group in groups" :key="group.label" class="wa_check_panel_group">
            <p v-if="group.label" class="wa_check_panel_label">{{ group.label }}</p>
            <AppCheckItem v-for="item in group.options" :key="item.value" class="wa_check_panel_item"
                :model-value="IsChecked(item.value)" :label="item.label" :size="size"
                :disabled="disabled || item.disabled" @change="checked => Toggle(item.value, checked)" />
        </div>

        <AppCheckItem v-for="item in options" :key="item.value" class="wa_check_panel_item"
            :model-value="IsChecked(item.value)" :label="item.label" :size="size"
            :disabled="disabled || item.disabled" @change="checked => Toggle(item.value, checked)" />

        <p v-if="!HasOptions" class="wa_check_panel_empty">{{ emptyText }}</p>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import AppCheckItem from './AppCheckItem.vue'

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
    size: {
        type: [Number, String],
        default: 18,
    },
    disabled: Boolean,
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    ariaLabel: {
        type: String,
        default: '复选框列表',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const PanelEl = ref(null)

const HasOptions = computed(
    () => props.groups.some(group => group.options?.length) || props.options.length > 0
)

// 打开时把第一个已选项滚动到面板中间，长列表里不至于看不到当前选择
function ScrollCheckedToCenter() {
    const el = PanelEl.value
    const checked = el?.querySelector('.wa_check.on')
    if (!el || !checked) return

    const row = checked.closest('.wa_check_panel_item') || checked
    const rowRect = row.getBoundingClientRect()
    const panelRect = el.getBoundingClientRect()
    const top = rowRect.top - panelRect.top + el.scrollTop
    const max = Math.max(0, el.scrollHeight - el.clientHeight)
    const target = top - (el.clientHeight - rowRect.height) / 2

    el.scrollTop = Math.max(0, Math.min(max, target))
}

onMounted(() => nextTick(ScrollCheckedToCenter))

function IsChecked(value) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
}

function Toggle(value, checked) {
    if (props.disabled) return

    const current = Array.isArray(props.modelValue) ? props.modelValue : []
    const next = checked
        ? current.includes(value) ? current : [...current, value]
        : current.filter(item => item !== value)

    emit('update:modelValue', next)
    emit('change', next)
}
</script>

<style>
.wa_check_panel {
    display: grid;
    gap: 4px;
    max-height: min(320px, calc(100vh - 120px));
    overflow-y: auto;
    overscroll-behavior: contain;
}

.wa_check_panel_group {
    display: grid;
    gap: 4px;
}

.wa_check_panel_label {
    padding: 4px 10px;
    font-size: 11px;
    color: var(--wa_color_text_faint);
}

.wa_check_panel_item {
    width: 100%;
    padding: 7px 10px;
    border-radius: var(--wa_radius_control);
}

.wa_check_panel_item:hover {
    background: var(--wa_color_hover);
}

.wa_check_panel_item .wa_check_label {
    flex: 1;
}

.wa_check_panel_empty {
    padding: 10px;
    font-size: 12px;
    color: var(--wa_color_text_faint);
}

@media (max-width: 860px) {
    .wa_check_panel {
        scrollbar-width: none;
    }

    .wa_check_panel::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
}
</style>
