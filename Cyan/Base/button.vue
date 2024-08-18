<template>
    <button :class="ButtonClass" :disabled="disabled" v-ripple :style="{ '--w': props.w, '--h': props.h, '--bg': GRB_Color }">
        <slot></slot>
    </button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { FnHexToRGB } from '../Utils/utils_fn.js'

let GRB_Color = ref('')

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
    w: {
        type: String,
        default: ''
    },
    h: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    round: Boolean,
    transparent: Boolean,
    fade: Boolean,
    dotted: Boolean,
    dashed: Boolean,
    disabled: Boolean,
    circle: Boolean,
    text: Boolean,
    ripple: Boolean,
})

const ButtonClass = computed(() => ({
    'cyan_button': true,
    [props.type]: true,
    [props.size]: true,
    round: props.round,
    circle: props.circle,
    transparent: props.transparent,
    fade: props.fade,
    dashed: props.dashed,
    dotted: props.dotted,
    disabled: props.disabled,
    text: props.text,
    text_overflow: props.w !== 'auto',
}))

if (props.color) {
    GRB_Color = FnHexToRGB(props.color)
}



</script>

<style lang="scss">
.cyan_button {
    width: var(--w);
    height: var(--h);
    padding: 0 var(--p_l);
    margin: 0;
    outline: 0;
    line-height: normal;
    border: 2px solid rgb(var(--bg));
    border-radius: 4px;
    background-color: rgb(var(--bg));
    color: #fff;
    overflow: hidden;
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

    &.transparent {
        background-color: transparent;
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

        &.transparent {
            background-color: transparent;
        }
    }

    &.text {
        border-color: transparent;
        background-color: transparent;
        color: rgb(var(--bg));

        &.transparent {
            background-color: transparent;
        }
    }

    &.fade {
        border-color: transparent;
        background-color: rgba(var(--bg), 0.1);
        color: rgb(var(--bg));

        &.dotted {
            border-color: var(--bg);
        }

        &.dashed {
            border-color: var(--bg);
        }
    }

    &.text_overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>