<template>
    <div class="wa_window_controls">
        <AppIconButton v-for="action in NormalizedActions" :key="action" :name="ActionIcon(action)"
            :label="ActionLabel(action)" :variant="action === 'close' ? 'danger' : 'ghost'" :size="size"
            :disabled="disabled" @click="OnAction(action)" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import AppIconButton from './AppIconButton.vue'

const ACTIONS = {
    min: { icon: 'minus', label: '最小化' },
    max: { icon: 'fullscreen', label: '最大化' },
    close: { icon: 'close', label: '关闭' },
}

const props = defineProps({
    /** 显示哪些按钮及顺序：['min', 'max', 'close'] */
    winAction: {
        type: Array,
        default: () => ['min', 'max', 'close'],
    },
    maximized: Boolean,
    disabled: Boolean,
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
})

const emit = defineEmits(['minimize', 'maximize', 'close'])

const NormalizedActions = computed(() => {
    const list = Array.isArray(props.winAction) ? props.winAction : []
    return list.filter((action, index) => ACTIONS[action] && list.indexOf(action) === index)
})

function ActionIcon(action) {
    if (action === 'max' && props.maximized) return 'fullscreen-exit'
    return ACTIONS[action].icon
}

function ActionLabel(action) {
    if (action === 'max' && props.maximized) return '还原'
    return ACTIONS[action].label
}

function OnAction(action) {
    if (action === 'min') emit('minimize')
    else if (action === 'max') emit('maximize')
    else if (action === 'close') emit('close')
}
</script>

<style>
.wa_window_controls {
    display: flex;
    align-items: center;
    gap: 2px;
    -webkit-app-region: no-drag;
}
</style>
