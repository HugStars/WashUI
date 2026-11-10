import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppStepper from '@ui/src/components/AppStepper.vue'

describe('AppStepper', () => {
    it('increments and decrements by step', async () => {
        const wrapper = mount(AppStepper, {
            props: { modelValue: 1.8, min: 1, max: 3, step: 0.1 },
        })
        const buttons = wrapper.findAll('button')

        await buttons[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1.9])

        await buttons[0].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([1.7])
    })

    it('disables arrows at min and max', () => {
        const min = mount(AppStepper, { props: { modelValue: 1, min: 1, max: 3 } })
        expect(min.findAll('button')[0].attributes('disabled')).toBeDefined()

        const max = mount(AppStepper, { props: { modelValue: 3, min: 1, max: 3 } })
        expect(max.findAll('button')[1].attributes('disabled')).toBeDefined()
    })

    it('clamps typed values on change', async () => {
        const wrapper = mount(AppStepper, {
            props: { modelValue: 1, min: 1, max: 3, step: 0.1 },
        })
        const input = wrapper.find('input')

        await input.setValue('9.99')
        await input.trigger('change')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
        expect(input.element.value).toBe('3.0')
    })

    it('does not emit while disabled', async () => {
        const wrapper = mount(AppStepper, {
            props: { modelValue: 1, disabled: true },
        })

        await wrapper.findAll('button')[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
})
