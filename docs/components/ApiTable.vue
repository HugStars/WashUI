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

<style>
.doc_api+.doc_api {
    margin-top: 18px;
}

.doc_api_title {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--wa_color_text_muted);
}

.doc_table_wrap {
    overflow-x: auto;
}

.doc_table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
}

.doc_table th {
    padding: 9px 12px;
    border-bottom: 1px solid var(--wa_color_line_strong);
    font-weight: 600;
    color: var(--wa_color_text_subtle);
    white-space: nowrap;
}

.doc_table td {
    padding: 9px 12px;
    border-bottom: 1px solid var(--wa_color_line);
    vertical-align: top;
    color: var(--wa_color_text_muted);
    line-height: 1.6;
}

.doc_table tr:last-child td {
    border-bottom: 0;
}

.doc_table code {
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--wa_color_soft);
    font: 12px var(--wa_font_mono);
    color: var(--wa_color_text);
    white-space: nowrap;
}
</style>
