<template>
    <section class="wa_card" :class="{ wa_card_compact: compact }">
        <header v-if="title || $slots.title || $slots.extra" class="wa_card_head">
            <h2 v-if="title || $slots.title" class="wa_card_title">
                <slot name="title">{{ title }}</slot>
            </h2>
            <div v-if="$slots.extra" class="wa_card_extra">
                <slot name="extra" />
            </div>
        </header>
        <slot />
        <footer v-if="$slots.footer" class="wa_card_foot">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: '',
    },
    compact: Boolean,
})
</script>
