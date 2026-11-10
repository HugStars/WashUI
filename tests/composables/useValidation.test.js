import { effectScope, nextTick, reactive, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useValidation } from '@ui/src/composables/useValidation.js'

let scope

beforeEach(() => {
    scope = effectScope()
})

afterEach(() => {
    scope.stop()
})

function setup(rule, initial = '') {
    const value = ref(initial)
    const props = reactive({ rule, error: '' })
    const api = scope.run(() => useValidation(props, () => value.value))
    return { value, props, ...api }
}

describe('useValidation', () => {
    it('validates required fields', () => {
        const { OnBlur, DisplayError } = setup({ required: true, message: '必填' })

        expect(OnBlur('')).toBe('必填')
        expect(DisplayError.value).toBe('必填')
        expect(OnBlur('ok')).toBe('')
    })

    it('validates length with min and max', () => {
        const { OnBlur } = setup({ min: 3, max: 5 })

        expect(OnBlur('ab')).toBe('至少 3 个字符')
        expect(OnBlur('abcdef')).toBe('最多 5 个字符')
        expect(OnBlur('abc')).toBe('')
    })

    it('resets lastIndex for global regular expressions', () => {
        const { OnBlur } = setup({ pattern: /^a$/g })

        expect(OnBlur('a')).toBe('')
        expect(OnBlur('a')).toBe('')
        expect(OnBlur('b')).toBe('格式不正确')
        expect(OnBlur('a')).toBe('')
    })

    it('supports custom validators', () => {
        expect(setup({ validator: () => '自定义错误' }).OnBlur('x')).toBe('自定义错误')
        expect(setup({ validator: () => new Error('boom') }).OnBlur('x')).toBe('boom')
        expect(setup({
            validator: () => {
                throw new Error('thrown')
            },
        }).OnBlur('x')).toBe('thrown')
        expect(setup({ validator: () => true }).OnBlur('x')).toBe('')
    })

    it('only runs rules for the matching trigger', () => {
        const { OnInput, OnChange, RuleError } = setup({ required: true, trigger: 'change' })

        expect(OnInput('')).toBe('')
        expect(RuleError.value).toBe('')
        expect(OnChange('')).toBe('请填写此项')
    })

    it('lets the error prop override rule messages', () => {
        const { props, DisplayError } = setup({ required: true, message: '必填' })

        props.error = '服务端错误'
        expect(DisplayError.value).toBe('服务端错误')
    })

    it('revalidates touched fields when the rule changes', async () => {
        const { props, OnBlur, DisplayError } = setup({ required: true, message: '旧消息' })

        OnBlur('')
        props.rule = { required: true, message: '新消息' }
        await nextTick()

        expect(DisplayError.value).toBe('新消息')
    })

    it('resets touched state and errors', () => {
        const { OnBlur, Reset, DisplayError } = setup({ required: true })

        OnBlur('')
        expect(DisplayError.value).not.toBe('')
        Reset()
        expect(DisplayError.value).toBe('')
    })
})
