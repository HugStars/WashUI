<template>
    <button :class="ButtonClass" :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: value => ['default', 'primary', 'info', 'success', 'error', 'warn', 'help'].includes(value)
    },
    size: {
        type: String,
        default: 'medium',
        validator: value => ['mini', 'small', 'medium', 'large'].includes(value)
    },
    round: Boolean,
    transp: Boolean,
    dotted: Boolean,
    dashed: Boolean,
    disabled: Boolean,
    circle: Boolean,
    text: Boolean,
})

const ButtonClass = computed(() => ({
    'cyan_button': true,
    [props.type]: true,
    [props.size]: true,
    round: props.round,
    circle: props.circle,
    transp: props.transp,
    dashed: props.dashed,
    dotted: props.dotted,
    disabled: props.disabled,
    text: props.text,
}))

</script>

<style lang="scss">
.cyan_button {
    overflow: hidden;
    margin: 0;
    padding: 0 var(--p_l);
    height: var(--h);
    outline: 0;
    line-height: normal;
    border: 2px solid rgb(var(--bg));
    border-radius: 4px;
    background: rgb(var(--bg));
    color: #fff;
    font-weight: 700;
    font-size: var(--fs);
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    user-select: none;

    &.mini {
        --h: 22px;
        --p_l: 8px;
        --fs: 12px;
    }

    &.small {
        --h: 28px;
        --p_l: 12px;
        --fs: 13px;
    }

    &.medium {
        --h: 34px;
        --p_l: 16px;
        --fs: 13.3333px;
    }

    &.large {
        --h: 40px;
        --p_l: 20px;
        --fs: 16px;
    }

    &.round {
        border-radius: 50px;
    }

    &.circle {
        width: var(--h);
        padding: 0;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    &.transp {
        background: transparent;
        color: rgb(var(--bg));
    }

    &.dotted {
        border-style: dotted;
        background-clip: padding-box;
    }

    &.dashed {
        border-style: dashed;
        background-clip: padding-box;
    }

    &.disabled {
        cursor: not-allowed;
        border-color: #e0e0e6;
        color: #333639;
        background-color: #e0e0e6;
        opacity: 0.5;

        &.transp {
            background-color: transparent;
        }
    }

    &.text {
        border-color: transparent;
        background: transparent;
        color: rgb(var(--bg));
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