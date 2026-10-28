# WashUI

WashUI 的 Vue 3 设计系统与文档站。仓库：<https://github.com/HugStars/WashUI>

仓库由两部分组成：

- `ui/`：`@wash/ui` 库，包含设计变量、组件、布局、主题、Toast、路由与工具
- `docs/`：基于本库实现的文档站，根目录的 Vite 配置直接指向 `docs/`

## 技术栈

pnpm workspace · Vue 3 · Vite 7 · JavaScript · 纯 CSS 变量

## 启动文档

```bash
pnpm install
pnpm dev:docs
```

访问 `http://localhost:5180`。

`pnpm dev` 是 `pnpm dev:docs` 的快捷方式。根目录就是文档站，不存在单独的 docs 包，所以文档命令都带 `:docs` 后缀。

同一个 5180 端口只运行一个开发服务。修改包名或依赖后如果出现 `504 (Outdated Optimize Dep)`，先停掉所有 dev server，再执行 `pnpm dev:docs:force`。

## 命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev:docs` | 启动文档站开发服务（5180） |
| `pnpm dev:docs:force` | 强制重建依赖预构建后启动 |
| `pnpm build:docs` | 构建文档站到 `docs/dist` |
| `pnpm preview:docs` | 预览文档站构建结果 |
| `pnpm build:ui` | 构建库到 `ui/dist` |
| `pnpm dev` | 等同 `pnpm dev:docs` |
| `pnpm build` | 等同 `pnpm build:docs` |
| `pnpm preview` | 等同 `pnpm preview:docs` |

## 目录

```text
WashUI/
├─ ui/                     @wash/ui 库
│  ├─ src/
│  │  ├─ components/       基础、加载、表单与反馈组件
│  │  ├─ layout/           AppShell、PageHeader、AppRouteBar、PageTransition
│  │  ├─ composables/      useClipboard、useRequest
│  │  ├─ router/           createAppRouter
│  │  ├─ styles/           base、layout、components
│  │  ├─ utils/            格式化函数
│  │  ├─ theme.js          主题与 tokens 配置
│  │  ├─ toast.js          Toast 服务
│  │  ├─ plugin.js         createUi
│  │  └─ index.js          主入口
│  ├─ tokens.css           CSS 变量与暗色主题
│  ├─ tokens.js            图表配色、断点与层级
│  ├─ vite.config.js       库构建配置
│  └─ package.json
├─ docs/                   文档站
│  ├─ pages/               指南、组件、布局与能力页面
│  ├─ components/          DocPage、DemoBlock、ApiTable
│  ├─ styles/docs.css      文档站布局样式
│  ├─ site.js              导航与页面注册数据
│  ├─ router.js            文档路由
│  ├─ App.vue              文档壳层
│  ├─ main.js              文档入口
│  └─ index.html
├─ vite.config.js          文档站 Vite 配置（root: docs）
├─ pnpm-workspace.yaml
└─ package.json
```

## 文档结构

文档页由 `docs/site.js` 驱动：

- 指南、组件、布局、能力分别对应 `sections` 与 `nav`
- 组件页与布局页集中在 `componentGroups`、`layoutPages`
- 新增页面时，在 `docs/pages/` 创建 `.vue` 文件，并在 `site.js` 注册；`router.js` 会自动生成路由

组件与布局在目录、导航和文档中都分开：`ui/src/components/` 是 UI 组件，`ui/src/layout/` 是页面结构。

## 主题与 tokens

```js
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
```

- `tokens` 在所有主题生效
- `themes.light` / `themes.dark` 只对应各自主题，并覆盖同名 `tokens`
- 键名会自动补 `--wa_` 前缀，也可以直接传完整变量名
- 运行时可以调用 `configureTokens` 重新应用

## 命名

- CSS 类名、CSS 变量与动画名统一 `wa_` 前缀，使用下划线拼接
- 状态类统一使用 `.on`
- 组件样式只引用变量和修饰类，不使用 `!important`
- 布局样式在 `ui/src/styles/layout.css`，组件样式在 `ui/src/styles/components.css`

## 构建与发布

```bash
pnpm build:ui
cd ui
pnpm publish --registry=https://你的私有源地址
```

`ui/package.json` 的 `files` 只包含 `dist`、`tokens.css`、`tokens.js` 与 `README.md`，文档不会发布。发布前需要在私有源拥有 `@wash` 作用域。

## 说明

当前仓库只完成了代码改造，未执行依赖安装与构建。首次运行前先执行 `pnpm install`；`node_modules` 与 `dist` 已被忽略。
