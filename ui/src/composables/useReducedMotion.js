import { ref } from 'vue'

const reduced = ref(false)
let media = null
let listening = false

function EnsureListener() {
    if (listening || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = media.matches
    listening = true

    const handler = event => {
        reduced.value = event.matches
    }

    if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handler)
    } else {
        media.addListener?.(handler)
    }
}

/**
 * 监听系统「减少动态效果」偏好
 * @returns {import('vue').Ref<boolean>} 是否启用减少动态效果
 */
export function useReducedMotion() {
    EnsureListener()
    return reduced
}
