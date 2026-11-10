import { describe, expect, it } from 'vitest'
import { codeLanguageLabel, codeLanguageNames, normalizeCodeLang } from '@ui/src/core/code_languages.js'

describe('normalizeCodeLang', () => {
    it('normalizes aliases and case', () => {
        expect(normalizeCodeLang('JavaScript')).toBe('js')
        expect(normalizeCodeLang('sh')).toBe('bash')
        expect(normalizeCodeLang('Markdown')).toBe('md')
        expect(normalizeCodeLang('yml')).toBe('yaml')
        expect(normalizeCodeLang('typescript')).toBe('ts')
    })

    it('falls back to plain', () => {
        expect(normalizeCodeLang('')).toBe('plain')
        expect(normalizeCodeLang(undefined)).toBe('plain')
        expect(normalizeCodeLang('unknown')).toBe('unknown')
    })
})

describe('codeLanguageLabel', () => {
    it('returns a readable label', () => {
        expect(codeLanguageLabel('javascript')).toBe('JavaScript')
        expect(codeLanguageLabel('plain')).toBe('Plain text')
        expect(codeLanguageLabel('not-a-lang')).toBe('not-a-lang')
    })
})

describe('codeLanguageNames', () => {
    it('contains the public language list', () => {
        expect(codeLanguageNames).toContain('js')
        expect(codeLanguageNames).toContain('html')
        expect(codeLanguageNames).toContain('plain')
    })
})
