<template>
    <div class="wa_table" :class="RootClass">
        <div v-if="$slots.toolbar" class="wa_table_toolbar">
            <slot name="toolbar" />
        </div>

        <div v-if="HasViewport" class="wa_table_viewport" :style="ViewportStyle">
            <div ref="HeadScrollEl" class="wa_table_head_scroll" :class="ShadowClass"
                :style="{ paddingRight: `${HeadPaddingRight}px` }">
                <table ref="HeadTableEl" class="wa_table_el wa_table_fixed wa_table_head_table">
                    <TableColgroup :columns="columns" :selectable="selectable"
                        :column-width-style="ColumnWidthStyle" />
                    <!-- * $slots 原样透传，header-* 才能命中 TableHead 里的动态插槽 -->
                    <TableHead :columns="columns" :selectable="selectable" :all-selected="AllSelected"
                        :partially-selected="PartiallySelected"
                        :select-all-disabled="!SelectableKeys.length || loading"
                        :select-is-left-edge="SelectIsLeftEdge" :header-class="HeaderClass"
                        :column-style="ColumnStyle" :is-sort-active="IsSortActive"
                        :toggle-sort="ToggleSort" :toggle-all="ToggleAll" :sort-aria="AriaSort">
                        <template v-for="(_, name) in $slots" #[name]="slotProps">
                            <slot :name="name" v-bind="slotProps || {}" />
                        </template>
                    </TableHead>
                </table>
            </div>

            <div ref="ScrollEl" class="wa_table_scroll wa_table_body_scroll" :class="ShadowClass"
                @scroll="OnBodyScroll">
                <table ref="TableEl" class="wa_table_el wa_table_fixed" :aria-label="ariaLabel"
                    :aria-busy="loading ? 'true' : undefined">
                    <TableColgroup :columns="columns" :selectable="selectable"
                        :column-width-style="ColumnWidthStyle" />
                    <!-- * cell-* 与 empty 插槽同样透传，否则自定义单元格会退回默认文本 -->
                    <TableBody :columns="columns" :rows="SortedData" :loading="loading"
                        :loading-rows="loadingRows" :selectable="selectable" :empty-text="emptyText"
                        :col-span="ColSpan" :select-is-left-edge="SelectIsLeftEdge"
                        :get-row-key="GetRowKey" :original-index="OriginalIndex"
                        :get-row-class="GetRowClass" :is-row-selected="IsRowSelected"
                        :is-row-selectable="IsRowSelectable" :toggle-row="ToggleRow"
                        :column-class="ColumnClass" :column-style="ColumnStyle"
                        :format-cell="FormatCell" :get-value="GetValue"
                        :get-tooltip-text="GetTooltipText" :skeleton-width="SkeletonWidth"
                        :handle-row-click="OnRowClick" :handle-cell-click="OnCellClick">
                        <template v-for="(_, name) in $slots" #[name]="slotProps">
                            <slot :name="name" v-bind="slotProps || {}" />
                        </template>
                    </TableBody>
                </table>
            </div>
        </div>

        <div v-else ref="ScrollEl" class="wa_table_scroll" :class="ScrollClass" :style="ScrollStyle"
            @scroll="UpdateScrollShadow">
            <table ref="TableEl" class="wa_table_el" :class="{ wa_table_fixed: IsFixedLayout }"
                :aria-label="ariaLabel" :aria-busy="loading ? 'true' : undefined">
                <TableColgroup :columns="columns" :selectable="selectable"
                    :column-width-style="ColumnWidthStyle" />
                <TableHead :columns="columns" :selectable="selectable" :all-selected="AllSelected"
                    :partially-selected="PartiallySelected"
                    :select-all-disabled="!SelectableKeys.length || loading"
                    :select-is-left-edge="SelectIsLeftEdge" :header-class="HeaderClass"
                    :column-style="ColumnStyle" :is-sort-active="IsSortActive"
                    :toggle-sort="ToggleSort" :toggle-all="ToggleAll" :sort-aria="AriaSort">
                    <template v-for="(_, name) in $slots" #[name]="slotProps">
                        <slot :name="name" v-bind="slotProps || {}" />
                    </template>
                </TableHead>

                <TableBody :columns="columns" :rows="SortedData" :loading="loading"
                    :loading-rows="loadingRows" :selectable="selectable" :empty-text="emptyText"
                    :col-span="ColSpan" :select-is-left-edge="SelectIsLeftEdge"
                    :get-row-key="GetRowKey" :original-index="OriginalIndex"
                    :get-row-class="GetRowClass" :is-row-selected="IsRowSelected"
                    :is-row-selectable="IsRowSelectable" :toggle-row="ToggleRow"
                    :column-class="ColumnClass" :column-style="ColumnStyle"
                    :format-cell="FormatCell" :get-value="GetValue"
                    :get-tooltip-text="GetTooltipText" :skeleton-width="SkeletonWidth"
                    :handle-row-click="OnRowClick" :handle-cell-click="OnCellClick">
                    <template v-for="(_, name) in $slots" #[name]="slotProps">
                        <slot :name="name" v-bind="slotProps || {}" />
                    </template>
                </TableBody>
            </table>
        </div>

        <div v-if="$slots.footer" class="wa_table_footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TableBody from './table/TableBody.vue'
