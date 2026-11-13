import { afterEach, describe, expect, it } from 'vitest'
import { configureIconDefaults, defaultIcons, getIconDefaults } from '@ui/src/core/icons.js'

const Original = {
    spring: { stiffness: 520, damping: 34 },
    speed: 1,
    strokeWidth: 1.8,
    reducedMotion: 'user',
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

    it('includes a fill github icon', () => {
        const icon = defaultIcons.github

        expect(Array.isArray(icon)).toBe(true)
        expect(icon[0][0]).toBe('path')
        expect(icon[0][1].fill).toBe('currentColor')
        expect(icon[0][1].stroke).toBe('none')
    })
})
