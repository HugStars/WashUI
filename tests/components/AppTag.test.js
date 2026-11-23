import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppTag from '@ui/src/components/AppTag.vue'

describe('AppTag', () => {
    it('renders text and tone class', () => {
        const wrapper = mount(AppTag, {
            props: { text: '成功', tone: 'success' },
        })

        expect(wrapper.text()).toBe('成功')
        expect(wrapper.classes()).toContain('wa_tag_success')
    })

    it('wraps text prop in a label for ellipsis', () => {
        const wrapper = mount(AppTag, {
            props: { text: '成功' },
        })

        expect(wrapper.find('.wa_tag_text > .wa_tag_label').text()).toBe('成功')
    })

    it('keeps slot content inside the flex text wrapper', () => {
        const wrapper = mount(AppTag, {
            slots: { default: '<span class="slot-icon"></span>在线' },
        })

        expect(wrapper.find('.wa_tag_text > .slot-icon').exists()).toBe(true)
        expect(wrapper.find('.wa_tag_label').exists()).toBe(false)
    })

    it('applies size, mono, frosted, pill and expand modifiers', () => {
        const wrapper = mount(AppTag, {
            props: {
                text: '标签',
                size: 'md',
                mono: false,
                frosted: true,
                pill: true,
                expand: true,
            },
        })

        expect(wrapper.classes()).toEqual(expect.arrayContaining([
            'wa_tag_md',
            'wa_tag_sans',
            'wa_tag_frosted',
            'wa_tag_pill',
            'wa_tag_expand',
        ]))
    })
})
