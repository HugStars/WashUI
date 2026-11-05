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
     * - mode='push'：始终写入历史栈（侧边栏、文档下拉等内容导航）
     * - mode='replace'：始终替换当前历史
     * - 默认 auto：未配置 home 时 replace；home → 非 home 时 push；非 home 之间 replace；回到 home 时优先 back
     */
    function Navigate(to, options = {}) {
        const mode = options.mode || 'auto'
        const current = router.currentRoute.value
        const target = router.resolve(to)

        if (target.fullPath === current.fullPath) return

        if (mode === 'push') {
            router.push(to)
            return
        }

        if (mode === 'replace') {
            router.replace(to)
            return
        }

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
