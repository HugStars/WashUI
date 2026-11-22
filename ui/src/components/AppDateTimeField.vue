<template>
    <div class="wa_field">
        <label v-if="label || $slots.label" class="wa_field_label" :id="`${FieldId}-label`">
            <slot name="label">{{ label }}</slot>
        </label>

        <AppPopover v-model:open="PanelOpen" placement="bottom-left" :width="PanelWidth" :gap="6" :padding="0"
            role="dialog" :aria-label="ariaLabel">
            <template #trigger="{ open }">
                <button :id="FieldId" type="button" class="wa_datetime"
                    :class="{ on: DisplayError, off: disabled || readonly, wa_datetime_sm: size === 'sm', open }"
                    :disabled="disabled || readonly" :aria-haspopup="'dialog'" :aria-expanded="open"
                    :aria-labelledby="label ? `${FieldId}-label` : undefined" :aria-label="label ? undefined : ariaLabel"
                    :aria-invalid="DisplayError ? 'true' : undefined">
                    <AppIcon :name="IconName" :size="15" class="wa_datetime_icon" aria-hidden="true" />
                    <span class="wa_datetime_value" :class="{ wa_datetime_placeholder: !DisplayValue }">
                        {{ DisplayValue || placeholder }}
                    </span>
                    <AppIcon name="chevron" :size="14" class="wa_datetime_arrow" aria-hidden="true" />
                </button>
            </template>

            <template #default="{ close }">
                <div class="wa_dt_panel">
                    <div v-if="mode !== 'time'" class="wa_dt_calendar">
                        <div class="wa_dt_calendar_head">
                            <button type="button" class="wa_dt_nav" aria-label="上个月" @click="MoveMonth(-1)">
                                <AppIcon name="chevron-left" :size="15" />
                            </button>
                            <span class="wa_dt_month">{{ MonthLabel }}</span>
                            <button type="button" class="wa_dt_nav" aria-label="下个月" @click="MoveMonth(1)">
                                <AppIcon name="chevron" :size="15" />
                            </button>
                        </div>

                        <div class="wa_dt_weekdays" aria-hidden="true">
                            <span v-for="day in Weekdays" :key="day">{{ day }}</span>
                        </div>

                        <div class="wa_dt_days">
                            <button v-for="item in CalendarDays" :key="item.key" type="button" class="wa_dt_day"
                                :class="{
                                    on: item.selected,
                                    muted: !item.current,
                                    today: item.today
                                }" :disabled="item.disabled" @click="ChooseDay(item)">
                                {{ item.day }}
                            </button>
                        </div>
                    </div>

                    <div v-if="mode !== 'date'" class="wa_dt_time">
                        <div class="wa_dt_select" :class="{ open: OpenTimeSelect === 'hour' }">
                            <button type="button" class="wa_dt_select_trigger" aria-label="小时"
                                @click.stop="ToggleTimeSelect('hour')">
                                <span>{{ padZero(DraftHour) }}</span>
                                <AppIcon name="chevron" :size="12" class="wa_dt_select_arrow" />
                            </button>
                            <div v-if="OpenTimeSelect === 'hour'" class="wa_dt_select_menu">
                                <button v-for="hour in Hours" :key="hour" type="button" class="wa_dt_select_item"
                                    :class="{ on: hour === DraftHour }" :disabled="IsHourDisabled(hour)"
                                    @click="PickHour(hour)">
                                    {{ padZero(hour) }}
                                </button>
                            </div>
                        </div>

                        <span class="wa_dt_time_sep">:</span>

                        <div class="wa_dt_select" :class="{ open: OpenTimeSelect === 'minute' }">
                            <button type="button" class="wa_dt_select_trigger" aria-label="分钟"
                                @click.stop="ToggleTimeSelect('minute')">
                                <span>{{ padZero(DraftMinute) }}</span>
                                <AppIcon name="chevron" :size="12" class="wa_dt_select_arrow" />
                            </button>
                            <div v-if="OpenTimeSelect === 'minute'" class="wa_dt_select_menu">
                                <button v-for="minute in Minutes" :key="minute" type="button" class="wa_dt_select_item"
                                    :class="{ on: minute === DraftMinute }" :disabled="IsMinuteDisabled(minute)"
                                    @click="PickMinute(minute)">
                                    {{ padZero(minute) }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="QuickItems.length" class="wa_dt_quick">
                        <AppChip v-for="item in QuickItems" :key="item.label" size="sm" frosted
                            @click="ApplyQuick(item, close)">
                            {{ item.label }}
                        </AppChip>
                    </div>

                    <div class="wa_dt_footer">
                        <span class="wa_dt_hint">{{ FooterHint }}</span>
                        <AppButton v-if="mode !== 'date'" size="sm" variant="primary" @click="Confirm(close)">
                            确定
                        </AppButton>
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
import { formatDate, padZero } from '../utils/format.js'
import AppButton from './AppButton.vue'
import AppChip from './AppChip.vue'
import AppIcon from './AppIcon.vue'
import AppPopover from './AppPopover.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    /**
     * date：日期；time：时间；datetime：日期时间
     * @type {'date' | 'time' | 'datetime'}
     */
    mode: {
        type: String,
        default: 'date',
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
        default: '请选择',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    /** 最小可选日期，YYYY-MM-DD；datetime 模式取日期部分 */
    min: {
        type: String,
        default: '',
    },
    /** 最大可选日期，YYYY-MM-DD；datetime 模式取日期部分 */
    max: {
        type: String,
        default: '',
    },
    /** 分钟步长 */
    minuteStep: {
        type: Number,
        default: 5,
    },
    /**
     * 快捷选项：string 或 { label, value }；value 可以是函数
     * @type {Array<string | { label: string, value: string | Function }>}
     */
    quick: {
        type: Array,
        default: () => [],
    },
    disabled: Boolean,
    readonly: Boolean,
    /** 校验规则对象或数组；支持 required、min、max、pattern、validator、message、trigger */
    rule: {
        type: [Object, Array],
        default: null,
    },
    ariaLabel: {
        type: String,
        default: '日期时间选择',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const FieldId = useId()
const HintId = `${FieldId}-hint`
const ErrorId = `${FieldId}-error`

const Weekdays = ['一', '二', '三', '四', '五', '六', '日']
const Hours = Array.from({ length: 24 }, (_, index) => index)

const PanelOpen = ref(false)
const OpenTimeSelect = ref(null)
const PanelWidth = computed(() => props.mode === 'time' ? 240 : 300)
const ViewMonth = ref(StartOfMonth(ParseDate(props.modelValue) || new Date()))
const DraftDate = ref(ParseDate(props.modelValue) || new Date())
const DraftHour = ref(ParseTime(props.modelValue).hour)
const DraftMinute = ref(ParseTime(props.modelValue).minute)

const { DisplayError, OnInput: ValidateInput } = useValidation(
    props,
    () => props.modelValue,
    { defaultTrigger: 'change' }
)

const IconName = computed(() => props.mode === 'time' ? 'clock' : 'calendar')

const Minutes = computed(() => {
    const step = Math.max(1, Math.min(60, Number(props.minuteStep) || 5))
    return Array.from({ length: Math.ceil(60 / step) }, (_, index) => index * step)
})

const MinDate = computed(() => NormalizeDate(props.min))
const MaxDate = computed(() => NormalizeDate(props.max))

const MinTime = computed(() => NormalizeTime(props.min))
const MaxTime = computed(() => NormalizeTime(props.max))

const ActiveMinTime = computed(() => {
    if (!MinTime.value) return null
    if (props.mode === 'time') return MinTime.value
    if (props.mode === 'datetime' && formatDate(DraftDate.value, 'YYYY-MM-DD') === MinDate.value) return MinTime.value
    return null
})

const ActiveMaxTime = computed(() => {
    if (!MaxTime.value) return null
    if (props.mode === 'time') return MaxTime.value
    if (props.mode === 'datetime' && formatDate(DraftDate.value, 'YYYY-MM-DD') === MaxDate.value) return MaxTime.value
    return null
})

function IsHourDisabled(hour) {
    if (ActiveMinTime.value && hour < ActiveMinTime.value.hour) return true
    if (ActiveMaxTime.value && hour > ActiveMaxTime.value.hour) return true
    return false
}

function IsMinuteDisabled(minute) {
    const min = ActiveMinTime.value
    const max = ActiveMaxTime.value

    if (min && DraftHour.value === min.hour && minute < min.minute) return true
    if (max && DraftHour.value === max.hour && minute > max.minute) return true
    return false
}

const DisplayValue = computed(() => {
    if (!props.modelValue) return ''
    if (props.mode === 'time') return String(props.modelValue)
    if (props.mode === 'datetime') return String(props.modelValue).replace('T', ' ')
    return String(props.modelValue)
})

const MonthLabel = computed(() => `${ViewMonth.value.getFullYear()} 年 ${ViewMonth.value.getMonth() + 1} 月`)

const CalendarDays = computed(() => {
    const year = ViewMonth.value.getFullYear()
    const month = ViewMonth.value.getMonth()
    const first = new Date(year, month, 1)
    const offset = (first.getDay() + 6) % 7
    const start = new Date(year, month, 1 - offset)
    const selected = formatDate(DraftDate.value, 'YYYY-MM-DD')
    const today = formatDate(new Date(), 'YYYY-MM-DD')

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
        const value = formatDate(date, 'YYYY-MM-DD')

        return {
            key: value,
            date,
            day: date.getDate(),
            current: date.getMonth() === month,
            selected: value === selected,
            today: value === today,
            disabled: Boolean((MinDate.value && value < MinDate.value) || (MaxDate.value && value > MaxDate.value))
        }
    })
})

const FooterHint = computed(() => {
    if (props.mode === 'date') return '点击日期选择'
    if (props.mode === 'time') return '选择小时和分钟'
    return '选择日期与时间'
})

const QuickItems = computed(() => props.quick
    .map(item => {
        if (typeof item === 'string') return { label: item, value: item }
        if (!item || typeof item !== 'object') return null

        const value = item.value
        const label = item.label ?? (typeof value === 'string' ? value : '')
        return label ? { label, value } : null
    })
    .filter(Boolean))

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

onUnmounted(() => clearTimeout(MessageTimer))

watch(PanelOpen, open => {
    if (!open) {
        OpenTimeSelect.value = null
        return
    }

    const date = ParseDate(props.modelValue) || new Date()
    const time = ParseTime(props.modelValue)
    DraftDate.value = date
    DraftHour.value = time.hour
    DraftMinute.value = time.minute
    ViewMonth.value = StartOfMonth(date)
    OpenTimeSelect.value = null
})

function ToggleTimeSelect(type) {
    OpenTimeSelect.value = OpenTimeSelect.value === type ? null : type
}

function PickHour(hour) {
    if (IsHourDisabled(hour)) return
    DraftHour.value = hour
    OpenTimeSelect.value = null
}

function PickMinute(minute) {
    if (IsMinuteDisabled(minute)) return
    DraftMinute.value = minute
    OpenTimeSelect.value = null
}

function StartOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

function ParseDate(value) {
    if (!value || props.mode === 'time') return null
    const date = new Date(String(value).replace(' ', 'T'))
    return Number.isNaN(date.getTime()) ? null : date
}

function ParseTime(value) {
    if (!value) return { hour: new Date().getHours(), minute: new Date().getMinutes() }
    const match = String(value).match(/(\d{1,2}):(\d{2})/)
    if (!match) return { hour: 0, minute: 0 }
    return {
        hour: Math.min(23, Number(match[1])),
        minute: Math.min(59, Number(match[2]))
    }
}

function NormalizeDate(value) {
    const match = String(value || '').match(/^\d{4}-\d{2}-\d{2}/)
    return match ? match[0] : ''
}

function NormalizeTime(value) {
    const match = String(value || '').match(/(\d{1,2}):(\d{2})/)
    if (!match) return null
    return {
        hour: Math.min(23, Number(match[1])),
        minute: Math.min(59, Number(match[2]))
    }
}

function MoveMonth(offset) {
    ViewMonth.value = new Date(ViewMonth.value.getFullYear(), ViewMonth.value.getMonth() + offset, 1)
}

function DisplayForDraft() {
    const time = `${padZero(DraftHour.value)}:${padZero(DraftMinute.value)}`

    if (props.mode === 'time') return time
    const date = formatDate(DraftDate.value, 'YYYY-MM-DD')
    return props.mode === 'datetime' ? `${date}T${time}` : date
}

function EmitValue(value, close) {
    emit('update:modelValue', value)
    emit('change', value)
    ValidateInput(value)
    close()
}

function ChooseDay(item) {
    if (item.disabled) return

    DraftDate.value = item.date
    if (props.mode === 'date') {
        EmitValue(formatDate(item.date, 'YYYY-MM-DD'), ClosePanel)
        return
    }

    ViewMonth.value = StartOfMonth(item.date)
}

function Confirm(close) {
    EmitValue(DisplayForDraft(), close)
}

function ApplyQuick(item, close) {
    const value = typeof item.value === 'function' ? item.value() : item.value
    if (value === undefined || value === null) return
    EmitValue(value, close)
}

function ClosePanel() {
    PanelOpen.value = false
}
</script>

<style>
.wa_datetime {
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

.wa_datetime:hover:not(:disabled) {
    border-color: var(--wa_color_line_strong);
}

.wa_datetime.open,
.wa_datetime:focus-visible {
    border-color: var(--wa_color_text);
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.wa_datetime.on {
    border-color: var(--wa_color_danger);
}

.wa_datetime.off {
    opacity: .55;
    cursor: not-allowed;
}

.wa_datetime_sm {
    min-height: var(--wa_control_height_sm);
    padding: 0 var(--wa_space_2);
    font-size: 13px;
}

.wa_datetime_icon {
    flex: none;
    color: var(--wa_color_text_faint);
}

.wa_datetime_value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_datetime_placeholder {
    color: var(--wa_color_text_subtle);
}

.wa_datetime_arrow {
    flex: none;
    color: var(--wa_color_text_faint);
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_datetime.open .wa_datetime_arrow {
    transform: rotate(90deg);
}

.wa_dt_panel {
    display: grid;
    gap: 10px;
    padding: 12px;
}

.wa_dt_calendar {
    display: grid;
    gap: 6px;
}

.wa_dt_calendar_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.wa_dt_month {
    font-size: 13px;
    font-weight: 600;
    color: var(--wa_color_text);
}

.wa_dt_nav {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: var(--wa_radius_sm);
    color: var(--wa_color_text_subtle);
    background: transparent;
    cursor: pointer;
}

.wa_dt_nav:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_dt_weekdays,
.wa_dt_days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
}

.wa_dt_weekdays span {
    padding: 2px 0;
    font-size: 11px;
    color: var(--wa_color_text_faint);
    text-align: center;
}

.wa_dt_day {
    display: grid;
    place-items: center;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: var(--wa_radius_sm);
    color: var(--wa_color_text);
    background: transparent;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_dt_day:hover:not(:disabled) {
    background: var(--wa_color_hover);
}

.wa_dt_day.muted {
    color: var(--wa_color_text_faint);
}

.wa_dt_day.today {
    box-shadow: inset 0 0 0 1px var(--wa_color_line_strong);
}

.wa_dt_day.on,
.wa_dt_day.on:hover:not(:disabled) {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
    font-weight: 600;
}

.wa_dt_day:disabled {
    opacity: .3;
    cursor: not-allowed;
}

.wa_dt_time {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 0;
}

.wa_dt_select {
    position: relative;
    flex: 1;
    min-width: 0;
}

.wa_dt_select_trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    width: 100%;
    height: 32px;
    padding: 0 8px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_sm);
    color: var(--wa_color_text);
    background: var(--wa_color_soft);
    font: inherit;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition:
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_dt_select_trigger:hover,
.wa_dt_select.open .wa_dt_select_trigger {
    border-color: var(--wa_color_line_strong);
    background: var(--wa_color_hover);
}

.wa_dt_select_arrow {
    flex: none;
    color: var(--wa_color_text_faint);
    transform: rotate(90deg);
    transition: transform var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_dt_select.open .wa_dt_select_arrow {
    transform: rotate(-90deg);
}

.wa_dt_select_menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1;
    display: grid;
    width: 100%;
    max-height: 168px;
    overflow-y: auto;
    padding: 3px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_sm);
    background: var(--wa_color_dialog);
    box-shadow: var(--wa_shadow_nav);
    scrollbar-width: thin;
}

.wa_dt_select_item {
    padding: 5px 0;
    border: 0;
    border-radius: var(--wa_radius_sm);
    color: var(--wa_color_text_muted);
    background: transparent;
    font: inherit;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
}

.wa_dt_select_item:hover:not(:disabled) {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_dt_select_item.on,
.wa_dt_select_item.on:hover:not(:disabled) {
    color: var(--wa_color_on_highlight);
    background: var(--wa_color_highlight);
}

.wa_dt_select_item:disabled {
    opacity: .3;
    cursor: not-allowed;
}

.wa_dt_quick {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.wa_dt_footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-top: 2px;
}

.wa_dt_hint {
    font-size: 11px;
    color: var(--wa_color_text_faint);
}

@media (prefers-reduced-motion: reduce) {
    .wa_datetime,
    .wa_datetime_arrow,
    .wa_dt_day {
        transition: none;
    }
}
</style>
