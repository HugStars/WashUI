import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AppSelectPanel from '@ui/src/components/AppSelectPanel.vue'

const options = [
    { label: 'Alpha', value: 'a' },
    { label: 'Beta', value: 'b', disabled: true },
    { label: 'Gamma', value: 'c' },
]

let wrapper

afterEach(() => {
    wrapper?.unmount()
    wrapper = null
    document.body.innerHTML = ''
})

async function settle() {
    await nextTick()
    await nextTick()
    await nextTick()
}

describe('AppSelectPanel', () => {
    it('uses roving tabindex', () => {
        wrapper = mount(AppSelectPanel, {
            props: { options, modelValue: 'c' },
            attachTo: document.body,
        })

        const items = wrapper.findAll('.wa_select_option')
        expect(items.map(item => item.attributes('tabindex'))).toEqual(['-1', '-1', '0'])
    })

    it('focuses the selected item on mount when autofocus is set', async () => {
        wrapper = mount(AppSelectPanel, {
            props: { options, modelValue: 'c', autofocus: true },
            attachTo: document.body,
        })
        await settle()

        expect(document.activeElement?.textContent).toContain('Gamma')
    })

    it('moves focus with arrow keys and skips disabled items', async () => {
        wrapper = mount(AppSelectPanel, {
            props: { options, modelValue: 'c', autofocus: true },
            attachTo: document.body,
        })
        await settle()

        const panel = wrapper.find('.wa_select_panel')
        await panel.trigger('keydown', { key: 'ArrowDown' })
        expect(document.activeElement?.textContent).toContain('Alpha')

        await panel.trigger('keydown', { key: 'ArrowDown' })
        expect(document.activeElement?.textContent).toContain('Gamma')

        await panel.trigger('keydown', { key: 'Home' })
        expect(document.activeElement?.textContent).toContain('Alpha')

        await panel.trigger('keydown', { key: 'End' })
        expect(document.activeElement?.textContent).toContain('Gamma')

        await panel.trigger('keydown', { key: 'ArrowUp' })
        expect(document.activeElement?.textContent).toContain('Alpha')
    })

    it('does not steal focus without autofocus', async () => {
        const outside = document.createElement('button')
        document.body.appendChild(outside)
        outside.focus()

        wrapper = mount(AppSelectPanel, {
            props: { options, modelValue: 'c' },
            attachTo: document.body,
        })
        await settle()

        expect(document.activeElement).toBe(outside)
    })
})
