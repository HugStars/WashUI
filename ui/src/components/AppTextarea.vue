<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :for="TextareaId">
            <slot name="label">{{ label }}</slot>
        </label>

        <div class="wa_textarea" :class="[`wa_textarea_${size}`, {
            on: error,
            off: disabled || readonly,
            wa_frosted: frosted,
        }]">
            <textarea :id="TextareaId" ref="TextareaEl" v-bind="$attrs" class="wa_textarea_control"
                :value="modelValue ?? ''" :rows="rows" :cols="cols" :wrap="wrap" :maxlength="maxlength"
                :style="{ resize }" :disabled="disabled" :readonly="readonly"
                :aria-invalid="error ? 'true' : undefined" :aria-describedby="DescribedBy"
                :aria-label="label ? undefined : ariaLabel" @input="OnInput"></textarea>
        </div>

        <p v-if="error" :id="`${TextareaId}-error`" class="wa_field_error">{{ error }}</p>
        <p v-else-if="hint" :id="`${TextareaId}-hint`" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, ref, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    hint: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: '',
    },
    /** 文本域行数 */
    rows: {
        type: [Number, String],
        default: 3,
    },
    /** 原生 cols；实际宽度由父容器控制 */
    cols: {
        type: [Number, String],
        default: undefined,
    },
    /** 原生 wrap：soft / hard / off */
    wrap: {
        type: String,
        default: 'soft',
    },
    /** 原生 maxlength */
    maxlength: {
        type: [Number, String],
        default: undefined,
    },
    /** 拖动缩放方向 */
    resize: {
        type: String,
        default: 'vertical',
        allows: ['none', 'both', 'horizontal', 'vertical'],
    },
    size: {
        type: String,
        default: 'sm',
        allows: ['md', 'sm'],
    },
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
    ariaLabel: {
        type: String,
        default: '文本域',
    },
    disabled: Boolean,
    readonly: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const TextareaId = useId()
const TextareaEl = ref(null)
const DescribedBy = computed(() => (props.error ? `${TextareaId}-error` : props.hint ? `${TextareaId}-hint` : undefined))

function OnInput(event) {
    emit('update:modelValue', event.target.value)
}
</script>

<style>
.wa_textarea {
    display: flex;
    align-items: stretch;
    width: 100%;
    min-width: 0;
    padding: 8px var(--wa_space_3);
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_field);
    transition:
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        opacity var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_textarea:hover {
    border-color: var(--wa_color_line_strong);
}

.wa_textarea:focus-within {
    border-color: var(--wa_color_text);
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.wa_textarea.on {
    border-color: var(--wa_color_danger);
}

.wa_textarea.on:focus-within {
    box-shadow: 0 0 0 3px var(--wa_color_danger_soft);
}

.wa_textarea.off {
    opacity: .55;
}

.wa_textarea_sm {
    padding: 6px var(--wa_space_2);
}

.wa_textarea_md {
    padding: 10px var(--wa_space_3);
}

.wa_textarea_control {
    flex: 1;
    min-width: 0;
    width: 100%;
    min-height: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    color: inherit;
    background: transparent;
    box-shadow: none;
    font: inherit;
    font-size: 13px;
    line-height: 1.6;
}

.wa_textarea_md .wa_textarea_control {
    font-size: 14px;
}

.wa_textarea_control:hover,
.wa_textarea_control:focus {
    border: 0;
    box-shadow: none;
}

.wa_textarea_control:disabled {
    cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
    .wa_textarea {
        transition: none;
    }
}
</style>
