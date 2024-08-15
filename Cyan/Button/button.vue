<template>
    <button class="cyan_button">
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

<style lang="scss">
.cyan_button{
    border: 2px solid #ccc;
}
</style>