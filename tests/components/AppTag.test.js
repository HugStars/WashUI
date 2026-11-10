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
