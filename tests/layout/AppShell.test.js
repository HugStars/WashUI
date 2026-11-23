import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppShell from '@ui/src/layout/AppShell.vue'

describe('AppShell', () => {
    it('renders navigation from items', () => {
        const wrapper = mount(AppShell, {
            props: {
                items: [
                    { value: 'home', label: '开始', icon: 'home' },
                    { value: 'components', label: '组件', icon: 'list' },
                ],
            },
        })

        expect(wrapper.findAll('.wa_nav_item')).toHaveLength(2)
    })

    it('flattens groups into the same navigation list', () => {
        const wrapper = mount(AppShell, {
            props: {
                groups: [
                    { label: '基础', items: [{ value: 'home', label: '开始', icon: 'home' }] },
                    { label: '组件', items: [{ value: 'button', label: '按钮', icon: 'grid' }] },
                ],
            },
        })

        expect(wrapper.findAll('.wa_nav_item')).toHaveLength(2)
    })
})
