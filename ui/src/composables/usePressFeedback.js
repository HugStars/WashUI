import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 长按反馈：按住指定时长后把 Press 置为 true
 * @param {string} selector 目标项选择器
 * @param {Map} itemEls 元素表，用于记录当前按下的项
 * @param {number} delay 触发时长（ms）
 * @returns {object} { Press, PressedKey, Clear, Start }
 */
export function usePressFeedback(selector, itemEls, delay = 320) {
    const Press = ref(false)
    const PressedKey = ref(null)
    let timer = null

    function Clear() {
        clearTimeout(timer)
        timer = null
        Press.value = false
        PressedKey.value = null
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

        timer = setTimeout(() => {
            timer = null
            Press.value = true
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
