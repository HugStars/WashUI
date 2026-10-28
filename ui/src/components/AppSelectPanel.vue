<template>
    <div class="wa_select_panel">
        <div v-for="group in groups" :key="group.label" class="wa_select_group">
            <p v-if="group.label" class="wa_select_group_label">{{ group.label }}</p>
            <button v-for="item in group.options" :key="item.value" type="button" class="wa_select_option"
                :class="{ on: item.value === modelValue }" role="option" :aria-selected="item.value === modelValue"
                :disabled="item.disabled" @click="emit('select', item)">
                <span>{{ item.label }}</span>
                <span v-if="item.value === modelValue" class="wa_select_check" aria-hidden="true">✓</span>
            </button>
        </div>

        <button v-for="item in options" :key="item.value" type="button" class="wa_select_option"
            :class="{ on: item.value === modelValue }" role="option" :aria-selected="item.value === modelValue"
            :disabled="item.disabled" @click="emit('select', item)">
            <span>{{ item.label }}</span>
            <span v-if="item.value === modelValue" class="wa_select_check" aria-hidden="true">✓</span>
        </button>

        <p v-if="!HasOptions" class="wa_select_empty">{{ emptyText }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    emptyText: {
        type: String,
        default: '暂无选项',
    },
})

const emit = defineEmits(['select'])
const HasOptions = computed(() => props.groups.some(group => group.options?.length) || props.options.length > 0)
</script>
