const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

export function formatBytes(bytes) {
    const value = Number(bytes)
    if (!Number.isFinite(value) || value <= 0) return '0 B'
    const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), BYTE_UNITS.length - 1)
    return parseFloat((value / Math.pow(1024, index)).toFixed(2)) + ' ' + BYTE_UNITS[index]
}

export function formatSpeed(bytesPerSecond) {
    return formatBytes(bytesPerSecond) + '/s'
}

export function formatMbps(bytesPerSecond) {
    const value = Number(bytesPerSecond)
    if (!Number.isFinite(value)) return '-'
    return (value * 8 / 1e6).toFixed(2)
}

export function formatDuration(ms) {
    const value = Number(ms)
    if (!Number.isFinite(value) || value <= 0) return '0 ms'
    if (value < 1000) return value.toFixed(1) + ' ms'
    return (value / 1000).toFixed(2) + ' s'
}

export function formatCount(n) {
    const value = Number(n)
    if (!Number.isFinite(value)) return '-'
    const abs = Math.abs(value)
    if (abs >= 1e8) return (value / 1e8).toFixed(1).replace(/\.0$/, '') + '亿'
    if (abs >= 1e4) return (value / 1e4).toFixed(1).replace(/\.0$/, '') + '万'
    if (abs >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
    return String(value)
}
