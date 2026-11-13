const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

function toNumber(value, fallback = 0) {
    const number = Number(value)
    return Number.isFinite(number) ? number : fallback
}

/**
 * 统一解析数字格式选项
 * @param {number|object} options 小数位数，或 { decimals, trimZeros, space, unit, locale }
 * @param {object} defaults 各函数的默认值
 * @returns {object} 归一化后的选项
 */
function normalizeOptions(options = {}, defaults = {}) {
    const base = {
        decimals: 2,
        trimZeros: true,
        space: true,
        unit: undefined,
        locale: undefined,
        ...defaults
    }

    if (typeof options === 'number') {
        return { ...base, decimals: Math.max(0, options), trimZeros: false }
    }

    return {
        ...base,
        decimals: Math.max(0, toNumber(options.decimals, base.decimals)),
        trimZeros: options.trimZeros ?? base.trimZeros,
        space: options.space !== false,
        unit: options.unit,
        locale: options.locale
    }
}

/**
 * 按位数格式化数字，可选择是否去掉末尾零
 * @param {number} value 数字
 * @param {number} decimals 小数位数
 * @param {boolean} trimZeros 是否去掉末尾零
 * @returns {string} 格式化后的数字
 */
function formatDecimal(value, decimals, trimZeros) {
    const text = value.toFixed(decimals)
    if (!trimZeros || !text.includes('.')) return text
    return text.replace(/\.?0+$/, '')
}

/**
 * 格式化字节数
 * @param {number} bytes 字节数
 * @param {number|object} options 小数位数或 { decimals, trimZeros, unit, space }
 * @returns {string} 例如 1.5 MB
 */
export function formatBytes(bytes, options = {}) {
    const config = normalizeOptions(options)
    const value = toNumber(bytes)

    if (value <= 0) {
        return `0${config.space ? ' ' : ''}${config.unit || 'B'}`
    }

    const index = config.unit
        ? Math.max(0, BYTE_UNITS.indexOf(String(config.unit).toUpperCase()))
        : Math.min(Math.floor(Math.log(value) / Math.log(1024)), BYTE_UNITS.length - 1)
    const scaled = value / Math.pow(1024, index)

    return `${formatDecimal(scaled, config.decimals, config.trimZeros)}${config.space ? ' ' : ''}${BYTE_UNITS[index]}`
}

/**
 * 生成固定小数位的字节格式化函数
 * @param {number} decimals 小数位数
 * @param {object} options 其他选项，同 formatBytes
 * @returns {Function} 接收字节数、返回字符串的函数
 * @example const fixed2 = formatBytesFixed(2); fixed2(1536) // 1.50 KB
 */
export function formatBytesFixed(decimals = 2, options = {}) {
    return bytes => formatBytes(bytes, { ...options, decimals, trimZeros: false })
}

/**
 * 格式化传输速度
 * @param {number} bytesPerSecond 每秒字节数
 * @param {number|object} options 同 formatBytes
 * @returns {string} 例如 1.5 MB/s
 */
export function formatSpeed(bytesPerSecond, options = {}) {
    return `${formatBytes(bytesPerSecond, options)}/s`
}

/**
 * 把字节速度换算成 Mbps 文本
 * @param {number} bytesPerSecond 每秒字节数
 * @param {number|object} options 小数位数或 { decimals, trimZeros }
 * @returns {string} 例如 12.5
 */
export function formatMbps(bytesPerSecond, options = {}) {
    const config = normalizeOptions(options, { decimals: 2, trimZeros: false })
    const raw = Number(bytesPerSecond)
    if (!Number.isFinite(raw)) return '-'
    return formatDecimal(raw * 8 / 1e6, config.decimals, config.trimZeros)
}

/**
 * 格式化耗时
 * @param {number} ms 毫秒
 * @param {number|object} options 小数位数或 { decimals, unit, trimZeros }
 * @returns {string} 例如 320 ms / 1.25 s
 */
export function formatDuration(ms, options = {}) {
    const value = toNumber(ms)
    if (value <= 0) return '0 ms'

    const requestedUnit = typeof options === 'object' ? options.unit : undefined
    const unit = requestedUnit || (value < 1000 ? 'ms' : 's')
    const config = normalizeOptions(options, {
        decimals: unit === 'ms' ? 1 : 2,
        trimZeros: false
    })
    const scaled = unit === 'ms' ? value : value / 1000

    return `${formatDecimal(scaled, config.decimals, config.trimZeros)} ${unit}`
}

/**
 * 格式化大数字，自动使用 k / 万 / 亿
 * @param {number} n 数字
 * @param {number|object} options 小数位数或 { decimals, trimZeros }
 * @returns {string} 例如 1.2万
 */
export function formatCount(n, options = {}) {
    const value = Number(n)
    if (!Number.isFinite(value)) return '-'

    const config = normalizeOptions(options, { decimals: 1, trimZeros: true })
    const abs = Math.abs(value)
    const format = scaled => `${formatDecimal(scaled, config.decimals, config.trimZeros)}`

    if (abs >= 1e8) return `${format(value / 1e8)}亿`
    if (abs >= 1e4) return `${format(value / 1e4)}万`
    if (abs >= 1e3) return `${format(value / 1e3)}k`
    return String(value)
}

