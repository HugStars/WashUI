import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppBadge from '@ui/src/components/AppBadge.vue'

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

    it('emits click when activated', async () => {
        const wrapper = mount(AppBadge, {
            props: { value: 3 },
        })

        await wrapper.find('.wa_badge_blob').trigger('click')

        expect(wrapper.emitted('click')).toHaveLength(1)
    })
})
