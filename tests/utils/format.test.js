import { describe, expect, it } from 'vitest'
import { formatBytes, formatCount, formatDuration, formatMbps, formatSpeed } from '@ui/src/utils/format.js'

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
