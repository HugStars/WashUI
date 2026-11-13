<template>
    <section class="wa_card" :class="{ wa_card_compact: compact, wa_frosted: frosted }">
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
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
})
</script>

<style>
.wa_card {
    padding: 26px;
    border-radius: var(--wa_radius_card);
    background: var(--wa_color_surface);
}

.wa_card_compact {
    padding: 18px 22px;
}

.wa_card_head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
}

.wa_card_compact .wa_card_head {
    margin-bottom: 12px;
}

.wa_card_title {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
}

.wa_card_title::before {
    content: '';
    flex: none;
    width: 4px;
    height: 15px;
    border-radius: var(--wa_radius_sm);
    background: var(--wa_color_text_muted);
}

.wa_card_extra {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
}

.wa_card_foot {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
}
</style>
