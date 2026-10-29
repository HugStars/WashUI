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

<style>
.wa_stat {
    min-width: 0;
    padding: 12px 14px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_soft);
}

.wa_stat_label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}

.wa_stat_value {
    display: block;
    overflow: hidden;
    font-size: 15px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
