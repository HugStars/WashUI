<template>
    <DocPage category="表单" name="AppUpload" title="上传" description="处理选择、拖拽、类型/大小/数量校验与文件列表，不发起上传请求。">
        <DemoBlock title="基础" description="modelValue 是 File[]；上传请求由业务层处理。">
            <AppUpload v-model="files" accept="image/*,.pdf" :max-size="2 * 1024 * 1024" :max-count="5"
                hint="支持图片与 PDF，最多 5 个" @change="onChange" @reject="onReject" />
            <p v-if="files.length" class="wa_hint doc_gap">已选择 {{ files.length }} 个文件。</p>
        </DemoBlock>

        <DemoBlock title="禁用" description="disabled 同时禁用选择区与移除按钮。">
            <AppUpload :model-value="[]" label="禁用上传" disabled />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const files = ref([])

function onChange(list) {
    toast.success(`已选择 ${list.length} 个文件`)
}

function onReject({ file, reason }) {
    const text = reason === 'size' ? '文件超过大小限制' : reason === 'count' ? '超过数量限制' : '文件类型不支持'
    toast.warning(`${file.name}：${text}`)
}

const propsRows = [
    { name: 'modelValue', type: 'File[]', default: '[]', desc: '已选文件' },
    { name: 'label', type: 'string', default: "''", desc: '标签文案' },
    { name: 'hint', type: 'string', default: "''", desc: '提示文案' },
    { name: 'error', type: 'string', default: "''", desc: '错误文案，优先于 hint' },
    { name: 'accept', type: 'string', default: "''", desc: '原生 accept，支持后缀、MIME 与 type/*' },
    { name: 'multiple', type: 'boolean', default: 'false', desc: '允许多选' },
    { name: 'maxSize', type: 'number', default: '0', desc: '单文件最大字节数，0 不限制' },
    { name: 'maxCount', type: 'number', default: '0', desc: '最大文件数，0 不限制' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'File[]', desc: '文件列表变化' },
    { name: 'change', type: 'File[]', desc: '添加或移除后触发' },
    { name: 'reject', type: '{ file, reason }', desc: '校验失败，reason 为 type / size / count' },
    { name: 'remove', type: 'file, index', desc: '移除文件' },
]
</script>
