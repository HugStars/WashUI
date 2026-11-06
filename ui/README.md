# WashUI

`@wash/ui` 前端设计系统。包含设计变量、Vue 3 组件、页面布局、Toast、路由工厂、工具函数与组合式函数。

- 纯 CSS 变量 + 原生 CSS，不依赖 Tailwind、UI 框架或预处理器
- 组件与布局分离：`components/` 是 UI 组件，`layout/` 是页面结构
- 只发布 ESM，面向现代浏览器与 Vite

## 安装

```bash
pnpm add @wash/ui
```

私有源需要先在项目 `.npmrc` 中配置作用域：

```ini
@wash:registry=https://你的私有源地址
```

## 引入

```js
import '@wash/ui/style.css'
```

`style.css` 已包含 `tokens.css`。只使用变量时改为：

```js
import '@wash/ui/tokens.css'
```

两者不要同时引入。

## 初始化

```js
import { createApp } from 'vue'
import '@wash/ui/style.css'
import { createUi } from '@wash/ui'
import App from './App.vue'

const app = createApp(App)

app.use(createUi({
    theme: 'auto',
    tokens: {
        color_accent: '#6366f1',
        radius_card: '20px',
    },
    themes: {
        light: { color_canvas: '#f7f7f8' },
        dark: { color_canvas: '#101012' },
    },
}))

app.mount('#app')
```

- `createUi` 全局注册全部组件与布局，并初始化主题
- `tokens` 在所有主题生效；`themes.light` / `themes.dark` 覆盖同名 token
- 键名自动补 `--wa_` 前缀，也可以传完整变量名
- 默认主题存储键为 `wa_theme`

## 页面骨架

```html
<template>
    <AppShell :nav="nav" :active="route.name" @navigate="go">
        <PageHeader :title="route.meta.title || '首页'" />

        <RouterView v-slot="{ Component }">
            <PageTransition>
                <component :is="Component" />
            </PageTransition>
        </RouterView>
    </AppShell>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const nav = [
    { name: 'home', label: '首页', icon: 'home' },
    { name: 'list', label: '列表', icon: 'list' },
]

function go(item) {
    if (route.name !== item.name) router.push({ name: item.name })
}
</script>
```

PageHeader 必须放在 AppShell 内，并且放在 RouterView 与 PageTransition 外。PageTransition 要求页面组件是单根元素。

## 组件

| 组件 | 参数 | 事件 | 插槽 |
| --- | --- | --- | --- |
| `AppButton` | `variant`、`size`、`type`、`loading`、`disabled` | 原生 `click` | 默认 |
| `AppCard` | `title`、`compact` | 无 | 默认、`title`、`extra`、`footer` |
| `AppCode` | `code`、`lang`、`showLineNumbers`、`showLang`、`copyable`、`maxHeight` | 无 | 无 |
| `AppChip` | `active`、`text` | 原生 `click` | 默认 |
| `AppStat` | `label`、`value` | 无 | 默认、`label` |
| `AppEmpty` | `text` | 无 | 默认、`action` |
| `AppIcon` | `name`、`icon`、`size`、`strokeWidth`、`morph`、`spring`、`reducedMotion` | 无 | 无 |
| `AppThemeToggle` | `size` | `change` | 无 |
| `AppSpinner` | `size` | 无 | 无 |
| `AppSkeleton` | `width`、`height`、`radius` | 无 | 无 |
| `AppInput` | `modelValue`、`label`、`hint`、`error`、`rule`、`type`、`size`、`clearable`、`frosted`、`disabled`、`readonly` | `update:modelValue`、`clear` | `label`、`prefix`、`suffix` |
| `AppTextarea` | `modelValue`、`label`、`hint`、`error`、`rule`、`rows`、`cols`、`wrap`、`maxlength`、`showCount`、`resize`、`size`、`frosted`、`disabled`、`readonly` | `update:modelValue` | `label` |
| `AppSelect` | `modelValue`、`options`、`groups`、`label`、`hint`、`error`、`rule`、`placeholder`、`size`、`checkPosition`、`frosted`、`disabled` | `update:modelValue`、`change` | `label` |
| `AppSelectPanel` | `modelValue`、`options`、`groups`、`emptyText` | `select` | 无 |
| `AppUpload` | `modelValue`、`label`、`hint`、`error`、`accept`、`multiple`、`maxSize`、`maxCount`、`disabled` | `update:modelValue`、`change`、`reject`、`remove` | 无 |
| `AppPanel` | `title`、`description`、`tone`、`compact` | 无 | 默认、`title`、`actions`、`footer` |
| `AppPopover` | `open`、`placement`、`offset`、`width`、`matchTrigger`、`role`、`ariaLabel`、`disabled`、`closeOnOutside`、`closeOnEsc` | `update:open`、`open`、`close` | `trigger`、默认 |
| `AppDialog` | `open`、`title`、`ariaLabel`、`describedBy`、`width`、`closable`、`closeOnMask`、`closeOnEsc`、`gesture` | `update:open`、`close` | 默认、`title`、`footer` |

