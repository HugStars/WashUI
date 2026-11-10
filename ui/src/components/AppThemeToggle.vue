<template>
    <AppButton class="wa_theme_toggle" variant="icon" :size="size" :title="label" :aria-label="label" @click="toggle">
        <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="iconSize" />
    </AppButton>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../core/theme.js'
import AppButton from './AppButton.vue'
import AppIcon from './AppIcon.vue'

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
.wa_theme_toggle {
    border: 1px solid var(--wa_color_line);
    background: var(--wa_color_surface);
}

.wa_theme_toggle:hover {
    border-color: var(--wa_color_line_strong);
    background: var(--wa_color_hover);
}
</style>
