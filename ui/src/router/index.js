import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { routeLoading } from '../core/route_state.js'

export function createAppRouter(options = {}) {
    const {
        routes = [],
        history = 'web',
        base = '',
        title = '',
        scroll = true,
        minLoading = 320,
        onNavigate,
    } = options

    const positions = new Map()
    let loadingStart = 0
    let loadingTimer = null

    function StartLoading() {
        clearTimeout(loadingTimer)
        loadingStart = Date.now()
        routeLoading.value = true
    }

    function FinishLoading() {
        clearTimeout(loadingTimer)
        const wait = Math.max(0, minLoading - (Date.now() - loadingStart))
        loadingTimer = setTimeout(() => {
            routeLoading.value = false
        }, wait)
    }

    const router = createRouter({
        history: history === 'hash' ? createWebHashHistory(base) : createWebHistory(base),
        routes,
        scrollBehavior(to, from, savedPosition) {
            if (!scroll) return false
            if (savedPosition) return savedPosition
            return { top: positions.get(to.fullPath) || 0 }
        },
    })

    router.beforeEach((to, from) => {
        StartLoading()
        if (from.name && typeof window !== 'undefined') {
            positions.set(from.fullPath, window.scrollY)
        }
    })

    router.afterEach((to) => {
        FinishLoading()
        const nextTitle = typeof title === 'function' ? title(to) : (to.meta?.title || title)
        if (nextTitle && typeof document !== 'undefined') document.title = nextTitle
        onNavigate?.(to)
    })

    router.onError(() => {
        FinishLoading()
    })

    return router
}
