import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppSwitch from '@ui/src/components/AppSwitch.vue'

describe('AppSwitch', () => {
    it('toggles and emits the next value', async () => {
        const wrapper = mount(AppSwitch, {
            props: { modelValue: false, label: '通知' },
        })

        await wrapper.find('.wa_switch').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
        expect(wrapper.emitted('change')?.[0]).toEqual([true])
        expect(wrapper.text()).toContain('通知')
    })

    it('does not emit while disabled', async () => {
        const wrapper = mount(AppSwitch, {
            props: { modelValue: true, disabled: true, label: '通知' },
        })

        await wrapper.find('.wa_switch').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.find('.wa_switch').attributes('disabled')).toBeDefined()
        expect(wrapper.find('.wa_switch').attributes('aria-checked')).toBe('true')
    })
})
