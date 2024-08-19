/**
 * - 将十六进制颜色值转换为RGB格式
 * @param {string} color - 十六进制颜色值或RGB字符串
 * @returns {string} - 转换后的RGB格式字符串
 */

export function FnHexToRGB(color) {
    if (color.includes('rgb')) {
        color = color.replaceAll(', ', ',')
        let match = /^rgb\((\d+),(\d+),(\d+)\)$/
        if (color.includes(" ")) match = /^rgb\((\d+) (\d+) (\d+)\)$/
        return color.replace(match, (m, r, g, b) => `${r.trim()} ${g.trim()} ${b.trim()}`)
    }

    if (color.length == 4) color = color.replace(/^#(.)(.)(.)$/, '$1$1$2$2$3$3')
    color = color.replace(/^#/, '')

    const bigintColor = parseInt(color, 16)

    const r = (bigintColor >> 16) & 255
    const g = (bigintColor >> 8) & 255
    const b = bigintColor & 255

    return `${r} ${g} ${b}`
}