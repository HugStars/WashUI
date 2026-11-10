import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppInput from '@ui/src/components/AppInput.vue'

describe('AppInput', () => {
    it('renders label and emits typed value', async () => {
        const wrapper = mount(AppInput, {
            props: { modelValue: 'abc', label: '名称' },
        })

        expect(wrapper.text()).toContain('名称')

        await wrapper.find('input').setValue('hello')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
    })

    it('clears the value and emits clear', async () => {
        const wrapper = mount(AppInput, {
            props: { modelValue: 'abc', clearable: true },
        })

        await wrapper.find('.wa_input_clear').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
        expect(wrapper.emitted('clear')).toHaveLength(1)
    })

    it('shows validation errors on blur', async () => {
        const wrapper = mount(AppInput, {
            props: {
                modelValue: '',
                rule: { required: true, message: '必填' },
            },
        })

        await wrapper.find('input').trigger('blur')

        expect(wrapper.find('.wa_field_error').text()).toBe('必填')
    })
})
