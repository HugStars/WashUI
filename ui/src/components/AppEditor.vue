<template>
    <div class="wa_field">
        <span v-if="label" :id="LabelId" class="wa_field_label">{{ label }}</span>
        <div class="wa_editor" :class="{ on: error, off: disabled || readonly }">
            <div class="wa_editor_tool" role="toolbar" aria-label="文本格式">
                <button v-for="item in Tools" :key="item.title" type="button" class="wa_editor_btn"
                    :class="{ on: item.state && Active[item.command] }" :title="item.title" :aria-label="item.title"
                    :aria-pressed="item.state ? Active[item.command] : undefined" :disabled="disabled || readonly"
                    @mousedown.prevent @click="Run(item)">
                    {{ item.label }}
                </button>
            </div>
            <div :id="EditorId" ref="EditorEl" class="wa_editor_body" :class="{ wa_editor_empty: Empty }"
                :style="BodyStyle" :contenteditable="disabled || readonly ? 'false' : 'true'"
                :data-placeholder="placeholder" :aria-labelledby="label ? LabelId : undefined"
                :aria-label="label ? undefined : '富文本编辑器'" :aria-describedby="DescribedBy"
                :aria-invalid="error ? 'true' : undefined" role="textbox" aria-multiline="true" @input="OnInput"></div>
        </div>
        <p v-if="error" :id="ErrorId" class="wa_field_error">{{ error }}</p>
        <p v-else-if="hint" :id="HintId" class="wa_field_hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, useId, watch } from 'vue'

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
        default: '输入内容...',
    },
    minHeight: {
        type: [Number, String],
        default: 180,
    },
    disabled: Boolean,
    readonly: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const Tools = [
    { command: 'bold', label: 'B', title: '加粗', state: true },
    { command: 'italic', label: 'I', title: '斜体', state: true },
    { command: 'underline', label: 'U', title: '下划线', state: true },
    { command: 'strikeThrough', label: 'S', title: '删除线', state: true },
    { command: 'formatBlock', label: 'H', title: '标题', value: 'h2' },
    { command: 'insertUnorderedList', label: '•', title: '无序列表', state: true },
    { command: 'insertOrderedList', label: '1.', title: '有序列表', state: true },
    { command: 'createLink', label: '链接', title: '插入链接' },
    { command: 'removeFormat', label: '清除', title: '清除格式' },
    { command: 'undo', label: '↶', title: '撤销' },
    { command: 'redo', label: '↷', title: '重做' },
]

const Active = reactive(Object.fromEntries(Tools.filter(item => item.state).map(item => [item.command, false])))
const EditorId = useId()
const LabelId = `${EditorId}-label`
const HintId = `${EditorId}-hint`
const ErrorId = `${EditorId}-error`
const EditorEl = ref(null)
const Empty = ref(true)
const DescribedBy = computed(() => (props.error ? ErrorId : props.hint ? HintId : undefined))
const BodyStyle = computed(() => ({
    minHeight: typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight,
}))

function SetContent(value) {
    const html = value || ''
    if (EditorEl.value && EditorEl.value.innerHTML !== html) EditorEl.value.innerHTML = html
    Empty.value = !(EditorEl.value?.textContent || '').trim()
}

function OnInput() {
    if (!EditorEl.value) return
    Empty.value = !EditorEl.value.textContent.trim()
    emit('update:modelValue', EditorEl.value.innerHTML)
}

function Run(item) {
    if (props.disabled || props.readonly) return

    let value = item.value
    if (item.command === 'createLink') {
        value = window.prompt('输入链接地址', 'https://')?.trim()
        if (!value) return
    }

    EditorEl.value?.focus()
    document.execCommand(item.command, false, value)
    OnInput()
}

function SyncActive() {
    if (!EditorEl.value || !EditorEl.value.contains(document.activeElement)) return
    for (const item of Tools) {
        if (!item.state) continue
        try {
            Active[item.command] = document.queryCommandState(item.command)
        } catch {
            Active[item.command] = false
        }
    }
}

onMounted(() => {
    SetContent(props.modelValue)
    document.addEventListener('selectionchange', SyncActive)
})

onUnmounted(() => {
    document.removeEventListener('selectionchange', SyncActive)
})

watch(() => props.modelValue, value => {
    if (document.activeElement === EditorEl.value) return
    SetContent(value)
})
</script>
