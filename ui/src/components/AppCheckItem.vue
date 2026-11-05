<template>
    <div class="wa_check_row" :class="`wa_check_label_${labelPosition}`">
        <label v-if="HasLabel && labelPosition === 'before'" :id="`${CheckId}-label`" class="wa_check_label"
            :for="CheckId">
            <slot>{{ label }}</slot>
        </label>

        <button :id="CheckId" type="button" class="wa_check" :class="{ on: modelValue }" role="checkbox"
            :aria-checked="modelValue" :aria-labelledby="HasLabel ? `${CheckId}-label` : undefined"
            :aria-label="HasLabel ? undefined : AccessibleLabel" :disabled="disabled" @click="Toggle">
            <AppIcon name="check" :size="14" class="wa_check_icon" />
        </button>

        <label v-if="HasLabel && labelPosition !== 'before'" :id="`${CheckId}-label`" class="wa_check_label"
            :for="CheckId">
            <slot>{{ label }}</slot>
        </label>
    </div>
</template>

<script setup>
import { computed, useId, useSlots } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    modelValue: Boolean,
    label: {
        type: String,
        default: '',
    },
    /** before：标签在勾选框前；after：标签在勾选框后 */
    labelPosition: {
        type: String,
        default: 'after',
        allows: ['before', 'after'],
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const CheckId = useId()
const HasLabel = computed(() => Boolean(props.label || slots.default))
const AccessibleLabel = computed(() => props.ariaLabel || props.label || '复选框')

function Toggle() {
    if (props.disabled) return
    const next = !props.modelValue
    emit('update:modelValue', next)
    emit('change', next)
}
</script>

<style>
.wa_check_row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--wa_color_text);
}

.wa_check_label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
}

.wa_check {
    position: relative;
    display: grid;
    flex: none;
    place-items: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 1px solid var(--wa_color_line_strong);
    border-radius: 6px;
    color: transparent;
    background: var(--wa_color_field);
    cursor: pointer;
    transition:
        background var(--wa_duration_fast) var(--wa_ease_out),
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_check:hover:not(:disabled) {
    border-color: var(--wa_color_text_muted);
    background: var(--wa_color_hover);
}

.wa_check.on {
    border-color: var(--wa_color_text);
    color: var(--wa_color_on_text);
    background: var(--wa_color_text);
}

.wa_check.on:hover:not(:disabled) {
    border-color: var(--wa_color_primary_hover);
    background: var(--wa_color_primary_hover);
}

.wa_check:active:not(:disabled) {
    transform: scale(.9);
}

.wa_check:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_check:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_check_row:has(.wa_check:disabled) .wa_check_label {
    cursor: not-allowed;
}

.wa_check_icon {
    opacity: 0;
    transform: scale(.6);
    transition:
        opacity var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_fast) var(--wa_ease_spring);
}

.wa_check.on .wa_check_icon {
    opacity: 1;
    transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
    .wa_check,
    .wa_check_icon {
        transition: none;
    }

    .wa_check:active:not(:disabled) {
        transform: none;
    }
}
</style>
