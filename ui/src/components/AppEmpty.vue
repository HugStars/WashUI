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
