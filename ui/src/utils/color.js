import { clamp } from './format.js'

/**
 * 解析 HEX / RGB(A) / HSL(A) 颜色字符串
 * @param {string} input 颜色字符串
 * @returns {{ r: number, g: number, b: number } | null} RGB 对象，无法解析时返回 null
 */
export function parseColor(input) {
    const value = String(input || '').trim().toLowerCase()

    let match = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/)
    if (match) {
        const hex = match[1].length === 3
            ? match[1].split('').map(char => char + char).join('')
            : match[1]
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16)
        }
    }

    match = value.match(/^rgba?\(([^)]+)\)$/)
    if (match) {
        const parts = match[1].split(/[, ]+/).map(Number)
        if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
            return {
                r: clamp(parts[0], 0, 255),
                g: clamp(parts[1], 0, 255),
                b: clamp(parts[2], 0, 255)
            }
        }
    }

    match = value.match(/^hsla?\(([^)]+)\)$/)
    if (match) {
        const parts = match[1].split(/[, ]+/)
        const read = part => Number(String(part).replace('%', '').replace('deg', ''))
        const h = read(parts[0])
        const s = read(parts[1])
        const l = read(parts[2])
        if ([h, s, l].every(Number.isFinite)) return hslToRgb(h, s, l)
    }

    return null
}

/**
 * RGB 转 HEX
 * @param {{ r: number, g: number, b: number }} rgb RGB 对象
 * @returns {string} 形如 #05cfa4
 */
export function rgbToHex(rgb) {
    return '#' + [rgb.r, rgb.g, rgb.b]
        .map(value => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0'))
        .join('')
}

/**
 * RGB 转 HSV
 * @param {{ r: number, g: number, b: number }} rgb RGB 对象
 * @returns {{ h: number, s: number, v: number }} HSV，s/v 为 0–1
 */
export function rgbToHsv(rgb) {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let h = 0

    if (delta) {
        if (max === r) h = 60 * (((g - b) / delta) % 6)
        else if (max === g) h = 60 * ((b - r) / delta + 2)
        else h = 60 * ((r - g) / delta + 4)
    }

    return { h: (h + 360) % 360, s: max ? delta / max : 0, v: max }
}

/**
 * HSV 转 RGB
 * @param {number} h 色相 0–360
 * @param {number} s 饱和度 0–1
 * @param {number} v 明度 0–1
 * @returns {{ r: number, g: number, b: number }} RGB 对象
 */
export function hsvToRgb(h, s, v) {
    const c = v * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = v - c
    let r = 0
    let g = 0
    let b = 0

    if (h < 60) [r, g, b] = [c, x, 0]
    else if (h < 120) [r, g, b] = [x, c, 0]
    else if (h < 180) [r, g, b] = [0, c, x]
    else if (h < 240) [r, g, b] = [0, x, c]
    else if (h < 300) [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    }
}

/**
 * RGB 转 HSL
 * @param {{ r: number, g: number, b: number }} rgb RGB 对象
 * @returns {{ h: number, s: number, l: number }} HSL，s/l 为 0–100
 */
export function rgbToHsl(rgb) {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let h = 0

    if (delta) {
        if (max === r) h = 60 * (((g - b) / delta) % 6)
        else if (max === g) h = 60 * ((b - r) / delta + 2)
        else h = 60 * ((r - g) / delta + 4)
    }

    const l = (max + min) / 2
    const s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0

    return {
        h: Math.round((h + 360) % 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    }
}

/**
 * HSL 转 RGB
 * @param {number} h 色相 0–360
 * @param {number} s 饱和度 0–100
 * @param {number} l 明度 0–100
 * @returns {{ r: number, g: number, b: number }} RGB 对象
 */
export function hslToRgb(h, s, l) {
    const saturation = clamp(s, 0, 100) / 100
    const lightness = clamp(l, 0, 100) / 100
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation
    const x = c * (1 - Math.abs(((h % 360) / 60) % 2 - 1))
    const m = lightness - c / 2
    let r = 0
    let g = 0
    let b = 0

    const hue = ((h % 360) + 360) % 360
    if (hue < 60) [r, g, b] = [c, x, 0]
    else if (hue < 120) [r, g, b] = [x, c, 0]
    else if (hue < 180) [r, g, b] = [0, c, x]
    else if (hue < 240) [r, g, b] = [0, x, c]
    else if (hue < 300) [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    }
}

/**
 * 按指定格式输出颜色字符串
 * @param {{ r: number, g: number, b: number }} rgb RGB 对象
 * @param {'hex' | 'rgb' | 'hsl'} mode 输出格式
 * @returns {string} 颜色字符串
 */
export function formatColor(rgb, mode) {
    if (!rgb) return ''
    if (mode === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    if (mode === 'hsl') {
        const hsl = rgbToHsl(rgb)
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
    return rgbToHex(rgb)
}
