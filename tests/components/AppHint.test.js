import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppHint from '@ui/src/components/AppHint.vue'

describe('AppHint', () => {
    it('renders text without icon for default tone', () => {
        const wrapper = mount(AppHint, {
            props: { text: '保存后生效' },
        })

        expect(wrapper.text()).toContain('保存后生效')
        expect(wrapper.find('.wa_app_hint_icon').exists()).toBe(false)
    })

    it('uses tone icon and text color class', () => {
        const wrapper = mount(AppHint, {
            props: { text: '该操作会清理缓存', tone: 'warning' },
        })

        expect(wrapper.classes()).toContain('wa_app_hint_warning')
        expect(wrapper.find('.wa_app_hint_icon').exists()).toBe(true)
    })

    it('can disable the icon explicitly', () => {
        const wrapper = mount(AppHint, {
            props: { text: '已同步', tone: 'success', icon: false },
        })

        expect(wrapper.find('.wa_app_hint_icon').exists()).toBe(false)
    })

    it('supports box variant and slot content', () => {
        const wrapper = mount(AppHint, {
            props: { tone: 'help', box: true },
            slots: { default: '默认插槽内容' },
        })

        expect(wrapper.classes()).toContain('wa_app_hint_box')
        expect(wrapper.find('.wa_app_hint_text').text()).toBe('默认插槽内容')
    })
})
