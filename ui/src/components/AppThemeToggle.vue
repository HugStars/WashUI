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
import { useTheme } from '../theme.js'
import AppButton from './AppButton.vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md',
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
