const NAMES = ['边缘节点', '缓存命中', '源站响应', 'DNS 解析', 'TLS 握手', '连接复用']
const TOTAL = 23

function wait(ms, signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new DOMException('请求已取消', 'AbortError'))
            return
        }

        const timer = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort)
            resolve()
        }, ms)

        function onAbort() {
            clearTimeout(timer)
            reject(new DOMException('请求已取消', 'AbortError'))
        }

        signal?.addEventListener('abort', onAbort, { once: true })
    })
}

export async function fetchItems(params = {}) {
    const { page = 1, fail = false, signal } = params
    await wait(450 + Math.random() * 350, signal)

    if (fail) throw new Error('模拟接口错误：请重试')

    const start = (page - 1) * 5
    const count = Math.max(0, Math.min(5, TOTAL - start))
    const items = Array.from({ length: count }, (_, index) => {
        const id = start + index + 1
        return {
            id,
            name: `${NAMES[(id - 1) % NAMES.length]} ${id}`,
            size: 1024 * (id * 7 % 512),
        }
    })

    return { page, total: TOTAL, items }
}
