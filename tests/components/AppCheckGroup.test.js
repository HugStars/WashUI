import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppCheckGroup from '@ui/src/components/AppCheckGroup.vue'

const options = [
    { label: '邮件', value: 'email' },
    { label: '短信', value: 'sms' },
]

describe('AppCheckGroup', () => {
    it('selects a value through an option', async () => {
        const wrapper = mount(AppCheckGroup, {
            props: { modelValue: [], options },
        })

        await wrapper.findAll('.wa_check')[0].trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['email']])
        expect(wrapper.emitted('change')?.[0]).toEqual([['email']])
    })

    it('does not emit for disabled options', async () => {
        const wrapper = mount(AppCheckGroup, {
            props: {
                modelValue: [],
                options: [{ label: '不可用', value: 'off', disabled: true }],
            },
        })

        await wrapper.find('.wa_check').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
})
