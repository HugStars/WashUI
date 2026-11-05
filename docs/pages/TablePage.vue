<template>
    <DocPage category="数据" name="AppTable" title="表格"
        description="配置驱动的数据表格，默认紧凑尺寸。columns 定义列，data 提供行；常用能力通过 props 开启，复杂内容用 cell-{key} 插槽接管。">
        <DemoBlock title="基础" description="columns 定义列，data 提供数据；formatter 适合简单的文本格式化。">
            <AppTable :columns="columns" :data="rows" />
        </DemoBlock>

        <DemoBlock title="自定义单元格" description="cell-{key} 插槽拿到 row、column、value 与 index，可以放标记、按钮等任意内容。">
            <AppTable :columns="richColumns" :data="rows" table-layout="fixed">
                <template #cell-status="{ value }">
                    <AppChip size="sm" :active="value === '启用'" @click.stop>{{ value }}</AppChip>
                </template>
                <template #cell-actions="{ row }">
                    <AppButton size="sm" variant="line" @click.stop="toast.success(`编辑 ${row.name}`)">编辑</AppButton>
                </template>
            </AppTable>
        </DemoBlock>

        <DemoBlock title="单元格提示" description="列配置 tooltip: true 时使用 formatter 或原始值作为提示；传函数可以自定义提示内容。提示由 AppTooltip 呈现，悬停整格触发。">
            <AppTable :columns="tooltipColumns" :data="rows" />
        </DemoBlock>

        <DemoBlock title="透明样式"
            description="transparent 去掉外框、圆角和表头底色，尺寸贴近文档表格；固定列与吸顶表头需要不透明背景，可用 --wa_table_transparent_bg 对齐宿主背景。">
            <AppTable transparent :columns="columns" :data="rows.slice(0, 5)" />
        </DemoBlock>

        <DemoBlock title="内容自适应" description="fitContent 让表格宽度贴合内容，不铺满容器；适合字段较少的说明表格。">
            <AppTable fit-content :columns="columns.slice(0, 3)" :data="rows.slice(0, 4)" />
        </DemoBlock>

        <DemoBlock title="排序" description="sortable 开启客户端排序；v-model:sort 接收 { key, order }，order 依次为 asc、desc、null。">
            <AppTable v-model:sort="sort" :columns="sortColumns" :data="rows" />
            <p class="wa_hint doc_gap">当前排序：{{ sort ? `${sort.key} ${sort.order}` : '未排序' }}</p>
        </DemoBlock>

        <DemoBlock title="行选择" description="selectable 开启选择列，selectedKeys 受控；selectableRow 返回 false 的行不可选。">
            <AppTable selectable v-model:selected-keys="selectedKeys" :columns="columns" :data="rows"
                :selectable-row="row => row.status !== '停用'" />
            <p class="wa_hint doc_gap">已选：{{ selectedKeys.join(', ') || '无' }}</p>
        </DemoBlock>

        <DemoBlock title="固定高度与最小高度"
            description="height 固定表头 + 表体的总高度，表头固定、表体独立滚动；minHeight 保证内容较少时的最小高度。纵向滚动条只出现在表体区域。">
            <div class="doc_table_demo">
                <AppTable :columns="columns" :data="rows" :height="220" />
                <AppTable :columns="columns" :data="rows.slice(0, 3)" :min-height="220" />
            </div>
        </DemoBlock>

        <DemoBlock title="固定列与粘性表头"
            description="fixed 固定左右列，height 限制内容视口高度，表头自动固定；内容超出时只有表体滚动，并出现横向滚动与边缘阴影。">
            <AppTable :columns="wideColumns" :data="rows" :height="280">
                <template #cell-status="{ value }">
                    <AppChip size="sm" :active="value === '启用'" @click.stop>{{ value }}</AppChip>
                </template>
                <template #cell-actions="{ row }">
                    <AppButton size="sm" variant="line" @click.stop="toast.success(`编辑 ${row.name}`)">编辑</AppButton>
                </template>
            </AppTable>
        </DemoBlock>

        <DemoBlock title="加载与空状态" description="loading 显示骨架行并保留表头；没有数据时显示紧凑的空状态。">
            <div class="doc_table_demo">
                <AppButton size="sm" @click="loading = !loading">{{ loading ? '结束加载' : '模拟加载' }}</AppButton>
                <AppTable :columns="columns" :data="rows" :loading="loading" :loading-rows="3" />
                <AppTable :columns="columns" :data="[]" empty-text="没有匹配的记录" />
            </div>
        </DemoBlock>

        <DemoBlock title="与分页组合" description="表格不内置分页，用 footer 插槽组合 AppPagination；服务端分页时把 data 换成当前页数据即可。">
            <AppTable :columns="columns" :data="pagedRows">
                <template #footer>
                    <AppPagination v-model="page" v-model:page-size="pageSize" :total="rows.length" show-size-changer />
                </template>
            </AppTable>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="列定义" :rows="columnRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { computed, ref } from 'vue'
