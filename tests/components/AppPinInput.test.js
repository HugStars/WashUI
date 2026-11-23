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

    it('focuses the first cell when the initial code is empty', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '', length: 6 },
            attachTo: document.body,
        })
        const inputs = wrapper.findAll('.wa_pin_input')

        await inputs[5].trigger('click')

        expect(document.activeElement).toBe(inputs[0].element)
        wrapper.unmount()
    })

    it('focuses the first empty slot when clicking any cell', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '12', length: 4 },
            attachTo: document.body,
        })
        const inputs = wrapper.findAll('.wa_pin_input')

        await inputs[3].trigger('pointerdown')
        await nextTick()
        await nextTick()

        expect(document.activeElement).toBe(inputs[2].element)
        wrapper.unmount()
    })

    it('moves focus from a clicked later cell to the first empty slot', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '12', length: 4 },
            attachTo: document.body,
        })
        const inputs = wrapper.findAll('.wa_pin_input')

        await inputs[3].trigger('click')

        expect(document.activeElement).toBe(inputs[2].element)
        wrapper.unmount()
    })

    it('redirects native focus from a later cell to the first empty slot', () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '12', length: 4 },
            attachTo: document.body,
        })
        const inputs = wrapper.findAll('.wa_pin_input')

        inputs[3].element.focus()

        expect(document.activeElement).toBe(inputs[2].element)
        wrapper.unmount()
    })

    it('corrects focus if the browser focuses the clicked cell after click', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '12', length: 4 },
            attachTo: document.body,
        })
        const inputs = wrapper.findAll('.wa_pin_input')

        await inputs[3].trigger('pointerdown')
        await inputs[3].trigger('click')
        inputs[3].element.focus()

        expect(document.activeElement).toBe(inputs[2].element)
        wrapper.unmount()
    })

    it('keeps a new digit in the first empty slot after v-model sync', async () => {
        const wrapper = mount(AppPinInput, {
            props: { modelValue: '12', length: 6 },
            attachTo: document.body,
        })
        const inputs = wrapper.findAll('.wa_pin_input')

        await wrapper.find('.wa_pin').trigger('pointerdown')
        await nextTick()
        await nextTick()

        await inputs[2].setValue('3')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])

        await wrapper.setProps({ modelValue: '123' })
        await nextTick()

        expect(inputs[0].element.value).toBe('1')
        expect(inputs[1].element.value).toBe('2')
        expect(inputs[2].element.value).toBe('3')
        wrapper.unmount()
    })

    it('selects the virtual keyboard from keyboard or auto mode', async () => {
        const numeric = mount(AppPinInput, {
            props: { modelValue: '', keyboard: 'numeric' },
        })
        expect(numeric.find('.wa_pin_input').attributes('inputmode')).toBe('numeric')

        await numeric.find('.wa_pin_input').setValue('a')
        expect(numeric.find('.wa_pin_input').element.value).toBe('')
        expect(numeric.emitted('update:modelValue')?.at(-1)).toEqual([''])

        const alphanumeric = mount(AppPinInput, {
            props: { modelValue: '', keyboard: 'alphanumeric' },
        })
        const latinInput = alphanumeric.find('.wa_pin_input')
        expect(latinInput.attributes('type')).toBe('password')
        expect(latinInput.attributes('inputmode')).toBeUndefined()
        expect(alphanumeric.find('.wa_pin_char').exists()).toBe(true)

        await latinInput.setValue('中')
        expect(latinInput.element.value).toBe('')

        await latinInput.setValue('A')
        expect(alphanumeric.emitted('update:modelValue')?.at(-1)).toEqual(['A'])
        expect(alphanumeric.find('.wa_pin_char').text()).toBe('A')

        const auto = mount(AppPinInput, {
            props: { modelValue: '', type: 'number' },
        })
        expect(auto.find('.wa_pin_input').attributes('inputmode')).toBe('numeric')
    })

    it('renders password inputs and reflects disabled state', () => {
        const password = mount(AppPinInput, {
            props: { modelValue: '', type: 'password', length: 4 },
        })
        expect(password.find('.wa_pin_input').attributes('type')).toBe('password')

        const disabled = mount(AppPinInput, {
            props: { modelValue: '', length: 4, disabled: true },
        })
        expect(disabled.find('.wa_pin').classes()).toContain('wa_pin_disabled')
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
