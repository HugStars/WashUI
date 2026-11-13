import { describe, expect, it } from 'vitest'
import { searchDocs, searchItems } from '@docs/search.js'

describe('searchDocs', () => {
    it('finds pages by Chinese label', () => {
        const results = searchDocs('表格')
        expect(results[0]?.path).toBe('/components/table')
    })

    it('finds pages by component name', () => {
        const results = searchDocs('AppTable')
        expect(results.some(item => item.path === '/components/table')).toBe(true)
    })

    it('matches every whitespace-separated term', () => {
        expect(searchDocs('表单 输入').some(item => item.path === '/components/input')).toBe(true)
        expect(searchDocs('表单 不存在的词')).toEqual([])
    })

    it('respects the result limit', () => {
        expect(searchDocs('a', 3)).toHaveLength(3)
    })

    it('returns nothing for an empty query', () => {
        expect(searchDocs('  ')).toEqual([])
    })
})

describe('searchItems', () => {
    it('contains guides, components, layouts and abilities', () => {
        const paths = searchItems.map(item => item.path)
        expect(paths).toContain('/guide/install')
        expect(paths).toContain('/components/button')
        expect(paths).toContain('/components/list')
        expect(paths).toContain('/components/hint')
        expect(paths).toContain('/components/pin-input')
        expect(paths).toContain('/layout')
        expect(paths).toContain('/composables/theme')
        expect(paths).toContain('/services/toast')
        expect(paths).toContain('/tokens')
    })

    it('exposes split utility pages and removes the old overview', () => {
        const paths = searchItems.map(item => item.path)
        expect(paths).toContain('/utils/bytes')
        expect(paths).toContain('/utils/number')
        expect(paths).toContain('/utils/date')
        expect(paths).toContain('/utils/async')
        expect(paths).not.toContain('/utils')
    })
})
