import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppDeskShell from '@ui/src/layout/AppDeskShell.vue'

const items = [
    { label: '书架', value: 'home', icon: 'book' },
    { label: '设置', value: 'settings', icon: 'settings', badge: 2 },
]

const baseConfig = {
    title: { show: true, text: 'Read Books', icon: 'book' },
    header: { title: '书架', winAction: ['min', 'close'] },
    aside: { mode: 'icon-text', variant: 'plain' },
    main: { toolbar: { show: false, height: 40 } },
    window: { height: 420 },
}

describe('AppDeskShell', () => {
    it('renders title, header, AppNavMenu items and main slot', () => {
        const wrapper = mount(AppDeskShell, {
            props: { config: baseConfig, items, active: 'settings' },
            slots: { default: '主内容' },
        })

        expect(wrapper.find('.wa_desk_title').text()).toContain('Read Books')
        expect(wrapper.find('.wa_desk_header').text()).toContain('书架')
        expect(wrapper.findAll('.wa_nav_menu_link')).toHaveLength(2)
        expect(wrapper.find('.wa_nav_menu_link.on').text()).toContain('设置')
        expect(wrapper.find('.wa_desk_main').text()).toBe('主内容')
    })

    it('emits navigate and update:active when a nav item is clicked', async () => {
        const wrapper = mount(AppDeskShell, {
            props: { config: baseConfig, items, active: 'home' },
        })

        await wrapper.findAll('.wa_nav_menu_link')[1].trigger('click')
        expect(wrapper.emitted('navigate')?.[0]?.[0]).toMatchObject({ value: 'settings' })
        expect(wrapper.emitted('update:active')?.[0]).toEqual(['settings'])
    })

    it('supports icon, text and plain aside modes', () => {
        const icon = mount(AppDeskShell, {
            props: { config: { ...baseConfig, aside: { mode: 'icon', variant: 'plain' } }, items },
        })
        expect(icon.classes()).toContain('wa_desk_aside_icon')
        expect(icon.classes()).toContain('wa_desk_aside_plain')

        const text = mount(AppDeskShell, {
            props: { config: { ...baseConfig, aside: { mode: 'text', variant: 'bordered' } }, items },
        })
        expect(text.classes()).toContain('wa_desk_aside_text')
        expect(text.classes()).toContain('wa_desk_aside_bordered')
    })

    it('switches title fallback layout', () => {
        const header = mount(AppDeskShell, {
            props: { config: { ...baseConfig, title: { show: false, fallback: 'header' } }, items },
        })
        expect(header.classes()).toContain('wa_desk_title_hide')
        expect(header.classes()).toContain('wa_desk_fallback_header')

        const aside = mount(AppDeskShell, {
            props: { config: { ...baseConfig, title: { show: false, fallback: 'aside' } }, items },
        })
        expect(aside.classes()).toContain('wa_desk_fallback_aside')
    })

    it('hides the aside when there is no nav content', () => {
        const wrapper = mount(AppDeskShell, {
            props: { config: baseConfig },
        })

        expect(wrapper.find('.wa_desk_aside').exists()).toBe(false)
        expect(wrapper.classes()).toContain('wa_desk_no_aside')
    })

    it('renders the footer toolbar only when enabled', () => {
        const config = {
            ...baseConfig,
            main: { toolbar: { show: true, height: 40 } },
        }
        const wrapper = mount(AppDeskShell, {
            props: { config, items },
            slots: { toolbar: '状态栏' },
        })

        expect(wrapper.find('.wa_desk_toolbar').text()).toBe('状态栏')
    })

    it('renders window controls from winAction and emits close mode', async () => {
        const wrapper = mount(AppDeskShell, {
            props: {
                config: { ...baseConfig, header: { ...baseConfig.header, closeMode: 'app' } },
                items,
            },
        })
        const buttons = wrapper.findAll('.wa_window_controls .wa_icon_btn')

        expect(buttons).toHaveLength(2)
        await buttons[1].trigger('click')
        expect(wrapper.emitted('close')?.[0]).toEqual(['app'])
    })

    it('renders title, header, aside footer and toolbar slots', () => {
        const config = {
            ...baseConfig,
            main: { toolbar: { show: true } },
        }
        const wrapper = mount(AppDeskShell, {
            props: { config, items, active: 'home' },
            slots: {
                title: '自定义标题',
                'header-left': '自定义页面名',
                'header-actions': '全局操作',
                'aside-footer': '侧栏底部',
                toolbar: '状态栏',
            },
        })

        expect(wrapper.find('.wa_desk_title').text()).toContain('自定义标题')
        expect(wrapper.find('.wa_desk_header_left').text()).toContain('自定义页面名')
        expect(wrapper.find('.wa_desk_header_center').text()).toContain('全局操作')
        expect(wrapper.find('.wa_desk_aside_footer').text()).toContain('侧栏底部')
        expect(wrapper.find('.wa_desk_toolbar').text()).toContain('状态栏')
    })
})
