import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 长按反馈：按住指定时长后把 Press 置为 true，并在触屏上给一次轻微震动
 * @param {string} selector 目标项选择器
 * @param {Map} itemEls 元素表，用于记录当前按下的项
 * @param {number} delay 触发时长（ms）
 * @param {boolean} haptic 是否在长按触发时调用 Web Vibration API
 * @returns {object} { Press, PressedKey, Clear, Start }
 */
export function usePressFeedback(selector, itemEls, delay = 320, haptic = true) {
    const Press = ref(false)
    const PressedKey = ref(null)
    let timer = null
    let touch = false

    function Clear() {
        clearTimeout(timer)
        timer = null
        Press.value = false
        PressedKey.value = null
        touch = false
    }

    function Start(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return

        const target = event.target.closest?.(selector)
        if (!target) return

        Clear()
        for (const [key, el] of itemEls) {
            if (el === target) {
                PressedKey.value = key
                break
            }
        }

        touch = event.pointerType !== 'mouse'

        timer = setTimeout(() => {
            timer = null
            Press.value = true

            // * 触屏长按给一次轻微震动；不支持的浏览器（如 iOS Safari）会静默忽略
            if (haptic && touch && typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(8)
            }
        }, delay)
    }

    onMounted(() => {
        window.addEventListener('pointerup', Clear)
        window.addEventListener('pointercancel', Clear)
    })

    onUnmounted(() => {
        window.removeEventListener('pointerup', Clear)
        window.removeEventListener('pointercancel', Clear)
        clearTimeout(timer)
    })

    return { Press, PressedKey, Clear, Start }
}
