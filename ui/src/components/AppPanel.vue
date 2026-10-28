<template>
    <section class="wa_panel" :class="[`wa_panel_${tone}`, { wa_panel_compact: compact }]">
        <header v-if="title || description || $slots.title || $slots.actions" class="wa_panel_head">
            <div class="wa_panel_text">
                <h2 v-if="title || $slots.title" class="wa_panel_title">
                    <slot name="title">{{ title }}</slot>
                </h2>
                <p v-if="description" class="wa_panel_desc">{{ description }}</p>
            </div>
            <div v-if="$slots.actions" class="wa_panel_actions">
                <slot name="actions" />
            </div>
        </header>
        <div class="wa_panel_body">
            <slot />
        </div>
        <footer v-if="$slots.footer" class="wa_panel_foot">
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
    description: {
        type: String,
        default: '',
    },
    tone: {
        type: String,
        default: 'default',
    },
    compact: Boolean,
})
</script>
