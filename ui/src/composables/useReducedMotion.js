import { getCurrentScope, onScopeDispose, ref } from 'vue'

/**
 * 监听系统「减少动态效果」偏好
 * @returns {import('vue').Ref<boolean>} 是否启用减少动态效果
 */
export function useReducedMotion() {
    const reduced = ref(false)
    let media = null
    let handler = null

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        media = window.matchMedia('(prefers-reduced-motion: reduce)')
        reduced.value = media.matches
        handler = event => {
            reduced.value = event.matches
        }

        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', handler)
        } else {
            media.addListener?.(handler)
        }
    }

    if (getCurrentScope()) {
        onScopeDispose(() => {
            if (typeof media?.removeEventListener === 'function') {
                media.removeEventListener('change', handler)
            } else {
                media?.removeListener?.(handler)
            }
        })
    }

    return reduced
}
