<template>
    <div class="wa_field" v-bind="$attrs">
        <label v-if="label || $slots.label" class="wa_field_label" :id="`${FieldId}-label`">
            <slot name="label">{{ label }}</slot>
        </label>

        <AppPopover v-model:open="PanelOpen" placement="bottom-left" :width="268" :gap="6" :padding="0"
            role="dialog" :aria-label="ariaLabel">
            <template #trigger="{ open, triggerProps }">
                <button :id="FieldId" type="button" class="wa_color_trigger" v-bind="triggerProps"
                    :class="{ on: DisplayError, off: disabled || readonly, wa_color_sm: size === 'sm', open }"
                    :disabled="disabled || readonly"
                    :aria-labelledby="label ? `${FieldId}-label` : undefined" :aria-label="label ? undefined : ariaLabel"
                    :aria-invalid="DisplayError ? 'true' : undefined">
                    <span class="wa_color_swatch" :class="{ empty: !DisplayColor }"
                        :style="{ background: DisplayColor || 'transparent' }"></span>
                    <span class="wa_color_value" :class="{ wa_color_placeholder: !DisplayColor }">
                        {{ DisplayColor || placeholder }}
                    </span>
                    <AppIcon name="chevron" :size="14" class="wa_color_arrow" aria-hidden="true" />
                </button>
            </template>

            <template #default>
                <div class="wa_color_panel">
                    <div ref="AreaEl" class="wa_color_area" :style="AreaStyle" tabindex="0" role="group"
                        aria-label="颜色区域，方向键调整饱和度和明度" @keydown="OnAreaKeydown"
                        @pointerdown="StartDrag" @pointermove="OnDrag" @pointerup="StopDrag"
                        @pointercancel="StopDrag">
                        <span class="wa_color_area_thumb" :style="ThumbStyle"></span>
                    </div>

                    <input class="wa_color_hue" type="range" min="0" max="360" step="1" :value="Hsv.h"
                        aria-label="色相" @input="SetHue">

                    <div class="wa_color_modes" role="tablist" aria-label="颜色格式">
                        <button v-for="item in Modes" :key="item" type="button" role="tab"
                            class="wa_color_mode" :class="{ on: Mode === item }" :aria-selected="Mode === item"
                            @click="Mode = item">
                            {{ item.toUpperCase() }}
                        </button>
                    </div>

                    <div v-if="Mode === 'hex'" class="wa_color_inputs">
                        <input class="wa_color_input" type="text" :value="Hex" aria-label="HEX 颜色"
                            spellcheck="false" @change="OnHexChange">
                    </div>

                    <div v-else-if="Mode === 'rgb'" class="wa_color_inputs wa_color_inputs_three">
                        <label class="wa_color_field">
                            <span>R</span>
                            <input class="wa_color_input" type="number" min="0" max="255" :value="Rgb.r"
                                @change="OnRgbChange">
                        </label>
                        <label class="wa_color_field">
                            <span>G</span>
                            <input class="wa_color_input" type="number" min="0" max="255" :value="Rgb.g"
                                @change="OnRgbChange">
                        </label>
                        <label class="wa_color_field">
                            <span>B</span>
                            <input class="wa_color_input" type="number" min="0" max="255" :value="Rgb.b"
                                @change="OnRgbChange">
                        </label>
                    </div>

                    <div v-else class="wa_color_inputs wa_color_inputs_three">
                        <label class="wa_color_field">
                            <span>H</span>
                            <input class="wa_color_input" type="number" min="0" max="360" :value="Hsl.h"
                                @change="OnHslChange">
                        </label>
                        <label class="wa_color_field">
                            <span>S</span>
                            <input class="wa_color_input" type="number" min="0" max="100" :value="Hsl.s"
                                @change="OnHslChange">
                        </label>
                        <label class="wa_color_field">
                            <span>L</span>
                            <input class="wa_color_input" type="number" min="0" max="100" :value="Hsl.l"
                                @change="OnHslChange">
                        </label>
                    </div>

                    <div v-if="NormalizedPresets.length" class="wa_color_presets">
                        <button v-for="color in NormalizedPresets" :key="color" type="button" class="wa_color_preset"
                            :style="{ background: color }" :title="color" :aria-label="color"
                            @click="ChoosePreset(color)"></button>
                    </div>
                </div>
            </template>
        </AppPopover>

        <div class="wa_field_message" :class="{ show: Message }">
            <div class="wa_field_message_inner">
                <p v-if="MessageIsError" :id="ErrorId" class="wa_field_error">{{ MessageText }}</p>
                <p v-else :id="HintId" class="wa_field_hint">{{ MessageText }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, useId, watch } from 'vue'
