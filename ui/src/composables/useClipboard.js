import { getCurrentScope, onScopeDispose, ref } from 'vue'

function fallbackCopy(text) {
    if (typeof document === 'undefined' || !document.body) return false
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.top = '0'
    el.style.left = '-9999px'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    let ok = false
    try {
        ok = document.execCommand('copy')
    } catch {
        ok = false
    }
    el.remove()
    return ok
}

export function useClipboard(options = {}) {
    const resetDelay = options.resetDelay ?? 1500
    const copied = ref(false)
    let timer = null

    async function copy(text) {
        const value = String(text ?? '')
        let ok = false

        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(value)
                ok = true
            } catch {
                ok = false
            }
        }

        if (!ok) ok = fallbackCopy(value)

        copied.value = ok
        if (ok && resetDelay > 0) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                copied.value = false
            }, resetDelay)
        }
        return ok
    }

    if (getCurrentScope()) {
        onScopeDispose(() => clearTimeout(timer))
    }

    return { copied, copy }
}
