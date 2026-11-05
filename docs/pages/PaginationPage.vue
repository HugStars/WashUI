<template>
    <DocPage category="数据" name="AppPagination" title="分页"
        description="受控页码与每页条数，不依赖列表组件。表格用 footer 插槽组合，其他列表也可以直接使用。">
        <DemoBlock title="基础" description="v-model 绑定当前页，total 是总条数，每页条数默认 10。">
            <AppPagination v-model="page" :total="128" />
            <p class="wa_hint doc_gap">当前第 {{ page }} 页</p>
        </DemoBlock>

        <DemoBlock title="每页条数" description="showSizeChanger 显示条数切换；v-model:pageSize 可以同步到业务侧。">
            <AppPagination v-model="sizedPage" v-model:page-size="pageSize" :total="128" show-size-changer />
            <p class="wa_hint doc_gap">第 {{ sizedPage }} 页，每页 {{ pageSize }} 条</p>
        </DemoBlock>

        <DemoBlock title="简单模式" description="simple 只保留上一页、当前页 / 总页数、下一页，适合窄容器。">
            <AppPagination v-model="simplePage" simple :total="86" :page-size="10" />
        </DemoBlock>

        <DemoBlock title="尺寸与禁用" description="size=md 放大按钮与字号；disabled 禁用全部交互。">
            <div class="doc_pagination_demo">
                <AppPagination v-model="mdPage" size="md" :total="64" />
                <AppPagination v-model="disabledPage" disabled :total="64" />
            </div>
        </DemoBlock>

        <DemoBlock title="监听变化" description="change 同时返回 page 与 pageSize，page-size-change 单独返回条数变化。">
            <AppPagination v-model="eventPage" v-model:page-size="eventPageSize" :total="128" show-size-changer
                @change="onChange" />
            <p class="wa_hint doc_gap">最近一次变化：第 {{ lastChange.page }} 页，每页 {{ lastChange.pageSize }} 条</p>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const page = ref(1)
const sizedPage = ref(1)
const pageSize = ref(10)
const simplePage = ref(1)
const mdPage = ref(1)
const disabledPage = ref(1)
const eventPage = ref(1)
const eventPageSize = ref(10)

const lastChange = reactive({ page: 1, pageSize: 10 })

function onChange({ page: nextPage, pageSize: nextPageSize }) {
    lastChange.page = nextPage
    lastChange.pageSize = nextPageSize
}

const propsRows = [
    { name: 'modelValue', type: 'number', default: '—', desc: 'v-model，当前页，从 1 开始；不传时组件内部维护' },
    { name: 'pageSize', type: 'number', default: '10', desc: 'v-model:pageSize，每页条数；不传时内部维护' },
    { name: 'total', type: 'number', default: '0', desc: '总条数' },
    { name: 'pageSizeOptions', type: 'number[]', default: '[10, 20, 50, 100]', desc: '每页条数选项' },
    { name: 'showSizeChanger', type: 'boolean', default: 'false', desc: '显示每页条数切换' },
    { name: 'showTotal', type: 'boolean', default: 'true', desc: '显示“共 N 条”' },
    { name: 'simple', type: 'boolean', default: 'false', desc: '简单模式，只显示上一页、页码摘要、下一页' },
    { name: 'maxButtons', type: 'number', default: '5', desc: '中间页码按钮的最大数量' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '按钮尺寸与字号' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用全部交互' },
    { name: 'ariaLabel', type: 'string', default: "'分页'", desc: '导航无障碍名称' },
]

const eventRows = [
    { name: 'update:modelValue', type: 'number', desc: '当前页变化' },
    { name: 'update:pageSize', type: 'number', desc: '每页条数变化' },
    { name: 'change', type: '{ page, pageSize }', desc: '页码或条数变化' },
    { name: 'page-size-change', type: '{ pageSize, page }', desc: '每页条数变化' },
]
</script>

<style>
.doc_pagination_demo {
    display: grid;
    gap: 14px;
}
</style>
