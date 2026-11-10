import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppCard from '@ui/src/components/AppCard.vue'
import AppCheck from '@ui/src/components/AppCheck.vue'
import AppChip from '@ui/src/components/AppChip.vue'
import AppEmpty from '@ui/src/components/AppEmpty.vue'
import AppPanel from '@ui/src/components/AppPanel.vue'
import AppRadio from '@ui/src/components/AppRadio.vue'
import AppSkeleton from '@ui/src/components/AppSkeleton.vue'
import AppSpinner from '@ui/src/components/AppSpinner.vue'
import AppStat from '@ui/src/components/AppStat.vue'
import AppTextarea from '@ui/src/components/AppTextarea.vue'

describe('basic components', () => {
    it('AppCard renders title, slots and modifiers', () => {
        const wrapper = mount(AppCard, {
            props: { title: '卡片', compact: true, frosted: true },
            slots: {
                default: '内容',
                extra: '更多',
                footer: '页脚',
            },
        })

        expect(wrapper.text()).toContain('卡片')
        expect(wrapper.text()).toContain('内容')
        expect(wrapper.text()).toContain('更多')
        expect(wrapper.text()).toContain('页脚')
        expect(wrapper.classes()).toEqual(expect.arrayContaining([
            'wa_card',
            'wa_card_compact',
            'wa_frosted',
        ]))
    })

    it('AppChip renders active state', () => {
        const wrapper = mount(AppChip, {
            props: { active: true, text: '筛选', frosted: true, size: 'sm' },
        })

        expect(wrapper.text()).toBe('筛选')
        expect(wrapper.classes()).toEqual(expect.arrayContaining([
            'wa_chip',
            'on',
            'wa_frosted',
            'wa_chip_sm',
        ]))
        expect(wrapper.attributes('aria-pressed')).toBe('true')
    })

    it('AppEmpty renders default and custom text', () => {
        const fallback = mount(AppEmpty)
        expect(fallback.text()).toBe('暂无数据')

        const custom = mount(AppEmpty, { props: { text: '没有记录' } })
        expect(custom.text()).toBe('没有记录')
    })

    it('AppStat renders label and value', () => {
        const wrapper = mount(AppStat, {
            props: { label: '在线', value: 12 },
        })

        expect(wrapper.find('.wa_stat_label').text()).toBe('在线')
        expect(wrapper.find('.wa_stat_value').text()).toBe('12')
    })

    it('AppSkeleton applies size styles', () => {
        const wrapper = mount(AppSkeleton, {
            props: { width: 120, height: 18, radius: 6 },
        })

        expect(wrapper.attributes('style')).toContain('width: 120px')
        expect(wrapper.attributes('style')).toContain('height: 18px')
        expect(wrapper.attributes('style')).toContain('border-radius: 6px')
    })

    it('AppSpinner applies size styles', () => {
        const wrapper = mount(AppSpinner, {
            props: { size: 32 },
        })

        expect(wrapper.attributes('style')).toContain('width: 32px')
        expect(wrapper.attributes('style')).toContain('height: 32px')
    })

    it('AppPanel renders tone, title, description and body', () => {
        const wrapper = mount(AppPanel, {
            props: {
                title: '提示',
                description: '说明',
                tone: 'warning',
                compact: true,
            },
            slots: { default: '内容' },
        })

        expect(wrapper.text()).toContain('提示')
        expect(wrapper.text()).toContain('说明')
        expect(wrapper.text()).toContain('内容')
        expect(wrapper.classes()).toEqual(expect.arrayContaining([
            'wa_panel_warning',
            'wa_panel_compact',
        ]))
    })

    it('AppCheck emits checked state', async () => {
        const wrapper = mount(AppCheck, {
            props: { modelValue: false, label: '同意' },
        })

        await wrapper.find('.wa_check').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
        expect(wrapper.text()).toContain('同意')
    })

    it('AppRadio emits checked state', async () => {
        const wrapper = mount(AppRadio, {
            props: { modelValue: false, label: '选项' },
        })

        await wrapper.find('.wa_radio').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
        expect(wrapper.text()).toContain('选项')
    })

    it('AppTextarea emits input and renders counter', async () => {
        const wrapper = mount(AppTextarea, {
            props: {
                modelValue: 'abc',
                maxlength: 10,
                showCount: true,
            },
        })

        await wrapper.find('textarea').setValue('hello')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
        expect(wrapper.find('.wa_textarea_count').text()).toBe('3 / 10')
    })
})
