import { componentGroups, composablePages, guidePages, iconPages, layoutPages, servicePages, utilsPages } from './site.js'

const componentItems = componentGroups.flatMap(group => group.items.map(item => ({
    ...item,
    group: group.title,
})))

export const searchItems = [
    { name: 'home', label: '开始', en: 'Home', path: '/', summary: 'WashUI 设计系统首页。' },
    ...guidePages,
    { name: 'components', label: '组件总览', en: 'Components', path: '/components', summary: '全部组件的分类索引。' },
    ...componentItems,
    ...layoutPages,
    ...composablePages,
    ...servicePages,
    ...iconPages,
    { name: 'abilities', label: '能力总览', en: 'Abilities', path: '/abilities', summary: '全局服务、组合式函数、工具函数与设计变量。' },
    ...utilsPages,
    { name: 'tokens', label: '设计变量', en: 'Tokens', path: '/tokens', summary: '颜色、圆角、间距、阴影与动效 token。' },
    { name: 'playground', label: '实验场', en: 'Playground', path: '/playground', summary: '在线编辑并运行示例。' },
]

function normalize(value) {
    return String(value || '').toLowerCase()
}

export function searchDocs(query, limit = 20) {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
    if (!terms.length) return []

    return searchItems
        .map(item => ({
            item,
            haystack: normalize([item.label, item.en, item.component, item.group, item.summary, item.path].filter(Boolean).join(' ')),
        }))
        .filter(({ haystack }) => terms.every(term => haystack.includes(term)))
        .sort((a, b) => {
            const aLabel = normalize(a.item.label)
            const bLabel = normalize(b.item.label)
            const aRank = aLabel.startsWith(terms[0]) ? 0 : 1
            const bRank = bLabel.startsWith(terms[0]) ? 0 : 1
            return aRank - bRank
        })
        .slice(0, limit)
        .map(({ item }) => item)
}
