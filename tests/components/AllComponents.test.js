import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import * as components from '@ui/src/components/index.js'
import * as layout from '@ui/src/layout/index.js'

const all = { ...components, ...layout }

afterEach(() => {
    document.body.innerHTML = ''
})

describe('all exported components mount', () => {
    for (const [name, Component] of Object.entries(all)) {
        it(name, () => {
            const wrapper = mount(Component, {
                props: {},
                slots: {
                    default: '内容',
                    trigger: '打开',
                },
                attachTo: document.body,
            })

            expect(wrapper.element).toBeTruthy()
            expect(wrapper.html()).not.toBe('')
            wrapper.unmount()
        })
    }
})
