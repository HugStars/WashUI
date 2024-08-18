<template>
    <div :class="DividerClass" :style="{ '--w': props.w, '--h': props.h, '--m':props.m, '--bg': GRB_Color }">
        <p class="text" v-if="TextPosition">
            {{ props[TextPosition] }}
        </p>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { FnHexToRGB } from '../Utils/utils_fn.js'

let GRB_Color = ref('')
let TextPosition = ref('')

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: value => ['default', 'info', 'success', 'error', 'warn', 'help'].includes(value)
    },
    color: {
        type: String,
        default: ''
    },
    left: {
        type: String,
        default: ''
    },
    center: {
        type: String,
        default: ''
    },
    right: {
        type: String,
        default: ''
    },
    w: {
        type: String,
        default: ''
    },
    h: {
        type: String,
        default: ''
    },
    m: {
        type: String,
        default: ''
    },

    v: Boolean,
    round: Boolean,
    dotted: Boolean,
    dashed: Boolean,
})

const DividerClass = computed(() => ({
    'cyan_divider': true,
    [props.type]: true,
    round: props.round,
    dashed: props.dashed,
    dotted: props.dotted,
    vertical: props.v,
    [TextPosition]: true
}))


if (props.color) {
    GRB_Color = FnHexToRGB(props.color)
}

if (props.left) TextPosition = 'left'
else if (props.center) TextPosition = 'center'
else if (props.right) TextPosition = 'right'


</script>

<style lang="scss">
.cyan_divider {
    position: relative;
    --w: 100%;
    --h: 2px;
    --m: 6px;

    &.default {
        --bg: 226, 226, 226;
    }

    width: var(--w);
    height: var(--h);
    margin: var(--m) auto;
    background-color: rgb(var(--bg));

    &.vertical {
        --w: 2px;
        --h: 1em;
        display: inline-block;
        margin: auto var(--m);
        vertical-align: middle;
        width: var(--w);
    }

    &.dotted {
        --d: right;
        --size: var(--h);
        background-color: unset;
        background-image: linear-gradient(
            to var(--d),
            rgb(var(--bg)) 0 var(--size),
            rgba(255, 255, 255, 0) var(--size) calc(2 * var(--size))
        );
        background-size: calc(2 * var(--size));

        &.vertical {
            --d: bottom;
            --size: var(--w);
            background-size: 1px calc(2 * var(--size));
        }
    }

    &.dashed {
        --d: right;
        --size: var(--h);
        background-color: unset;
        background-image: linear-gradient(
            to var(--d),
            rgb(var(--bg)) 0 calc(3 * var(--size)),
            rgba(255, 255, 255, 0) calc(3 * var(--size)) calc(6 * var(--size))
        );
        background-size: calc(6 * var(--size));

        &.vertical {
            --d: bottom;
            --size: var(--w);
            background-size: 1px calc(6 * var(--size));
        }
    }

    &.left .text {
        left: 10px;
        transform: translate(0, -50%);
    }

    &.center .text {
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &.right .text {
        right: 10px;
        transform: translate(0, -50%);
    }

    .text {
        position: absolute;
        top: 50%;
        font-size: 14px;
        margin: unset;
        line-height: unset;
        backdrop-filter: blur(46px);
        letter-spacing: 2px;
        overflow: hidden;
    }
}
</style>