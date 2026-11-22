import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppIcon from '@ui/src/components/AppIcon.vue'

describe('AppIcon', () => {
    it('renders a known icon on the 24 grid', () => {
        const wrapper = mount(AppIcon, {
            props: { name: 'home', size: 24 },
        })

        const svg = wrapper.find('svg')
        expect(svg.attributes('viewBox')).toBe('0 0 24 24')
        expect(svg.attributes('width')).toBe('24px')
        expect(svg.findAll('path').length).toBeGreaterThan(0)
    })

    it('renders no path for an unknown icon', () => {
        const wrapper = mount(AppIcon, {
            props: { name: 'does-not-exist' },
        })

        expect(wrapper.find('svg').exists()).toBe(true)
        expect(wrapper.findAll('path')).toHaveLength(0)
    })

    it('renders all raw paths when morph is disabled', () => {
        const wrapper = mount(AppIcon, {
            props: { name: 'home', morph: false },
        })

        expect(wrapper.findAll('path')).toHaveLength(2)
    })

    it('converts a raw SVG string into morphable icon data', () => {
        const wrapper = mount(AppIcon, {
            props: {
                icon: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="currentColor"/></svg>',
            },
        })

        expect(wrapper.find('.wa_icon_raw').exists()).toBe(false)
        expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 24 24')
        expect(wrapper.findAll('path')).toHaveLength(1)
    })

    it('keeps stroke geometry in mixed fill / stroke icons while morphing', async () => {
        const wrapper = mount(AppIcon, {
            props: { name: 'list', size: 24 },
        })
        await nextTick()

        const d = wrapper.find('path').attributes('d') || ''
        const values = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || []

        // list 的三条线延伸到 x=21，只渲染圆点时最大 x 约为 4.5
        expect(Math.max(...values)).toBeGreaterThan(20)
    })
})
