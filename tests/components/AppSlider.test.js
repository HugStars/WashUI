import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppSlider from '@ui/src/components/AppSlider.vue'

let wrapper

afterEach(() => {
    wrapper?.unmount()
    wrapper = null
})

// - jsdom 的 pointer event 不支持直接设置 clientX，手动构造 MouseEvent
function pointerEvent(type, clientX = 0, pointerId = 1) {
    const event = new MouseEvent(type, { clientX, button: 0, bubbles: true, cancelable: true })
    Object.defineProperty(event, 'pointerId', { value: pointerId })
    return event
}

describe('AppSlider', () => {
    it('renders label, value and accessible attributes', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 40, label: '音量', showValue: true, suffix: '%' },
        })

        expect(wrapper.find('.wa_slider_label').text()).toBe('音量')
        expect(wrapper.find('.wa_slider_value').text()).toBe('40%')
        expect(wrapper.find('.wa_slider_value').classes()).not.toContain('wa_slider_value_on_hover')
        expect(wrapper.find('.wa_slider_thumb').attributes('aria-valuenow')).toBe('40')
        expect(wrapper.find('.wa_slider_thumb').attributes('aria-valuemin')).toBe('0')
        expect(wrapper.find('.wa_slider_thumb').attributes('aria-valuemax')).toBe('100')
    })

    it('hides the value by default until hover', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 40, suffix: '%' },
        })

        const value = wrapper.find('.wa_slider_value')
        expect(value.exists()).toBe(true)
        expect(value.classes()).toContain('wa_slider_value_on_hover')
    })

    it('supports always and none value display', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 40, valueDisplay: 'always' },
        })
        expect(wrapper.find('.wa_slider_value').classes()).not.toContain('wa_slider_value_on_hover')

        wrapper.unmount()
        wrapper = mount(AppSlider, {
            props: { modelValue: 40, valueDisplay: 'none' },
        })
        expect(wrapper.find('.wa_slider_value').exists()).toBe(false)
    })

    it('applies the gap between track and value', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 40, valueGap: 18 },
        })

        expect(wrapper.find('.wa_slider_body').attributes('style')).toContain('--wa_slider_gap: 18px')
    })

    it('renders formatted value', () => {
        wrapper = mount(AppSlider, {
            props: {
                modelValue: 0.5,
                valueDisplay: 'always',
                min: 0,
                max: 1,
                step: 0.1,
                format: value => `${Math.round(value * 100)}%`,
            },
        })

        expect(wrapper.find('.wa_slider_value').text()).toBe('50%')
    })

    it('increments and decrements by step with keyboard', async () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 50, step: 5 },
        })
        const thumb = wrapper.find('.wa_slider_thumb')

        await thumb.trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([55])
        expect(wrapper.emitted('change')?.[0]).toEqual([55])

        await thumb.trigger('keydown', { key: 'ArrowLeft' })
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([50])
    })

    it('supports Home, End and PageUp', async () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 50, step: 2 },
        })
        const thumb = wrapper.find('.wa_slider_thumb')

        await thumb.trigger('keydown', { key: 'Home' })
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])

        await thumb.trigger('keydown', { key: 'PageUp' })
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([20])

        await thumb.trigger('keydown', { key: 'End' })
        expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([100])
    })

    it('snaps values to the nearest step', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 12, step: 5 },
        })

        expect(wrapper.find('.wa_slider_thumb').attributes('aria-valuenow')).toBe('10')
    })

    it('does not emit beyond the range', async () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 100 },
        })

        await wrapper.find('.wa_slider_thumb').trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('does not emit while disabled', async () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 50, disabled: true },
        })

        await wrapper.find('.wa_slider_thumb').trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.find('.wa_slider_thumb').attributes('tabindex')).toBe('-1')
    })

    it('uses md by default and applies sm size', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 0.5, valueDisplay: 'always', min: 0, max: 1, step: 0.1 },
        })

        expect(wrapper.classes()).not.toContain('wa_slider_sm')
        expect(wrapper.find('.wa_slider_value').text()).toBe('0.5')

        wrapper.unmount()
        wrapper = mount(AppSlider, {
            props: { modelValue: 50, size: 'sm' },
        })

        expect(wrapper.classes()).toContain('wa_slider_sm')
    })

    it('keeps keyboard values inside allowed ranges', async () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 20, allowedRanges: [20, 80], step: 5 },
        })
        const thumb = wrapper.find('.wa_slider_thumb')

        await thumb.trigger('keydown', { key: 'ArrowLeft' })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await thumb.trigger('keydown', { key: 'End' })
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([80])

        await thumb.trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    })

    it('snaps an out-of-range value to the nearest boundary', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 10, allowedRanges: [20, 80] },
        })

        expect(wrapper.find('.wa_slider_thumb').attributes('aria-valuenow')).toBe('20')
    })

    it('renders disabled segments for the gaps', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 50, allowedRanges: [20, 80] },
        })

        expect(wrapper.findAll('.wa_slider_disabled_range')).toHaveLength(2)
    })

    it('supports multiple allowed ranges', () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 90, allowedRanges: [[0, 20], [80, 100]] },
        })

        expect(wrapper.findAll('.wa_slider_disabled_range')).toHaveLength(1)
        expect(wrapper.find('.wa_slider_thumb').attributes('aria-valuenow')).toBe('90')
    })

    it('keeps keyboard movement inside the current allowed segment', async () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 20, allowedRanges: [[0, 20], [80, 100]], step: 5 },
        })
        const thumb = wrapper.find('.wa_slider_thumb')

        await thumb.trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await thumb.trigger('keydown', { key: 'End' })
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([100])
    })

    it('keeps click animation and switches to dragging only after pointer moves', async () => {
        wrapper = mount(AppSlider, {
            props: { modelValue: 20 },
        })
        const track = wrapper.find('.wa_slider_track')

        track.element.dispatchEvent(pointerEvent('pointerdown', 10))
        await nextTick()
        expect(wrapper.classes()).not.toContain('wa_slider_dragging')

        track.element.dispatchEvent(pointerEvent('pointermove', 30))
        await nextTick()
        expect(wrapper.classes()).toContain('wa_slider_dragging')

        track.element.dispatchEvent(pointerEvent('pointerup', 30))
        await nextTick()
        expect(wrapper.classes()).not.toContain('wa_slider_dragging')
    })
})