import { useFieldMessage } from '../composables/useFieldMessage.js'
import { useValidation } from '../composables/useValidation.js'
import {
    formatColor,
    hslToRgb,
    hsvToRgb,
    parseColor,
    rgbToHex,
    rgbToHsl,
    rgbToHsv,
} from '../utils/color.js'
import { clamp } from '../utils/format.js'
import AppIcon from './AppIcon.vue'
import AppPopover from './AppPopover.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    modelValue: {
        type: String,
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
    placeholder: {
        type: String,
        default: '请选择颜色',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /**
     * 输出格式
     * @type {'hex' | 'rgb' | 'hsl'}
     */
    format: {
        type: String,
        default: 'hex',
    },
    /** 预设颜色，支持 HEX / RGB / HSL 字符串 */
    presets: {
        type: Array,
        default: () => [
            '#000000', '#ffffff', '#64748b', '#05cfa4',
            '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'
        ],
    },
    disabled: Boolean,
    readonly: Boolean,
    rule: {
        type: [Object, Array],
        default: null,
    },
    ariaLabel: {
        type: String,
        default: '颜色选择',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const FieldId = useId()
const HintId = `${FieldId}-hint`
const ErrorId = `${FieldId}-error`
const Modes = ['hex', 'rgb', 'hsl']

const PanelOpen = ref(false)
const Mode = ref(NormalizeMode(props.format))
const Hsv = ref({ h: 0, s: 0, v: 0 })
const HasInteracted = ref(false)
const AreaEl = ref(null)
const Dragging = ref(false)
let DragPointer = null

const { DisplayError, OnChange: ValidateChange } = useValidation(
    props,
    () => props.modelValue,
    { defaultTrigger: 'change' }
)

const Rgb = computed(() => hsvToRgb(Hsv.value.h, Hsv.value.s, Hsv.value.v))
const Hex = computed(() => rgbToHex(Rgb.value))
const Hsl = computed(() => rgbToHsl(Rgb.value))
const DisplayColor = computed(() => {
    if (!props.modelValue && !HasInteracted.value) return ''
    return formatColor(Rgb.value, Mode.value)
})
const AreaStyle = computed(() => ({
    backgroundColor: `hsl(${Hsv.value.h} 100% 50%)`
}))
const ThumbStyle = computed(() => ({
    left: `${Hsv.value.s * 100}%`,
    top: `${(1 - Hsv.value.v) * 100}%`
}))
const NormalizedPresets = computed(() => props.presets
    .map(color => parseColor(color))
    .filter(Boolean)
    .map(color => formatColor(color, Mode.value)))

const { Message, MessageText, MessageIsError } = useFieldMessage(
    () => DisplayError.value,
    () => props.hint
)

watch(() => props.format, value => {
    Mode.value = NormalizeMode(value)
})

let LastEmitted = null

watch(() => props.modelValue, value => {
    // ! 内部拖动会同步回写 v-model；再按 RGB 反推 HSV 会丢精度，
    // ! 纯黑/纯白附近还会把色相和饱和度抹掉，表现为拖点闪动
    if (value === LastEmitted) return

    const rgb = parseColor(value)
    if (rgb) {
        Hsv.value = rgbToHsv(rgb)
        HasInteracted.value = true
        return
    }

    if (!value) {
        Hsv.value = { h: 0, s: 0, v: 0 }
        HasInteracted.value = false
    }
}, { immediate: true })

function NormalizeMode(value) {
    return Modes.includes(value) ? value : 'hex'
}

function OnAreaKeydown(event) {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    if (!keys.includes(event.key) || props.disabled || props.readonly) return

    event.preventDefault()

    const step = event.shiftKey ? 0.05 : 0.01
    const hsv = { ...Hsv.value }

    if (event.key === 'ArrowLeft') hsv.s = Math.max(0, hsv.s - step)
    else if (event.key === 'ArrowRight') hsv.s = Math.min(1, hsv.s + step)
    else if (event.key === 'ArrowUp') hsv.v = Math.min(1, hsv.v + step)
    else if (event.key === 'ArrowDown') hsv.v = Math.max(0, hsv.v - step)

    Hsv.value = hsv
    EmitColor(hsvToRgb(hsv.h, hsv.s, hsv.v), true)
}

function EmitColor(rgb, preserveHsv = false) {
    // 色板拖到纯黑/纯白时，RGB 反推会丢失色相和饱和度；保留当前 HSV 才能让拖点停在原位置
    if (!preserveHsv) Hsv.value = rgbToHsv(rgb)
    HasInteracted.value = true
    const value = formatColor(rgb, Mode.value)
    LastEmitted = value
    emit('update:modelValue', value)
    emit('change', value)
    ValidateChange(value)
}

function UpdateArea(event) {
    const el = AreaEl.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1)
    const y = clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1)

    Hsv.value = { h: Hsv.value.h, s: x, v: 1 - y }
    EmitColor(hsvToRgb(Hsv.value.h, x, 1 - y), true)
}

function StartDrag(event) {
    if (props.disabled || props.readonly) return
    Dragging.value = true
    DragPointer = event.pointerId
    event.currentTarget.setPointerCapture?.(event.pointerId)
    UpdateArea(event)
}

function OnDrag(event) {
    if (!Dragging.value || event.pointerId !== DragPointer) return
    UpdateArea(event)
}

