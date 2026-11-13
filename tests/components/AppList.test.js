import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppList from '@ui/src/components/AppList.vue'
import AppListRow from '@ui/src/components/AppListRow.vue'

describe('AppList', () => {
    it('renders divided and group variants', () => {
        const wrapper = mount(AppList, {
            props: { variant: 'group', divided: true, inset: true },
        })

        expect(wrapper.classes()).toContain('wa_list_group')
        expect(wrapper.classes()).toContain('wa_list_divided')
        expect(wrapper.classes()).toContain('wa_list_inset')
    })

    it('renders label and value', () => {
        const wrapper = mount(AppListRow, {
            props: { label: '版本', value: '0.3.0' },
        })

        expect(wrapper.find('.wa_list_label').text()).toBe('版本')
        expect(wrapper.find('.wa_list_value').text()).toBe('0.3.0')
    })

    it('supports top and responsive label positions', () => {
        const top = mount(AppListRow, {
            props: { label: '更新内容', value: '组件与文档', labelPosition: 'top' },
        })
        expect(top.classes()).toContain('wa_list_row_top')

        const responsive = mount(AppListRow, {
            props: { label: '更新内容', value: '组件与文档', labelPosition: 'responsive' },
        })
        expect(responsive.classes()).toContain('wa_list_row_responsive')
    })

    it('emits click only when clickable', async () => {
        const wrapper = mount(AppListRow, {
            props: { label: '通知', clickable: true },
        })

        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toHaveLength(1)

        const disabled = mount(AppListRow, {
            props: { label: '通知', clickable: true, disabled: true },
        })

        await disabled.trigger('click')
        expect(disabled.emitted('click')).toBeUndefined()
    })

    it('marks selected rows', () => {
        const wrapper = mount(AppListRow, {
            props: { label: '主题', selected: true },
        })

        expect(wrapper.classes()).toContain('on')
        expect(wrapper.attributes('aria-current')).toBe('true')
    })
})
