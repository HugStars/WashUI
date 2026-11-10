import { describe, expect, it, vi } from 'vitest'
import { useRequest } from '@ui/src/composables/useRequest.js'

function deferred() {
    let resolve
    let reject
    const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
    })
    return { promise, resolve, reject }
}

describe('useRequest', () => {
    it('stores the resolved result', async () => {
        const { data, loading, error, run } = useRequest(async () => 'ok')

        expect(loading.value).toBe(false)
        const promise = run()

        expect(loading.value).toBe(true)
        await expect(promise).resolves.toBe('ok')
        expect(data.value).toBe('ok')
        expect(error.value).toBe(null)
        expect(loading.value).toBe(false)
    })

    it('keeps only the latest response', async () => {
        const first = deferred()
        const second = deferred()
        const service = vi.fn()
            .mockImplementationOnce(() => first.promise)
            .mockImplementationOnce(() => second.promise)

        const { data, loading, run } = useRequest(service)
        const firstRun = run()
        const secondRun = run()

        second.resolve('second')
        await secondRun
        expect(data.value).toBe('second')
        expect(loading.value).toBe(false)

        first.resolve('first')
        await firstRun
        expect(data.value).toBe('second')
    })

    it('exposes errors', async () => {
        const { error, loading, run } = useRequest(async () => {
            throw new Error('boom')
        })

        await run()
        expect(error.value?.message).toBe('boom')
        expect(loading.value).toBe(false)
    })

    it('cancels the previous request before a new run', async () => {
        const signals = []
        const service = vi.fn((_params, { signal }) => {
            signals.push(signal)
            return new Promise(() => {})
        })

        const { run, cancel } = useRequest(service)
        run()
        run()

        expect(signals).toHaveLength(2)
        expect(signals[0].aborted).toBe(true)
        expect(signals[1].aborted).toBe(false)

        cancel()
        expect(signals[1].aborted).toBe(true)
    })

    it('reports a missing service function', async () => {
        const onError = vi.fn()
        const { error, run } = useRequest(null, { onError })

        await run()
        expect(error.value).toBeInstanceOf(TypeError)
        expect(onError).toHaveBeenCalled()
    })

    it('resets data and error', async () => {
        const { data, error, reset, run } = useRequest(async () => 'ok', { initialData: 'init' })

        await run()
        expect(data.value).toBe('ok')

        reset()
        expect(data.value).toBe('init')
        expect(error.value).toBe(null)
    })
})
