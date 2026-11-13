# WashUI

<p>
    <a href="https://www.npmjs.com/package/wash-ui"><img src="https://img.shields.io/npm/v/wash-ui" alt="npm version"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/npm/l/wash-ui" alt="license"></a>
    <a href="https://www.npmjs.com/package/wash-ui"><img src="https://img.shields.io/badge/types-included-blue" alt="types"></a>
    <br>
    <a href="https://github.com/HugStars/WashUI/actions/workflows/ci.yml"><img src="https://github.com/HugStars/WashUI/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
    <a href="https://vuejs.org"><img src="https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&amp;logoColor=white" alt="Vue 3"></a>
    <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-7-646cff?logo=vite&amp;logoColor=white" alt="Vite 7"></a>
    <br>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node-%3E%3D20-339933?logo=node.js&amp;logoColor=white" alt="Node >=20"></a>
    <a href="https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules"><img src="https://img.shields.io/badge/module-ESM-f7df1e?logo=javascript&amp;logoColor=black" alt="ESM"></a>
</p>

WashUI 是一套自用的 Vue 3 设计系统，由 `ui/` 库与 `docs/` 文档站组成。

包含布局、组件、Toast、Loading、图标、工具函数等，样式简洁、功能齐全。

同一套实现支持 PC 与移动端响应式适配，也有支持桌面端的 AppDeskShell。

颜色、圆角等支持通过 JS 和 CSS 调整。

提供常用格式化、防抖节流等工具函数。

