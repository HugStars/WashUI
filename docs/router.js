import { createAppRouter } from 'wash-ui/router'
import { componentPages, composablePages, guidePages, layoutPages, servicePages } from './site.js'

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
            { path: '/abilities', name: 'abilities', component: page('AbilitiesPage'), meta: { title: '能力', nav: 'abilities', section: 'abilities' } },
            ...servicePages.map(item => ({
                path: item.path,
                name: item.name,
                component: page(item.page),
                meta: { title: item.label, nav: 'abilities', section: 'abilities' },
            })),
            ...composablePages.map(item => ({
                path: item.path,
                name: item.name,
                component: page(item.page),
                meta: { title: item.label, nav: 'abilities', section: 'abilities' },
            })),
            { path: '/utils', name: 'utils', component: page('UtilsPage'), meta: { title: '工具函数', nav: 'abilities', section: 'abilities' } },
            { path: '/tokens', name: 'tokens', component: page('TokensPage'), meta: { title: '设计变量', nav: 'abilities', section: 'abilities' } },
            { path: '/composables', redirect: '/composables/theme' },
            { path: '/guide/layout', redirect: '/layout' },
            { path: '/components/icon', redirect: '/icons' },
            { path: '/components/toast', redirect: '/services/toast' },
            { path: '/components/loading', redirect: '/services/loading' },
            { path: '/playground', name: 'playground', component: page('PlaygroundPage'), meta: { title: '实验场', nav: 'playground' } },
            { path: '/:pathMatch(.*)*', redirect: '/' },
        ],
        home: 'home',
        title: to => `${to.meta?.title || '文档'} · WashUI`,
    })
}
