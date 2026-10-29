<template>
    <Teleport v-if="Target" :to="Target">
        <div class="wa_page_header">
            <h1 v-if="title || $slots.default">
                <slot>{{ title }}</slot>
            </h1>
            <div v-if="$slots.center" class="wa_page_center">
                <slot name="center" />
            </div>
            <div v-if="$slots.actions" class="wa_page_actions">
                <slot name="actions" />
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { inject } from 'vue'
import { HEADER_TARGET } from '../keys.js'

defineProps({
    title: {
        type: String,
        default: '',
    },
})

const Target = inject(HEADER_TARGET, null)
</script>

<style>
.wa_page_header :focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_page_header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.wa_page_header h1 {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
}

.wa_page_center {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
}

.wa_page_actions {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    margin-left: auto;
}
</style>
