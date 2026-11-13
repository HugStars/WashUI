import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppSpinner from '@ui/src/components/AppSpinner.vue'

describe('AppSpinner', () => {
    it('renders the rotating ring by default', () => {
        const wrapper = mount(AppSpinner, {
            props: { size: 18 },
        })

        expect(wrapper.classes()).toContain('wa_spinner')
        expect(wrapper.classes()).not.toContain('wa_spinner_dotted')
        expect(wrapper.find('.wa_spinner_dot').exists()).toBe(false)
        expect(wrapper.attributes('style')).toContain('18px')
    })

    it('renders a standalone breathing dot in dot mode', () => {
        const wrapper = mount(AppSpinner, {
            props: { dot: true, size: 16 },
        })

        expect(wrapper.classes()).toContain('wa_spinner_dotted')
        expect(wrapper.find('.wa_spinner_dot').exists()).toBe(true)
    })
})
