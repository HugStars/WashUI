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
        allows: ['default', 'success', 'warning', 'help', 'danger'],
    },
    compact: Boolean,
})
</script>

<style>
.wa_panel {
    --wa_panel_tone: var(--wa_color_line_strong);
    display: grid;
    gap: 14px;
    min-width: 0;
    padding: 20px;
    border: 1px solid var(--wa_color_line);
    border-left: 3px solid var(--wa_panel_tone);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_surface);
}

.wa_panel_compact {
    gap: 10px;
    padding: 14px 16px;
}

.wa_panel_success {
    --wa_panel_tone: var(--wa_color_success);
}

.wa_panel_warning {
    --wa_panel_tone: var(--wa_color_warning);
}

.wa_panel_help {
    --wa_panel_tone: var(--wa_color_help);
}

.wa_panel_danger {
    --wa_panel_tone: var(--wa_color_danger);
}

.wa_panel_head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
}

.wa_panel_text {
    display: grid;
    gap: 4px;
    min-width: 0;
}

.wa_panel_title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
}

.wa_panel_desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--wa_color_text_subtle);
}

.wa_panel_actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}

.wa_panel_body {
    min-width: 0;
    color: var(--wa_color_text_muted);
    font-size: 13px;
    line-height: 1.7;
}

.wa_panel_foot {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
