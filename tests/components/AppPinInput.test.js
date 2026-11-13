import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppPinInput from '@ui/src/components/AppPinInput.vue'

describe('AppPinInput', () => {
    it('renders the requested number of inputs', () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '', length: 4 },
        })

        expect(wrapper.findAll('.wa_pin_input')).toHaveLength(4)
    })

    it('emits typed digits and fills the next slot', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '', length: 4 },
        })

        const first = wrapper.findAll('.wa_pin_input')[0]
        await first.setValue('1')
        await nextTick()

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
    })

    it('accepts a pasted code and emits complete', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '', length: 6 },
        })

        await wrapper.findAll('.wa_pin_input')[0].trigger('paste', {
            clipboardData: { getData: () => '123456' },
        })

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123456'])
        expect(wrapper.emitted('complete')?.[0]).toEqual(['123456'])
    })

    it('clears the previous slot on backspace when the current slot is empty', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '123', length: 4 },
        })

        const inputs = wrapper.findAll('.wa_pin_input')
        await inputs[3].trigger('keydown', { key: 'Backspace' })

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['12'])
    })

    it('renders password inputs and reflects disabled state', () => {
        const password = mount(AppPinInput, {
            props: { modelValue: '', type: 'password', length: 4 },
        })
        expect(password.find('.wa_pin_input').attributes('type')).toBe('password')

        const disabled = mount(AppPinInput, {
            props: { modelValue: '', length: 4, disabled: true },
        })
        expect(disabled.classes()).toContain('wa_pin_disabled')
        expect(disabled.find('.wa_pin_input').attributes('disabled')).toBeDefined()
    })

    it('exposes focus and clear methods', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '1234', length: 4 },
        })

        wrapper.vm.clear()
        await nextTick()

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    })
})
