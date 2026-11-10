import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppNumber from '@ui/src/components/AppNumber.vue'

describe('AppNumber', () => {
    it('formats value with decimals, separator, prefix and suffix', async () => {
        const wrapper = mount(AppNumber, {
            props: {
                value: 1234.5,
                decimals: 1,
                separator: true,
                prefix: '$',
                suffix: ' 元',
                animateOnMount: false,
            },
        })
        await nextTick()

        expect(wrapper.text()).toBe('$1,234.5 元')
    })

    it('updates when value changes with no animation duration', async () => {
        const wrapper = mount(AppNumber, {
            props: { value: 12, duration: 0, animateOnMount: false },
        })

        await wrapper.setProps({ value: 42 })

        expect(wrapper.text()).toBe('42')
    })

    it('supports a custom tag', () => {
        const wrapper = mount(AppNumber, {
            props: { value: 1, tag: 'strong', animateOnMount: false },
        })

        expect(wrapper.element.tagName).toBe('STRONG')
    })
})
