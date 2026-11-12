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
})
