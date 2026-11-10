import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppPagination from '@ui/src/components/AppPagination.vue'

describe('AppPagination', () => {
    it('renders current page and emits page changes', async () => {
        const wrapper = mount(AppPagination, {
            props: { total: 50, pageSize: 10, modelValue: 2 },
        })

        expect(wrapper.find('.wa_pagination_btn.on').attributes('aria-current')).toBe('page')
        expect(wrapper.text()).toContain('共 50 条')

        await wrapper.find('[aria-label="第 3 页"]').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
        expect(wrapper.emitted('change')?.[0]).toEqual([{ page: 3, pageSize: 10 }])
    })

    it('disables previous on the first page and next on the last page', () => {
        const first = mount(AppPagination, {
            props: { total: 20, pageSize: 10, modelValue: 1 },
        })
        expect(first.find('[aria-label="上一页"]').attributes('disabled')).toBeDefined()
        expect(first.find('[aria-label="下一页"]').attributes('disabled')).toBeUndefined()

        const last = mount(AppPagination, {
            props: { total: 20, pageSize: 10, modelValue: 2 },
        })
        expect(last.find('[aria-label="下一页"]').attributes('disabled')).toBeDefined()
    })
})
