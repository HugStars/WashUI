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

<style>
.wa_select_panel {
    display: grid;
    gap: calc(var(--wa_popover_padding) * 2);
    min-width: 0;
    max-height: min(320px, calc(100vh - 120px));
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: auto;
    scrollbar-color: auto;
}

.wa_select_panel::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.wa_select_panel::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
}

.wa_select_panel::-webkit-scrollbar-button:vertical:start:decrement,
.wa_select_panel::-webkit-scrollbar-button:vertical:end:increment {
    display: none;
    width: 0;
    height: 0;
}

.wa_select_panel::-webkit-scrollbar-track {
    margin-top: var(--wa_radius_popover);
    margin-bottom: var(--wa_radius_popover);
    background: transparent;
}

.wa_select_panel::-webkit-scrollbar-thumb {
    border-radius: var(--wa_radius_pill);
}

.wa_select_group {
    display: grid;
    gap: var(--wa_popover_padding);
}

.wa_select_group_label {
    padding: var(--wa_space_1) var(--wa_space_3);
    font-size: 11px;
    color: var(--wa_color_text_faint);
}

.wa_select_option {
    display: flex;
    align-items: center;
    gap: var(--wa_space_2);
    width: 100%;
    padding: var(--wa_space_2) var(--wa_space_3);
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_muted);
    background: transparent;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.wa_select_option:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_select_option.on,
.wa_select_option.on:hover {
    color: var(--wa_color_on_text);
    background: var(--wa_color_text);
    font-weight: 600;
}

.wa_select_option:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_select_check {
    margin-left: auto;
    font-size: 12px;
}

.wa_select_empty {
    padding: 10px;
    font-size: 12px;
    color: var(--wa_color_text_faint);
}
</style>
