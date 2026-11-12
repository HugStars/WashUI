import { getIcon } from './icons.js'
import { sanitizeSvg } from '../utils/svg.js'

const DEFAULT_TEXT = '加载中...'

const items = new Map()
let order = 0
let topId = null
let host = null
let ringEl = null
let iconEl = null
let textEl = null
let pageLocked = false
let lockedScrollY = 0

function EnsureHost() {
    if (host || typeof document === 'undefined') return host

    host = document.createElement('div')
    host.className = 'wa_loading'
    host.setAttribute('aria-hidden', 'true')

    const box = document.createElement('div')
    box.className = 'wa_loading_box'
    box.setAttribute('role', 'status')
    box.setAttribute('aria-live', 'polite')

    ringEl = document.createElement('span')
    ringEl.className = 'wa_loading_ring'

    iconEl = document.createElement('span')
    iconEl.className = 'wa_loading_icon'

    textEl = document.createElement('span')
    textEl.className = 'wa_loading_text'

    box.append(ringEl, iconEl, textEl)
    host.append(box)
    document.body.appendChild(host)

    return host
}

function PickTop() {
    let top = null

    for (const [id, item] of items) {
        if (
            !top ||
            item.priority > top.priority ||
            (item.priority === top.priority && item.order > top.order)
        ) {
            top = { id, ...item }
        }
    }

    return top
}

function ApplyOverlay(item) {
    if (!host) return

    host.style.background = item.gradient
        ? 'linear-gradient(to bottom, transparent, #00000059)'
        : ''
    host.style.webkitBackdropFilter = item.blur > 0 ? `blur(${item.blur}px)` : ''
    host.style.backdropFilter = item.blur > 0 ? `blur(${item.blur}px)` : ''
}

function ApplyIcon(item) {
    const icon = item.icon ? getIcon(item.icon) : null

    if (!icon) {
        ringEl.hidden = false
        iconEl.hidden = true
        iconEl.innerHTML = ''
        iconEl.classList.remove('spin')
        return
    }

    ringEl.hidden = true
    iconEl.hidden = false
    iconEl.innerHTML = ''
    iconEl.classList.toggle('spin', item.spin !== false)

    if (typeof icon === 'string') {
        iconEl.innerHTML = sanitizeSvg(icon)
        return
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('width', '26')
    svg.setAttribute('height', '26')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '1.8')
    svg.setAttribute('stroke-linecap', 'round')
    svg.setAttribute('stroke-linejoin', 'round')
    svg.setAttribute('aria-hidden', 'true')

    for (const [tag, attrs = {}] of icon) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', tag)
        for (const [key, value] of Object.entries(attrs)) {
            node.setAttribute(key, String(value))
        }
        svg.appendChild(node)
    }

    iconEl.appendChild(svg)
}

function LockPage() {
    if (typeof document === 'undefined' || pageLocked) return

    pageLocked = true
    lockedScrollY = window.scrollY
    document.documentElement.classList.add('wa_loading_active')
    window.scrollTo(0, lockedScrollY)
}

function UnlockPage() {
    if (typeof document === 'undefined' || !pageLocked) return

    pageLocked = false
    document.documentElement.classList.remove('wa_loading_active')
    window.scrollTo(0, lockedScrollY)
    requestAnimationFrame(() => {
        if (!pageLocked) window.scrollTo(0, lockedScrollY)
    })
}

function ShowHost() {
    const el = EnsureHost()
    if (!el) return

    el.classList.add('on')
    el.setAttribute('aria-hidden', 'false')
    LockPage()
}

function HideHost() {
    if (!host) return
    host.classList.remove('on')
    host.setAttribute('aria-hidden', 'true')
    UnlockPage()
}

function Render() {
    const top = PickTop()

    if (!top) {
        topId = null
        HideHost()
        return
    }

    // 服务端渲染或非浏览器环境下没有 DOM 可操作
    if (!EnsureHost()) return

    textEl.textContent = top.text
    ApplyIcon(top)
    ApplyOverlay(top)
    topId = top.id

    ShowHost()
}

function NormalizeOptions(text, options) {
    let value = text
    let config = options || {}

    if (value && typeof value === 'object') {
        config = value
        value = config.text
    }

    return {
        text: value == null || value === '' ? DEFAULT_TEXT : String(value),
        priority: Number(config.priority) || 0,
        icon: config.icon || '',
        spin: config.spin !== false,
        gradient: config.gradient === true,
        blur: Math.max(0, Number(config.blur) || 0),
    }
}

export const loading = {
    /**
     * 显示/更新一个 loading
     * @param {string} id 唯一标识
     * @param {string|object} text 文案或配置对象
     * @param {object} options { priority, icon, spin, gradient, blur }
     */
    show(id, text = DEFAULT_TEXT, options = {}) {
        if (!id) return id

        const config = NormalizeOptions(text, options)

        items.set(id, {
            text: config.text,
            priority: config.priority,
            icon: config.icon,
            spin: config.spin,
            gradient: config.gradient,
            blur: config.blur,
            order: ++order,
        })
        Render()

        return id
    },

    /**
     * 更新指定 id 的文案或配置
     * @param {string} id
     * @param {string|object} text 文案或 { text, priority, icon, spin, gradient, blur }
     */
    update(id, text) {
        const item = items.get(id)
        if (!item) return false

        if (typeof text === 'string') {
            item.text = text || DEFAULT_TEXT
        } else if (text && typeof text === 'object') {
            if (text.text !== undefined) item.text = text.text || DEFAULT_TEXT
            if (text.priority !== undefined) item.priority = Number(text.priority) || 0
            if (text.icon !== undefined) item.icon = text.icon || ''
            if (text.spin !== undefined) item.spin = text.spin !== false
            if (text.gradient !== undefined) item.gradient = text.gradient === true
            if (text.blur !== undefined) item.blur = Math.max(0, Number(text.blur) || 0)
        }

        item.order = ++order
        Render()
        return true
    },

    /** 关闭指定 id */
    hide(id) {
        if (!items.delete(id)) return false
        Render()
        return true
    },

    /** 清空全部 loading */
    clear() {
        const had = items.size > 0
        items.clear()
        topId = null
        HideHost()
        return had
    },

    /** clear 的别名，应急关闭全部 */
    forceHide() {
        return loading.clear()
    },

    /** 当前 loading 数量 */
    count() {
        return items.size
    },

    /** 判断某个 id 是否正在 loading */
    has(id) {
        return items.has(id)
    },

    /** 调试/状态快照 */
    state() {
        return {
            items: [...items.entries()].map(([id, item]) => ({ id, ...item })),
            currentDisplayId: topId,
        }
    },
}

export const loadingManager = loading
