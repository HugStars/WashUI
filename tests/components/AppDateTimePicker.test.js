import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppDatePicker from '@ui/src/components/AppDatePicker.vue'
import AppDateTimePicker from '@ui/src/components/AppDateTimePicker.vue'
import AppTimePicker from '@ui/src/components/AppTimePicker.vue'

let wrapper

afterEach(() => {
    wrapper?.unmount()
    wrapper = null
    document.body.innerHTML = ''
})

function mountPicker(Component, props = {}) {
    return mount(Component, {
        props,
        attachTo: document.body,
        global: { stubs: { teleport: true } },
    })
}

function findDay(wrapper, day) {
    return wrapper.findAll('.wa_dt_day')
        .find(item => item.text() === String(day) && !item.classes().includes('muted'))
}

describe('AppDatePicker', () => {
    it('opens a custom calendar and selects a day', async () => {
        wrapper = mountPicker(AppDatePicker, { modelValue: '2026-11-15', label: '选择日期' })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        expect(wrapper.find('.wa_dt_panel').exists()).toBe(true)
        expect(wrapper.find('.wa_datetime_value').text()).toBe('2026-11-15')

        await findDay(wrapper, 20).trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-20'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['2026-11-20'])
    })

    it('applies quick options from the panel', async () => {
        wrapper = mountPicker(AppDatePicker, {
            modelValue: '',
            quick: ['2026-11-01', { label: '明天', value: '2026-11-23' }],
        })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        const chips = wrapper.findAll('.wa_dt_quick .wa_chip')
        expect(chips).toHaveLength(2)

        await chips[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-23'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['2026-11-23'])
    })

    it('supports function values in quick options', async () => {
        wrapper = mountPicker(AppDatePicker, {
            modelValue: '',
            quick: [{ label: '今天', value: () => '2026-11-22' }],
        })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        await wrapper.find('.wa_dt_quick .wa_chip').trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-22'])
    })

    it('selects a month with picker=month', async () => {
        wrapper = mountPicker(AppDatePicker, { modelValue: '2026-05-15', picker: 'month' })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        const july = wrapper.findAll('.wa_dt_period').find(item => item.text() === '7 月')
        await july.trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-07'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['2026-07'])
    })

    it('selects a year with picker=year', async () => {
        wrapper = mountPicker(AppDatePicker, { modelValue: '2026-05-15', picker: 'year' })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        const target = wrapper.findAll('.wa_dt_period').find(item => item.text() === '2027')
        await target.trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2027'])
    })

    it('selects an ISO week with picker=week', async () => {
        wrapper = mountPicker(AppDatePicker, { modelValue: '2026-05-15', picker: 'week' })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        await wrapper.find('.wa_dt_week').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0][0]).toMatch(/^\d{4}-W\d{2}$/)
    })

    it('selects a date range', async () => {
        wrapper = mountPicker(AppDatePicker, {
            modelValue: ['2026-11-05', ''],
            range: true,
        })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        await findDay(wrapper, 10).trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-11-05', '2026-11-10']])
        expect(wrapper.emitted('change')?.[0]).toEqual([['2026-11-05', '2026-11-10']])
    })

    it('disables the trigger and quick options', async () => {
        wrapper = mountPicker(AppDatePicker, {
            modelValue: '',
            disabled: true,
            quick: ['2026-11-01'],
        })

        expect(wrapper.find('.wa_datetime').attributes('disabled')).toBeDefined()
    })
})

describe('AppTimePicker', () => {
    it('selects hour and minute in the custom panel', async () => {
        wrapper = mountPicker(AppTimePicker, { modelValue: '09:30' })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        const triggers = wrapper.findAll('.wa_dt_select_trigger')
        await triggers[0].trigger('click')
        await wrapper.find('.wa_dt_select_menu')
            .findAll('.wa_dt_select_item').find(item => item.text() === '10').trigger('click')

        await triggers[1].trigger('click')
        await wrapper.find('.wa_dt_select_menu')
            .findAll('.wa_dt_select_item').find(item => item.text() === '15').trigger('click')

        await wrapper.find('.wa_dt_footer .wa_btn').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:15'])
        expect(wrapper.emitted('change')?.[0]).toEqual(['10:15'])
    })
})

describe('AppDateTimePicker', () => {
    it('selects date and time together', async () => {
        wrapper = mountPicker(AppDateTimePicker, { modelValue: '2026-11-15T09:30' })
        await wrapper.find('.wa_datetime').trigger('click')
        await nextTick()

        await findDay(wrapper, 20).trigger('click')

        const triggers = wrapper.findAll('.wa_dt_select_trigger')
        await triggers[0].trigger('click')
        await wrapper.find('.wa_dt_select_menu')
            .findAll('.wa_dt_select_item').find(item => item.text() === '18').trigger('click')

        await triggers[1].trigger('click')
        await wrapper.find('.wa_dt_select_menu')
            .findAll('.wa_dt_select_item').find(item => item.text() === '45').trigger('click')

        await wrapper.find('.wa_dt_footer .wa_btn').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-11-20T18:45'])
    })

    it('shows date and time in the trigger', async () => {
        wrapper = mountPicker(AppDateTimePicker, { modelValue: '2026-11-15T09:30' })

        expect(wrapper.find('.wa_datetime_value').text()).toBe('2026-11-15 09:30')
    })
})
