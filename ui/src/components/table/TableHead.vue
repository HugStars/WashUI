<template>
    <thead>
        <tr>
            <th v-if="selectable" scope="col"
                class="wa_table_th wa_table_select wa_table_sticky wa_table_sticky_left"
                :class="{ wa_table_sticky_edge_left: selectIsLeftEdge }" :style="{ left: '0px' }">
                <AppCheck :model-value="allSelected" :indeterminate="partiallySelected"
                    :disabled="selectAllDisabled" aria-label="全选当前页" @update:model-value="toggleAll" />
            </th>

            <th v-for="column in columns" :key="column.key" scope="col" class="wa_table_th"
                :class="headerClass(column)" :style="columnStyle(column)" :aria-sort="sortAria(column)">
                <button v-if="column.sortable" type="button" class="wa_table_sort" @click="toggleSort(column)">
                    <span class="wa_table_sort_label">
                        <slot :name="`header-${column.key}`" :column="column">{{ column.title }}</slot>
                    </span>
                    <span class="wa_table_sort_icons" aria-hidden="true">
                        <svg class="wa_table_sort_arrow" :class="{ on: isSortActive(column, 'asc') }"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 15 6-6 6 6" />
                        </svg>
                        <svg class="wa_table_sort_arrow" :class="{ on: isSortActive(column, 'desc') }"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </span>
                </button>
                <template v-else>
                    <slot :name="`header-${column.key}`" :column="column">{{ column.title }}</slot>
                </template>
            </th>
        </tr>
    </thead>
</template>

<script setup>
import AppCheck from '../AppCheck.vue'

// section 表头
// * 固定表头视图与普通视图共用同一份 thead；排序、全选和固定列通过父组件函数调用
// ! 动态插槽名必须和 AppTable 透传的 header-* 键一致，否则自定义表头会退回 column.title
defineProps({
    columns: {
        type: Array,
        default: () => [],
    },
    selectable: Boolean,
    allSelected: Boolean,
    partiallySelected: Boolean,
    selectAllDisabled: Boolean,
    selectIsLeftEdge: Boolean,
    headerClass: {
        type: Function,
        required: true,
    },
    columnStyle: {
        type: Function,
        required: true,
    },
    // ! 不要命名为 ariaSort，避免和原生 aria-sort 属性混淆
    sortAria: {
        type: Function,
        required: true,
    },
    isSortActive: {
        type: Function,
        required: true,
    },
    toggleSort: {
        type: Function,
        required: true,
    },
    toggleAll: {
        type: Function,
        required: true,
    },
})
</script>
