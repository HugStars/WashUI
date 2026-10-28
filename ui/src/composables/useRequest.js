import { getCurrentScope, onScopeDispose, ref } from 'vue'

export function useRequest(service, options = {}) {
    const {
        initialData = null,
        immediate = false,
        onSuccess,
        onError,
    } = options

    const data = ref(initialData)
    const error = ref(null)
    const loading = ref(false)

    let controller = null
    let sequence = 0

    function cancel() {
        if (controller) {
            controller.abort()
            controller = null
        }
        if (loading.value) loading.value = false
    }

    async function run(params) {
        if (typeof service !== 'function') {
            const err = new TypeError('useRequest 需要传入请求函数')
            error.value = err
            onError?.(err)
            return undefined
        }

        cancel()
        const id = ++sequence
        controller = new AbortController()
        loading.value = true
        error.value = null

        try {
            const result = await service(params, { signal: controller.signal })
            if (id !== sequence) return undefined
            data.value = result
            onSuccess?.(result, params)
            return result
        } catch (err) {
            if (id !== sequence || err?.name === 'AbortError') return undefined
            error.value = err
            onError?.(err, params)
            return undefined
        } finally {
            if (id === sequence) {
                loading.value = false
                controller = null
            }
        }
    }

    function reset() {
        cancel()
        sequence += 1
        data.value = initialData
        error.value = null
    }

    if (getCurrentScope()) {
        onScopeDispose(cancel)
    }

    if (immediate) run()

    return { data, error, loading, run, cancel, reset }
}
