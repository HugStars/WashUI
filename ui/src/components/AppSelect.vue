<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :for="SelectId">
            <slot name="label">{{ label }}</slot>
        </label>

        <AppPopover placement="bottom" match-trigger :role="multiple ? 'dialog' : 'listbox'" :aria-label="ariaLabel"
            :padding="PopoverPadding" :disabled="disabled">
            <template #trigger="{ open, toggle }">
                <button :id="SelectId" v-bind="$attrs" type="button" class="wa_select_trigger"
                    :class="{ on: error, off: disabled, wa_select_sm: size === 'sm', wa_frosted: frosted }"
                    :disabled="disabled" :aria-invalid="error ? 'true' : undefined" :aria-describedby="DescribedBy"
                    :aria-haspopup="multiple ? 'dialog' : 'listbox'" :aria-expanded="open"
                    @keydown.down.prevent="toggle" @keydown.up.prevent="toggle">
                    <span class="wa_select_value"
                        :class="{ wa_select_placeholder: multiple ? !Values.length : !Selected }">{{ Shown }}</span>
                    <AppIcon class="wa_select_arrow" name="chevron" :size="15" />
                </button>
            </template>

            <template #default="{ close }">
                <AppCheckPanel v-if="multiple" :groups="groups" :options="options" :model-value="Values"
                    :size="PanelSize" :disabled="disabled" :empty-text="emptyText"
                    @update:model-value="UpdateMultiple" />
                <AppSelectPanel v-else :groups="groups" :options="options" :model-value="modelValue" :size="size"
                    :check-icon="checkIcon" :icon-component="iconComponent" :empty-text="emptyText"
                    @select="item => Choose(item, close)" />
            </template>
        </AppPopover>

        <p v-if="error" :id="`${SelectId}-error`" class="wa_field_error">{{ error }}</p>
        <p v-else-if="hint" :id="`${SelectId}-hint`" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'
import { useChoiceSummary } from '../composables/useChoiceSummary.js'
import AppCheckPanel from './AppCheckPanel.vue'
import AppIcon from './AppIcon.vue'
import AppPopover from './AppPopover.vue'
import AppSelectPanel from './AppSelectPanel.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    modelValue: {
        type: [String, Number, Symbol, Array],
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
        default: 'sm',
        allows: ['md', 'sm'],
    },
    /**
     * 选中对号的呈现方式，透传给下拉面板：
     * - true（默认）显示 ✓，false 不显示
     * - 字符串：短字符按文本显示，图标名按 iconComponent 渲染
     */
    checkIcon: {
        type: [Boolean, String],
        default: true,
    },
    /** 图标组件，默认使用内置 AppIcon，可替换为其他图标库 */
    iconComponent: {
        type: [Object, Function],
        default: () => AppIcon,
    },
    /** 没有可选项时面板显示的文案 */
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    multiple: Boolean,
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change'])

const SelectId = useId()
const PopoverPadding = computed(() => props.size === 'sm' ? 6 : 8)
const PanelSize = computed(() => props.size === 'sm' ? 18 : 20)
const { AllOptions, Values, Summary } = useChoiceSummary(props)
const Selected = computed(() => AllOptions.value.find(item => item.value === props.modelValue))
const Shown = computed(() => props.multiple
    ? Summary.value
    : Selected.value?.label || props.placeholder || '请选择')
const ariaLabel = computed(() => props.label || props.placeholder || '选择')
const DescribedBy = computed(() => (props.error ? `${SelectId}-error` : props.hint ? `${SelectId}-hint` : undefined))

function Choose(item, close) {
    if (item.disabled) return
    emit('update:modelValue', item.value)
    emit('change', item.value)
    close()
}

function UpdateMultiple(values) {
    emit('update:modelValue', values)
    emit('change', values)
}
</script>

<style>
.wa_select_trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: var(--wa_control_height);
    padding: 0 var(--wa_space_3);
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text);
    background: var(--wa_color_field);
    font: inherit;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    transition:
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out),
        opacity var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_select_trigger:hover {
    border-color: var(--wa_color_line_strong);
}

.wa_select_trigger[aria-expanded='true'] {
    background: var(--wa_color_hover);
}

.wa_select_trigger:focus-visible {
    border-color: var(--wa_color_text);
    outline: 0;
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.wa_select_trigger.on {
    border-color: var(--wa_color_danger);
}

.wa_select_trigger.on:focus-visible {
    box-shadow: 0 0 0 3px var(--wa_color_danger_soft);
}

.wa_select_trigger.off {
    opacity: .55;
    cursor: not-allowed;
}

.wa_select_trigger.wa_select_sm {
    min-height: var(--wa_control_height_sm);
    padding: 0 var(--wa_space_3);
    font-size: 13px;
}

.wa_select_value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_select_placeholder {
    color: var(--wa_color_text_faint);
}

.wa_select_arrow {
    flex: none;
    color: var(--wa_color_text_faint);
    transform: rotate(90deg);
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_select_trigger[aria-expanded='true'] .wa_select_arrow {
    transform: rotate(-90deg);
}

@media (prefers-reduced-motion: reduce) {
    .wa_select_trigger,
    .wa_select_arrow {
        transition: none;
    }
}
</style>