import { toast } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const rows = [
    { id: 1, name: '林一', email: 'linyi@wash.dev', role: '管理员', status: '启用', amount: 1280, time: '2026-10-12' },
    { id: 2, name: '陈默', email: 'chenmo@wash.dev', role: '编辑', status: '启用', amount: 860, time: '2026-10-13' },
    { id: 3, name: '苏禾', email: 'suhe@wash.dev', role: '访客', status: '待审核', amount: 320, time: '2026-10-14' },
    { id: 4, name: '周青', email: 'zhouqing@wash.dev', role: '编辑', status: '停用', amount: 640, time: '2026-10-15' },
    { id: 5, name: '何岸', email: 'hean@wash.dev', role: '管理员', status: '启用', amount: 2040, time: '2026-10-16' },
    { id: 6, name: '唐宁', email: 'tangning@wash.dev', role: '访客', status: '启用', amount: 180, time: '2026-10-17' },
    { id: 7, name: '顾言', email: 'guyan@wash.dev', role: '编辑', status: '待审核', amount: 720, time: '2026-10-18' },
    { id: 8, name: '叶川', email: 'yechuan@wash.dev', role: '访客', status: '启用', amount: 260, time: '2026-10-19' },
    { id: 9, name: '沈迟', email: 'shenchi@wash.dev', role: '管理员', status: '停用', amount: 1560, time: '2026-10-20' },
    { id: 10, name: '白露', email: 'bailu@wash.dev', role: '编辑', status: '启用', amount: 940, time: '2026-10-21' },
    { id: 11, name: '江照', email: 'jiangzhao@wash.dev', role: '访客', status: '待审核', amount: 410, time: '2026-10-22' },
    { id: 12, name: '许知', email: 'xuzhi@wash.dev', role: '编辑', status: '启用', amount: 1120, time: '2026-10-23' },
]

const columns = [
    { key: 'name', title: '成员', width: 160 },
    { key: 'role', title: '角色', width: 120 },
    { key: 'status', title: '状态', width: 110 },
    { key: 'amount', title: '额度', width: 120, align: 'right', formatter: value => `¥${Number(value).toLocaleString()}` },
]

const richColumns = [
    { key: 'name', title: '成员', width: 150 },
    { key: 'email', title: '邮箱', width: 200, ellipsis: true },
    { key: 'status', title: '状态', width: 110 },
    { key: 'actions', title: '操作', width: 100, align: 'right' },
]

const tooltipColumns = [
    { key: 'name', title: '成员', width: 140, tooltip: true },
    { key: 'email', title: '邮箱', width: 220, ellipsis: true, tooltip: value => `邮箱：${value}` },
    { key: 'role', title: '角色', width: 120, tooltip: true },
    { key: 'amount', title: '额度', width: 120, align: 'right', tooltip: value => `额度：¥${Number(value).toLocaleString()}` },
]

const sortColumns = [
    { key: 'name', title: '成员', width: 180, sortable: true },
    { key: 'amount', title: '额度', width: 140, align: 'right', sortable: true, formatter: value => `¥${Number(value).toLocaleString()}` },
    { key: 'time', title: '加入时间', width: 160, sortable: true },
]

const wideColumns = [
    { key: 'id', title: 'ID', width: 72, fixed: 'left', align: 'center' },
    { key: 'name', title: '成员', width: 140 },
    { key: 'email', title: '邮箱', width: 220 },
    { key: 'role', title: '角色', width: 110 },
    { key: 'time', title: '加入时间', width: 160 },
    { key: 'status', title: '状态', width: 100, fixed: 'right' },
    { key: 'actions', title: '操作', width: 96, fixed: 'right', align: 'right' },
]

const sort = ref(null)
const selectedKeys = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(5)

