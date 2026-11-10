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

    it('renders empty state when there is no data', () => {
        const wrapper = mount(AppTable, {
            props: { columns, data: [], emptyText: '没有记录' },
        })

        expect(wrapper.text()).toContain('没有记录')
    })
})
