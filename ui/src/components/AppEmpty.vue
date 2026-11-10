<template>
    <div class="wa_empty">
        <slot>
            <p>{{ text }}</p>
        </slot>
        <slot name="action" />
    </div>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        default: '暂无数据',
    },
})
</script>

<style>
.wa_empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-height: 420px;
    color: var(--wa_color_text_subtle);
}

.wa_empty p {
    font-size: 13px;
}
</style>
