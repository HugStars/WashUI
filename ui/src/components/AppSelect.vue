<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :for="SelectId">
            <slot name="label">{{ label }}</slot>
        </label>

        <AppPopover placement="bottom" :offset="6" match-trigger role="listbox" :aria-label="ariaLabel"
            :disabled="disabled">
            <template #trigger="{ open, toggle }">
                <button :id="SelectId" v-bind="$attrs" type="button" class="wa_select_trigger"
                    :class="{ on: error, off: disabled, wa_select_sm: size === 'sm' }" :disabled="disabled"
                    :aria-invalid="error ? 'true' : undefined" :aria-describedby="DescribedBy" aria-haspopup="listbox"
                    :aria-expanded="open" @keydown.down.prevent="toggle" @keydown.up.prevent="toggle">
                    <span class="wa_select_value" :class="{ wa_select_placeholder: !Selected }">{{ Shown }}</span>
                    <AppIcon class="wa_select_arrow" name="chevron" :size="15" />
                </button>
            </template>

            <template #default="{ close }">
                <AppSelectPanel :groups="groups" :options="options" :model-value="modelValue"
                    @select="item => Choose(item, close)" />
            </template>
        </AppPopover>

        <p v-if="error" :id="`${SelectId}-error`" class="wa_field_error">{{ error }}</p>
        <p v-else-if="hint" :id="`${SelectId}-hint`" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'
import AppIcon from './AppIcon.vue'
import AppPopover from './AppPopover.vue'
import AppSelectPanel from './AppSelectPanel.vue'

defineOptions({ inheritAttrs: false })

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
    placeholder: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: 'md',
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const SelectId = useId()
const AllOptions = computed(() => [
    ...props.groups.flatMap(group => group.options || []),
    ...props.options,
])
const Selected = computed(() => AllOptions.value.find(item => item.value === props.modelValue))
const Shown = computed(() => Selected.value?.label || props.placeholder || '请选择')
const ariaLabel = computed(() => props.label || props.placeholder || '选择')
const DescribedBy = computed(() => (props.error ? `${SelectId}-error` : props.hint ? `${SelectId}-hint` : undefined))

function Choose(item, close) {
    if (item.disabled) return
    emit('update:modelValue', item.value)
    emit('change', item.value)
    close()
}
</script>