import TableColgroup from './table/TableColgroup.vue'
import TableHead from './table/TableHead.vue'

// section 表格结构
// * 固定表头视图和普通视图只保留外层滚动容器差异，列宽、表头、表体统一复用 table 子组件
// - table/ 下的子组件仅供 AppTable 内部使用，不加入公共组件导出
// ! table / colgroup 的 ref 仍留在父组件，MeasureColumns 依赖 HeadTableEl 或 TableEl
// ! TableHead / TableBody 通过 $slots 原样透传插槽，header-* 和 cell-* 才能在子组件内命中

const SELECT_WIDTH = 48
const SKELETON_WIDTHS = ['72%', '54%', '86%', '64%', '78%', '48%']

const props = defineProps({
    /** { key, title, dataIndex?, width?, minWidth?, align?, fixed?, sortable?, ellipsis?, tooltip?, formatter?, class?, headerClass? } */
    columns: {
        type: Array,
        default: () => [],
    },
    data: {
        type: Array,
        default: () => [],
    },
    /** 行唯一键字段名或函数 */
    rowKey: {
        type: [String, Function],
        default: 'id',
    },
    loading: Boolean,
    loadingRows: {
        type: Number,
        default: 5,
    },
    emptyText: {
        type: String,
        default: '暂无数据',
    },
    /**
     * @type {'sm' | 'md'}
     */
    size: {
        type: String,
        default: 'sm',
    },
    stripe: Boolean,
    bordered: Boolean,
    /** 透明外观：去掉外框、圆角与表头底色，尺寸贴近文档表格 */
    transparent: Boolean,
    /** 表格宽度根据内容自适应，不铺满容器 */
    fitContent: Boolean,
    stickyHeader: Boolean,
    /** 固定高度（表头 + 表体），数字按 px 处理；设置后表头固定、表体独立滚动 */
    height: {
        type: [Number, String],
        default: null,
    },
    /** 最小高度（表头 + 表体），数字按 px 处理 */
    minHeight: {
        type: [Number, String],
        default: null,
    },
    /** 内容视口最大高度；数字按 px 处理 */
    maxHeight: {
        type: [Number, String],
        default: null,
    },
    /**
     * @type {'auto' | 'fixed'}
     */
    tableLayout: {
        type: String,
        default: 'auto',
    },
    selectable: Boolean,
    /** v-model:selectedKeys；不传时组件内部维护 */
    selectedKeys: {
        type: Array,
        default: undefined,
    },
    /** 返回 false 时该行不可选择 */
    selectableRow: {
        type: Function,
        default: null,
    },
    /** v-model:sort，形如 { key, order: 'asc' | 'desc' } */
    sort: {
        type: Object,
        default: undefined,
    },
    defaultSort: {
        type: Object,
        default: null,
    },
    rowClass: {
        type: [String, Function],
        default: null,
    },
    ariaLabel: {
        type: String,
        default: '数据表格',
    },
})

