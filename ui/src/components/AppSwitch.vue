<template>
    <div class="wa_switch_row" :class="{ 'wa_switch_between': align === 'between', 'wa_switch_md': size === 'md' }">
        <label v-if="HasLabel" :id="`${SwitchId}-label`" class="wa_switch_label" :for="SwitchId">
            <slot>{{ label }}</slot>
        </label>

        <button :id="SwitchId" type="button" class="wa_switch" :class="{ on: modelValue }" role="switch"
            :aria-checked="modelValue" :aria-labelledby="HasLabel ? `${SwitchId}-label` : undefined"
            :aria-label="HasLabel ? undefined : ariaLabel" :disabled="disabled" @click="Toggle">
            <span class="wa_switch_thumb" aria-hidden="true"></span>
        </button>
    </div>
</template>

<script setup>
import { computed, useId, useSlots } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    label: {
        type: String,
        default: '',
    },
    /** 隐藏标签文本，但保留无障碍名称 */
    hideLabel: Boolean,
    /** inline：标签与开关紧挨；between：标签与开关分别贴左右两侧 */
    align: {
        type: String,
        default: 'inline',
        allows: ['inline', 'between'],
    },
    size: {
        type: String,
        default: 'sm',
        allows: ['sm', 'md'],
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const slots = useSlots()
const SwitchId = useId()
const HasLabel = computed(() => !props.hideLabel && Boolean(props.label || slots.default))
const ariaLabel = computed(() => props.label || '开关')

function Toggle() {
    if (props.disabled) return
    const next = !props.modelValue
    emit('update:modelValue', next)
    emit('change', next)
}
</script>

<style>
.wa_switch_row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--wa_color_text);
}

.wa_switch_row.wa_switch_md {
    gap: 12px;
    font-size: 14px;
}

.wa_switch_between {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
}

.wa_switch_label {
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

.wa_switch_between .wa_switch_label {
    flex: 1;
}

.wa_switch {
    --wa_switch_width: 44px;
    --wa_switch_height: 27px;
    --wa_switch_pad: 3.5px;
    --wa_switch_thumb: 20px;
    --wa_switch_travel: 17px;
    --wa_switch_thumb_off: .667;
    --wa_switch_thumb_pressed: 1.167;

    position: relative;
    display: inline-flex;
    flex: none;
    width: var(--wa_switch_width);
    height: var(--wa_switch_height);
    padding: 0;
    border: 0;
    border-radius: var(--wa_radius_pill);
    background: var(--wa_color_active);
    box-shadow: inset 0 0 0 2px var(--wa_color_text_subtle);
    cursor: pointer;
    transition:
        background-color var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out);
}

@media (hover: hover) and (pointer: fine) {
    .wa_switch:hover:not(:disabled) {
        box-shadow: inset 0 0 0 2px var(--wa_color_text_muted);
    }

    .wa_switch.on:hover:not(:disabled) {
        box-shadow: inset 0 0 0 2px transparent;
    }
}

.wa_switch_row.wa_switch_md .wa_switch {
    --wa_switch_width: 52px;
    --wa_switch_height: 32px;
    --wa_switch_pad: 4px;
    --wa_switch_thumb: 24px;
    --wa_switch_travel: 20px;
}

.wa_switch_thumb {
    position: absolute;
    top: var(--wa_switch_pad);
    left: var(--wa_switch_pad);
    width: var(--wa_switch_thumb);
    height: var(--wa_switch_thumb);
    border-radius: 50%;
    background: var(--wa_color_text_subtle);
    box-shadow: 0 1px 3px #00000026;
    translate: 0 0;
    scale: var(--wa_switch_thumb_off);
    transition:
        translate var(--wa_duration_slow) var(--wa_ease_spring),
        scale var(--wa_duration_base) var(--wa_ease_out),
        background-color var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_switch.on {
    background: var(--wa_color_text);
    box-shadow: inset 0 0 0 2px transparent;
}

.wa_switch.on .wa_switch_thumb {
    background: var(--wa_color_on_text);
    box-shadow: 0 1px 3px #00000033;
    translate: var(--wa_switch_travel) 0;
    scale: 1;
}

.wa_switch:active:not(:disabled) .wa_switch_thumb {
    scale: var(--wa_switch_thumb_pressed);
    transition-duration: var(--wa_duration_fast);
    transition-timing-function: var(--wa_ease_out);
}

.wa_switch.on:active:not(:disabled) .wa_switch_thumb {
    translate: var(--wa_switch_travel) 0;
    scale: var(--wa_switch_thumb_pressed);
}

.wa_switch:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    .wa_switch,
    .wa_switch_thumb {
        transition: none;
    }
}

.wa_switch:disabled {
    opacity: .45;
    cursor: not-allowed;
}
</style>
