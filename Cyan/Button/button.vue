<template>
    <button :class="['cyan_button', type, round && 'round']">
        <slot></slot>
    </button>
</template>

<script setup>

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator(value) {
            return ['default', 'primary', 'info', 'success', 'error', 'warn', 'help'].includes(value)
        }
    },
    round: {
        type: Boolean,
        default: false,
        validator(value) {
            return typeof value === 'boolean'
        }
    }
})
</script>

<style lang="scss">
.cyan_button {
    overflow: hidden;
    margin: 0;
    padding: 0 16px;
    height: 34px;
    outline: 0;
    border: 2px solid rgba(var(--bg) 0.8);
    border-radius: 4px;
    background: rgb(var(--bg));
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    user-select: none;

    &.round{
        border-radius: 50px;
    }

    &.default {
        --bg: 80 146 255;
    }

    &.primary {
        --bg: 20 184 166;
    }

    &.info {
        --bg: 100 116 139;
    }

    &.success {
        --bg: 65 207 125;
    }

    &.error {
        --bg: 255 118 125;
    }

    &.warn {
        --bg: 245 189 30;
    }

    &.help {
        --bg: 156 113 254;
    }
}
</style>