const emit = defineEmits([
    'update:selectedKeys',
    'update:sort',
    'select',
    'select-all',
    'sort-change',
    'row-click',
    'cell-click',
])

const ScrollEl = ref(null)
const HeadScrollEl = ref(null)
const TableEl = ref(null)
const HeadTableEl = ref(null)
const HeadPaddingRight = ref(0)
const MeasuredWidths = ref({})
const ShadowLeft = ref(false)
const ShadowRight = ref(false)

const InternalSort = ref(props.defaultSort ? { ...props.defaultSort } : null)
const InternalSelected = ref([])
const FlashRows = ref(false)

let FlashTimer = null
let FlashFrame = 0
const ReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

const SortState = computed(() => props.sort === undefined ? InternalSort.value : props.sort)
const SelectedKeys = computed(() => props.selectedKeys === undefined ? InternalSelected.value : props.selectedKeys)
const SelectedSet = computed(() => new Set(SelectedKeys.value || []))

const HasLeftFixed = computed(() => props.selectable || props.columns.some(column => column.fixed === 'left'))
const HasRightFixed = computed(() => props.columns.some(column => column.fixed === 'right'))
const SelectIsLeftEdge = computed(() => !props.columns.some(column => column.fixed === 'left'))
const ColSpan = computed(() => Math.max(1, props.columns.length + (props.selectable ? 1 : 0)))
const IsFixedLayout = computed(() => props.tableLayout === 'fixed' || HasLeftFixed.value || HasRightFixed.value)

const RootClass = computed(() => [
    `wa_table_${props.size}`,
    {
        wa_table_stripe: props.stripe,
        wa_table_bordered: props.bordered,
        wa_table_transparent: props.transparent,
        wa_table_fit: props.fitContent && !HasViewport.value,
        wa_table_loading: props.loading,
        wa_table_rows_flash: FlashRows.value,
    },
])

const ShadowClass = computed(() => ({
    wa_table_shadow_left: ShadowLeft.value,
    wa_table_shadow_right: ShadowRight.value,
}))

const ScrollClass = computed(() => ({
    ...ShadowClass.value,
    wa_table_sticky_header: props.stickyHeader && !HasViewport.value,
}))

const ViewportStyle = computed(() => {
    const style = {}
    const height = ToSize(props.height)
    const minHeight = ToSize(props.minHeight)
    const maxHeight = ToSize(props.maxHeight)
    if (height) style.height = height
    if (minHeight) style.minHeight = minHeight
    if (maxHeight) style.maxHeight = maxHeight
    return Object.keys(style).length ? style : undefined
})

// * 有 height / minHeight / maxHeight 时启用固定表头双 table 视图
const HasViewport = computed(() => Boolean(ViewportStyle.value))

const ScrollStyle = computed(() => {
    if (HasViewport.value) return undefined
    const value = ToSize(props.maxHeight)
    return value ? { maxHeight: value } : undefined
})

// 无 rowKey 字段时以首次出现的原始索引兜底，data 中不要重复引用同一个行对象
const OriginalIndexMap = computed(() => {
    const map = new Map()
    props.data.forEach((row, index) => {
        if (!map.has(row)) map.set(row, index)
    })
    return map
})

const SortedData = computed(() => {
    const state = SortState.value
    if (!state || !state.key || !state.order) return props.data

    const column = props.columns.find(item => item.key === state.key)
    if (!column || !column.sortable || column.sortable === 'custom') return props.data

    const factor = state.order === 'desc' ? -1 : 1
    return props.data.slice().sort((a, b) => CompareValue(GetValue(a, column), GetValue(b, column)) * factor)
})

