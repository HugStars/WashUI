import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureToast, toast } from '@ui/src/core/toast.js'

beforeEach(() => {
    vi.useFakeTimers()
})

afterEach(() => {
    toast.clear()
    vi.runAllTimers()
    configureToast({ top: null })
    document.body.innerHTML = ''
    vi.useRealTimers()
})

/**
 * 按自定义属性查找 Toast 容器
 * @param {string} top 归一化后的 top 值
 * @returns {HTMLElement | undefined} 对应容器
 */
function findBox(top) {
    return [...document.querySelectorAll('.wa_toast_box')]
        .find(box => box.style.getPropertyValue('--wa_toast_top') === top)
}

describe('toast top', () => {
    it('creates a dedicated container for a per-call top', () => {
        toast('局部提示', { top: 120 })

        const box = findBox('120px')
        expect(box).toBeTruthy()
        expect(box.style.top).toContain('env(safe-area-inset-top')
    })

    it('uses the global top and supports loading options', () => {
        configureToast({ top: 80 })
        toast('全局提示')

        expect(findBox('80px')).toBeTruthy()

        toast.loading('加载中', { top: 40 })
        expect(findBox('40px')).toBeTruthy()
    })

    it('normalizes numeric strings to px', () => {
        toast('字符串 top', { top: '100' })
        expect(findBox('100px')).toBeTruthy()
    })

    it('restores the CSS default when top is null', () => {
        configureToast({ top: 80 })
        expect(configureToast({ top: null })).toEqual({ top: '' })
    })
})
