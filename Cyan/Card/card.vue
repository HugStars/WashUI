<template>
    <section class="cyan_card">
        <slot></slot>
    </section>
</template>

<style lang="scss">
.cyan_card {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    gap: 8px 12px;
}
</style>