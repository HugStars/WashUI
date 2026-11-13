import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppPanel from '@ui/src/components/AppPanel.vue'

describe('AppPanel', () => {
    it('renders title, description and default variant', () => {
        const wrapper = mount(AppPanel, {
            props: { title: '运行状态', description: '所有节点在线' },
        })

        expect(wrapper.classes()).toContain('wa_panel_default')
        expect(wrapper.text()).toContain('运行状态')
        expect(wrapper.text()).toContain('所有节点在线')
    })

    it('supports tip, soft and plain variants', () => {
        for (const variant of ['tip', 'soft', 'plain']) {
            const wrapper = mount(AppPanel, {
                props: { variant, title: variant },
            })

            expect(wrapper.classes()).toContain(`wa_panel_${variant}`)
            wrapper.unmount()
        }
    })

    it('renders actions and footer slots', () => {
        const wrapper = mount(AppPanel, {
            props: { title: '同步任务' },
            slots: {
                default: '正文',
                actions: '<button class="action">同步</button>',
                footer: '<button class="footer">日志</button>',
            },
        })

        expect(wrapper.find('.wa_panel_actions .action').exists()).toBe(true)
        expect(wrapper.find('.wa_panel_foot .footer').exists()).toBe(true)
    })
})
