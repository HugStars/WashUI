<template>
    <div class="wa_stat">
        <span class="wa_stat_label">
            <slot name="label">{{ label }}</slot>
        </span>
        <b class="wa_stat_value">
            <slot>{{ value }}</slot>
        </b>
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        default: '',
    },
    value: {
        type: [String, Number],
        default: '',
    },
})
</script>
