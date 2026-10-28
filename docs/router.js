import { createAppRouter } from '@wash/ui/router'
import { componentPages, guidePages, layoutPages } from './site.js'

const pages = import.meta.glob('./pages/*.vue')

function page(name) {
    const loader = pages[`./pages/${name}.vue`]
    if (!loader) throw new Error(`缺少文档页面：${name}`)
    return loader
}

export function createDocsRouter() {
    return createAppRouter({
        routes: [
            { path: '/', name: 'home', component: page('HomePage'), meta: { title: 'WashUI', nav: 'home' } },
            ...guidePages.map(item => ({
                path: item.path,
                name: item.name,
                component: page(item.page),
                meta: { title: item.label, nav: 'guide', section: 'guide' },
            })),
            { path: '/components', name: 'components', component: page('ComponentsPage'), meta: { title: '组件总览', nav: 'components', section: 'components' } },
            ...componentPages.map(item => ({
                path: item.path,
                name: item.name,
                component: page(item.page),
                meta: { title: item.label, nav: 'components', section: 'components' },
            })),
            { path: '/icons', name: 'icons', component: page('IconPage'), meta: { title: '图标', nav: 'icons' } },
            ...layoutPages.map(item => ({
                path: item.path,
                name: item.name,
                component: page(item.page),
                meta: { title: item.label, nav: 'layout', section: 'layout' },
            })),
            { path: '/composables', name: 'composables', component: page('ComposablesPage'), meta: { title: '组合式函数', nav: 'abilities', section: 'abilities' } },
            { path: '/utils', name: 'utils', component: page('UtilsPage'), meta: { title: '工具函数', nav: 'abilities', section: 'abilities' } },
            { path: '/tokens', name: 'tokens', component: page('TokensPage'), meta: { title: '设计变量', nav: 'abilities', section: 'abilities' } },
            { path: '/guide/layout', redirect: '/layout' },
            { path: '/components/icon', redirect: '/icons' },
            { path: '/:pathMatch(.*)*', redirect: '/' },
        ],
        title: to => `${to.meta?.title || '文档'} · WashUI`,
        onNavigate(to) {
            console.info('[wash-ui]', to.fullPath)
        },
    })
}
