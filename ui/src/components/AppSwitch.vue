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
    --wa_switch_height: 25px;
    --wa_switch_pad: 3px;
    --wa_switch_thumb: 19px;
    --wa_switch_travel: 19px;

    position: relative;
    display: inline-flex;
    flex: none;
    width: var(--wa_switch_width);
    height: var(--wa_switch_height);
    padding: 0;
    border: 0;
    border-radius: var(--wa_radius_pill);
    background: var(--wa_color_field);
    cursor: pointer;
    transition: background var(--wa_duration_fast) ease;
}

.wa_switch_row.wa_switch_md .wa_switch {
    --wa_switch_width: 52px;
    --wa_switch_height: 30px;
    --wa_switch_thumb: 24px;
    --wa_switch_travel: 22px;
}

.wa_switch_thumb {
    position: absolute;
    top: var(--wa_switch_pad);
    left: var(--wa_switch_pad);
    width: var(--wa_switch_thumb);
    height: var(--wa_switch_thumb);
    border-radius: 50%;
    background: var(--wa_color_text_faint);
    box-shadow: 0 1px 3px #00000026;
    transition: transform var(--wa_duration_fast) var(--wa_ease_out), background var(--wa_duration_fast);
}

.wa_switch.on {
    background: var(--wa_color_text);
}

.wa_switch.on .wa_switch_thumb {
    background: var(--wa_color_on_text);
    transform: translateX(var(--wa_switch_travel));
}

.wa_switch:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_switch:disabled {
    opacity: .45;
    cursor: not-allowed;
}
</style>
