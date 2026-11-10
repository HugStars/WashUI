import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppButton from '@ui/src/components/AppButton.vue'

describe('AppButton', () => {
    it('renders a button with slot content and native type', () => {
        const wrapper = mount(AppButton, {
            props: { type: 'submit' },
            slots: { default: '保存' },
        })

        expect(wrapper.element.tagName).toBe('BUTTON')
        expect(wrapper.attributes('type')).toBe('submit')
        expect(wrapper.text()).toBe('保存')
        expect(wrapper.classes()).toEqual(expect.arrayContaining(['wa_btn', 'wa_btn_sm']))
    })

    it('applies variant, size and frosted classes', () => {
        const wrapper = mount(AppButton, {
            props: {
                variant: 'primary',
                size: 'sm',
                frosted: true,
            },
        })

        expect(wrapper.classes()).toEqual(expect.arrayContaining([
            'wa_btn',
            'wa_btn_primary',
            'wa_btn_sm',
            'wa_frosted',
        ]))
    })

    it('does not add a modifier class for the default variant', () => {
        const wrapper = mount(AppButton)

        expect(wrapper.classes()).toContain('wa_btn')
        expect(wrapper.classes()).not.toContain('wa_btn_default')
    })

    it('disables the button and exposes busy state while loading', () => {
        const wrapper = mount(AppButton, {
            props: { loading: true },
        })

        expect(wrapper.classes()).toContain('wa_btn_loading')
        expect(wrapper.attributes('disabled')).toBeDefined()
        expect(wrapper.attributes('aria-busy')).toBe('true')
        expect(wrapper.find('.wa_spinner').exists()).toBe(true)
    })

    it('does not render loading UI by default', () => {
        const wrapper = mount(AppButton)

        expect(wrapper.find('.wa_spinner').exists()).toBe(false)
        expect(wrapper.attributes('aria-busy')).toBeUndefined()
        expect(wrapper.attributes('disabled')).toBeUndefined()
    })

    it('supports the disabled and icon variants', () => {
        const wrapper = mount(AppButton, {
            props: {
                variant: 'icon',
                size: 'sm',
                disabled: true,
            },
            attrs: { 'aria-label': '关闭' },
            slots: { default: '×' },
        })

        expect(wrapper.classes()).toEqual(expect.arrayContaining([
            'wa_btn',
            'wa_btn_icon',
            'wa_btn_sm',
        ]))
        expect(wrapper.attributes('disabled')).toBeDefined()
        expect(wrapper.attributes('aria-label')).toBe('关闭')
    })
})
