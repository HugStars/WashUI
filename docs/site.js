export const nav = [
    { name: 'home', label: '开始', icon: 'home' },
    { name: 'guide', label: '指南', icon: 'edit' },
    { name: 'components', label: '组件', icon: 'grid' },
    { name: 'layout', label: '布局', icon: 'layout' },
    { name: 'abilities', label: '能力', icon: 'cpu' },
    { name: 'icons', label: '图标', icon: 'icons' },
    { name: 'playground', label: '实验场', icon: 'terminal' },
]

export const guidePages = [
    { name: 'install', label: '安装', en: 'Install', page: 'InstallPage', path: '/guide/install' },
    { name: 'quick-start', label: '快速开始', en: 'Quick Start', page: 'QuickStartPage', path: '/guide/quick-start' },
    { name: 'theme', label: '主题', en: 'Theme', page: 'ThemePage', path: '/guide/theme' },
]

export const componentGroups = [
    {
        title: '基础',
        items: [
            { name: 'button', label: '按钮', component: 'AppButton', page: 'ButtonPage', path: '/components/button', summary: '操作入口，支持类型、尺寸与加载态。' },
            { name: 'card', label: '卡片', component: 'AppCard', page: 'CardPage', path: '/components/card', summary: '内容分组容器，支持标题、额外区与页脚。' },
            { name: 'code', label: '代码', component: 'AppCode', page: 'CodePage', path: '/components/code', summary: '基于 Speed-highlight 的代码块，支持多语言、行号与复制。' },
            { name: 'chip', label: '标记', component: 'AppChip', page: 'ChipPage', path: '/components/chip', summary: '轻量筛选与状态标记。' },
            { name: 'tabs', label: '标签页', component: 'AppTabs', page: 'TabsPage', path: '/components/tabs', summary: '参考导航实现的滑动标签切换，支持面板与两种外观。' },
            { name: 'stat', label: '统计', component: 'AppStat', page: 'StatPage', path: '/components/stat', summary: '紧凑的指标展示。' },
            { name: 'number', label: '数字跳动', en: 'Number', component: 'AppNumber', page: 'NumberPage', path: '/components/number', summary: '数字变化时的平滑跳动。' },
            { name: 'empty', label: '空状态', component: 'AppEmpty', page: 'EmptyPage', path: '/components/empty', summary: '无数据时的占位与操作。' },
            { name: 'theme-toggle', label: '主题切换', component: 'AppThemeToggle', page: 'ThemeTogglePage', path: '/components/theme-toggle', summary: '亮暗主题切换，内置太阳与月亮图标。' },
        ],
    },
    {
        title: '加载',
        items: [
            { name: 'spinner', label: '加载圈', component: 'AppSpinner', page: 'SpinnerPage', path: '/components/spinner', summary: '行内加载指示。' },
            { name: 'skeleton', label: '骨架屏', component: 'AppSkeleton', page: 'SkeletonPage', path: '/components/skeleton', summary: '内容占位与渐进加载。' },
        ],
    },
    {
        title: '表单',
        items: [
            { name: 'input', label: '输入框', component: 'AppInput', page: 'InputPage', path: '/components/input', summary: '带标签、提示与校验的输入框。' },
            { name: 'switch', label: '开关', component: 'AppSwitch', page: 'SwitchPage', path: '/components/switch', summary: '二选一状态切换，支持标签对齐、尺寸与禁用。' },
            { name: 'check', label: '复选框组', component: 'AppCheck', page: 'CheckPage', path: '/components/check', summary: '复选项横向/纵向排列，支持标签前后位置与纵向对齐。' },
            { name: 'select', label: '下拉框', component: 'AppSelect', page: 'SelectPage', path: '/components/select', summary: '带标签、分组与校验的下拉选择。' },
            { name: 'select-panel', label: '下拉面板', component: 'AppSelectPanel', page: 'SelectPanelPage', path: '/components/select-panel', summary: '下拉框使用的可复用选项面板。' },
            { name: 'upload', label: '上传', component: 'AppUpload', page: 'UploadPage', path: '/components/upload', summary: '选择、拖拽、校验与文件列表。' },
            { name: 'editor', label: '富文本', component: 'AppEditor', page: 'EditorPage', path: '/components/editor', summary: '基于 contenteditable 的轻量编辑器。' },
        ],
    },
    {
        title: '反馈',
        items: [
            { name: 'panel', label: '展示框', component: 'AppPanel', page: 'PanelPage', path: '/components/panel', summary: '带色调的状态与信息展示。' },
            { name: 'popover', label: '弹出框', component: 'AppPopover', page: 'PopoverPage', path: '/components/popover', summary: '点击触发、浮层展示内容。' },
            { name: 'dialog', label: '弹框', component: 'AppDialog', page: 'DialogPage', path: '/components/dialog', summary: '受控弹框，含焦点陷阱与移动端手势。' },
        ],
    },
]