`AppButton` 的 `variant`：`default`、`primary`、`line`、`danger`、`icon`；`size`：`md`、`sm`。

`AppCode` 基于 Speed-highlight，`lang` 支持 `js`、`ts`、`html`、`css`、`json`、`md`、`py`、`bash`、`sql`、`go`、`java`、`c`、`rs`、`yaml`、`xml` 等 34 种语言，也接受 `javascript`、`python`、`shell` 等常见别名。完整列表与标签从 `codeLanguages` 导入：

```js
import { codeLanguages } from '@wash/ui'

// [{ value: 'js', label: 'JavaScript' }, ...]
```

```vue
<AppCode :code="source" lang="ts" show-line-numbers :max-height="360" />
```

`maxHeight` 为 `0` 时不限制高度；`showLang` 与 `copyable` 都关闭时不再渲染头部。

## 按需引入

组件与布局都有独立子路径入口，构建后保留独立模块，便于打包器做 JS tree-shaking：

```js
import AppButton from '@wash/ui/components/AppButton'
import AppShell from '@wash/ui/layout/AppShell'
import '@wash/ui/style.css'
```

也可以继续从主入口按需导入：

```js
import { AppButton, AppShell } from '@wash/ui'
```

样式统一抽取在 `dist/style.css`，按需引入组件时仍需引入一次。

`createUi()` 会全量注册所有组件；需要 tree-shaking 时使用上面的子路径导入，并手动注册需要的组件。
`AppPanel` 的 `tone`：`default`、`success`、`warning`、`help`、`danger`。
`AppDialog` 是受控组件，必须使用 `v-model:open`。

## 图标

