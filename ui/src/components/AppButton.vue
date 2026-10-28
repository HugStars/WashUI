<template>
    <button :type="type" class="wa_btn" :class="Classes" :disabled="disabled || loading"
        :aria-busy="loading || undefined">
        <span v-if="loading" class="wa_spinner" aria-hidden="true"></span>
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'default',
    },
    size: {
        type: String,
        default: 'md',
    },
    type: {
        type: String,
        default: 'button',
    },
    loading: Boolean,
    disabled: Boolean,
})

const Classes = computed(() => {
    const list = []
    if (props.variant !== 'default') list.push(`wa_btn_${props.variant}`)
    if (props.size === 'sm') list.push('wa_btn_sm')
    if (props.loading) list.push('wa_btn_loading')
    return list
})
</script>
