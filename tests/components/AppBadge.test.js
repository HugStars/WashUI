import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppBadge from '@ui/src/components/AppBadge.vue'

function MakePointerEvent(type, x, y) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clientX', { value: x })
    Object.defineProperty(event, 'clientY', { value: y })
    return event
}

describe('AppBadge', () => {
    it('caps numeric values at max', () => {
        const wrapper = mount(AppBadge, {
            props: { value: 120, max: 99 },
        })

        expect(wrapper.find('.wa_badge_text').text()).toBe('99+')
        expect(wrapper.find('.wa_badge_blob').attributes('aria-label')).toBe('120 条未读')
        expect(wrapper.classes()).toContain('wa_badge_danger')
    })

    it('renders dot mode without text', () => {
        const wrapper = mount(AppBadge, {
            props: { dot: true, tone: 'accent', size: 'md' },
        })

        expect(wrapper.find('.wa_badge_text').text()).toBe('')
        expect(wrapper.classes()).toEqual(expect.arrayContaining([
            'wa_badge_dot',
            'wa_badge_md',
            'wa_badge_accent',
        ]))
        expect(wrapper.find('.wa_badge_blob').attributes('aria-label')).toBe('有新消息')
    })

    it('renders readonly badges as spans', () => {
        const wrapper = mount(AppBadge, {
            props: { value: 3, readonly: true },
        })

        expect(wrapper.find('.wa_badge_blob').element.tagName).toBe('SPAN')
    })

    it('renders the goo layer only while dragging', async () => {
        const wrapper = mount(AppBadge, {
            props: { value: 3, draggable: true, maxDistance: 20 },
            attachTo: document.body,
        })
        const blob = wrapper.find('.wa_badge_blob')

        expect(wrapper.find('.wa_badge_goo').exists()).toBe(false)

        blob.element.dispatchEvent(MakePointerEvent('pointerdown', 0, 0))
        blob.element.dispatchEvent(MakePointerEvent('pointermove', 30, 0))
        await nextTick()

        expect(wrapper.find('.wa_badge_goo').exists()).toBe(true)
        wrapper.unmount()
    })

    it('bursts at the scaled badge position instead of the pointer position', async () => {
        const wrapper = mount(AppBadge, {
            props: { value: 3, draggable: true, maxDistance: 20 },
            attachTo: document.body,
        })
        const host = wrapper.find('.wa_badge').element
        const blob = wrapper.find('.wa_badge_blob')

        host.getBoundingClientRect = () => ({
            left: 90,
            top: 90,
            width: 20,
            height: 20,
            right: 110,
            bottom: 110,
        })
        // 模拟 scale(.72) 后角标中心：布局中心 100 + 拖动 100 × .72
        blob.element.getBoundingClientRect = () => ({
            left: 164.8,
            top: 164.8,
            width: 14.4,
            height: 14.4,
            right: 179.2,
            bottom: 179.2,
        })

        blob.element.dispatchEvent(MakePointerEvent('pointerdown', 0, 0))
        blob.element.dispatchEvent(MakePointerEvent('pointermove', 100, 100))
        blob.element.dispatchEvent(MakePointerEvent('pointermove', 100, 100))
        await nextTick()

        expect(blob.classes()).toContain('dragging')
        expect(blob.classes()).toContain('broken')

        blob.element.dispatchEvent(MakePointerEvent('pointerup', 100, 100))
        await nextTick()

        const style = wrapper.find('.wa_badge_bursts').attributes('style')
        expect(style).toContain('translate3d(72px, 72px, 0px)')
        wrapper.unmount()
    })

    it('emits click when activated', async () => {
        const wrapper = mount(AppBadge, {
            props: { value: 3 },
        })

        await wrapper.find('.wa_badge_blob').trigger('click')

        expect(wrapper.emitted('click')).toHaveLength(1)
    })
})
