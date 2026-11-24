import { afterEach, describe, expect, it } from 'vitest'
import { configureIconDefaults, defaultIcons, getIconDefaults } from '@ui/src/core/icons.js'

const Defaults = getIconDefaults()
const Original = {
    ...Defaults,
    spring: Defaults.spring && typeof Defaults.spring === 'object'
        ? { ...Defaults.spring }
        : Defaults.spring,
}

afterEach(() => {
    configureIconDefaults(Original)
})

describe('configureIconDefaults', () => {
    it('updates the global icon motion defaults', () => {
        configureIconDefaults({
            spring: 'bouncy',
            speed: 0.5,
            strokeWidth: 2.2,
            reducedMotion: 'always',
        })

        expect(getIconDefaults()).toMatchObject({
            spring: 'bouncy',
            speed: 0.5,
            strokeWidth: 2.2,
            reducedMotion: 'always',
        })
    })

    it('keeps untouched defaults', () => {
        configureIconDefaults({ speed: 2 })

        expect(getIconDefaults().speed).toBe(2)
        expect(getIconDefaults().strokeWidth).toBe(1.8)
    })
})

describe('default icons', () => {
    it('stores IconNode data instead of raw SVG markup', () => {
        const raw = Object.entries(defaultIcons)
            .filter(([, value]) => typeof value === 'string' && value.trim().startsWith('<'))

        expect(raw).toEqual([])
    })

    it('includes fill brand and device icons', () => {
        for (const name of ['github', 'vue', 'devices']) {
            const icon = defaultIcons[name]

            expect(Array.isArray(icon)).toBe(true)
            expect(icon[0][0]).toBe('path')
            expect(icon[0][1].fill).toBe('currentColor')
            expect(icon[0][1].stroke).toBe('none')
        }
    })
})
