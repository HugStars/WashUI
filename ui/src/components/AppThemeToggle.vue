<template>
    <AppIconButton class="wa_theme_toggle" :name="theme === 'dark' ? 'sun' : 'moon'" :icon-size="iconSize"
        :size="size" :label="label" @click="toggle" />
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../core/theme.js'
import AppIconButton from './AppIconButton.vue'

const props = defineProps({
    /**
     * @type {'md' | 'sm'}
     */
    size: {
        type: String,
        default: 'sm',
    },
})

const emit = defineEmits(['change'])
const { theme, toggleTheme } = useTheme()
const label = computed(() => theme.value === 'dark' ? '切换到亮色' : '切换到暗色')
const iconSize = computed(() => props.size === 'sm' ? 18 : 20)

function toggle() {
    toggleTheme()
    emit('change', theme.value)
}
</script>

<style>
.wa_icon_btn.wa_theme_toggle {
    border: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
}

.wa_icon_btn.wa_theme_toggle:hover {
    border-color: var(--wa_color_line_strong);
    background: var(--wa_color_hover);
}
</style>
