<template>
    <tbody>
        <template v-if="loading">
            <tr v-for="row in Math.max(1, loadingRows)" :key="`loading-${row}`"
                class="wa_table_tr wa_table_loading_row" aria-hidden="true">
                <td v-if="selectable"
                    class="wa_table_td wa_table_select wa_table_sticky wa_table_sticky_left"
                    :class="{ wa_table_sticky_edge_left: selectIsLeftEdge }" :style="{ left: '0px' }">
                    <AppSkeleton :width="16" :height="16" radius="5px" />
                </td>
                <td v-for="(column, index) in columns" :key="column.key" class="wa_table_td"
                    :class="columnClass(column)" :style="columnStyle(column)">
                    <AppSkeleton :width="skeletonWidth(index)" :height="12" />
                </td>
            </tr>
        </template>

        <tr v-else-if="!rows.length" class="wa_table_empty_row">
            <td :colspan="colSpan" class="wa_table_td wa_table_empty_cell">
                <slot name="empty">
                    <AppEmpty class="wa_table_empty" :text="emptyText" />
                </slot>
            </td>
        </tr>

        <template v-else>
            <tr v-for="(row, index) in rows" :key="getRowKey(row, originalIndex(row, index))"
                class="wa_table_tr"
                :class="[getRowClass(row, index), { on: isRowSelected(row, originalIndex(row, index)) }]"
                @click="handleRowClick(row, index, $event)">
                <td v-if="selectable"
                    class="wa_table_td wa_table_select wa_table_sticky wa_table_sticky_left"
                    :class="{ wa_table_sticky_edge_left: selectIsLeftEdge }" :style="{ left: '0px' }"
                    @click.stop>
                    <AppCheck :model-value="isRowSelected(row, originalIndex(row, index))"
                        :disabled="!isRowSelectable(row, originalIndex(row, index))"
                        :aria-label="`选择第 ${index + 1} 行`"
                        @update:model-value="toggleRow(row, originalIndex(row, index))" />
                </td>

                <td v-for="column in columns" :key="column.key" class="wa_table_td"
                    :class="columnClass(column)" :style="columnStyle(column)"
                    @click="handleCellClick(row, column, index, $event)">
                    <AppTooltip v-if="column.tooltip" fill placement="bottom"
                        :content="getTooltipText(row, column, index)">
                        <slot :name="`cell-${column.key}`" :row="row" :column="column"
                            :value="getValue(row, column)" :index="index">
                            {{ formatCell(row, column, index) }}
                        </slot>
                    </AppTooltip>
                    <slot v-else :name="`cell-${column.key}`" :row="row" :column="column"
                        :value="getValue(row, column)" :index="index">
                        {{ formatCell(row, column, index) }}
                    </slot>
                </td>
            </tr>
        </template>
    </tbody>
</template>

<script setup>
import AppCheck from '../AppCheck.vue'
import AppEmpty from '../AppEmpty.vue'
import AppSkeleton from '../AppSkeleton.vue'
import AppTooltip from '../AppTooltip.vue'

// section 表体
// * 固定表头视图与普通视图共用同一份 tbody；行选择、排序后的索引与插槽都由父组件提供
// ! index 是排序后的展示索引，originalIndex 才是选择/rowKey 使用的原始索引，两者不能混用
// ! 动态插槽名必须和 AppTable 透传的 cell-* / empty 键一致
defineProps({
    columns: {
        type: Array,
        default: () => [],
    },
    rows: {
        type: Array,
        default: () => [],
    },
    loading: Boolean,
    loadingRows: {
        type: Number,
        default: 5,
    },
    selectable: Boolean,
    emptyText: {
        type: String,
        default: '暂无数据',
    },
    colSpan: {
        type: Number,
        default: 1,
    },
    selectIsLeftEdge: Boolean,
    getRowKey: {
        type: Function,
        required: true,
    },
    originalIndex: {
        type: Function,
        required: true,
    },
    getRowClass: {
        type: Function,
        required: true,
    },
    isRowSelected: {
        type: Function,
        required: true,
    },
    isRowSelectable: {
        type: Function,
        required: true,
    },
    toggleRow: {
        type: Function,
        required: true,
    },
    columnClass: {
        type: Function,
        required: true,
    },
    columnStyle: {
        type: Function,
        required: true,
    },
    formatCell: {
        type: Function,
        required: true,
    },
    getValue: {
        type: Function,
        required: true,
    },
    getTooltipText: {
        type: Function,
        required: true,
    },
    skeletonWidth: {
        type: Function,
        required: true,
    },
    // ! 用 handleXxx 而不是 onXxx，避免 Vue 把它当成事件监听器
    handleRowClick: {
        type: Function,
        required: true,
    },
    handleCellClick: {
        type: Function,
        required: true,
    },
})
</script>
