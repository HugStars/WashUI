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
        home = null,
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

    function ResolveHome() {
        if (home == null) return null
        if (typeof home === 'string') {
            return router.hasRoute(home) ? router.resolve({ name: home }) : router.resolve(home)
        }
        return router.resolve(home)
    }

    function IsHome(route, homeRoute) {
        if (!homeRoute) return false
        if (homeRoute.name && route.name === homeRoute.name) return true
        return route.path === homeRoute.path
    }

    function CanBackToHome(homeRoute) {
        if (typeof window === 'undefined' || !window.history.state?.back) return false

        try {
            return IsHome(router.resolve(window.history.state.back), homeRoute)
        } catch {
            return false
        }
    }

    /**
     * 导航菜单跳转：
     * - 未配置 home：直接 replace
     * - home 进入非 home：push
     * - 非 home 之间：replace
     * - 回到 home：上一页是 home 时 back，否则 replace
     */
    function Navigate(to) {
        const current = router.currentRoute.value
        const target = router.resolve(to)

        if (target.fullPath === current.fullPath) return

        const homeRoute = ResolveHome()

        if (!homeRoute) {
            router.replace(to)
            return
        }

        if (IsHome(target, homeRoute)) {
            if (CanBackToHome(homeRoute)) router.back()
            else router.replace(to)
            return
        }

        if (IsHome(current, homeRoute)) router.push(to)
        else router.replace(to)
    }

    router.navigate = Navigate

    return router
}