export const layoutPages = [
    { name: 'layout', label: '概览', en: 'Layout', component: '布局', page: 'LayoutPage', path: '/layout', summary: '导航、标题与页面过渡的组合方式。' },
    { name: 'route-bar', label: '路由进度条', component: 'AppRouteBar', page: 'RouteBarPage', path: '/layout/route-bar', summary: '固定在顶部的路由加载进度条。' },
    { name: 'shell', label: '壳层', component: 'AppShell', page: 'ShellPage', path: '/layout/shell', summary: '页面骨架、导航与页脚。' },
    { name: 'page-header', label: '页面标题', component: 'PageHeader', page: 'PageHeaderPage', path: '/layout/page-header', summary: '投递到壳层顶部栏的标题。' },
    { name: 'page-transition', label: '页面过渡', component: 'PageTransition', page: 'PageTransitionPage', path: '/layout/page-transition', summary: '路由切换的 out-in 过渡。' },
]

export const componentPages = componentGroups.flatMap(group => group.items)

export const iconPages = [
    { name: 'icons', label: '图标', en: 'Icons', page: 'IconPage', path: '/icons' },
]

export const composablePages = [
    { name: 'use-theme', label: '主题', en: 'useTheme', page: 'UseThemePage', path: '/composables/theme' },
    { name: 'use-clipboard', label: '剪贴板', en: 'useClipboard', page: 'UseClipboardPage', path: '/composables/clipboard' },
    { name: 'use-request', label: '请求', en: 'useRequest', page: 'UseRequestPage', path: '/composables/request' },
]

export const abilityOverview = { name: 'abilities', label: '能力总览', en: 'Abilities', path: '/abilities' }

export const abilityPages = [
    ...composablePages,
    { name: 'utils', label: '工具函数', en: 'Utils', path: '/utils' },
    { name: 'tokens', label: '设计变量', en: 'Tokens', path: '/tokens' },
]

export const servicePages = [
    { name: 'toast', label: '轻提示', en: 'Toast', page: 'ToastPage', path: '/services/toast' },
    { name: 'loading', label: '加载', en: 'Loading', page: 'LoadingPage', path: '/services/loading' },
]

export function pageLabel(item) {
    if (!item) return ''
    const suffix = item.en || (/^[A-Z]/.test(item.component || '') ? item.component : '')
    return suffix && suffix !== item.label ? `${item.label} ${suffix}` : item.label
}

export const sections = {
    guide: { title: '指南', groups: [{ title: '', items: guidePages }] },
    components: {
        title: '组件',
        groups: [
            { title: '总览', items: [{ name: 'components', label: '组件总览', path: '/components' }] },
            ...componentGroups,
        ],
    },
    layout: { title: '布局', groups: [{ title: '页面结构', items: layoutPages }] },
    abilities: {
        title: '能力',
        groups: [
            { title: '总览', items: [abilityOverview] },
            { title: '全局服务', items: servicePages },
            { title: '组合式函数', items: composablePages },
            { title: '工具函数', items: [{ name: 'utils', label: '格式化函数', path: '/utils' }] },
            { title: '设计变量', items: [{ name: 'tokens', label: '颜色 / 圆角 / 层级', path: '/tokens' }] },
        ],
    },
}

export const pageNav = [
    ...guidePages,
    ...componentPages,
    ...iconPages,
    ...layoutPages,
    abilityOverview,
    ...servicePages,
    ...abilityPages,
]
