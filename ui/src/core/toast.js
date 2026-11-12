import './toast.css'

const CONTAINER_CLASS = 'wa_toast_box'
const ITEM_CLASS = 'wa_toast_item'
const LEAVE_DELAY = 220
const UPDATE_DELAY = 360
const DEFAULT_DURATION = 2200

// section 容器与全局配置
// * 不同 top 使用不同容器，互不挤压；key 为归一化后的 top 字符串
const containers = new Map()
const active = new Set()
let defaultTop = ''

function NormalizeTop(top) {
    if (top === null || top === undefined || top === '') return ''
    if (typeof top === 'number') return `${top}px`

    const value = String(top).trim()
    // note 兼容调用方传 '80' 这类纯数字字符串，避免生成无效的 CSS 值
    return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value
}

/**
 * 全局配置 Toast
 * @param {object} options 配置对象
 * @param {number|string|null} [options.top] 距顶部距离，数字按 px；传 null 恢复 CSS 默认
 * @returns {{ top: string }} 当前配置
 */
export function configureToast(options = {}) {
    if (options && Object.prototype.hasOwnProperty.call(options, 'top')) {
        defaultTop = NormalizeTop(options.top)
    }
    return { top: defaultTop }
}

function host(top) {
    if (typeof document === 'undefined') return null

    const key = top || ''
    const existing = containers.get(key)
    if (existing && document.contains(existing)) return existing

    const box = document.createElement('div')
    box.className = CONTAINER_CLASS
    box.setAttribute('role', 'status')
    box.setAttribute('aria-live', 'polite')
    box.setAttribute('aria-atomic', 'false')
    // * CSS 默认值负责响应式；指定 top 时同时写变量和内联 top，避免被移动端媒体查询覆盖
    if (top) {
        box.style.setProperty('--wa_toast_top', top)
        box.style.top = `calc(${top} + env(safe-area-inset-top, 0px))`
    }

    containers.set(key, box)
    document.body.appendChild(box)
    return box
}

function dismiss(item) {
    if (!item || item.dataset.leaving) return
    item.dataset.leaving = '1'
    clearTimeout(item._timer)
    active.delete(item)
    item.classList.add('wa_toast_item_leave')
    setTimeout(() => {
        const box = item.parentElement
        item.remove()
        if (!box || box.children.length) return

        box.remove()
        for (const [key, value] of containers) {
            if (value === box) containers.delete(key)
        }
    }, LEAVE_DELAY)
}

function createItem(type, text, top) {
    // * top 为调用参数，未传时回落到全局默认；两者都没有则交给 CSS 默认值
    const box = host(NormalizeTop(top ?? defaultTop))
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
    const { type = '', duration = DEFAULT_DURATION, persistent = false, top } = options
    const node = createItem(type, text, top)
    if (!node) return () => { }

    if (!persistent && type !== 'loading') schedule(node.item, duration)
    return () => dismiss(node.item)
}

toast.success = (text, options = {}) => toast(text, { ...options, type: 'success' })
toast.warning = (text, options = {}) => toast(text, { ...options, type: 'warning' })
toast.help = (text, options = {}) => toast(text, { ...options, type: 'help' })
toast.danger = (text, options = {}) => toast(text, { ...options, type: 'danger' })

toast.loading = function (text = '加载中...', options = {}) {
    const node = createItem('loading', text, options.top)
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

toast.configure = configureToast

toast.clear = function () {
    for (const item of [...active]) dismiss(item)
}