// * 排序、筛选、翻页替换数据后，让行做一次错峰淡入
watch(() => SortedData.value, () => {
    if (ReducedMotion?.matches) return

    cancelAnimationFrame(FlashFrame)
    FlashRows.value = false
    FlashFrame = requestAnimationFrame(() => {
        FlashRows.value = true
        clearTimeout(FlashTimer)
        FlashTimer = setTimeout(() => {
            FlashRows.value = false
        }, 320)
    })
})

const SelectableKeys = computed(() => {
    const keys = []
    props.data.forEach((row, index) => {
        if (IsRowSelectable(row, index)) keys.push(GetRowKey(row, index))
    })
    return keys
})

const AllSelected = computed(() => {
    if (!SelectableKeys.value.length) return false
    return SelectableKeys.value.every(key => SelectedSet.value.has(key))
})

const PartiallySelected = computed(() => {
    if (!SelectableKeys.value.length) return false
    const count = SelectableKeys.value.filter(key => SelectedSet.value.has(key)).length
    return count > 0 && count < SelectableKeys.value.length
})

function ToSize(value) {
    if (value === null || value === undefined || value === '') return undefined
    return typeof value === 'number' ? `${value}px` : value
}

function ToPx(value) {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
        const text = value.trim()
        if (/^\d+(\.\d+)?(px)?$/.test(text)) return parseFloat(text)
    }
    return 0
}

function OriginalIndex(row, fallback) {
    return OriginalIndexMap.value.has(row) ? OriginalIndexMap.value.get(row) : fallback
}

function GetRowKey(row, index) {
    if (typeof props.rowKey === 'function') {
        return props.rowKey(row, index) ?? index
    }
    return row?.[props.rowKey] ?? index
}

function GetValue(row, column) {
    const path = column.dataIndex ?? column.key
    if (typeof path === 'function') return path(row)
    if (Array.isArray(path)) return path.reduce((value, key) => value?.[key], row)
    if (typeof path === 'string' && path.includes('.')) {
        return path.split('.').reduce((value, key) => value?.[key], row)
    }
    return row?.[path]
}

function FormatCell(row, column, index) {
    const value = GetValue(row, column)
    if (typeof column.formatter === 'function') return column.formatter(value, row, index, column)
    return value
}

function CompareValue(a, b) {
    if (a === b) return 0
    if (a === null || a === undefined) return -1
    if (b === null || b === undefined) return 1
    if (typeof a === 'number' && typeof b === 'number') return a - b
    if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
    return String(a).localeCompare(String(b), 'zh-CN', { numeric: true, sensitivity: 'base' })
}

function AriaSort(column) {
    if (!column.sortable) return undefined
    const state = SortState.value
    if (!state || state.key !== column.key || !state.order) return 'none'
    return state.order === 'asc' ? 'ascending' : 'descending'
}

function IsSortActive(column, order) {
    const state = SortState.value
    return Boolean(state && state.key === column.key && state.order === order)
}

function ToggleSort(column) {
    if (!column.sortable) return

    const current = SortState.value
    let order = 'asc'

    if (current && current.key === column.key) {
        order = current.order === 'asc' ? 'desc' : current.order === 'desc' ? null : 'asc'
    }

    const next = order ? { key: column.key, order } : null
    if (props.sort === undefined) InternalSort.value = next

    emit('update:sort', next)
    emit('sort-change', { key: column.key, order, column })
}

function GetColumnWidth(column) {
    return ToPx(column.width) || MeasuredWidths.value[column.key] || 0
}

function GetStickyOffset(column) {
    const list = props.columns
    const index = list.indexOf(column)
    if (index < 0) return 0

    if (column.fixed === 'right') {
        let offset = 0
        for (let i = list.length - 1; i > index; i--) {
            if (list[i].fixed === 'right') offset += GetColumnWidth(list[i])
        }
        return offset
    }

    let offset = props.selectable ? SELECT_WIDTH : 0
    for (let i = 0; i < index; i++) {
        if (list[i].fixed === 'left') offset += GetColumnWidth(list[i])
    }
    return offset
}