const pagedRows = computed(() => rows.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

const propsRows = [
    { name: 'columns', type: 'Array', default: '[]', desc: '列定义，见下方列定义表' },
    { name: 'data', type: 'Array', default: '[]', desc: '行数据' },
    { name: 'rowKey', type: 'string | Function', default: "'id'", desc: '行唯一键字段名或函数' },
    { name: 'loading', type: 'boolean', default: 'false', desc: '显示骨架行，保留表头' },
    { name: 'loadingRows', type: 'number', default: '5', desc: '骨架行数量' },
    { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '空状态文案' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '单元格间距与字号，默认紧凑' },
    { name: 'stripe', type: 'boolean', default: 'false', desc: '斑马纹' },
    { name: 'bordered', type: 'boolean', default: 'false', desc: '显示单元格竖向分割线' },
    { name: 'transparent', type: 'boolean', default: 'false', desc: '透明外观：去掉外框、圆角与表头底色，尺寸贴近文档表格' },
    { name: 'fitContent', type: 'boolean', default: 'false', desc: '表格宽度根据内容自适应，不铺满容器；与 height / minHeight 同用时以高度模式为准' },
    { name: 'stickyHeader', type: 'boolean', default: 'false', desc: '表头吸附在滚动容器顶部；设置高度时表头自动固定' },
    { name: 'height', type: 'number | string', default: '—', desc: '固定高度（表头 + 表体），设置后表头固定、表体独立滚动' },
    { name: 'minHeight', type: 'number | string', default: '—', desc: '最小高度（表头 + 表体），数字按 px 处理' },
    { name: 'maxHeight', type: 'number | string', default: '—', desc: '内容视口最大高度，数字按 px 处理' },
    { name: 'tableLayout', type: 'auto | fixed', default: 'auto', desc: 'fixed 时列宽更可控，ellipsis 更稳定；存在固定列时自动使用 fixed' },
    { name: 'selectable', type: 'boolean', default: 'false', desc: '显示行选择列' },
    { name: 'selectedKeys', type: 'Array', default: '—', desc: 'v-model:selectedKeys；不传时组件内部维护' },
    { name: 'selectableRow', type: 'Function', default: '—', desc: '(row, index) => boolean，返回 false 时该行不可选' },
    { name: 'sort', type: 'Object', default: '—', desc: "v-model:sort，形如 { key, order }；order 为 asc、desc 或 null" },
    { name: 'defaultSort', type: 'Object', default: '—', desc: '非受控场景的初始排序' },
    { name: 'rowClass', type: 'string | Function', default: '—', desc: '行附加类名，函数接收 (row, index)' },
    { name: 'ariaLabel', type: 'string', default: "'数据表格'", desc: '表格无障碍名称' },
]

const columnRows = [
    { name: 'key', type: 'string', default: '—', desc: '必填，列唯一标识，同时作为默认 dataIndex 和插槽名后缀' },
    { name: 'title', type: 'string', default: '—', desc: '表头文本' },
    { name: 'dataIndex', type: 'string | string[] | Function', default: 'key', desc: '取值路径，支持 a.b 或函数' },
    { name: 'width', type: 'number | string', default: '—', desc: '列宽，数字按 px 处理' },
    { name: 'minWidth', type: 'number | string', default: '—', desc: '预留的最小宽度' },
    { name: 'align', type: 'left | center | right', default: 'left', desc: '内容对齐' },
    { name: 'fixed', type: 'left | right', default: '—', desc: '固定列；建议固定列连续并给出 width' },
    { name: 'sortable', type: 'boolean | custom', default: 'false', desc: 'true 客户端排序；custom 只发事件，由服务端处理' },
    { name: 'ellipsis', type: 'boolean', default: 'false', desc: '单行省略，配合 tableLayout=fixed 或固定列宽更稳定' },
    { name: 'tooltip', type: 'boolean | Function', default: 'false', desc: 'true 使用 formatter / 原始值作为提示；函数接收 (value, row, index, column) 返回提示文本' },
    { name: 'formatter', type: 'Function', default: '—', desc: '(value, row, index, column) => 显示内容' },
    { name: 'class', type: 'string', default: '—', desc: '单元格附加类名' },
    { name: 'headerClass', type: 'string', default: '—', desc: '表头附加类名' },
]

const eventRows = [
    { name: 'update:selectedKeys', type: 'Array', desc: '选择变化' },
    { name: 'select', type: '{ row, selected, keys }', desc: '单行选择变化' },
    { name: 'select-all', type: '{ selected, keys }', desc: '全选或取消全选' },
    { name: 'update:sort', type: '{ key, order } | null', desc: '排序状态变化' },
    { name: 'sort-change', type: '{ key, order, column }', desc: '排序状态变化，附带列定义' },
    { name: 'row-click', type: '{ row, index, event }', desc: '点击行' },
    { name: 'cell-click', type: '{ row, column, index, event }', desc: '点击单元格' },
]

const slotRows = [
    { name: 'toolbar', type: '—', desc: '表格上方工具栏' },
    { name: 'footer', type: '—', desc: '表格下方，用于放 AppPagination' },
    { name: 'empty', type: '—', desc: '替换默认空状态' },
    { name: 'header-{key}', type: '{ column }', desc: '自定义表头单元格' },
    { name: 'cell-{key}', type: '{ row, column, value, index }', desc: '自定义数据单元格' },
]
</script>

<style>
.doc_table_demo {
    display: grid;
    gap: 14px;
}
</style>
