<template>
    <div class="wa_stepper" :class="{ wa_stepper_md: size === 'md', is_disabled: disabled }" role="group"
        :aria-label="ariaLabel">
        <button type="button" class="wa_stepper_btn" :disabled="disabled || AtMin" aria-label="减少" @click="Step(-1)">
            <AppIcon name="minus" :size="14" />
        </button>

        <input class="wa_stepper_input" type="text" inputmode="decimal" role="spinbutton"
            :value="Text" :disabled="disabled" :aria-label="ariaLabel" :aria-valuenow="Current"
            :aria-valuemin="Number.isFinite(min) ? min : undefined" :aria-valuemax="Number.isFinite(max) ? max : undefined"
            @focus="$event.target.select()" @change="OnInput" @keydown.up.prevent="Step(1)"
            @keydown.down.prevent="Step(-1)" @keydown.enter.prevent="$event.target.blur()" />

        <button type="button" class="wa_stepper_btn" :disabled="disabled || AtMax" aria-label="增加" @click="Step(1)">
            <AppIcon name="plus" :size="14" />
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
    modelValue: {
        type: Number,
        default: 0,
    },
    min: {
        type: Number,
        default: -Infinity,
    },
    max: {
        type: Number,
        default: Infinity,
    },
    step: {
        type: Number,
        default: 1,
    },
    /** 显示小数位；不传时按 step 的小数位推导 */
    precision: {
        type: Number,
        default: null,
    },
    disabled: Boolean,
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    ariaLabel: {
        type: String,
        default: '步进器',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const Decimals = computed(() => {
    if (props.precision !== null && props.precision !== undefined) {
        return Math.max(0, Math.min(10, Math.floor(props.precision)))
    }

    const text = String(props.step)
    return text.includes('.') ? text.split('.')[1].length : 0
})

function Round(value) {
    const base = 10 ** Decimals.value
    return Math.round(value * base) / base
}

function Clamp(value) {
    return Math.min(props.max, Math.max(props.min, value))
}

const Current = computed(() => {
    const value = Number(props.modelValue)
    return Round(Clamp(Number.isFinite(value) ? value : 0))
})
const Text = computed(() => Current.value.toFixed(Decimals.value))
const AtMin = computed(() => Current.value <= props.min)
const AtMax = computed(() => Current.value >= props.max)

function Commit(value) {
    const next = Round(Clamp(value))
    if (next === Current.value) return
    emit('update:modelValue', next)
    emit('change', next)
}

function Step(direction) {
    if (props.disabled) return
    Commit(Current.value + direction * props.step)
}

function OnInput(event) {
    const value = Number(event.target.value)
    const next = Number.isFinite(value) ? Round(Clamp(value)) : Current.value
    event.target.value = next.toFixed(Decimals.value)
    Commit(next)
}
</script>

<style>
.wa_stepper {
    --wa_stepper_height: var(--wa_control_height_sm, 32px);

    display: inline-flex;
    width: fit-content;
    max-width: 100%;
    align-items: center;
    gap: 2px;
    padding: 2px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_pill);
    color: var(--wa_color_text);
    background: var(--wa_color_field);
    transition: border-color var(--wa_duration_fast), box-shadow var(--wa_duration_fast);
}

.wa_stepper_md {
    --wa_stepper_height: var(--wa_control_height, 40px);
}

.wa_stepper:focus-within {
    border-color: var(--wa_color_highlight);
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.wa_stepper.is_disabled {
    opacity: .45;
}

.wa_stepper_btn {
    display: grid;
    width: calc(var(--wa_stepper_height) - 8px);
    height: calc(var(--wa_stepper_height) - 8px);
    place-items: center;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: var(--wa_color_text_muted);
    background: transparent;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast),
        background var(--wa_duration_fast),
        transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_stepper_btn:hover:not(:disabled) {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_stepper_btn:active:not(:disabled) {
    transform: scale(.9);
}

.wa_stepper_btn:disabled {
    opacity: .3;
    cursor: not-allowed;
}

.wa_stepper_btn:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 1px;
}

.wa_stepper input.wa_stepper_input,
.wa_stepper input.wa_stepper_input:hover,
.wa_stepper input.wa_stepper_input:focus {
    width: 46px;
    min-width: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    color: var(--wa_color_text);
    background: transparent;
    box-shadow: none;
    font: inherit;
    font-size: 13px;
    line-height: 1.4;
    text-align: center;
    font-variant-numeric: tabular-nums;
    cursor: text;
}

.wa_stepper_md input.wa_stepper_input,
.wa_stepper_md input.wa_stepper_input:hover,
.wa_stepper_md input.wa_stepper_input:focus {
    width: 56px;
    font-size: 14px;
}

@media (prefers-reduced-motion: reduce) {
    .wa_stepper_btn {
        transition: none;
    }
}
</style>
