import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppRadioGroup from '@ui/src/components/AppRadioGroup.vue'

const options = [
    { label: '基础版', value: 'basic' },
    { label: '专业版', value: 'pro' },
]

describe('AppRadioGroup', () => {
    it('selects a value through an option', async () => {
        const wrapper = mount(AppRadioGroup, {
            props: { modelValue: 'basic', options },
        })

        await wrapper.findAll('.wa_radio')[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['pro'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['pro'])
    })

    it('renders segmented variant', () => {
        const wrapper = mount(AppRadioGroup, {
            props: { modelValue: 'basic', options, variant: 'segmented' },
        })

        expect(wrapper.classes()).toContain('wa_choice_group_segmented')
        expect(wrapper.findAll('.wa_radio_segmented')).toHaveLength(2)
    })
})
