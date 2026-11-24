import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppTable from '@ui/src/components/AppTable.vue'

const columns = [
    { key: 'name', title: '名称', sortable: true },
    { key: 'age', title: '年龄' },
]

const data = [
    { id: 1, name: 'Alice', age: 20 },
    { id: 2, name: 'Bob', age: 30 },
]

describe('AppTable', () => {
    it('renders columns and rows', () => {
        const wrapper = mount(AppTable, {
            props: { columns, data },
        })

        expect(wrapper.text()).toContain('名称')
        expect(wrapper.text()).toContain('Alice')
        expect(wrapper.text()).toContain('Bob')
        expect(wrapper.findAll('tbody .wa_table_tr')).toHaveLength(2)
    })

    it('emits sort state when a sortable header is clicked', async () => {
        const wrapper = mount(AppTable, {
            props: { columns, data },
        })

        await wrapper.find('.wa_table_sort').trigger('click')

        expect(wrapper.emitted('update:sort')?.[0]).toEqual([{ key: 'name', order: 'asc' }])
        expect(wrapper.emitted('sort-change')?.[0]?.[0]).toMatchObject({
            key: 'name',
            order: 'asc',
        })
    })

    it('calculates sticky offsets from explicit column widths', () => {
        const fixedColumns = [
            { key: 'id', title: 'ID', width: 50, fixed: 'left' },
            { key: 'name', title: '名称', width: 120 },
            { key: 'status', title: '状态', width: 60, fixed: 'right' },
            { key: 'actions', title: '操作', width: 70, fixed: 'right' },
        ]
        const wrapper = mount(AppTable, {
            props: { columns: fixedColumns, data },
        })
        const headers = wrapper.findAll('.wa_table_th')

        expect(headers[0].attributes('style')).toContain('left: 0px')
        expect(headers[2].attributes('style')).toContain('right: 70px')
        expect(headers[3].attributes('style')).toContain('right: 0px')
    })

    it('renders a fixed header viewport when maxHeight is set', () => {
        const wrapper = mount(AppTable, {
            props: { columns, data, maxHeight: 200 },
        })

        expect(wrapper.find('.wa_table_viewport').exists()).toBe(true)
        expect(wrapper.find('.wa_table_viewport').attributes('style')).toContain('max-height: 200px')
        expect(wrapper.findAll('.wa_table_head_table')).toHaveLength(1)
        expect(wrapper.findAll('.wa_table_body_scroll')).toHaveLength(1)
    })

    it('renders empty state when there is no data', () => {
        const wrapper = mount(AppTable, {
            props: { columns, data: [], emptyText: '没有记录' },
        })

        expect(wrapper.text()).toContain('没有记录')
    })
})
