<template>
    <button type="button" class="wa_chip" :class="{ on: active }">
        <slot>{{ text }}</slot>
    </button>
</template>

<script setup>
defineProps({
    active: Boolean,
    text: {
        type: String,
        default: '',
    },
})
</script>
