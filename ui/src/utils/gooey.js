/**
 * 两个圆之间的粘性连接路径（藕断丝连）。
 *
 * 坐标原点与 SVG 一致（左上角），返回值可直接用于 <path d>。
 * 距离达到 maxDistance 时返回空字符串，表示连接已经断开。
 */
export function createGooeyPath({ x1, y1, r1, x2, y2, r2, maxDistance, neckRatio = 1 }) {
    if (!(maxDistance > 0)) return ''

    const dx = x2 - x1
    const dy = y2 - y1
    const distance = Math.hypot(dx, dy)

    if (!Number.isFinite(distance) || distance < 0.01 || distance >= maxDistance) return ''

    // 两圆刚分开时颈部等于半径，之后线性收细，接近阈值时断成一条线
    const contact = r1 + r2
    const falloff = Math.max(0, 1 - Math.max(0, distance - contact) / Math.max(1, maxDistance - contact))
    const neck = Math.min(r1, r2) * neckRatio * falloff

    if (neck < 0.35) return ''

    const ux = dx / distance
    const uy = dy / distance
    const px = -uy
    const py = ux

    const cx = (x1 + x2) / 2
    const cy = (y1 + y2) / 2

    const a1 = `${round(x1 + px * r1)},${round(y1 + py * r1)}`
    const b1 = `${round(x2 + px * r2)},${round(y2 + py * r2)}`
    const a2 = `${round(x1 - px * r1)},${round(y1 - py * r1)}`
    const b2 = `${round(x2 - px * r2)},${round(y2 - py * r2)}`
    const c1 = `${round(cx + px * neck)},${round(cy + py * neck)}`
    const c2 = `${round(cx - px * neck)},${round(cy - py * neck)}`

    return `M${a1}Q${c1} ${b1}L${b2}Q${c2} ${a2}Z`
}

function round(value) {
    return Math.round(value * 100) / 100
}
