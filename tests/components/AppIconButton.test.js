import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppIconButton from '@ui/src/components/AppIconButton.vue'

describe('AppIconButton', () => {
    it('renders a square icon button with accessible label', () => {
        const wrapper = mount(AppIconButton, {
            props: { name: 'close', label: '关闭', variant: 'danger' },
        })

        expect(wrapper.classes()).toContain('wa_icon_btn')
        expect(wrapper.classes()).toContain('wa_icon_btn_danger')
        expect(wrapper.attributes('aria-label')).toBe('关闭')
        expect(wrapper.attributes('title')).toBe('关闭')
    })

    it('applies md size and disabled state', () => {
        const wrapper = mount(AppIconButton, {
            props: { name: 'close', size: 'md', disabled: true },
        })

        expect(wrapper.classes()).toContain('wa_icon_btn_md')
        expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('supports large line buttons with frosted and active states', () => {
        const wrapper = mount(AppIconButton, {
            props: {
                name: 'star',
                label: '收藏',
                size: 'lg',
                variant: 'line',
                frosted: true,
                active: true,
            },
        })

        expect(wrapper.classes()).toContain('wa_icon_btn_lg')
        expect(wrapper.classes()).toContain('wa_icon_btn_line')
        expect(wrapper.classes()).toContain('wa_frosted')
        expect(wrapper.classes()).toContain('wa_icon_btn_on')
        expect(wrapper.attributes('aria-pressed')).toBe('true')
    })

    it('shows a spinner and disables the button while loading', () => {
        const wrapper = mount(AppIconButton, {
            props: { name: 'refresh', label: '刷新', loading: true },
        })

        expect(wrapper.find('.wa_spinner').exists()).toBe(true)
        expect(wrapper.attributes('disabled')).toBeDefined()
        expect(wrapper.attributes('aria-busy')).toBe('true')
    })
})
