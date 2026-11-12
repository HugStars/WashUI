import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, provide, ref } from 'vue'
import PageBar from '@ui/src/layout/PageBar.vue'
import { HEADER_BAR_TARGET } from '@ui/src/core/keys.js'

function Host(placement) {
    return defineComponent({
        setup() {
            const target = ref(null)
            provide(HEADER_BAR_TARGET, target)

            return () => h('div', [
                h('div', { ref: target, class: 'header-target' }),
                h(PageBar, { placement }, () => '操作'),
            ])
        },
    })
}

describe('PageBar', () => {
    it('teleports into the header target when placement is header', async () => {
        const wrapper = mount(Host('header'))
        await nextTick()

        expect(wrapper.find('.header-target').text()).toBe('操作')
    })

    it('stays inline when placement is inline', async () => {
        const wrapper = mount(Host('inline'))
        await nextTick()

        expect(wrapper.find('.header-target').text()).toBe('')
        expect(wrapper.text()).toContain('操作')
    })
})
