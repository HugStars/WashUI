import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppTabs from '@ui/src/components/AppTabs.vue'

const items = [
    { name: 'overview', label: '概览' },
    { name: 'members', label: '成员' },
    { name: 'archive', label: '归档', disabled: true },
]

describe('AppTabs', () => {
    it('marks the active tab and emits changes', async () => {
        const wrapper = mount(AppTabs, {
            props: { items, modelValue: 'overview' },
        })

        const tabs = wrapper.findAll('.wa_tabs_tab')
        expect(tabs[0].attributes('aria-selected')).toBe('true')
        expect(tabs[1].attributes('aria-selected')).toBe('false')

        await tabs[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['members'])
        expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ name: 'members' })
    })

    it('ignores disabled tabs', async () => {
        const wrapper = mount(AppTabs, {
            props: { items, modelValue: 'overview' },
        })

        await wrapper.findAll('.wa_tabs_tab')[2].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
})
