import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppTabs from '@ui/src/components/AppTabs.vue'

const items = [
    { value: 'overview', label: '概览' },
    { value: 'members', label: '成员' },
    { value: 'archive', label: '归档', disabled: true },
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
        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'members' })
    })

    it('ignores disabled tabs', async () => {
        const wrapper = mount(AppTabs, {
            props: { items, modelValue: 'overview' },
        })

        await wrapper.findAll('.wa_tabs_tab')[2].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('applies the group variant class', () => {
        const wrapper = mount(AppTabs, {
            props: { items, modelValue: 'overview', variant: 'group' },
        })

        expect(wrapper.classes()).toContain('wa_tabs_group')
    })

    it('enables badge dragging for all badges', () => {
        const wrapper = mount(AppTabs, {
            props: {
                modelValue: 'overview',
                items: [
                    { value: 'overview', label: '概览', badge: 3 },
                    { value: 'members', label: '成员', badge: { text: 2 } }
                ],
                badgeDraggable: true,
                badgeMaxDistance: 80
            },
        })

        expect(wrapper.findAll('.wa_badge')).toHaveLength(2)
        expect(wrapper.findAll('.wa_badge_draggable')).toHaveLength(2)
    })
})
