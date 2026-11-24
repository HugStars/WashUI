import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppSelect from '@ui/src/components/AppSelect.vue'

const options = [
    { label: '邮件', value: 'email' },
    { label: '短信', value: 'sms' },
]

describe('AppSelect', () => {
    it('validates the field when the panel closes without a selection', async () => {
        const wrapper = mount(AppSelect, {
            props: {
                modelValue: '',
                options,
                rule: { required: true, message: '请选择通知方式' },
            },
            attachTo: document.body,
        })

        await wrapper.find('.wa_select_trigger').trigger('click')
        await nextTick()
        await wrapper.find('.wa_select_trigger').trigger('click')
        await nextTick()

        expect(wrapper.find('.wa_field_error').text()).toBe('请选择通知方式')
    })
})
