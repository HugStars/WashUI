<template>
    <AppButton class="wa_theme_toggle" variant="icon" :size="size" :title="label" :aria-label="label" @click="toggle">
        <Transition enter-active-class="wa_theme_enter_active" leave-active-class="wa_theme_leave_active"
            enter-from-class="wa_theme_enter_from" leave-to-class="wa_theme_leave_to" mode="out-in">
            <AppIcon :key="theme" :name="theme === 'dark' ? 'sun' : 'moon'" :size="iconSize" />
        </Transition>
    </AppButton>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../core/theme.js'
import AppButton from './AppButton.vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    size: {
        type: String,
        default: 'sm',
        allows: ['md', 'sm'],
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

.wa_theme_toggle .wa_theme_enter_active,
.wa_theme_toggle .wa_theme_leave_active {
    transition: opacity .18s ease, transform .18s var(--wa_ease_out);
}

.wa_theme_toggle .wa_theme_enter_from {
    opacity: 0;
    transform: rotate(-45deg) scale(.7);
}

.wa_theme_toggle .wa_theme_leave_to {
    opacity: 0;
    transform: rotate(45deg) scale(.7);
}

@media (prefers-reduced-motion: reduce) {

    .wa_theme_toggle .wa_theme_enter_active,
    .wa_theme_toggle .wa_theme_leave_active {
        transition: none;
    }
}
</style>
