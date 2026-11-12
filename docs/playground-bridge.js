export const PLAYGROUND_CHANNEL = 'washui-playground'

let channel = null
let pending = null

function GetChannel() {
    if (channel || typeof BroadcastChannel === 'undefined') return channel

    channel = new BroadcastChannel(PLAYGROUND_CHANNEL)
    channel.onmessage = event => {
        const data = event.data || {}
        if (!pending) return

        if (data.type === 'pong' && data.token === pending.token) {
            SendPending()
        } else if (data.type === 'ready') {
            SendPending()
        }
    }

    return channel
}

function ClearTimers(item) {
    if (!item) return
    for (const timer of item.timers) clearTimeout(timer)
    item.timers = []
}

function SendPending() {
    if (!channel || !pending) return

    const current = pending
    pending = null
    ClearTimers(current)

    channel.postMessage({
        type: 'code',
        token: current.token,
        code: current.code,
    })

    current.onSuccess?.()
}

export function OpenInPlayground(code, options = {}) {
    if (!code) return

    const { onSuccess, onError } = options
    const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const bus = GetChannel()

    if (!bus) {
        window.open('/playground', 'washui-playground')?.focus()
        onError?.(new Error('当前浏览器不支持 BroadcastChannel'))
        return
    }

    // 连续点击时取消上一次请求，避免旧计时器继续堆积
    ClearTimers(pending)
    pending = null

    const timers = []
    pending = { token, code, opened: false, onSuccess, onError, timers }

    function Later(delay, action) {
        timers.push(setTimeout(action, delay))
    }

    function Ping() {
        if (pending?.token !== token) return
        bus.postMessage({ type: 'ping', token })
    }

    function Fail(message) {
        if (pending?.token !== token) return

        const current = pending
        pending = null
        ClearTimers(current)
        onError?.(new Error(message))
    }

    Ping()

    // 先等已有实验场回应；没有回应才打开新标签
    Later(500, () => {
        if (pending?.token !== token || pending.opened) return

        pending.opened = true
        window.open('/playground', 'washui-playground')?.focus()
        Ping()
    })

    for (const delay of [1200, 2500, 4500, 7000, 10000]) Later(delay, Ping)
    Later(15000, () => Fail('实验场没有响应，请手动打开后再试'))
}