function ColumnWidthStyle(column) {
    const width = column.width ?? (column.fixed ? MeasuredWidths.value[column.key] : null)
    return width === null || width === undefined ? undefined : { width: ToSize(width) }
}

function ColumnStyle(column) {
    const style = {}
    if (column.align) style.textAlign = column.align
    if (column.minWidth) style.minWidth = ToSize(column.minWidth)
    if (column.fixed) {
        const side = column.fixed === 'right' ? 'right' : 'left'
        style[side] = `${GetStickyOffset(column)}px`
    }
    return style
}

function BaseColumnClass(column) {
    const classes = []
    if (column.align) classes.push(`wa_table_align_${column.align}`)
    if (column.fixed) {
        classes.push('wa_table_sticky', `wa_table_sticky_${column.fixed}`)
        if (IsLastLeftFixed(column)) classes.push('wa_table_sticky_edge_left')
        if (IsFirstRightFixed(column)) classes.push('wa_table_sticky_edge_right')
    }
    return classes
}

function ColumnClass(column) {
    const classes = BaseColumnClass(column)
    if (column.class) classes.unshift(column.class)
    if (column.ellipsis) classes.push('wa_table_ellipsis')
    return classes
}

function HeaderClass(column) {
    const classes = BaseColumnClass(column)
    if (column.headerClass) classes.unshift(column.headerClass)
    return classes
}

function IsLastLeftFixed(column) {
    if (column.fixed !== 'left') return false
    const list = props.columns.filter(item => item.fixed === 'left')
    return list[list.length - 1] === column
}

function IsFirstRightFixed(column) {
    if (column.fixed !== 'right') return false
    return props.columns.find(item => item.fixed === 'right') === column
}

function IsRowSelectable(row, index) {
    if (!props.selectable) return false
    return typeof props.selectableRow === 'function' ? Boolean(props.selectableRow(row, index)) : true
}

function IsRowSelected(row, index) {
    return SelectedSet.value.has(GetRowKey(row, index))
}

function CommitSelected(keys) {
    if (props.selectedKeys === undefined) InternalSelected.value = keys
    emit('update:selectedKeys', keys)
}

function ToggleRow(row, index) {
    if (!IsRowSelectable(row, index)) return

    const key = GetRowKey(row, index)
    const current = SelectedKeys.value || []
    const selected = !current.includes(key)
    const keys = selected ? [...current, key] : current.filter(item => item !== key)

    CommitSelected(keys)
    emit('select', { row, selected, keys })
}

function ToggleAll() {
    if (!SelectableKeys.value.length) return

    const current = SelectedKeys.value || []
    const selectable = new Set(SelectableKeys.value)
    const selected = !AllSelected.value
    let keys

    if (!selected) {
        keys = current.filter(key => !selectable.has(key))
    } else {
        const next = new Set(current)
        SelectableKeys.value.forEach(key => next.add(key))
        keys = [...next]
    }

    CommitSelected(keys)
    emit('select-all', { selected, keys })
}

function GetRowClass(row, index) {
    const value = typeof props.rowClass === 'function' ? props.rowClass(row, index) : props.rowClass
    return value || ''
}

function SkeletonWidth(index) {
    return SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]
}

function OnRowClick(row, index, event) {
    emit('row-click', { row, index, event })
}

function OnCellClick(row, column, index, event) {
    emit('cell-click', { row, column, index, event })
}

function GetTooltipText(row, column, index) {
    if (!column.tooltip) return ''

    if (typeof column.tooltip === 'function') {
        const text = column.tooltip(GetValue(row, column), row, index, column)
        return text === null || text === undefined ? '' : String(text)
    }

    const value = FormatCell(row, column, index)
    if (typeof value === 'string' || typeof value === 'number') return String(value)
    return ''
}

