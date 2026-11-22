import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppColorPicker from '@ui/src/components/AppColorPicker.vue'

let wrapper

afterEach(() => {
    wrapper?.unmount()
    wrapper = null
    document.body.innerHTML = ''
})

function mountPicker(props = {}) {
    return mount(AppColorPicker, {
        props,
        attachTo: document.body,
        global: { stubs: { teleport: true } },
    })
}

describe('AppColorPicker', () => {
    it('opens the custom panel and shows the current color', async () => {
        wrapper = mountPicker({ modelValue: '#ff0000', label: '颜色' })
        expect(wrapper.find('.wa_color_value').text()).toBe('#ff0000')

        await wrapper.find('.wa_color_trigger').trigger('click')
        await nextTick()

        expect(wrapper.find('.wa_color_panel').exists()).toBe(true)
        expect(wrapper.findAll('.wa_color_preset')).toHaveLength(8)
    })

    it('emits a hex value from a preset', async () => {
        wrapper = mountPicker({ modelValue: '' })
        await wrapper.find('.wa_color_trigger').trigger('click')
        await nextTick()

        await wrapper.findAll('.wa_color_preset')[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#ffffff'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['#ffffff'])
    })

    it('switches output format to hsl', async () => {
        wrapper = mountPicker({ modelValue: '#ff0000', format: 'hsl' })

        expect(wrapper.find('.wa_color_value').text()).toBe('hsl(0, 100%, 50%)')

        await wrapper.find('.wa_color_trigger').trigger('click')
        await nextTick()

        const hslMode = wrapper.findAll('.wa_color_mode').find(item => item.text() === 'HSL')
        expect(hslMode.classes()).toContain('on')
    })

    it('emits rgb values when format is rgb', async () => {
        wrapper = mountPicker({ modelValue: '', format: 'rgb' })
        await wrapper.find('.wa_color_trigger').trigger('click')
        await nextTick()

        await wrapper.findAll('.wa_color_preset')[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['rgb(255, 255, 255)'])
    })

    it('disables the trigger', () => {
        wrapper = mountPicker({ modelValue: '#000000', disabled: true })
        expect(wrapper.find('.wa_color_trigger').attributes('disabled')).toBeDefined()
    })
})