/**
 * 千分位数字
 * @param {number} value 数字
 * @param {number|object} options 小数位数或 { decimals, trimZeros, locale }
 * @returns {string} 例如 1,234.5
 */
export function formatNumber(value, options = {}) {
    const config = normalizeOptions(options)
    const number = toNumber(value)

    return number.toLocaleString(config.locale || 'zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: config.decimals,
    })
}

/**
 * 百分比格式化
 * @param {number} value 原始比例，0.256 表示 25.6%
 * @param {number|object} options 小数位数或 { decimals, trimZeros }
 * @returns {string} 例如 25.6%
 */
export function formatPercent(value, options = {}) {
    const config = normalizeOptions(options)
    const number = toNumber(value)
    return `${formatDecimal(number * 100, config.decimals, config.trimZeros)}%`
}

/**
 * 货币格式化
 * @param {number} value 金额
 * @param {object} options { currency, locale, decimals }
 * @returns {string} 例如 ¥1,234.00
 */
export function formatCurrency(value, options = {}) {
    const number = toNumber(value)
    const decimals = Math.max(0, toNumber(options.decimals, 2))

    return number.toLocaleString(options.locale || 'zh-CN', {
        style: 'currency',
        currency: options.currency || 'CNY',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

/**
 * 数字补零
 * @param {number|string} value 原值
 * @param {number} length 目标长度
 * @returns {string} 例如 7 → 07
 */
export function padZero(value, length = 2) {
    return String(value).padStart(Math.max(1, length), '0')
}

/**
 * 按模板格式化日期
 * @param {Date|string|number} value 日期
 * @param {string} pattern 模板，支持 YYYY MM DD HH mm ss
 * @returns {string} 例如 2026-11-13 08:30:00
 */
export function formatDate(value = new Date(), pattern = 'YYYY-MM-DD HH:mm:ss') {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    const parts = {
        YYYY: String(date.getFullYear()),
        MM: padZero(date.getMonth() + 1),
        DD: padZero(date.getDate()),
        HH: padZero(date.getHours()),
        mm: padZero(date.getMinutes()),
        ss: padZero(date.getSeconds())
    }

    return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, key => parts[key])
}

/**
 * 相对时间描述
 * @param {Date|string|number} value 目标时间
 * @param {object} options { base, short }
 * @returns {string} 例如 3 分钟前 / 刚刚
 */
export function formatRelativeTime(value, options = {}) {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    const base = options.base == null ? Date.now() : new Date(options.base).getTime()
    const diff = Math.round((date.getTime() - base) / 1000)
    const abs = Math.abs(diff)
    const short = options.short === true

    const units = [
        { limit: 60, size: 1, name: '秒' },
        { limit: 3600, size: 60, name: '分钟' },
        { limit: 86400, size: 3600, name: '小时' },
        { limit: 2592000, size: 86400, name: '天' },
        { limit: 31536000, size: 2592000, name: '个月' },
        { limit: Infinity, size: 31536000, name: '年' }
    ]

    if (abs < 30) return '刚刚'

    const unit = units.find(item => abs < item.limit)
    const count = Math.max(1, Math.round(abs / unit.size))

    if (short) return `${diff < 0 ? '' : 'in '}${count}${unit.name}${diff < 0 ? '前' : '后'}`
    return diff < 0 ? `${count} ${unit.name}前` : `${count} ${unit.name}后`
}

/**
 * 截断长文本
 * @param {string} text 原文本
 * @param {number} max 最大长度
 * @param {string} suffix 截断后缀
 * @returns {string} 截断后的文本
 */
export function truncate(text, max = 24, suffix = '…') {
    const value = String(text ?? '')
    if (value.length <= max) return value
    return value.slice(0, Math.max(0, max)) + suffix
}

/**
 * 限制数字区间
 * @param {number} value 原值
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 区间内的值
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(toNumber(value), min), max)
}

/**
 * 防抖
 * @param {Function} fn 目标函数
 * @param {number} wait 等待毫秒
 * @returns {Function} 包装后的函数，附带 cancel
 */
export function debounce(fn, wait = 200) {
    let timer = null
    const wrapped = (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
            fn(...args)
        }, wait)
    }
    wrapped.cancel = () => {
        clearTimeout(timer)
        timer = null
    }
    return wrapped
}

/**
 * 节流
 * @param {Function} fn 目标函数
 * @param {number} wait 间隔毫秒
 * @returns {Function} 包装后的函数，附带 cancel
 */
export function throttle(fn, wait = 200) {
    let last = 0
    let timer = null
    let pendingArgs = null

    const wrapped = (...args) => {
        const now = Date.now()
        const remain = wait - (now - last)
        pendingArgs = args

        if (remain <= 0) {
            last = now
            fn(...args)
            pendingArgs = null
            return
        }

        if (timer) return
        timer = setTimeout(() => {
            timer = null
            last = Date.now()
            if (pendingArgs) fn(...pendingArgs)
            pendingArgs = null
        }, remain)
    }

    wrapped.cancel = () => {
        clearTimeout(timer)
        timer = null
        pendingArgs = null
    }

    return wrapped
}
