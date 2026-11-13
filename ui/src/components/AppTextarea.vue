<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :for="TextareaId">
            <slot name="label">{{ label }}</slot>
        </label>

        <div class="wa_textarea" :class="[`wa_textarea_${size}`, {
            on: DisplayError,
            off: disabled || readonly,
            wa_frosted: frosted,
        }]">
            <textarea :id="TextareaId" ref="TextareaEl" v-bind="$attrs" class="wa_textarea_control"
                :value="modelValue ?? ''" :rows="rows" :cols="cols" :wrap="wrap" :maxlength="maxlength"
                :style="{ resize }" :disabled="disabled" :readonly="readonly"
                :aria-invalid="DisplayError ? 'true' : undefined" :aria-describedby="DescribedBy"
                :aria-label="label ? undefined : ariaLabel" @input="HandleInput" @blur="HandleBlur"></textarea>
        </div>

        <div v-if="showCount || Message" class="wa_textarea_meta">
            <div class="wa_field_message" :class="{ show: Message }">
                <div class="wa_field_message_inner">
                    <p v-if="MessageIsError" :id="`${TextareaId}-error`" class="wa_field_error">{{ MessageText }}</p>
                    <p v-else :id="`${TextareaId}-hint`" class="wa_field_hint">{{ MessageText }}</p>
                </div>
            </div>
            <span v-if="showCount" class="wa_textarea_count">{{ CountText }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed, onUnmounted, ref, useId, watch } from 'vue'
import { useValidation } from '../composables/useValidation.js'

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
    /**
     * 拖动缩放方向
     * @type {'none' | 'both' | 'horizontal' | 'vertical'}
     */
    resize: {
        type: String,
        default: 'none',
    },
    /** 在底部右侧显示字数统计 */
    showCount: Boolean,
    /**
     * @type {'md' | 'sm'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /** 白色磨砂半透明表面，与 AppPopover 面板一致 */
    frosted: Boolean,
    /** 校验规则对象或数组；支持 required、min、max、pattern、validator、message、trigger */
    rule: {
        type: [Object, Array],
        default: null,
    },
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
const { DisplayError, OnBlur: ValidateBlur, OnInput: ValidateInput } = useValidation(
    props,
    () => props.modelValue,
    { defaultTrigger: 'blur' }
)
const DescribedBy = computed(() => (DisplayError.value
    ? `${TextareaId}-error`
    : props.hint ? `${TextareaId}-hint` : undefined))
const Length = computed(() => String(props.modelValue ?? '').length)
const HasMaxlength = computed(
    () => props.maxlength !== undefined && props.maxlength !== null && props.maxlength !== ''
)
const CountText = computed(() => HasMaxlength.value
    ? `${Length.value} / ${props.maxlength}`
    : `${Length.value}`)
const Message = computed(() => Boolean(DisplayError.value || props.hint))
const MessageText = ref('')
const MessageIsError = ref(false)
let MessageTimer = 0

// * 消息收起时延迟清空文本，让容器高度过渡能完整播放
watch([DisplayError, () => props.hint], ([error, hint]) => {
    clearTimeout(MessageTimer)

    if (error || hint) {
        MessageIsError.value = Boolean(error)
        MessageText.value = error || hint
        return
    }

    MessageTimer = setTimeout(() => {
        MessageText.value = ''
    }, 220)
}, { immediate: true })

onUnmounted(() => clearTimeout(MessageTimer))

function HandleInput(event) {
    const value = event.target.value
    emit('update:modelValue', value)
    ValidateInput(value)
}

function HandleBlur() {
    ValidateBlur(props.modelValue)
}
</script>

<style>
.wa_textarea {
    display: flex;
    align-items: stretch;
    width: 100%;
    min-width: 0;
    padding: 8px var(--wa_space_3);
    overflow: hidden;
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

.wa_textarea_meta {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    margin-top: 6px;
}

.wa_textarea_meta>.wa_field_message {
    flex: 1;
    min-width: 0;
}

.wa_textarea_meta>.wa_field_hint,
.wa_textarea_meta>.wa_field_error {
    flex: 1;
    min-width: 0;
}

.wa_textarea_count {
    flex: none;
    margin-left: auto;
    font-size: 12px;
    line-height: 1.6;
    color: var(--wa_color_text_subtle);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.wa_textarea_control {
    flex: 1;
    min-width: 0;
    min-height: 0;
    width: 100%;
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
