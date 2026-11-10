import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppDialog from '@ui/src/components/AppDialog.vue'
import AppSelect from '@ui/src/components/AppSelect.vue'
import AppThemeToggle from '@ui/src/components/AppThemeToggle.vue'

afterEach(() => {
    document.body.innerHTML = ''
})

describe('interactive components', () => {
    it('AppSelect shows the selected label and disabled state', () => {
        const wrapper = mount(AppSelect, {
            props: {
                label: '环境',
                modelValue: 'prod',
                options: [
                    { label: '开发', value: 'dev' },
                    { label: '生产', value: 'prod' },
                ],
            },
        })

        expect(wrapper.text()).toContain('环境')
        expect(wrapper.find('.wa_select_value').text()).toBe('生产')

        const disabled = mount(AppSelect, {
            props: {
                modelValue: 'prod',
                options: [{ label: '生产', value: 'prod' }],
                disabled: true,
            },
        })
        expect(disabled.find('.wa_select_trigger').attributes('disabled')).toBeDefined()
    })

    it('AppDialog renders open content and requests close', async () => {
        const wrapper = mount(AppDialog, {
            props: { open: true, title: '弹框标题' },
            slots: { default: '弹框内容' },
            attachTo: document.body,
        })
        await nextTick()

        expect(document.querySelector('.wa_dialog')).not.toBeNull()
        expect(document.querySelector('.wa_dialog_title')?.textContent).toBe('弹框标题')
        expect(document.querySelector('.wa_dialog_body')?.textContent).toContain('弹框内容')

        document.querySelector('.wa_dialog_close')?.click()
        await nextTick()

        expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
        wrapper.unmount()
    })

    it('AppThemeToggle emits theme changes', async () => {
        const wrapper = mount(AppThemeToggle)

        expect(wrapper.attributes('aria-label')).toMatch(/切换到/)
        await wrapper.trigger('click')

        expect(wrapper.emitted('change')).toHaveLength(1)
        expect(['light', 'dark']).toContain(wrapper.emitted('change')?.[0]?.[0])
    })
})
