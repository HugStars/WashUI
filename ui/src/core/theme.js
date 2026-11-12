import { readonly, ref } from 'vue'

const DEFAULT_KEY = 'wa_theme'

let storageKey = DEFAULT_KEY
let inited = false
let mediaBound = false

const mode = ref('auto')
const theme = ref('light')
const custom = { base: {}, light: {}, dark: {} }
const applied = new Set()

function varName(key) {
    return key.startsWith('--') ? key : `--wa_${key}`
}

function setStyle(tokens) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    for (const [key, value] of Object.entries(tokens)) {
        if (value === undefined || value === null) continue
        const name = varName(key)
        root.style.setProperty(name, String(value))
        applied.add(name)
    }
}

function systemTheme() {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolve(value) {
    return value === 'dark' || value === 'light' ? value : systemTheme()
}

function apply() {
    theme.value = resolve(mode.value)
    if (typeof document === 'undefined') return

    const root = document.documentElement
    for (const name of applied) root.style.removeProperty(name)
    applied.clear()

    setStyle(custom.base)
    setStyle(theme.value === 'dark' ? custom.dark : custom.light)
    root.dataset.theme = theme.value
}

function readStored() {
    if (typeof localStorage === 'undefined') return null
    try {
        return localStorage.getItem(storageKey)
    } catch {
        return null
    }
}

function isValid(value) {
    return value === 'light' || value === 'dark' || value === 'auto'
}

export function initTheme(initial = 'auto', key) {
    const nextKey = key || storageKey
    if (inited && nextKey === storageKey) return

    storageKey = nextKey
    inited = true
    if (typeof window === 'undefined') return

    if (!mediaBound) {
        mediaBound = true
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => {
                if (mode.value === 'auto') apply()
            })
    }

    const saved = readStored()
    mode.value = isValid(saved) ? saved : (isValid(initial) ? initial : 'auto')
    apply()
}

export function configureTokens(options = {}) {
    custom.base = options.tokens || {}
    custom.light = options.themes?.light || {}
    custom.dark = options.themes?.dark || {}
    apply()
}

export function setTheme(next) {
    if (!isValid(next)) return
    mode.value = next
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(storageKey, next)
        } catch {
            // 存储不可用时仍切换当前会话主题
        }
    }
    apply()
}

export function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

export function useTheme() {
    if (!inited) initTheme()
    return {
        mode: readonly(mode),
        theme: readonly(theme),
        setTheme,
        toggleTheme,
    }
}
