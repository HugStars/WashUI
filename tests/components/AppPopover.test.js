import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppPopover from '@ui/src/components/AppPopover.vue'

const Host = {
    components: { AppPopover },
    template: `
        <div class="wa_dialog_mask">
            <AppPopover :width="200">
                <template #trigger="{ triggerProps }">
                    <button type="button" class="trigger" v-bind="triggerProps">打开</button>
                </template>
                <div class="panel_content">内容</div>
            </AppPopover>
        </div>
    `,
}

describe('AppPopover', () => {
    it('raises its z-index above the dialog when opened inside a dialog', async () => {
        const wrapper = mount(Host, {
            attachTo: document.body,
            global: { stubs: { teleport: true } },
        })

        await wrapper.find('.trigger').trigger('click')
        await nextTick()

        const panel = wrapper.find('.wa_popover_panel')
        expect(panel.exists()).toBe(true)
        expect(panel.attributes('style')).toContain('--wa_z_dialog')

        wrapper.unmount()
    })
})
