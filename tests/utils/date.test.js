import { describe, expect, it } from 'vitest'
import {
    getISOWeekNumber,
    normalizeDateValue,
    parseDateValue,
    parseTimeValue,
    startOfMonth,
    startOfWeek,
} from '@ui/src/utils/format.js'

describe('date utils', () => {
    it('parses date and time values defensively', () => {
        expect(formatKey(parseDateValue('2026-11-15'))).toBe('2026-11-15')
        expect(formatKey(parseDateValue('2026-11-15T10:20'))).toBe('2026-11-15')
        expect(formatKey(parseDateValue('2026-11'))).toBe('2026-11-01')
        expect(formatKey(parseDateValue('2026'))).toBe('2026-01-01')
        expect(formatKey(parseDateValue('2024-W01'))).toBe('2024-01-01')
        expect(parseDateValue('2026-02-31')).toBeNull()
        expect(parseDateValue('')).toBeNull()
        expect(parseDateValue('not-a-date')).toBeNull()
        expect(parseTimeValue('09:30')).toEqual({ hour: 9, minute: 30 })
        expect(parseTimeValue('bad')).toBeNull()
        expect(normalizeDateValue('2026-11-15 10:20')).toBe('2026-11-15')
        expect(normalizeDateValue('bad')).toBe('')
    })

    it('calculates month, Monday and ISO week boundaries', () => {
        expect(formatKey(startOfMonth(new Date(2026, 10, 24)))).toBe('2026-11-01')
        expect(formatKey(startOfWeek(new Date(2026, 10, 24)))).toBe('2026-11-23')
        expect(getISOWeekNumber(new Date(2024, 0, 1))).toBe(1)
        expect(getISOWeekNumber(new Date(2024, 11, 30))).toBe(1)
    })
})

function formatKey(date) {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}
