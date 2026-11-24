import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { useFieldMessage } from '@ui/src/composables/useFieldMessage.js'

describe('useFieldMessage', () => {
    it('shows hint/error immediately and clears text after the transition delay', async () => {
        vi.useFakeTimers()
        const error = ref('')
        const hint = ref('提示')
        const scope = effectScope()
        const state = scope.run(() => useFieldMessage(() => error.value, () => hint.value))

        expect(state.Message.value).toBe(true)
        expect(state.MessageText.value).toBe('提示')
        expect(state.MessageIsError.value).toBe(false)

        error.value = '错误'
        await nextTick()
        expect(state.MessageIsError.value).toBe(true)
        expect(state.MessageText.value).toBe('错误')

        error.value = ''
        hint.value = ''
        await nextTick()
        expect(state.Message.value).toBe(false)
        expect(state.MessageText.value).toBe('错误')

        vi.advanceTimersByTime(220)
        expect(state.MessageText.value).toBe('')

        scope.stop()
        vi.useRealTimers()
    })
})
