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

function SendPending() {
    if (!channel || !pending) return

    const current = pending
    pending = null

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
    pending = { token, code, opened: false, onSuccess, onError }

    const channel = GetChannel()

    if (!channel) {
        window.open('/playground', 'washui-playground')?.focus()
        pending = null
        onError?.(new Error('当前浏览器不支持 BroadcastChannel'))
        return
    }

    const ping = () => {
        if (pending?.token !== token) return
        channel.postMessage({ type: 'ping', token })
    }

    ping()

    // 先等已有实验场回应；没有回应才打开新标签
    setTimeout(() => {
        if (pending?.token !== token || pending.opened) return

        pending.opened = true
        window.open('/playground', 'washui-playground')?.focus()
        ping()
    }, 500)

    setTimeout(ping, 1400)

    setTimeout(() => {
        if (pending?.token !== token) return

        pending = null
        onError?.(new Error('实验场没有响应'))
    }, 3000)

    setTimeout(() => {
        if (pending?.token === token) pending = null
    }, 10000)
}
