<template>
    <Teleport to="body">
        <div class="wa_route_bar" :class="{ on: Loading }" aria-hidden="true"></div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { routeLoading } from '../route_state.js'

const props = defineProps({
    loading: {
        type: Boolean,
        default: undefined,
    },
})

const Loading = computed(() => props.loading ?? routeLoading.value)
</script>
