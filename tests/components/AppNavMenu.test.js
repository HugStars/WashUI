import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import AppNavMenu from '@ui/src/components/AppNavMenu.vue'

const items = [
    { label: '概览', value: 'overview', href: '/overview' },
    { label: '成员', value: 'members', href: '/members' },
    { label: '归档', value: 'archive', href: '/archive', disabled: true },
]

describe('AppNavMenu', () => {
    it('renders groups and real links', () => {
        const wrapper = mount(AppNavMenu, {
            props: {
                groups: [{ title: '项目', items }],
            },
        })

        expect(wrapper.text()).toContain('项目')
        expect(wrapper.findAll('a')).toHaveLength(3)
        expect(wrapper.find('a').attributes('href')).toBe('/overview')
    })

    it('marks the selected item with aria-current', () => {
        const wrapper = mount(AppNavMenu, {
            props: { items, modelValue: 'members' },
        })

        const links = wrapper.findAll('a')
        expect(links[0].attributes('aria-current')).toBeUndefined()
        expect(links[1].attributes('aria-current')).toBe('page')
    })

    it('emits selection for action items without href', async () => {
        const wrapper = mount(AppNavMenu, {
            props: { items: [{ label: '打开', value: 'open' }] },
        })

        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['open'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['open'])
        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'open' })
    })

    it('does not emit for disabled items', async () => {
        const wrapper = mount(AppNavMenu, {
            props: { items },
        })

        await wrapper.findAll('a')[2].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.findAll('a')[2].attributes('aria-disabled')).toBe('true')
    })

    it('supports a custom link component', () => {
        const Link = defineComponent({
            props: { to: { type: String, required: true } },
            setup(props, { slots }) {
                return () => h('a', { href: props.to, class: 'custom-link' }, slots.default?.())
            },
        })

        const wrapper = mount(AppNavMenu, {
            props: {
                items: [{ label: '按钮', value: 'button', href: '/components/button' }],
                linkComponent: Link,
            },
        })

        expect(wrapper.find('a.custom-link').attributes('href')).toBe('/components/button')
    })

    it('renders compact size and badge', () => {
        const wrapper = mount(AppNavMenu, {
            props: {
                size: 'sm',
                items: [{ label: '通知', value: 'notice', badge: 3 }],
            },
        })

        expect(wrapper.find('.wa_nav_menu_sm').exists()).toBe(true)
        expect(wrapper.find('.wa_badge_text').text()).toBe('3')
    })
})
