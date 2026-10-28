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
