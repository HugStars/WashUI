<template>
    <div class="wa_field">
        <span v-if="label" class="wa_field_label">{{ label }}</span>
        <button type="button" class="wa_upload_zone" :class="{ on: Dragging, off: disabled }" :disabled="disabled"
            @click="Open" @dragenter.prevent="Dragging = true" @dragover.prevent="Dragging = true"
            @dragleave.prevent="Dragging = false" @drop.prevent="OnDrop">
            <AppIcon name="upload" :size="24" />
            <span class="wa_upload_title">{{ Dragging ? '松开即可添加' : '点击选择或拖拽文件到这里' }}</span>
            <span class="wa_upload_rule">{{ HintText }}</span>
        </button>
        <input ref="InputEl" class="wa_upload_input" type="file" :accept="accept" :multiple="multiple"
            :disabled="disabled" tabindex="-1" aria-hidden="true" @change="OnChange">
        <ul v-if="modelValue.length" class="wa_upload_list">
            <li v-for="(file, index) in modelValue" :key="`${file.name}-${file.size}-${index}`" class="wa_upload_item">
                <AppIcon name="file" :size="16" />
                <span class="wa_upload_name" :title="file.name">{{ file.name }}</span>
                <span class="wa_upload_size">{{ formatBytes(file.size) }}</span>
                <button type="button" class="wa_upload_remove" aria-label="移除文件" :disabled="disabled"
                    @click="Remove(index)">
                    <AppIcon name="close" :size="14" />
                </button>
            </li>
        </ul>
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
