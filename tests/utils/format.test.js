import { describe, expect, it } from 'vitest'
import {
    clamp,
    debounce,
    formatBytes,
    formatBytesFixed,
    formatCount,
    formatCurrency,
    formatDate,
    formatDuration,
    formatMbps,
    formatNumber,
    formatPercent,
    formatRelativeTime,
    formatSpeed,
    padZero,
    throttle,
    truncate
} from '@ui/src/utils/format.js'

describe('formatBytes', () => {
    it('formats byte units', () => {
        expect(formatBytes(0)).toBe('0 B')
        expect(formatBytes(1024)).toBe('1 KB')
        expect(formatBytes(1536)).toBe('1.5 KB')
        expect(formatBytes(1024 * 1024)).toBe('1 MB')
    })

    it('falls back for invalid values', () => {
        expect(formatBytes(-1)).toBe('0 B')
        expect(formatBytes('nope')).toBe('0 B')
        expect(formatBytes(null)).toBe('0 B')
    })
})

describe('formatSpeed', () => {
    it('appends per-second suffix', () => {
        expect(formatSpeed(2048)).toBe('2 KB/s')
    })
})

describe('formatMbps', () => {
    it('converts bytes per second to Mbps', () => {
        expect(formatMbps(1_000_000)).toBe('8.00')
        expect(formatMbps('bad')).toBe('-')
    })
})

describe('formatDuration', () => {
    it('switches from ms to s', () => {
        expect(formatDuration(0)).toBe('0 ms')
        expect(formatDuration(12.34)).toBe('12.3 ms')
        expect(formatDuration(1500)).toBe('1.50 s')
    })
})

describe('formatCount', () => {
    it('uses k / 万 / 亿', () => {
        expect(formatCount(999)).toBe('999')
        expect(formatCount(1000)).toBe('1k')
        expect(formatCount(10_000)).toBe('1万')
        expect(formatCount(15_000)).toBe('1.5万')
        expect(formatCount(100_000_000)).toBe('1亿')
    })

    it('keeps invalid input visible', () => {
        expect(formatCount('bad')).toBe('-')
    })
})

describe('format options', () => {
    it('supports fixed decimals and unit overrides', () => {
        expect(formatBytes(1536, 2)).toBe('1.50 KB')
        expect(formatBytes(1536, { decimals: 2, trimZeros: false })).toBe('1.50 KB')
        expect(formatBytes(1536, { unit: 'MB' })).toBe('0 MB')
        expect(formatBytesFixed(2)(1536)).toBe('1.50 KB')
    })

    it('formats numbers, percents and currency', () => {
        expect(formatNumber(1234567.89)).toBe('1,234,567.89')
        expect(formatPercent(0.256)).toBe('25.6%')
        expect(formatCurrency(1234.5)).toContain('1,234.50')
        expect(formatCurrency(1234.5, { currency: 'USD', locale: 'en-US' })).toBe('$1,234.50')
    })

    it('formats dates and relative time', () => {
        expect(formatDate('2026-11-13T13:00:00', 'YYYY/MM/DD')).toBe('2026/11/13')
        expect(formatDate('2026-11-13T13:00:00')).toBe('2026-11-13 13:00:00')
        expect(formatRelativeTime(Date.now() - 3 * 60 * 1000)).toBe('3 分钟前')
    })

    it('formats text and ranges', () => {
        expect(padZero(7)).toBe('07')
        expect(truncate('WashUI 设计系统', 6)).toBe('WashUI…')
        expect(clamp(120, 0, 100)).toBe(100)
    })

    it('returns debounce and throttle wrappers with cancel', () => {
        const debounced = debounce(() => { }, 100)
        const throttled = throttle(() => { }, 100)

        expect(typeof debounced).toBe('function')
        expect(typeof throttled).toBe('function')
        expect(typeof debounced.cancel).toBe('function')
        expect(typeof throttled.cancel).toBe('function')
    })
})
