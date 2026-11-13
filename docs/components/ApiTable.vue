<template>
    <div class="doc_api">
        <h3 v-if="title" class="doc_api_title">{{ title }}</h3>
        <AppTable :columns="tableColumns" :data="rows" :row-key="RowKey" transparent>
            <template #cell-name="{ value }">
                <AppTag mono :text="value ?? '—'" :expand="false" />
            </template>
            <template #cell-type="{ value }">
                <AppTag mono :text="value ?? '—'" :expand="false" />
            </template>
            <template #cell-default="{ value }">
                <AppTag mono :text="value ?? '—'" :expand="false" />
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
            { key: 'name', title: '事件', minWidth: 160 },
            { key: 'type', title: '参数', minWidth: 180 },
            { key: 'desc', title: '说明', minWidth: 280 },
        ]
    }
    if (props.kind === 'slots') {
        return [
            { key: 'name', title: '插槽', minWidth: 150 },
            { key: 'type', title: '参数', minWidth: 170 },
            { key: 'desc', title: '说明', minWidth: 280 },
        ]
    }
    if (props.kind === 'values') {
        return [
            { key: 'name', title: '值', minWidth: 160 },
            { key: 'desc', title: '说明', minWidth: 380 },
        ]
    }
    return [
        { key: 'name', title: '属性', minWidth: 150 },
        { key: 'type', title: '类型', minWidth: 170 },
        { key: 'default', title: '默认值', minWidth: 130 },
        { key: 'desc', title: '说明', minWidth: 300 },
    ]
})

function RowKey(row, index) {
    return index
}
</script>

<style>
.doc_api {
    min-width: 0;
    padding-top: 18px;
    overflow-x: auto;
}

.doc_api + .doc_api {
    padding-top: 18px;
}

.doc_api_title {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--wa_color_text_muted);
}
</style>