内置约一两百个图标，使用[`Morphicons`](https://www.morphicons.com/) 支持任意图标之间的切换动画。

-   `ui/`：`wash-ui` 库，包含设计变量、组件、布局、主题、Toast、路由状态与工具
-   `docs/`：基于本库实现的文档站，根目录 Vite 配置直接指向 `docs/`

## 技术栈

pnpm workspace · Vue 3 · Vite 7 · JavaScript · 纯 CSS 变量 · PC / 移动端 / 桌面壳层三端适配

## 快速开始

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:5180`。

根目录就是文档站，只有一套开发命令。修改包名或依赖后如果出现 `504 (Outdated Optimize Dep)`，先停掉所有 dev server，再执行 `pnpm dev --force`。

### 命令

| 命令                    | 说明                                          |
| ----------------------- | --------------------------------------------- |
| `pnpm dev`              | 启动文档站开发服务（5180）                    |
| `pnpm dev --force`      | 强制重建依赖预构建后启动                      |
| `pnpm build`            | 构建文档站到根目录 `dist`                     |
| `pnpm preview`          | 预览文档站构建结果                            |
| `pnpm test`             | 运行 Vitest 单元测试                          |
| `pnpm test:watch`       | 监听模式运行测试                              |
| `pnpm build:ui`         | 构建库到 `ui/dist`，并生成 `ui/types`         |
| `pnpm version:ui patch` | 递增 `wash-ui` 版本，也可用 `minor` / `major` |
| `pnpm publish:ui`       | 构建并发布 `wash-ui` 到公共 npm               |

## 设计理念

1. **变量先行**：颜色、圆角、间距、阴影、层级、动画时长都来自 CSS 变量，组件不写死主题色或秒数；换主题、调节奏只改一处。
2. **动效统一**：滑块、分页、按压、校验、角标清除共用同一套时长与缓动；状态动画优先使用 transition，支持中断和 `prefers-reduced-motion`。
3. **图标行为**：线性与 fill 图标共用一套配置，`name` 变化时由 Morphicons 做形变，不额外写动画；描边、弹簧、速度可全局配置。
4. **三端一致**：PC 页面、移动端底部导航和桌面壳层共享组件与交互语义，差异只体现在布局和输入方式。
5. **反馈一致**：校验、Tooltip、Toast、Loading 使用同一套出现 / 收起节奏和层级规则；错误提示高度过渡、可拖拽角标清除都有明确反馈。
6. **组合与共享**：单个选择项不生成外层容器，Group 只负责排列；复选框、单选框、面板、下拉多选共用选择列表和状态 composable。
7. **可覆盖**：默认值只是起点；token、图标、磨砂、动效都可以在项目侧覆盖，不侵入组件源码；所有组件、布局和 composable 都有独立导出，可 tree-shake。
8. **默认无障碍**：role、aria、键盘、焦点环和 `prefers-reduced-motion` 作为组件默认能力。

### 磨砂表面

-   `frosted` 统一使用 `--wa_color_glass` + `--wa_frosted_filter`，与 `AppPopover` 面板一致。
-   已支持 Button、Select、Input、Textarea、Chip、Tag、Card；Dialog 的 `frosted` 作用于面板，遮罩只负责变暗，不参与模糊。
-   磨砂元素本身及其祖先不要同时做 opacity 入场，避免 Chromium 丢掉 `backdrop-filter`。

## 动效规范

### 时间与曲线

| Token                   | 值                             | 用途                       |
| ----------------------- | ------------------------------ | -------------------------- |
| `--wa_duration_instant` | `.12s`                         | 透明度、勾选标记等瞬时反馈 |
| `--wa_duration_fast`    | `.15s`                         | 颜色、边框、透明度、悬停   |
| `--wa_duration_base`    | `.2s`                          | 按压、位移、一般状态切换   |
| `--wa_duration_medium`  | `.24s`                         | 弹框内容、较大区域的进入   |
| `--wa_duration_slow`    | `.34s`                         | 滑块、标签指示器、浮层进入 |
| `--wa_duration_slower`  | `.45s`                         | 回弹、扩散类反馈           |
| `--wa_duration_route`   | `.55s`                         | 路由进度条                 |
| `--wa_duration_loop`    | `.8s`                          | Spinner 等循环动画         |
| `--wa_duration_shimmer` | `1.2s`                         | 骨架屏 shimmer             |
| `--wa_ease_out`         | `cubic-bezier(.2, .9, .3, 1)`  | 进入、颜色、淡出           |
| `--wa_ease_in`          | `cubic-bezier(.4, 0, 1, 1)`    | 退出                       |
| `--wa_ease_in_out`      | `cubic-bezier(.4, 0, .2, 1)`   | 可逆位移                   |
| `--wa_ease_spring`      | `cubic-bezier(.3, 1.2, .5, 1)` | 按压缩放、滑块、指示器     |

### 交互反馈

-   悬停位移只在鼠标设备生效：

    ```css
    @media (hover: hover) and (pointer: fine) {
        .component:hover:not(:disabled) {
            transform: translateY(-1px);
        }
    }
    ```

-   按压统一为轻微缩小：按钮 `.96`、Chip `.94`、标签 `.94`、图标按钮 `.86`、复选框 `.9`。
-   焦点统一使用 `2px` accent 外轮廓，或在控件上使用 `3px` focus ring。
-   `disabled` 状态不再触发悬停位移和按压反馈。

### 状态动画

-   可逆状态使用 transition：复选框勾选 / 取消、单选框圆点、开关滑块、标签指示器。
-   连续动画使用 keyframe：Spinner、Skeleton、RouteBar。
-   一次性装饰动画使用 keyframe：Toast、Dialog 内容、移动端 sheet。
-   状态动画必须支持中断：不要用 `forwards` 一次性动画驱动会反复切换的状态。
-   拖拽类连续交互使用 rAF 弹簧，松手时携带释放速度；粘性连接每帧按两个圆的几何关系计算路径，超过阈值立即断开。
-   不要在 `backdrop-filter` 元素本身或它的祖先/子元素上同时做 opacity 入场；Chromium 会丢掉模糊。
-   浮层、弹框、Toast 的进入退出需要同时覆盖 `prefers-reduced-motion`。

### 无障碍

-   所有动画组件提供 `prefers-reduced-motion: reduce` 分支。
-   Spinner 在减少动态时减速而不是完全停止；Skeleton 停止 shimmer。
-   动效不能是唯一的信息来源，选中状态同时通过形状、颜色和 `aria-checked` 表达。

## 圆角层级

组件统一使用四档圆角，不再写死 5 / 7 / 10 / 14 / 22 / 28 等值：

| Token                 | 值    | 用途                                      |
| --------------------- | ----- | ----------------------------------------- |
| `--wa_radius_card`    | 24px  | 卡片、弹框、AppShell 侧栏                 |
| `--wa_radius_popover` | 16px  | 面板、列表分组、提示块、Popover、导航项   |
| `--wa_radius_control` | 8px   | 输入框、按钮组、图标按钮、代码块、Tooltip |
| `--wa_radius_sm`      | 6px   | 标签、行内代码、Tabs 按钮组内层           |
| `--wa_radius_pill`    | 999px | 胶囊按钮、Chip、Switch、Slider            |

`--wa_radius_small` 保留为 `--wa_radius_control` 的兼容别名；`--wa_radius_dialog` 与 `--wa_radius_card` 同为 24px。

## 命名规范

### 组件

-   公共组件：`AppXxx`，例如 `AppButton`、`AppCheckGroup`、`AppChoiceList`。
-   布局组件：`AppShell`、`AppDeskShell`、`PageHeader`、`PageBar`、`PageTransition`、`AppRouteBar`。
-   单个选择项与分组：`AppCheck` / `AppCheckGroup`、`AppRadio` / `AppRadioGroup`。
-   面板封装：`AppCheckPanel`、`AppRadioPanel`；共享核心为 `AppChoiceList`。

### CSS

-   类名、CSS 变量、动画名统一 `wa_` 前缀，使用下划线拼接：`.wa_btn`、`.wa_check_group`、`--wa_duration_fast`。
-   状态类统一 `.on`；选中、展开、激活都用 `.on`。
-   修饰类使用 `wa_<组件>_<修饰>`，例如 `.wa_btn_primary`、`.wa_tabs_plain`。
-   子元素使用 `wa_<组件>_<部分>`，例如 `.wa_dialog_head`、`.wa_check_mark`。
-   不使用 `!important`；组件样式写在各自 SFC 的 `<style>` 中，构建时抽取到 `dist/style.css`。

### JavaScript

-   组合式函数：`useXxx`，例如 `useTheme`、`useClipboard`、`useRequest`、`useChoiceGroup`。
-   内部工厂：`createXxx`，例如 `createChoiceGroup`、`createAppRouter`。
-   常量、Symbol key 使用大驼峰；事件名使用 kebab-case 或 Vue 事件名。

## 主题与 tokens

```js
app.use(
    createUi({
        theme: 'auto',
        tokens: {
            color_accent: '#6366f1',
            radius_card: '24px',
        },
        themes: {
            light: { color_canvas: '#f7f7f8' },
            dark: { color_canvas: '#101012' },
        },
    })
)
```

-   `tokens` 在所有主题生效
-   `themes.light` / `themes.dark` 只对应各自主题，并覆盖同名 `tokens`
-   键名会自动补 `--wa_` 前缀，也可以直接传完整变量名
-   运行时可以调用 `configureTokens` 重新应用

## 按需引入

```js
import AppButton from 'wash-ui/components/AppButton'
import { AppCheck, AppCheckGroup } from 'wash-ui'
import 'wash-ui/style.css'
```

`createUi()` 会全量注册所有组件；不使用它时手动注册即可。样式统一抽取为 `dist/style.css`。

组件子路径同时提供类型声明（`types/components/*.d.ts`），`wash-ui/components/AppButton` 可以直接获得 Props 与事件提示。

## 工具函数

```js
import {
    formatBytes,
    formatBytesFixed,
    formatDate,
    formatRelativeTime,
    debounce,
} from 'wash-ui/utils'

formatBytes(1536) // 1.5 KB
formatBytesFixed(2)(1536) // 1.50 KB
formatDate(Date.now(), 'YYYY-MM-DD') // 2026-11-13
formatRelativeTime(Date.now() - 3 * 60 * 1000) // 3 分钟前

const onSearch = debounce((keyword) => search(keyword), 300)
onSearch.cancel()
```

工具函数按用途分四组：字节与速率、数字与文本、日期与时间、防抖与节流，完整示例见文档站 **能力 → 工具函数**。

## TODO

-   [x] 复选框拆分为 `AppCheck` + `AppCheckGroup`
-   [x] 新增 `AppRadio` + `AppRadioGroup`
-   [x] 抽取 `AppChoiceList`、`useChoiceGroup`
-   [x] `AppCheck` 支持 indeterminate
-   [x] `AppRadio` 复用复选框的尺寸、标签、排版和动效节奏
-   [x] 统一组件按压、悬停、reduced-motion 规范
-   [x] 重写 README 设计、动效、命名、事件、Props 规范
-   [x] 新增 Roadmap、Radio、ChoiceList 文档页
-   [x] 迁移旧 `AppCheck` 分组 API 的存量示例
-   [x] 新增 `PageBar` 响应式页面操作栏与 `bleed` 铺满
-   [x] Input / Textarea / Select 支持 `rule` 校验
-   [x] 文档校验示例统一改为 `rule`
-   [x] 新增 `AppTable`、`AppPagination` 与对应文档页
-   [x] 枚举 Prop 的可选值统一改为 JSDoc
-   [x] Popover 关闭时恢复焦点，Select / 更多菜单支持方向键导航
-   [x] 修复深色主题辅助文字对比度与全局键盘焦点环
-   [x] 增加 Vitest 测试与 GitHub Actions 校验
-   [x] 生成 `ui/types` 组件 Props 声明
-   [x] 文档站增加搜索（Ctrl/Cmd+K）与页内目录
-   [x] 新增 `AppNavMenu` 导航菜单，文档侧栏改用真实链接
-   [x] 动画时长、缓动、磨砂、代码高亮、选中高亮统一为设计 token
-   [x] 圆角统一为 24 / 16 / 8 / 6 四档
-   [x] 新增 `AppList` / `AppListRow`、`AppHint`、`AppPinInput`
-   [x] `AppPanel` 支持 `tip` / `soft` / `plain` 三种形态
-   [x] 表格行入场、分页滑块、校验高度过渡、角标松手清除
-   [x] 移动端 AppShell 手势隐藏导航与长按震动统一
-   [x] 实验场重构为标签式编辑器、可拖拽分栏、视口切换与全屏预览
-   [x] 组件 / 布局 / 能力总览入口卡片统一为 `DocEntryCard`
-   [ ] 补齐 ChoiceList 更多自定义触发器示例
-   [ ] 为 PageBar 补充更多插槽内容示例与移动端回归
-   [ ] 为表单 `rule` 增加异步校验与跨字段校验
-   [ ] 为 Radio / RadioGroup 增加浏览器回归用例
-   [ ] 形成正式的版本迁移指南
-   [ ] 按路线图实现 Form、Tree 等计划组件

## 发版流程

### 版本规则

| 级别  | 命令                    | 适用场景                           |
| ----- | ----------------------- | ---------------------------------- |
| patch | `pnpm version:ui patch` | 修复、样式调整、文档               |
| minor | `pnpm version:ui minor` | 新增组件、新增参数或事件，保持兼容 |
| major | `pnpm version:ui major` | 破坏性 API 变更                    |

### 发布步骤

```bash
# 1. 发布前检查
pnpm test
pnpm build:ui

# 2. 递增版本，自动提交并创建 vX.Y.Z tag
pnpm version:ui patch

# 3. 先推送分支，确保默认分支已有最新 workflow
git push

# 4. 再推送 tag，触发 GitHub Actions 自动发布
git push --follow-tags
```

### 注意项

-   `pnpm version:ui` 会修改 `ui/package.json`、自动提交并打 tag；脚本要求工作区干净，否则会拒绝执行
-   必须先 `git push` 分支，再 `git push --follow-tags`；tag 先到、workflow 后到时 GitHub 不会触发发布
-   仓库需要在 **Settings → Secrets and variables → Actions** 配置 `NPM_TOKEN`
-   workflow 会校验 tag 与 `ui/package.json` 版本一致，不一致会直接失败
-   该版本已经存在于 npm 时，发布步骤会自动跳过
-   启用 CI 发布后，不要同时在本地执行 `pnpm publish:ui`，避免重复发布
-   如果 Actions 不可用，可以本地 `pnpm publish:ui` 作为备选，此时不要再推 tag
-   npm 发布后 registry 传播可能需要几分钟，用 `npm view wash-ui version` 确认
-   `ui/package.json` 的 `files` 只包含 `dist`、`types`、`tokens.css`、`tokens.js`、`LICENSE` 与 `README.md`，文档站不会发布

### 发布后验证

```bash
npm view wash-ui version
npm i wash-ui
```

再确认 <https://www.npmjs.com/package/wash-ui> 的版本、README 和文件列表是否正常。

`pnpm build:ui` 会先用 `vue-tsc` 生成 `ui/types`，再由 `scripts/build-types.mjs` 从 `defineProps` 生成组件的 Props 声明。类型目录不提交到仓库，发布时由 `prepublishOnly` 重新生成。

## 许可证

[MIT](./LICENSE)
