<template>
    <colgroup>
        <col v-if="selectable" class="wa_table_col_select" />
        <col v-for="column in columns" :key="column.key" :style="columnWidthStyle(column)" />
    </colgroup>
</template>

<script setup>
// section 表格列宽占位
// * 固定表头视图和普通视图共用，避免三处 colgroup 各写一份
defineProps({
    columns: {
        type: Array,
        default: () => [],
    },
    selectable: Boolean,
    columnWidthStyle: {
        type: Function,
        required: true,
    },
})
</script>