`AppIcon` 使用 [Morphicons](https://www.morphicons.com)（MIT）做图标形变：`name` 或 `icon` 变化时，会自动从旧图标过渡到新图标。

```vue
<AppIcon :name="open ? 'close' : 'menu'" />
<AppIcon name="home" :size="20" :stroke-width="1.8" />
<AppIcon name="static-icon" :morph="false" />
```

- `morph`：是否启用形变，默认 `true`
- `spring`：`snappy`、`smooth`、`bouncy` 或 `{ stiffness, damping }`
- `reducedMotion`：`never`、`user`（默认，跟随系统）、`always`
- `icon`：直接传 IconNode 数组或 24 grid 的 `d` 字符串，优先级高于 `name`
- 原始 `<svg>` 字符串按原样渲染，不参与形变；需要形变时请提供数组或 `d` 字符串

全局新增或覆盖图标：

```js
app.use(createUi({
    icons: {
        badge: [
            ['circle', { cx: 12, cy: 12, r: 9 }],
            ['path', { d: 'm8 12 3 3 5-6' }],
        ],
        logo: '<svg viewBox="0 0 24 24"><path d="..." fill="currentColor" /></svg>',
    },
}))
```

- 数组形式沿用 `strokeWidth`、`currentColor` 等规则
- 字符串 SVG 原样渲染，不应用 `strokeWidth`，尺寸仍由 `size` 控制
- 运行时使用 `configureIcons()`；传 `null` 可移除图标
- `iconNames()` 返回当前图标名列表
- `iconGroups` 提供内置图标的分类信息，可用于文档或图标选择器

## 布局

| 布局 | 参数 | 事件 | 插槽 |
| --- | --- | --- | --- |
| `AppRouteBar` | `loading` | 无 | 无 |
| `AppShell` | `nav`、`active`、`loading`、`navLayout` | `navigate` | 默认、`footer` |
| `PageBar` | `bleed` | 无 | 默认 |
| `PageHeader` | `title` | 无 | 默认、`center`、`actions` |
| `PageTransition` | 无 | 无 | 默认 |

`navLayout`：`auto`（默认，桌面仅图标、移动端图标+文本）、`inline`、`stacked`、`icon`、`text`。
`PageBar` 桌面端在原位置渲染，移动端（≤860px）自动投递到 `AppShell` 顶部标题栏下方，共用标题栏的磨砂背景；`bleed` 会抵消标题栏的左右内边距，并通过 `--wa_page_bar_inset` 把标题栏内边距暴露给插槽内容，`AppTabs` 已内置适配。
`AppShell` 的 `loading` 不传时自动跟随 `routeLoading`。

`AppShell` 已内置 `AppRouteBar`。自定义布局时可以单独放到应用根部：

```vue
<AppRouteBar />
```

需要手动控制时传 `loading`：

```vue
<AppRouteBar :loading="loading" />
```

## Toast

```js
import { toast } from '@wash/ui'

toast('普通提示')
toast.success('已保存')
toast.warning('请注意')
toast.help('使用说明')
toast.danger('请求失败')

const task = toast.loading('处理中...')
task.update('success', '完成')
task.close()

toast('常驻提示', { persistent: true })
toast('三秒后关闭', { duration: 3000 })
toast.clear()
```

Toast 使用 `textContent` 写入内容，不解析 HTML。

## Loading

```js
import { loading, loadingManager } from '@wash/ui'

loading.show('save', '保存中...', {
    priority: 1,
    icon: 'loader',
    gradient: true,
    blur: 10,
})

loading.update('save', '正在写入...')
loading.update('save', { icon: 'database', spin: false, blur: 16 })
loading.hide('save')

loading.show('sync', '同步中...', { priority: 0 })
loading.count()
loading.has('sync')
loading.clear()
```

- 全局单例遮罩，多个 id 可同时注册
- 按 `priority` 选择显示，同级取最新
- 同一 id 重复 `show` 会覆盖配置
- `icon` 使用内置图标名，`spin` 控制是否旋转
- `gradient` 开启从透明到 `#00000059` 的渐变背景
- `blur` 设置磨砂模糊半径（px），`0` 为关闭
- 多个任务同时存在时，以当前显示的优先级最高任务的配置为准
- 打开时锁定页面滚动并保留当前滚动位置，关闭后恢复
- `loadingManager` 是 `loading` 的别名
- 加载遮罩没有关闭按钮，由业务代码调用 `hide(id)` / `clear()` 关闭

## 主题

```js
import { useTheme } from '@wash/ui'

const { mode, theme, setTheme, toggleTheme } = useTheme()
```

- `mode`：`light`、`dark`、`auto`
- `theme`：当前实际主题
- `setTheme('auto')`、`toggleTheme()`
- 运行时修改 tokens：

```js
import { configureTokens } from '@wash/ui'

configureTokens({
    tokens: { color_accent: '#6366f1' },
    themes: { dark: { color_canvas: '#101012' } },
})
```

首屏防闪：

```html
<script>
    try {
        var saved = localStorage.getItem('wa_theme')
        var dark = saved === 'dark' || (saved !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    } catch (e) { }
</script>
```

## 路由

```js
import { createAppRouter } from '@wash/ui/router'

const router = createAppRouter({
    routes,
    history: 'web',
    title: to => `${to.meta?.title || '概览'} · 我的应用`,
    minLoading: 320,
    onNavigate(to) {
        console.info(to.fullPath)
    },
})
```

工厂负责顶部进度条、`document.title` 与滚动位置恢复。`minLoading` 是最短显示时间，默认 320ms。

## 组合式函数与工具

```js
import { useClipboard, useRequest } from '@wash/ui'
import { formatBytes, formatSpeed, formatMbps, formatDuration, formatCount } from '@wash/ui/utils'
```

- `useClipboard` 返回 `{ copied, copy }`
- `useRequest` 返回 `{ data, error, loading, run, cancel, reset }`
- `formatBytes`、`formatSpeed`、`formatMbps`、`formatDuration`、`formatCount` 都是纯函数

## 命名

- 所有 CSS 类名、CSS 变量、动画名使用下划线拼接，统一 `wa_` 前缀
- 状态类统一使用 `.on`
- 不使用 `!important`
- 组件与布局样式写在各自 SFC 的 `<style>` 中，构建时抽取为 `dist/style.css`
- `styles/` 保留 `base.css`、`form.css`、`loading.css` 与汇总入口 `index.css`
- `core/` 存放图标、主题、Toast、Loading、路由状态、插件与代码语言等运行时模块；`toast.css` 与 `toast.js` 同目录
- 主题通过 `[data-theme='dark']` 覆盖变量，不覆盖组件规则

主要变量：

| 分组 | 变量 |
| --- | --- |
| 画布/表面 | `--wa_color_canvas`、`--wa_color_surface`、`--wa_color_dialog` |
| 文字 | `--wa_color_text`、`--wa_color_text_muted`、`--wa_color_text_subtle`、`--wa_color_text_faint` |
| 容器 | `--wa_color_glass`、`--wa_color_border`、`--wa_color_line`、`--wa_color_soft`、`--wa_color_hover` |
| 强调 | `--wa_color_accent`、`--wa_color_success`、`--wa_color_warning`、`--wa_color_help`、`--wa_color_danger` |
| 导航选中 | `--wa_color_nav_active`、`--wa_color_on_nav_active` |
| 圆角 | `--wa_radius_card`、`--wa_radius_control`、`--wa_radius_small`、`--wa_radius_popover`、`--wa_radius_dialog`、`--wa_radius_pill` |
| 间距 | `--wa_space_1`、`--wa_space_2`、`--wa_space_3`、`--wa_popover_padding` |
| 控件高度 | `--wa_control_height`、`--wa_control_height_sm` |
| 磨砂 | `--wa_blur` |
| 阴影 | `--wa_shadow_nav`、`--wa_shadow_dialog`、`--wa_shadow_toast` |
| 动效 | `--wa_duration_fast`、`--wa_duration_base`、`--wa_ease_out` |
| 层级 | `--wa_z_header`、`--wa_z_nav`、`--wa_z_popover`、`--wa_z_dialog`、`--wa_z_toast`、`--wa_z_route` |
| 布局 | `--wa_body_width`、`--wa_font_family`、`--wa_font_mono` |

## 文档

仓库根目录就是文档站，从根执行：

```bash
pnpm install
pnpm dev:docs
```

访问 `http://localhost:5180`。构建与目录说明见根 `README.md`。

## 发布

```bash
pnpm build:ui
cd ui
pnpm publish --registry=https://你的私有源地址
```

`prepublishOnly` 会自动构建。`files` 只包含 `dist`、`tokens.css`、`tokens.js` 与 `README.md`。
