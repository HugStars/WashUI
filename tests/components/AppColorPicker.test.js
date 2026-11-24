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

    it('keeps the thumb position after the emitted value is written back', async () => {
        wrapper = mountPicker({ modelValue: '#000000' })
        await wrapper.find('.wa_color_trigger').trigger('click')
        await nextTick()

        const area = wrapper.find('.wa_color_area')
        await area.trigger('keydown', { key: 'ArrowUp' })

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#030303'])

        await wrapper.setProps({ modelValue: '#030303' })
        await nextTick()

        const style = wrapper.find('.wa_color_area_thumb').attributes('style')
        expect(style).toContain('left: 0%')
        expect(style).toContain('top: 99%')
    })

    it('keeps the pointer position at pure black after v-model write-back', async () => {
        wrapper = mountPicker({ modelValue: '#ff0000' })
        await wrapper.find('.wa_color_trigger').trigger('click')
        await nextTick()

        const area = wrapper.find('.wa_color_area')
        area.element.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
        })

        const event = new MouseEvent('pointerdown', { bubbles: true, cancelable: true })
        Object.defineProperty(event, 'clientX', { value: 50 })
        Object.defineProperty(event, 'clientY', { value: 100 })
        area.element.dispatchEvent(event)
        await nextTick()

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#000000'])

        await wrapper.setProps({ modelValue: '#000000' })
        await nextTick()

        const style = wrapper.find('.wa_color_area_thumb').attributes('style')
        expect(style).toContain('left: 50%')
        expect(style).toContain('top: 100%')
    })

    it('clears the current color when modelValue is emptied', async () => {
        wrapper = mountPicker({ modelValue: '#ff0000' })
        expect(wrapper.find('.wa_color_value').text()).toBe('#ff0000')

        await wrapper.setProps({ modelValue: '' })
        await nextTick()

        expect(wrapper.find('.wa_color_value').text()).toBe('请选择颜色')
    })

    it('runs change rules after picking a color', async () => {
        wrapper = mountPicker({
            modelValue: '#ff0000',
            rule: { pattern: /^#ffffff$/, message: '只能选白色' },
        })
        await wrapper.find('.wa_color_trigger').trigger('click')
        await nextTick()

        await wrapper.findAll('.wa_color_preset')[0].trigger('click')
        await nextTick()

        expect(wrapper.find('.wa_field_error').text()).toBe('只能选白色')
    })

    it('forwards attrs to the field root', () => {
        wrapper = mount(AppColorPicker, {
            props: { modelValue: '' },
            attrs: { class: 'doc_custom_field', id: 'color-field' },
        })

        expect(wrapper.classes()).toContain('doc_custom_field')
        expect(wrapper.attributes('id')).toBe('color-field')
    })

    it('disables the trigger', () => {
        wrapper = mountPicker({ modelValue: '#000000', disabled: true })
        expect(wrapper.find('.wa_color_trigger').attributes('disabled')).toBeDefined()
    })
})
