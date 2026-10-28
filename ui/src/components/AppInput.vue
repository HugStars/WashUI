<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :for="InputId">
            <slot name="label">{{ label }}</slot>
        </label>
        <div class="wa_input" :class="{ on: error, off: disabled, wa_input_sm: size === 'sm' }">
            <span v-if="$slots.prefix" class="wa_input_affix">
                <slot name="prefix" />
            </span>
            <input :id="InputId" ref="InputEl" v-bind="$attrs" class="wa_input_control" :type="type"
                :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly"
                :aria-invalid="error ? 'true' : undefined" :aria-describedby="DescribedBy" @input="OnInput">
            <button v-if="clearable && modelValue" type="button" class="wa_input_clear" aria-label="清空"
                :disabled="disabled || readonly" @click="Clear">
                <AppIcon name="close" :size="14" />
            </button>
            <span v-if="$slots.suffix" class="wa_input_affix">
                <slot name="suffix" />
            </span>
        </div>
        <p v-if="error" :id="ErrorId" class="wa_field_error">{{ error }}</p>
        <p v-else-if="hint" :id="HintId" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import AppIcon from './AppIcon.vue'

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
    type: {
        type: String,
        default: 'text',
    },
    size: {
        type: String,
        default: 'md',
    },
    clearable: Boolean,
    disabled: Boolean,
    readonly: Boolean,
})

const emit = defineEmits(['update:modelValue', 'clear'])

const InputId = useId()
const HintId = `${InputId}-hint`
const ErrorId = `${InputId}-error`
const InputEl = ref(null)
const DescribedBy = computed(() => (props.error ? ErrorId : props.hint ? HintId : undefined))

function OnInput(event) {
    emit('update:modelValue', event.target.value)
}

function Clear() {
    emit('update:modelValue', '')
    emit('clear')
    InputEl.value?.focus()
}
</script>
