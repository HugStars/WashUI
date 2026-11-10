import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppRadioGroup from './AppRadioGroup.vue'

const options = [
    { label: '月付', value: 'month' },
    { label: '年付', value: 'year' },
    { label: '团队', value: 'team' },
]

let wrapper

afterEach(() => {
    wrapper?.unmount()
    wrapper = null
})

describe('AppRadioGroup segmented', () => {
    it('renders a glider and segmented buttons', async () => {
        wrapper = mount(AppRadioGroup, {
            props: { options, modelValue: 'month', variant: 'segmented' },
            attachTo: document.body,
        })
        await nextTick()

        expect(wrapper.find('.wa_choice_group_glider').exists()).toBe(true)
        expect(wrapper.findAll('.wa_radio_segmented')).toHaveLength(3)
        expect(wrapper.find('.wa_radio_segmented.on').exists()).toBe(true)
    })

    it('defaults to md and applies sm / rect modifiers', () => {
        wrapper = mount(AppRadioGroup, {
            props: { options, modelValue: 'month', variant: 'segmented' },
        })
        expect(wrapper.classes()).toContain('wa_choice_group_segmented_md')
        expect(wrapper.classes()).not.toContain('wa_choice_group_segmented_rect')

        wrapper.unmount()
        wrapper = mount(AppRadioGroup, {
            props: { options, modelValue: 'month', variant: 'segmented', size: 'sm', shape: 'rect' },
        })

        expect(wrapper.classes()).toContain('wa_choice_group_segmented_sm')
        expect(wrapper.classes()).toContain('wa_choice_group_segmented_rect')
    })

    it('emits the selected value when an option is clicked', async () => {
        wrapper = mount(AppRadioGroup, {
            props: { options, modelValue: 'month', variant: 'segmented' },
        })

        await wrapper.findAll('.wa_radio_segmented')[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['year'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['year'])
    })

    it('keeps disabled options disabled', () => {
        wrapper = mount(AppRadioGroup, {
            props: {
                options: [{ label: '月付', value: 'month' }, { label: '年付', value: 'year', disabled: true }],
                modelValue: 'month',
                variant: 'segmented',
            },
        })

        expect(wrapper.findAll('.wa_radio_segmented')[1].attributes('disabled')).toBeDefined()
    })
})
