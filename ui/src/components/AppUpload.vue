<template>
    <div class="wa_field">
        <span v-if="label" class="wa_field_label">{{ label }}</span>
        <button type="button" class="wa_upload_zone" :class="{ on: Dragging, off: disabled }" :disabled="disabled"
            @click="Open" @dragenter.prevent="Dragging = true" @dragover.prevent="Dragging = true"
            @dragleave.prevent="OnDragLeave" @drop.prevent="OnDrop">
            <AppIcon name="upload" :size="24" />
            <span class="wa_upload_title">{{ Dragging ? '松开即可添加' : '点击选择或拖拽文件到这里' }}</span>
            <span class="wa_upload_rule">{{ HintText }}</span>
        </button>
        <input ref="InputEl" class="wa_upload_input" type="file" :accept="accept" :multiple="multiple"
            :disabled="disabled" tabindex="-1" aria-hidden="true" @change="OnChange">
        <TransitionGroup tag="ul" class="wa_upload_list" :class="{ wa_upload_list_show: modelValue.length }"
            name="wa_upload" appear>
            <li v-for="(file, index) in modelValue" :key="FileKey(file, index)" class="wa_upload_item">
                <AppIcon name="file" :size="16" />
                <span class="wa_upload_name" :title="file.name">{{ file.name }}</span>
                <span class="wa_upload_size">{{ formatBytes(file.size) }}</span>
                <button type="button" class="wa_upload_remove" aria-label="移除文件" :disabled="disabled"
                    @click="Remove(index)">
                    <AppIcon name="close" :size="14" />
                </button>
            </li>
        </TransitionGroup>
        <p v-if="error" class="wa_field_error">{{ error }}</p>
        <p v-else-if="hint" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { formatBytes } from '../utils/format.js'

const props = defineProps({
    modelValue: {
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
    accept: {
        type: String,
        default: '',
    },
    multiple: Boolean,
    maxSize: {
        type: Number,
        default: 0,
    },
    maxCount: {
        type: Number,
        default: 0,
    },
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'change', 'reject', 'remove'])

const InputEl = ref(null)
const Dragging = ref(false)
const FileKeys = new WeakMap()
let FileKeySeed = 0

function FileKey(file, index) {
    if (file && typeof file === 'object') {
        if (!FileKeys.has(file)) FileKeys.set(file, ++FileKeySeed)
        return FileKeys.get(file)
    }
    return `${index}-${file}`
}

const HintText = computed(() => {
    const list = []
    if (props.accept) list.push(`类型：${props.accept}`)
    if (props.maxSize) list.push(`单个不超过 ${formatBytes(props.maxSize)}`)
    if (props.maxCount) list.push(`最多 ${props.maxCount} 个`)
    return list.join(' · ') || '支持单个或批量文件'
})

function Open() {
    if (!props.disabled) InputEl.value?.click()
}

function OnChange(event) {
    Add(event.target.files)
    event.target.value = ''
}

// dragleave 会从子元素冒泡，只有真正离开上传区才取消高亮
function OnDragLeave(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return
    Dragging.value = false
}

function OnDrop(event) {
    Dragging.value = false
    Add(event.dataTransfer?.files)
}

function Add(files) {
    const incoming = files ? Array.from(files) : []
    if (!incoming.length) return

    const source = props.multiple ? incoming : incoming.slice(0, 1)
    const current = props.multiple ? [...props.modelValue] : []
    const accepted = []

    for (const file of source) {
        if (props.maxCount && current.length + accepted.length >= props.maxCount) {
            emit('reject', { file, reason: 'count' })
            continue
        }
        if (props.maxSize && file.size > props.maxSize) {
            emit('reject', { file, reason: 'size' })
            continue
        }
        if (!MatchesAccept(file)) {
            emit('reject', { file, reason: 'type' })
            continue
        }
        accepted.push(file)
    }

    if (!accepted.length) return

    const next = [...current, ...accepted]
    emit('update:modelValue', next)
    emit('change', next)
}

function MatchesAccept(file) {
    if (!props.accept) return true
    const type = file.type.toLowerCase()
    const name = file.name.toLowerCase()
    return props.accept.split(',').some(rule => {
        const value = rule.trim().toLowerCase()
        if (!value) return false
        if (value.startsWith('.')) return name.endsWith(value)
        if (value.endsWith('/*')) return type.startsWith(value.slice(0, -1))
        return type === value
    })
}

function Remove(index) {
    const next = props.modelValue.slice()
    const [file] = next.splice(index, 1)
    emit('update:modelValue', next)
    emit('change', next)
    emit('remove', file, index)
}
</script>

<style>
.wa_upload_zone:focus-visible,
.wa_upload_remove:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_upload_zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 22px 16px;
    border: 1px dashed var(--wa_color_line_strong);
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_subtle);
    background: var(--wa_color_soft);
    cursor: pointer;
    text-align: center;
    transition:
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_upload_zone:hover,
.wa_upload_zone.on {
    border-color: var(--wa_color_text);
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_upload_zone.on {
    transform: scale(1.005);
}

.wa_upload_zone.off {
    opacity: .55;
    cursor: not-allowed;
}

.wa_upload_zone>svg {
    color: var(--wa_color_text_muted);
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_upload_zone.on>svg {
    transform: translateY(-3px) scale(1.06);
}

.wa_upload_title {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--wa_color_text);
}

.wa_upload_rule {
    font-size: 12px;
    line-height: 1.5;
    color: var(--wa_color_text_subtle);
}

.wa_upload_input {
    display: none;
}

.wa_upload_list {
    position: relative;
    display: grid;
    gap: 6px;
    list-style: none;
}

.wa_upload_list_show {
    margin-top: 2px;
}

.wa_upload-enter-active,
.wa_upload-leave-active {
    transition:
        opacity var(--wa_duration_base) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_upload-enter-from {
    opacity: 0;
    transform: translateY(-4px) scale(.98);
}

.wa_upload-leave-to {
    opacity: 0;
    transform: translateX(10px);
}

.wa_upload-leave-active {
    position: absolute;
    left: 0;
    right: 0;
}

.wa_upload-move {
    transition: transform var(--wa_duration_base) var(--wa_ease_out);
}

.wa_upload_item {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--wa_color_soft);
    font-size: 12px;
}

.wa_upload_item>svg {
    flex: none;
    color: var(--wa_color_text_subtle);
}

.wa_upload_name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--wa_color_text_muted);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_upload_size {
    flex: none;
    color: var(--wa_color_text_subtle);
    font-variant-numeric: tabular-nums;
}

.wa_upload_remove {
    display: grid;
    flex: none;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: var(--wa_color_text_faint);
    background: transparent;
    cursor: pointer;
    transform-origin: center;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

.wa_upload_remove:hover {
    color: var(--wa_color_danger);
    background: var(--wa_color_danger_soft);
}

.wa_upload_remove:active:not(:disabled) {
    transform: scale(.86);
}

.wa_upload_remove:disabled {
    opacity: .4;
    cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
    .wa_upload_zone,
    .wa_upload_zone>svg,
    .wa_upload_remove,
    .wa_upload-enter-active,
    .wa_upload-leave-active,
    .wa_upload-move {
        transition: none;
    }

    .wa_upload_zone.on {
        transform: none;
    }

    .wa_upload_zone.on>svg,
    .wa_upload_remove:active:not(:disabled) {
        transform: none;
    }
}
</style>
