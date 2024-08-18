<template>
    <hr :class="HrClass">
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'h',
        validator: value => ['h', 'v'].includes(value)
    },
})
const HrClass = computed(() => {
    return {
        "cyan_hr": true,
        'horizontal': props.type === 'h',
        'vertical': props.type === 'v',
    }
})

</script>

<style lang="scss">
.cyan_hr {
    border: 0;
    background-color: rgba(0, 0, 0, 0.1);
    background-color: #f6f6f7;

    &.horizontal {
        height: 1px;
        width: 100%;
        margin: 16px 0;
    }

    &.vertical {
        width: 1px;
        height: 100%;
        margin: 0 16px;
    }
}
</style>