function MeasureColumns() {
    const table = HeadTableEl.value || TableEl.value
    if (!table) return

    const headers = table.querySelectorAll('thead th')
    const selectOffset = props.selectable ? 1 : 0
    const next = { ...MeasuredWidths.value }
    let changed = false

    props.columns.forEach((column, index) => {
        if (column.fixed !== 'left' && column.fixed !== 'right') return

        const header = headers[index + selectOffset]
        if (!header) return

        const width = Math.round(header.getBoundingClientRect().width * 100) / 100
        if (width > 0 && Math.abs((next[column.key] || 0) - width) > 0.5) {
            next[column.key] = width
            changed = true
        }
    })

    if (changed) MeasuredWidths.value = next
}

function UpdateScrollShadow() {
    const el = ScrollEl.value
    if (!el) return

    const max = el.scrollWidth - el.clientWidth
    ShadowLeft.value = HasLeftFixed.value && el.scrollLeft > 1
    ShadowRight.value = HasRightFixed.value && max > 1 && el.scrollLeft < max - 1
}

function SyncHeadScroll() {
    const head = HeadScrollEl.value
    const body = ScrollEl.value
    if (head && body) head.scrollLeft = body.scrollLeft
}

function SyncScrollbarWidth() {
    const body = ScrollEl.value
    if (!HasViewport.value || !body) {
        HeadPaddingRight.value = 0
        return
    }

    const width = Math.max(0, body.offsetWidth - body.clientWidth)
    if (width !== HeadPaddingRight.value) HeadPaddingRight.value = width
}

function OnBodyScroll() {
    UpdateScrollShadow()
    SyncHeadScroll()
}

function OnResize() {
    MeasureColumns()
    UpdateScrollShadow()
    SyncScrollbarWidth()
    SyncHeadScroll()
}

let ResizeObserverInstance = null
let Unmounted = false

onMounted(() => {
    nextTick(OnResize)
    window.addEventListener('resize', OnResize)
    document.fonts?.ready?.then(() => {
        if (!Unmounted) OnResize()
    })

    if (typeof ResizeObserver !== 'undefined' && ScrollEl.value) {
        ResizeObserverInstance = new ResizeObserver(OnResize)
        ResizeObserverInstance.observe(ScrollEl.value)
    }
})

onBeforeUnmount(() => {
    Unmounted = true
    window.removeEventListener('resize', OnResize)
    ResizeObserverInstance?.disconnect()
    ResizeObserverInstance = null
    cancelAnimationFrame(FlashFrame)
    clearTimeout(FlashTimer)
})

watch(() => props.columns, () => nextTick(OnResize), { deep: true })
watch([() => props.data, () => props.data.length, () => props.selectable], () => nextTick(OnResize))
watch([HasLeftFixed, HasRightFixed], () => nextTick(UpdateScrollShadow))
watch(HasViewport, () => nextTick(OnResize))

watch(ScrollEl, (el, old) => {
    if (!ResizeObserverInstance) return
    if (old) ResizeObserverInstance.unobserve(old)
    if (el) ResizeObserverInstance.observe(el)
})
</script>

<style>
.wa_table {
    --wa_table_bg: var(--wa_color_surface);
    --wa_table_head_bg: color-mix(in srgb, var(--wa_color_surface) 96%, var(--wa_color_text));
    --wa_table_cell_pad: 12px 14px;
    --wa_table_font: 13px;

    position: relative;
    min-width: 0;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_table_bg);
    overflow: hidden;
}

.wa_table_sm {
    --wa_table_cell_pad: 8px 12px;
    --wa_table_font: 12px;
}

.wa_table_fit {
    width: fit-content;
    max-width: 100%;
}

.wa_table_fit .wa_table_el {
    width: auto;
}

/* 单元格内的按钮与标记跟随表格密度缩小，避免撑高 sm 行 */
.wa_table_sm .wa_table_td {
    --wa_btn_height: 26px;
    --wa_btn_padding: 3px 12px;
    --wa_btn_font: 12px;
    --wa_btn_icon_size: 26px;
    --wa_chip_height: 26px;
    --wa_chip_padding: 0 10px;
    --wa_chip_font: 12px;
}

