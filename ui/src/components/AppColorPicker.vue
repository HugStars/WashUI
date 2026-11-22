<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :id="`${FieldId}-label`">
            <slot name="label">{{ label }}</slot>
        </label>

        <AppPopover v-model:open="PanelOpen" placement="bottom-left" :width="268" :gap="6" :padding="0"
            role="dialog" :aria-label="ariaLabel">
            <template #trigger="{ open }">
                <button :id="FieldId" type="button" class="wa_color_trigger"
                    :class="{ on: DisplayError, off: disabled || readonly, wa_color_sm: size === 'sm', open }"
                    :disabled="disabled || readonly" :aria-haspopup="'dialog'" :aria-expanded="open"
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
                    <div ref="AreaEl" class="wa_color_area" :style="AreaStyle" @pointerdown="StartDrag"
                        @pointermove="OnDrag" @pointerup="StopDrag" @pointercancel="StopDrag">
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
import { computed, onUnmounted, ref, useId, watch } from 'vue'
import { useValidation } from '../composables/useValidation.js'
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

const { DisplayError, OnInput: ValidateInput } = useValidation(
    props,
    () => props.modelValue,
    { defaultTrigger: 'change' }
)

const Rgb = computed(() => HsvToRgb(Hsv.value.h, Hsv.value.s, Hsv.value.v))
const Hex = computed(() => RgbToHex(Rgb.value))
const Hsl = computed(() => RgbToHsl(Rgb.value))
const DisplayColor = computed(() => {
    if (!props.modelValue && !HasInteracted.value) return ''
    return FormatColor(Rgb.value, Mode.value)
})
const AreaStyle = computed(() => ({
    backgroundColor: `hsl(${Hsv.value.h} 100% 50%)`
}))
const ThumbStyle = computed(() => ({
    left: `${Hsv.value.s * 100}%`,
    top: `${(1 - Hsv.value.v) * 100}%`
}))
const NormalizedPresets = computed(() => props.presets
    .map(color => ParseColor(color))
    .filter(Boolean)
    .map(color => FormatColor(color, Mode.value)))

const Message = computed(() => Boolean(DisplayError.value || props.hint))
const MessageText = ref('')
const MessageIsError = ref(false)
let MessageTimer = 0

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

watch(() => props.format, value => {
    Mode.value = NormalizeMode(value)
})

watch(() => props.modelValue, value => {
    const rgb = ParseColor(value)
    if (rgb) {
        Hsv.value = RgbToHsv(rgb)
        HasInteracted.value = true
    }
}, { immediate: true })

onUnmounted(() => clearTimeout(MessageTimer))

function NormalizeMode(value) {
    return Modes.includes(value) ? value : 'hex'
}

function Clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

function ParseColor(input) {
    const value = String(input || '').trim().toLowerCase()

    let match = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/)
    if (match) {
        const hex = match[1].length === 3
            ? match[1].split('').map(char => char + char).join('')
            : match[1]
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16)
        }
    }

    match = value.match(/^rgba?\(([^)]+)\)$/)
    if (match) {
        const parts = match[1].split(/[, ]+/).map(Number)
        if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
            return {
                r: Clamp(parts[0], 0, 255),
                g: Clamp(parts[1], 0, 255),
                b: Clamp(parts[2], 0, 255)
            }
        }
    }

    match = value.match(/^hsla?\(([^)]+)\)$/)
    if (match) {
        const parts = match[1].split(/[, ]+/)
        const h = Number(parts[0])
        const s = Number(parts[1])
        const l = Number(parts[2])
        if ([h, s, l].every(Number.isFinite)) return HslToRgb(h, s, l)
    }

    return null
}

function RgbToHex(rgb) {
    return '#' + [rgb.r, rgb.g, rgb.b]
        .map(value => Math.round(Clamp(value, 0, 255)).toString(16).padStart(2, '0'))
        .join('')
}

function RgbToHsv(rgb) {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let h = 0

    if (delta) {
        if (max === r) h = 60 * (((g - b) / delta) % 6)
        else if (max === g) h = 60 * ((b - r) / delta + 2)
        else h = 60 * ((r - g) / delta + 4)
    }

    return { h: (h + 360) % 360, s: max ? delta / max : 0, v: max }
}

function HsvToRgb(h, s, v) {
    const c = v * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = v - c
    let r = 0
    let g = 0
    let b = 0

    if (h < 60) [r, g, b] = [c, x, 0]
    else if (h < 120) [r, g, b] = [x, c, 0]
    else if (h < 180) [r, g, b] = [0, c, x]
    else if (h < 240) [r, g, b] = [0, x, c]
    else if (h < 300) [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    }
}

function RgbToHsl(rgb) {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let h = 0

    if (delta) {
        if (max === r) h = 60 * (((g - b) / delta) % 6)
        else if (max === g) h = 60 * ((b - r) / delta + 2)
        else h = 60 * ((r - g) / delta + 4)
    }

    const l = (max + min) / 2
    const s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0

    return {
        h: Math.round((h + 360) % 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    }
}

function HslToRgb(h, s, l) {
    const saturation = Clamp(s, 0, 100) / 100
    const lightness = Clamp(l, 0, 100) / 100
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation
    const x = c * (1 - Math.abs(((h % 360) / 60) % 2 - 1))
    const m = lightness - c / 2
    let r = 0
    let g = 0
    let b = 0

    const hue = ((h % 360) + 360) % 360
    if (hue < 60) [r, g, b] = [c, x, 0]
    else if (hue < 120) [r, g, b] = [x, c, 0]
    else if (hue < 180) [r, g, b] = [0, c, x]
    else if (hue < 240) [r, g, b] = [0, x, c]
    else if (hue < 300) [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    }
}

function FormatColor(rgb, mode) {
    if (!rgb) return ''
    if (mode === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    if (mode === 'hsl') {
        const hsl = RgbToHsl(rgb)
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
    return RgbToHex(rgb)
}

function EmitColor(rgb) {
    Hsv.value = RgbToHsv(rgb)
    HasInteracted.value = true
    const value = FormatColor(rgb, Mode.value)
    emit('update:modelValue', value)
    emit('change', value)
    ValidateInput(value)
}

function UpdateArea(event) {
    const el = AreaEl.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = Clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1)
    const y = Clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1)

    Hsv.value = { h: Hsv.value.h, s: x, v: 1 - y }
    EmitColor(HsvToRgb(Hsv.value.h, x, 1 - y))
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
    EmitColor(HsvToRgb(hue, Hsv.value.s, Hsv.value.v))
}

function OnHexChange(event) {
    const rgb = ParseColor(event.target.value)
    if (rgb) EmitColor(rgb)
    else event.target.value = Hex.value
}

function OnRgbChange(event) {
    const inputs = event.currentTarget.closest('.wa_color_inputs').querySelectorAll('.wa_color_input')
    const [r, g, b] = Array.from(inputs).map(input => Clamp(Number(input.value) || 0, 0, 255))
    EmitColor({ r, g, b })
}

function OnHslChange(event) {
    const inputs = event.currentTarget.closest('.wa_color_inputs').querySelectorAll('.wa_color_input')
    const [h, s, l] = Array.from(inputs).map((input, index) => {
        const value = Number(input.value) || 0
        return index === 0 ? Clamp(value, 0, 360) : Clamp(value, 0, 100)
    })
    EmitColor(HslToRgb(h, s, l))
}

function ChoosePreset(color) {
    const rgb = ParseColor(color)
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