function StopDrag() {
    Dragging.value = false
    DragPointer = null
}

function SetHue(event) {
    const hue = Number(event.target.value) || 0
    Hsv.value = { ...Hsv.value, h: hue }
    EmitColor(hsvToRgb(hue, Hsv.value.s, Hsv.value.v), true)
}

function OnHexChange(event) {
    const rgb = parseColor(event.target.value)
    if (rgb) EmitColor(rgb)
    else event.target.value = Hex.value
}

function OnRgbChange(event) {
    const inputs = event.currentTarget.closest('.wa_color_inputs').querySelectorAll('.wa_color_input')
    const [r, g, b] = Array.from(inputs).map(input => clamp(Number(input.value) || 0, 0, 255))
    EmitColor({ r, g, b })
}

function OnHslChange(event) {
    const inputs = event.currentTarget.closest('.wa_color_inputs').querySelectorAll('.wa_color_input')
    const [h, s, l] = Array.from(inputs).map((input, index) => {
        const value = Number(input.value) || 0
        return index === 0 ? clamp(value, 0, 360) : clamp(value, 0, 100)
    })
    EmitColor(hslToRgb(h, s, l))
}

function ChoosePreset(color) {
    const rgb = parseColor(color)
    if (rgb) EmitColor(rgb)
}
</script>

<style>
.wa_color_trigger {
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
        opacity var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_color_trigger:hover:not(:disabled) {
    border-color: var(--wa_color_line_strong);
}

.wa_color_trigger.open,
.wa_color_trigger:focus-visible {
    border-color: var(--wa_color_text);
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.wa_color_trigger.on {
    border-color: var(--wa_color_danger);
}

.wa_color_trigger.off {
    opacity: .55;
    cursor: not-allowed;
}

.wa_color_sm {
    min-height: var(--wa_control_height_sm);
    padding: 0 var(--wa_space_2);
    font-size: 13px;
}

.wa_color_swatch {
    flex: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px var(--wa_color_line_strong);
}

.wa_color_swatch.empty {
    background-image:
        linear-gradient(45deg, var(--wa_color_line) 25%, transparent 25%),
        linear-gradient(-45deg, var(--wa_color_line) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--wa_color_line) 75%),
        linear-gradient(-45deg, transparent 75%, var(--wa_color_line) 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
}

.wa_color_placeholder {
    color: var(--wa_color_text_subtle);
}

.wa_color_value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.wa_color_arrow {
    flex: none;
    color: var(--wa_color_text_faint);
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_color_trigger.open .wa_color_arrow {
    transform: rotate(90deg);
}

.wa_color_panel {
    display: grid;
    gap: 10px;
    padding: 12px;
}

.wa_color_area {
    position: relative;
    height: 140px;
    border-radius: var(--wa_radius_sm);
    background-image:
        linear-gradient(to top, #000, transparent),
        linear-gradient(to right, #fff, transparent);
    cursor: crosshair;
    touch-action: none;
}

.wa_color_area:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_color_area_thumb {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #00000040, 0 2px 4px #00000026;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.wa_color_hue {
    width: 100%;
    height: 10px;
    margin: 0;
    border-radius: var(--wa_radius_pill);
    background: linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
}

.wa_color_hue::-webkit-slider-thumb {
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: transparent;
    box-shadow: 0 0 0 1px #00000040;
    appearance: none;
}

.wa_color_hue::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: transparent;
    box-shadow: 0 0 0 1px #00000040;
}

.wa_color_modes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2px;
    padding: 2px;
    border-radius: var(--wa_radius_sm);
    background: var(--wa_color_soft);
}

.wa_color_mode {
    padding: 5px 0;
    border: 0;
    border-radius: calc(var(--wa_radius_sm) - 1px);
    color: var(--wa_color_text_subtle);
    background: transparent;
    font: inherit;
    font-size: 11px;
    cursor: pointer;
}

.wa_color_mode.on {
    color: var(--wa_color_text);
    background: var(--wa_color_dialog);
    box-shadow: var(--wa_shadow_thumb_soft);
}

.wa_color_inputs {
    display: grid;
    gap: 6px;
}

.wa_color_inputs_three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.wa_color_field {
    display: grid;
    gap: 2px;
    min-width: 0;
    font-size: 11px;
    color: var(--wa_color_text_subtle);
}

.wa_color_input {
    width: 100%;
    min-width: 0;
    height: 30px;
    padding: 0 8px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_sm);
    outline: 0;
    color: var(--wa_color_text);
    background: var(--wa_color_soft);
    font: inherit;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.wa_color_input:focus {
    border-color: var(--wa_color_text);
}

.wa_color_presets {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 5px;
}

.wa_color_preset {
    aspect-ratio: 1;
    padding: 0;
    border: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px var(--wa_color_line_strong);
    cursor: pointer;
}

.wa_color_preset:hover {
    transform: scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
    .wa_color_trigger,
    .wa_color_arrow {
        transition: none;
    }
}
</style>