.wa_table_toolbar {
    padding: 12px 14px;
    border-bottom: 1px solid var(--wa_color_line);
}

.wa_table_scroll {
    position: relative;
    max-width: 100%;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--wa_color_scroll) transparent;
}

.wa_table_viewport {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.wa_table_head_scroll {
    flex: none;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--wa_table_head_bg);
}

.wa_table_body_scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
}

.wa_table_el {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: var(--wa_table_font);
    text-align: left;
}

.wa_table_fixed {
    table-layout: fixed;
}

.wa_table_col_select {
    width: 48px;
}

.wa_table_th {
    padding: var(--wa_table_cell_pad);
    border-bottom: 1px solid var(--wa_color_line_strong);
    color: var(--wa_color_text_subtle);
    background: var(--wa_table_head_bg);
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    text-align: left;
    white-space: nowrap;
    vertical-align: middle;
}

.wa_table_td {
    padding: var(--wa_table_cell_pad);
    border-bottom: 1px solid var(--wa_color_line);
    color: var(--wa_color_text_muted);
    line-height: 1.6;
    vertical-align: middle;
}

.wa_table_el tbody tr:last-child .wa_table_td {
    border-bottom: 0;
}

.wa_table_align_center {
    text-align: center;
}

.wa_table_align_right {
    text-align: right;
}

.wa_table_ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.wa_table_sticky {
    position: sticky;
    z-index: 1;
    background: var(--wa_table_bg);
}

.wa_table_th.wa_table_sticky {
    background: var(--wa_table_head_bg);
}

.wa_table_select {
    width: 48px;
    text-align: center;
}

.wa_table_select .wa_choice_row {
    justify-content: center;
}

.wa_table_sticky_header .wa_table_th {
    position: sticky;
    top: 0;
    z-index: 2;
}

.wa_table_sticky_header .wa_table_th.wa_table_sticky {
    z-index: 3;
}

.wa_table_shadow_left .wa_table_sticky_edge_left {
    box-shadow: 8px 0 12px -10px var(--wa_color_sticky_shadow);
}

.wa_table_shadow_right .wa_table_sticky_edge_right {
    box-shadow: -8px 0 12px -10px var(--wa_color_sticky_shadow);
}

.wa_table_tr {
    transition: background var(--wa_duration_fast) var(--wa_ease_out);
}

/* * 排序 / 筛选 / 翻页后的行入场：前几行错峰淡入 */
.wa_table_rows_flash tbody .wa_table_tr {
    animation: wa_table_row_in var(--wa_duration_base) var(--wa_ease_out) both;
}

.wa_table_rows_flash tbody .wa_table_tr:nth-child(2) {
    animation-delay: 16ms;
}

.wa_table_rows_flash tbody .wa_table_tr:nth-child(3) {
    animation-delay: 32ms;
}

.wa_table_rows_flash tbody .wa_table_tr:nth-child(4) {
    animation-delay: 48ms;
}

.wa_table_rows_flash tbody .wa_table_tr:nth-child(5) {
    animation-delay: 64ms;
}

.wa_table_rows_flash tbody .wa_table_tr:nth-child(6) {
    animation-delay: 80ms;
}

@keyframes wa_table_row_in {
    from {
        opacity: 0;
        translate: 0 4px;
    }

    to {
        opacity: 1;
        translate: 0 0;
    }
}

@media (hover: hover) and (pointer: fine) {
    .wa_table_tr:hover {
        background: var(--wa_color_hover);
    }

    .wa_table_tr:hover .wa_table_sticky {
        background: color-mix(in srgb, var(--wa_table_bg) 94%, var(--wa_color_text));
    }

    .wa_table_sort:hover {
        color: var(--wa_color_text);
    }
}

.wa_table_stripe .wa_table_tr:nth-child(even) {
    background: var(--wa_color_soft);
}

