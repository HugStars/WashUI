<template>
    <div class="doc_api">
        <h3 v-if="title" class="doc_api_title">{{ title }}</h3>
        <div class="doc_table_wrap">
            <table class="doc_table">
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in rows" :key="index">
                        <td v-for="column in columns" :key="column.key">
                            <code v-if="column.code">{{ row[column.key] ?? '—' }}</code>
                            <span v-else>{{ row[column.key] ?? '—' }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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

const columns = computed(() => {
    if (props.kind === 'events') {
        return [
            { key: 'name', label: '事件', code: true },
            { key: 'type', label: '参数', code: true },
            { key: 'desc', label: '说明' },
        ]
    }
    if (props.kind === 'slots') {
        return [
            { key: 'name', label: '插槽', code: true },
            { key: 'type', label: '参数', code: true },
            { key: 'desc', label: '说明' },
        ]
    }
    if (props.kind === 'values') {
        return [
            { key: 'name', label: '值', code: true },
            { key: 'desc', label: '说明' },
        ]
    }
    return [
        { key: 'name', label: '属性', code: true },
        { key: 'type', label: '类型', code: true },
        { key: 'default', label: '默认值', code: true },
        { key: 'desc', label: '说明' },
    ]
})
</script>
