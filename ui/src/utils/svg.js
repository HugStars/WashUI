// 图标渲染只允许这些 SVG 标签，避免脚本、外部图片和 foreignObject 注入
const ALLOWED_TAGS = new Set([
    'svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse',
    'defs', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'use',
    'title', 'desc', 'pattern', 'symbol', 'marker', 'text', 'tspan',
])

const UNSAFE_STYLE = /expression\s*\(|javascript:/i

function IsUnsafeStyle(value) {
    if (UNSAFE_STYLE.test(value)) return true

    const urls = value.match(/url\s*\([^)]*\)/gi) || []
    return urls.some(item => !/^url\s*\(\s*['"]?#/i.test(item))
}

function CleanAttributes(element) {
    for (const attr of [...element.attributes]) {
        const name = attr.name.toLowerCase()
        const value = attr.value.trim()

        if (name.startsWith('on')) {
            element.removeAttribute(attr.name)
            continue
        }

        // 只允许片段引用，禁止 http、data、javascript 等外部地址
        if ((name === 'href' || name === 'xlink:href') && !value.startsWith('#')) {
            element.removeAttribute(attr.name)
            continue
        }

        if (name === 'style' && IsUnsafeStyle(value)) element.removeAttribute(attr.name)
    }
}

function CleanElement(element) {
    for (const child of [...element.children]) {
        if (!ALLOWED_TAGS.has(child.localName.toLowerCase())) {
            child.remove()
            continue
        }

        CleanAttributes(child)
        CleanElement(child)
    }
}

/**
 * 过滤原始 SVG 字符串中的脚本、事件属性和外部引用
 * @param {string} source 原始 SVG 字符串
 * @returns {string} 可安全写入 innerHTML 的 SVG；无法解析时返回空字符串
 */
export function sanitizeSvg(source) {
    const text = String(source ?? '').trim()
    if (!text || typeof DOMParser === 'undefined') return ''

    const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
    if (doc.querySelector('parsererror')) return ''

    const root = doc.documentElement
    if (!root || root.localName.toLowerCase() !== 'svg') return ''

    CleanAttributes(root)
    CleanElement(root)
    return root.outerHTML
}
