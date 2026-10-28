const CONTAINER_CLASS = 'wa_toast_box'
const ITEM_CLASS = 'wa_toast_item'
const LEAVE_DELAY = 220
const UPDATE_DELAY = 360
const DEFAULT_DURATION = 2200

let container = null
const active = new Set()

function host() {
    if (typeof document === 'undefined') return null
    if (container && document.contains(container)) return container
    container = document.createElement('div')
    container.className = CONTAINER_CLASS
    container.setAttribute('role', 'status')
    container.setAttribute('aria-live', 'polite')
    container.setAttribute('aria-atomic', 'false')
    document.body.appendChild(container)
    return container
}

function dismiss(item) {
    if (!item || item.dataset.leaving) return
    item.dataset.leaving = '1'
    clearTimeout(item._timer)
    active.delete(item)
    item.classList.add('wa_toast_item_leave')
    setTimeout(() => item.remove(), LEAVE_DELAY)
}

function createItem(type, text) {
    const box = host()
    if (!box) return null

    const item = document.createElement('div')
    item.className = ITEM_CLASS + (type && type !== 'default' ? ' wa_toast_item_' + type : '')

    const icon = document.createElement('i')
    icon.className = type === 'loading' ? 'wa_spinner' : 'wa_toast_dot'

    const content = document.createElement('span')
    content.textContent = String(text ?? '')

    item.append(icon, content)
    box.appendChild(item)
    active.add(item)
    return { item, icon, content }
}

function schedule(item, duration) {
    if (!item || duration <= 0) return
    item._timer = setTimeout(() => dismiss(item), duration)
}

export function toast(text, options = {}) {
    const { type = '', duration = DEFAULT_DURATION, persistent = false } = options
    const node = createItem(type, text)
    if (!node) return () => { }

    if (!persistent && type !== 'loading') schedule(node.item, duration)
    return () => dismiss(node.item)
}

toast.success = (text, options = {}) => toast(text, { ...options, type: 'success' })
toast.warning = (text, options = {}) => toast(text, { ...options, type: 'warning' })
toast.help = (text, options = {}) => toast(text, { ...options, type: 'help' })
toast.danger = (text, options = {}) => toast(text, { ...options, type: 'danger' })

toast.loading = function (text = '加载中...') {
    const node = createItem('loading', text)
    if (!node) return { update() { }, close() { } }

    let closed = false
    let timer = null
    let updateTimer = null

    function clearTimers() {
        clearTimeout(timer)
        clearTimeout(updateTimer)
        timer = null
        updateTimer = null
    }

    function close() {
        if (closed) return
        closed = true
        clearTimers()
        dismiss(node.item)
    }

    function update(type = 'default', nextText = '', options = {}) {
        if (closed) return
        clearTimers()

        const { duration = DEFAULT_DURATION, persistent = false } = options
        node.item.className = ITEM_CLASS + (type && type !== 'default' ? ' wa_toast_item_' + type : '')
        node.icon.className = type === 'loading' ? 'wa_spinner' : 'wa_toast_dot'
        node.content.textContent = String(nextText ?? '')

        if (type === 'loading') return

        void node.item.offsetWidth
        node.item.classList.add('wa_toast_item_updated')
        updateTimer = setTimeout(() => {
            node.item.classList.remove('wa_toast_item_updated')
            updateTimer = null
        }, UPDATE_DELAY)

        if (!persistent) timer = setTimeout(close, duration)
    }

    return { update, close }
}

toast.clear = function () {
    for (const item of [...active]) dismiss(item)
}
