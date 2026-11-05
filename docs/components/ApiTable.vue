<template>
    <div class="doc_api">
        <h3 v-if="title" class="doc_api_title">{{ title }}</h3>
        <AppTable :columns="tableColumns" :data="rows" :row-key="RowKey" fit-content transparent>
            <template #cell-name="{ value }">
                <AppTag :text="value ?? '—'" :expand="false" />
            </template>
            <template #cell-type="{ value }">
                <AppTag :text="value ?? '—'" :expand="false" />
            </template>
            <template #cell-default="{ value }">
                <AppTag :text="value ?? '—'" :expand="false" />
            </template>
        </AppTable>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    kind: {
        type: String,
        default: 'props',
    },
    rows: {
        type: Array,
        default: () => [],
    },
})

const tableColumns = computed(() => {
    if (props.kind === 'events') {
        return [
            { key: 'name', title: '事件' },
            { key: 'type', title: '参数' },
            { key: 'desc', title: '说明' },
        ]
    }
    if (props.kind === 'slots') {
        return [
            { key: 'name', title: '插槽' },
            { key: 'type', title: '参数' },
            { key: 'desc', title: '说明' },
        ]
    }
    if (props.kind === 'values') {
        return [
            { key: 'name', title: '值' },
            { key: 'desc', title: '说明' },
        ]
    }
    return [
        { key: 'name', title: '属性' },
        { key: 'type', title: '类型' },
        { key: 'default', title: '默认值' },
        { key: 'desc', title: '说明' },
    ]
})

function RowKey(row, index) {
    return index
}
</script>

<style>
.doc_api + .doc_api {
    margin-top: 18px;
}

.doc_api_title {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--wa_color_text_muted);
}
</style>
