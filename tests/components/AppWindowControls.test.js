import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppWindowControls from '@ui/src/components/AppWindowControls.vue'

describe('AppWindowControls', () => {
    it('renders all actions by default and emits events', async () => {
        const wrapper = mount(AppWindowControls)
        const buttons = wrapper.findAll('.wa_icon_btn')

        expect(buttons).toHaveLength(3)

        await buttons[0].trigger('click')
        expect(wrapper.emitted('minimize')).toHaveLength(1)

        await buttons[1].trigger('click')
        expect(wrapper.emitted('maximize')).toHaveLength(1)

        await buttons[2].trigger('click')
        expect(wrapper.emitted('close')).toHaveLength(1)
        expect(buttons[2].classes()).toContain('wa_icon_btn_danger')
    })

    it('renders only the actions in winAction and keeps their order', () => {
        const wrapper = mount(AppWindowControls, {
            props: { winAction: ['close', 'min'] },
        })
        const buttons = wrapper.findAll('.wa_icon_btn')

        expect(buttons).toHaveLength(2)
        expect(buttons[0].classes()).toContain('wa_icon_btn_danger')
        expect(buttons[1].attributes('aria-label')).toBe('最小化')
    })

    it('uses the restore icon when maximized', () => {
        const wrapper = mount(AppWindowControls, {
            props: { winAction: ['max'], maximized: true },
        })

        expect(wrapper.find('.wa_icon_btn').attributes('aria-label')).toBe('还原')
    })
})
