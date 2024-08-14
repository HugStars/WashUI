<template>
    <button>
        <slot />
    </button>
</template>

<script setup>

const props = defineProps({ // 接受传参
    Text: { // 传参的类名
        type: String,
        default: "Test"
    }
})
</script>