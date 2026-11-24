import { describe, expect, it } from 'vitest'
import {
    formatColor,
    hslToRgb,
    hsvToRgb,
    parseColor,
    rgbToHex,
    rgbToHsl,
    rgbToHsv,
} from '@ui/src/utils/color.js'

describe('color utils', () => {
    it('parses hex, rgb and hsl strings', () => {
        expect(parseColor('#0f0')).toEqual({ r: 0, g: 255, b: 0 })
        expect(parseColor('rgb(255, 128, 0)')).toEqual({ r: 255, g: 128, b: 0 })
        expect(parseColor('hsl(120, 50%, 50%)')).toEqual({ r: 64, g: 191, b: 64 })
        expect(parseColor('not-a-color')).toBeNull()
    })

    it('converts between rgb, hsv and hsl', () => {
        expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
        expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 1, v: 1 })
        expect(hsvToRgb(0, 1, 1)).toEqual({ r: 255, g: 0, b: 0 })
        expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
        expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('formats colors by mode', () => {
        const rgb = { r: 5, g: 207, b: 164 }
        expect(formatColor(rgb, 'hex')).toBe('#05cfa4')
        expect(formatColor(rgb, 'rgb')).toBe('rgb(5, 207, 164)')
        expect(formatColor(rgb, 'hsl')).toBe('hsl(167, 95%, 42%)')
        expect(formatColor(null, 'hex')).toBe('')
    })
})