.wa_table_stripe .wa_table_tr:nth-child(even) .wa_table_sticky {
    background: color-mix(in srgb, var(--wa_table_bg) 97%, var(--wa_color_text));
}

.wa_table_stripe .wa_table_tr:nth-child(even):hover {
    background: var(--wa_color_hover);
}

.wa_table_stripe .wa_table_tr:nth-child(even):hover .wa_table_sticky {
    background: color-mix(in srgb, var(--wa_table_bg) 94%, var(--wa_color_text));
}

.wa_table_tr.on,
.wa_table_stripe .wa_table_tr.on:nth-child(even) {
    background: var(--wa_color_active);
}

.wa_table_tr.on .wa_table_sticky,
.wa_table_stripe .wa_table_tr.on:nth-child(even) .wa_table_sticky {
    background: color-mix(in srgb, var(--wa_table_bg) 92%, var(--wa_color_text));
}

.wa_table_tr.on:hover .wa_table_sticky,
.wa_table_stripe .wa_table_tr.on:nth-child(even):hover .wa_table_sticky {
    background: color-mix(in srgb, var(--wa_table_bg) 88%, var(--wa_color_text));
}

.wa_table_tr.on:hover,
.wa_table_stripe .wa_table_tr.on:nth-child(even):hover {
    background: color-mix(in srgb, var(--wa_color_active) 70%, var(--wa_color_hover));
}

.wa_table_bordered .wa_table_th+.wa_table_th,
.wa_table_bordered .wa_table_td+.wa_table_td {
    border-left: 1px solid var(--wa_color_line);
}

.wa_table_sort {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    color: inherit;
    background: none;
    font: inherit;
    font-weight: inherit;
    cursor: pointer;
    transition: color var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_table_sort_label {
    min-width: 0;
}

.wa_table_sort_icons {
    display: inline-flex;
    flex: none;
    flex-direction: column;
    gap: 0;
    line-height: 0;
}

.wa_table_sort_arrow {
    display: block;
    width: 13px;
    height: 13px;
    margin-block: -3px;
    color: var(--wa_color_text_faint);
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        translate var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_table_sort_arrow.on {
    color: var(--wa_color_text);
}

.wa_table_sort_arrow.on:first-child {
    translate: 0 -1px;
}

.wa_table_sort_arrow.on:last-child {
    translate: 0 1px;
}

.wa_table_empty_cell {
    padding: 0;
}

.wa_table .wa_table_empty {
    min-height: 180px;
}

.wa_table_footer {
    padding: 12px 14px;
    border-top: 1px solid var(--wa_color_line);
}

/* 透明外观：贴近期文档表格，无外框、无表头底色 */
.wa_table_transparent {
    --wa_table_bg: var(--wa_table_transparent_bg, var(--wa_color_canvas));
    --wa_table_head_bg: transparent;

    border: 0;
    border-radius: 0;
    background: transparent;
}

.wa_table_transparent .wa_table_th,
.wa_table_transparent .wa_table_td {
    padding: 9px 12px;
    font-size: 13px;
}

.wa_table_transparent .wa_table_th {
    border-bottom: 1px solid var(--wa_color_line_strong);
    background: transparent;
    font-weight: 600;
}

.wa_table_transparent .wa_table_td {
    vertical-align: top;
}

.wa_table_transparent .wa_table_toolbar {
    padding: 10px 0;
    border-bottom: 1px solid var(--wa_color_line);
}

.wa_table_transparent .wa_table_footer {
    padding: 10px 0;
    border-top: 1px solid var(--wa_color_line);
}

/* 固定列和吸顶表头必须不透明；宿主可用 --wa_table_transparent_bg 对齐所在背景 */
.wa_table_transparent .wa_table_sticky,
.wa_table_transparent.wa_table_sticky_header .wa_table_th {
    background: var(--wa_table_bg);
}

@media (prefers-reduced-motion: reduce) {
    .wa_table_tr,
    .wa_table_sort,
    .wa_table_sort_arrow {
        transition: none;
    }
}
</style>
