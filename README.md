# WashUI

WashUI 是一个 Vue 3 设计系统与文档站，仓库：<https://github.com/HugStars/WashUI>。

它由两部分组成：

- `ui/`：`@wash/ui` 库，包含设计变量、组件、布局、主题、Toast、路由状态与工具
- `docs/`：基于本库实现的文档站，根目录 Vite 配置直接指向 `docs/`

## 技术栈

pnpm workspace · Vue 3 · Vite 7 · JavaScript · 纯 CSS 变量

## 快速开始

```bash
pnpm install
pnpm dev:docs
```

访问 `http://localhost:5180`。

`pnpm dev` 是 `pnpm dev:docs` 的快捷方式。根目录就是文档站，不存在单独的 docs 包，所以文档命令都带 `:docs` 后缀。

同一个 5180 端口只运行一个开发服务。修改包名或依赖后如果出现 `504 (Outdated Optimize Dep)`，先停掉所有 dev server，再执行 `pnpm dev:docs:force`。

### 命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev:docs` | 启动文档站开发服务（5180） |
| `pnpm dev:docs:force` | 强制重建依赖预构建后启动 |
| `pnpm build:docs` | 构建文档站到根目录 `dist` |
| `pnpm preview:docs` | 预览文档站构建结果 |
| `pnpm build:ui` | 构建库到 `ui/dist`，并生成 `ui/types` 声明 |
| `pnpm test` | 运行 Vitest 单元测试 |
| `pnpm dev` | 等同 `pnpm dev:docs` |
| `pnpm build` | 等同 `pnpm build:docs` |
| `pnpm preview` | 等同 `pnpm preview:docs` |

## 设计理念

1. **安静、克制**：主体使用黑白灰，绿色只用于焦点、成功和必要提示；动效服务于反馈，不抢内容。
2. **变量优先**：颜色、圆角、间距、阴影、动效都来自 CSS 变量，组件不写死主题色。
3. **组合优于配置**：单个选择项不生成外层容器，分组容器只负责排列和排版；需要布局时显式使用 Group。
4. **共享核心**：复选框、单选框、面板、下拉多选共用选择列表和状态 composable，避免三套重复实现。
5. **可中断**：状态动画优先使用 transition，快速切换时能从当前帧反向过渡，不用一次性 keyframe 制造跳变。
6. **默认无障碍**：role、aria、键盘、焦点环和 `prefers-reduced-motion` 作为组件默认能力。
7. **可树摇**：所有组件、布局和 composable 都有独立导出，命名导入可由打包器 tree-shake。

### 磨砂表面

- `frosted` 统一使用 `--wa_color_glass` + `--wa_blur`，与 `AppPopover` 面板一致。
- 已支持 Button、Select、Input、Chip、Card；Dialog 的 `frosted` 作用于面板，遮罩只负责变暗，不参与模糊。
- 磨砂元素本身及其祖先不要同时做 opacity 入场，避免 Chromium 丢掉 `backdrop-filter`。

## 动效规范

### 时间与曲线

| Token | 值 | 用途 |
| --- | --- | --- |
| `--wa_duration_fast` | `.15s` | 颜色、边框、透明度、悬停 |
| `--wa_duration_base` | `.2s` | 按压、位移、一般状态切换 |
| `--wa_duration_slow` | `.34s` | 滑块、标签指示器、浮层进入 |
| `--wa_ease_out` | `cubic-bezier(.2, .9, .3, 1)` | 进入、颜色、淡出 |
| `--wa_ease_in` | `cubic-bezier(.4, 0, 1, 1)` | 退出 |
| `--wa_ease_in_out` | `cubic-bezier(.4, 0, .2, 1)` | 可逆位移 |
| `--wa_ease_spring` | `cubic-bezier(.3, 1.2, .5, 1)` | 按压缩放、滑块、指示器 |

### 交互反馈

- 悬停位移只在鼠标设备生效：

  ```css
  @media (hover: hover) and (pointer: fine) {
      .component:hover:not(:disabled) { transform: translateY(-1px); }
  }
  ```

- 按压统一为轻微缩小：按钮 `.96`、Chip `.94`、标签 `.94`、图标按钮 `.86`、复选框 `.9`。
- 焦点统一使用 `2px` accent 外轮廓，或在控件上使用 `3px` focus ring。
- `disabled` 状态不再触发悬停位移和按压反馈。

### 状态动画

- 可逆状态使用 transition：复选框勾选 / 取消、单选框圆点、开关滑块、标签指示器。
- 连续动画使用 keyframe：Spinner、Skeleton、RouteBar。
- 一次性装饰动画使用 keyframe：Toast、Dialog 内容、移动端 sheet。
- 状态动画必须支持中断：不要用 `forwards` 一次性动画驱动会反复切换的状态。
- 拖拽类连续交互使用 rAF 弹簧，松手时携带释放速度；粘性连接每帧按两个圆的几何关系计算路径，超过阈值立即断开。
- 不要在 `backdrop-filter` 元素本身或它的祖先/子元素上同时做 opacity 入场；Chromium 会丢掉模糊。
- 浮层、弹框、Toast 的进入退出需要同时覆盖 `prefers-reduced-motion`。

### 无障碍

- 所有动画组件提供 `prefers-reduced-motion: reduce` 分支。
- Spinner 在减少动态时减速而不是完全停止；Skeleton 停止 shimmer。
- 动效不能是唯一的信息来源，选中状态同时通过形状、颜色和 `aria-checked` 表达。

## 命名规范

### 组件

- 公共组件：`AppXxx`，例如 `AppButton`、`AppCheckGroup`、`AppChoiceList`。
- 布局组件：`AppShell`、`PageHeader`、`PageBar`、`PageTransition`、`AppRouteBar`。
- 单个选择项与分组：`AppCheck` / `AppCheckGroup`、`AppRadio` / `AppRadioGroup`。
- 面板封装：`AppCheckPanel`、`AppRadioPanel`；共享核心为 `AppChoiceList`。

### CSS

- 类名、CSS 变量、动画名统一 `wa_` 前缀，使用下划线拼接：`.wa_btn`、`.wa_check_group`、`--wa_duration_fast`。
- 状态类统一 `.on`；选中、展开、激活都用 `.on`。
- 修饰类使用 `wa_<组件>_<修饰>`，例如 `.wa_btn_primary`、`.wa_tabs_plain`。
- 子元素使用 `wa_<组件>_<部分>`，例如 `.wa_dialog_head`、`.wa_check_mark`。
- 不使用 `!important`；组件样式写在各自 SFC 的 `<style>` 中，构建时抽取到 `dist/style.css`。

### JavaScript

- 组合式函数：`useXxx`，例如 `useTheme`、`useClipboard`、`useRequest`、`useChoiceGroup`。
- 内部工厂：`createXxx`，例如 `createChoiceGroup`、`createAppRouter`。
- 常量、Symbol key 使用大驼峰；事件名使用 kebab-case 或 Vue 事件名。

## Props 约定

| 约定 | 说明 |
| --- | --- |
| `modelValue` | 所有受控组件的第一模型；`v-model` 默认绑定它 |
| `options` | `Array<{ label, value, disabled?, icon? }>` |
| `groups` | `Array<{ label, options }>`，用于分组面板 |
| `size` | 控件类用 `sm \| md`；选择项用数字（px）或 CSS 长度 |
| `direction` | `horizontal \| vertical`，用于选择组排列 |
| `align` | `left \| right \| between \| space-between`，纵向选择组对齐 |
| `labelPosition` | `before \| after` |
| `disabled` | 禁用整个组件或整组 |
| `ariaLabel` | 无可见标签时的无障碍名称 |
| `emptyText` | 空列表文案 |
| `placeholder` | 未选择时的占位文本 |
| `hint` / `error` | 表单提示与错误；错误优先 |
| `rule` | 组件级校验规则：`required`、`min`、`max`、`pattern`、`validator`、`message`、`trigger`；Input / Textarea / Select 支持 |
| `frosted` | 白色磨砂半透明表面，与 AppPopover 的玻璃面板一致；Button、Input、Select、Chip、Card 支持 |

### 枚举 Prop 的可选值

可选值统一写在 JSDoc 里，IDE 和 Volar 会直接提示：

```js
/** @type {'md' | 'sm'} 默认 sm，md 时更宽松 */
size: {
    type: String,
    default: 'sm',
},
```

项目不使用 `validator` 做运行时枚举校验：每次渲染都跑数组判断收益很低，传错值时还会刷控制台。组件内部对未知值回退到默认行为，可选值只作为开发期的文档和提示。

## 事件约定

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | 当前模型 | 所有 v-model 组件 |
| `change` | 当前模型 | 与 `update:modelValue` 同步，便于业务监听 |
| `update:open` / `open` / `close` | `boolean` / 无 | Popover、Dialog |
| `select` | `item` | SelectPanel 选中项 / NavMenu 点击项 |
| `update:selectedKeys` | 当前选择键 | 表格行选择 |
| `update:sort` / `sort-change` | `{ key, order }` / `{ key, order, column }` | 表格排序 |
| `badge-clear` | `{ name, item, index, more }` | 标签页角标被拖拽或按键清除 |
| `page-size-change` | `{ pageSize, page }` | 分页每页条数变化 |
| `reject` | `{ file, reason }` | Upload 拒绝文件 |
| `remove` | `file, index` | Upload 移除文件 |
| `change` | `theme` | ThemeToggle 切换主题 |

## 校验规则

Input、Textarea、Select 支持 `rule`，不再只能用 `error` 手动传入文案。

```js
const rule = {
    required: true,
    min: 2,
    max: 20,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validator: value => true, // false / 字符串 / Error 表示失败
    message: '请输入 2-20 个字符',
    trigger: ['blur', 'change'],
}
```

```html
<AppInput v-model="name" label="名称" :rule="rule" />
<AppTextarea v-model="note" :rule="{ required: true, min: 5 }" />
<AppSelect v-model="env" :options="options" :rule="{ required: true, message: '请选择环境' }" />
```

- `rule` 可以是对象或数组。
- 默认触发：Input / Textarea 为 `blur`，Select 为 `change`。
- `trigger` 支持 `blur`、`input`、`change` 或数组。
- `error` 仍然保留，且优先于 rule 自动生成的文案，适合服务端错误。
- 组件内部使用 `useValidation`，也可以直接导入它构建自定义表单控件。

## 目录

```text
WashUI/
├─ ui/                          @wash/ui 库
│  ├─ src/
│  │  ├─ components/            基础、加载、表单、反馈组件
│  │  │  ├─ AppCheck.vue        单个复选框
│  │  │  ├─ AppCheckGroup.vue   复选框分组 / 排版
│  │  │  ├─ AppRadio.vue        单个单选框
│  │  │  ├─ AppRadioGroup.vue   单选框分组 / 排版
│  │  │  ├─ AppChoiceList.vue   选择列表共享核心
│  │  │  ├─ AppCheckPanel.vue   多选面板薄封装
│  │  │  ├─ AppRadioPanel.vue   单选面板薄封装
│  │  │  ├─ AppNavMenu.vue      导航菜单
│  │  │  ├─ AppTable.vue        数据表格
│  │  │  └─ AppPagination.vue   分页
│  │  ├─ layout/                AppShell、PageHeader、PageBar、AppRouteBar、PageTransition
│  │  ├─ composables/           useClipboard、useRequest、useChoiceGroup、useChoiceSummary
│  │  ├─ core/                  图标、主题、Toast、Loading、路由状态、插件
│  │  ├─ router/                createAppRouter
│  │  ├─ styles/                base、form、choice、loading、index
│  │  ├─ utils/                 格式化函数
│  │  └─ index.js               主入口
│  ├─ tokens.css                CSS 变量与暗色主题
│  ├─ tokens.js                 图表配色、断点与层级
│  └─ package.json
├─ docs/                        文档站
│  ├─ pages/                    指南、组件、布局与能力页面
│  ├─ components/               DocPage、DemoBlock、ApiTable
│  ├─ site.js                   导航与页面注册
│  ├─ router.js                 文档路由
│  ├─ App.vue                   文档壳层
│  └─ main.js                   文档入口
├─ vite.config.js               文档站 Vite 配置
├─ pnpm-workspace.yaml
└─ package.json
```

## 选择类组件模型

| 组件 | v-model | 用途 |
| --- | --- | --- |
| `AppCheck` | `boolean` | 单个复选框；不生成外层容器 |
| `AppCheckGroup` | `Array` | 一组复选框；负责方向、对齐、标签位置 |
| `AppRadio` | `boolean` | 单个单选框；不生成外层容器 |
| `AppRadioGroup` | 标量 | 一组单选框；负责方向和排版 |
| `AppChoiceList` | `Array` / 标量 | 复选框 / 单选框共享的列表核心 |
| `AppCheckPanel` | `Array` | `AppChoiceList` 的多选薄封装 |
| `AppRadioPanel` | 标量 | `AppChoiceList` 的单选薄封装 |

单个 `AppCheck` / `AppRadio` 放进任意父容器即可；需要等宽、纵向、左右对齐时使用对应的 Group。Group 只负责布局，不改变选项本身的视觉。

## 从旧版迁移

- 旧 `AppCheck`（数组 + `options` + 布局）改为 `AppCheckGroup`。
- 旧 `AppCheckItem`（单个复选框）改为 `AppCheck`；在 Group 中使用时必须提供 `value`。
- 旧 `AppCheck` 的 `v-model` 布尔值现在对应单个 `AppCheck`，数组对应 `AppCheckGroup`。
- 多选面板继续使用 `AppCheckPanel`；新增 `AppRadioPanel` 和共享核心 `AppChoiceList`。
- `useCheckSummary` 更名为 `useChoiceSummary`；选择分组状态使用 `useChoiceGroup`。
- 旧的 `AppCheckItem` 导出已移除，请直接使用 `AppCheck`。

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

## 按需引入

```js
import AppButton from '@wash/ui/components/AppButton'
import { AppCheck, AppCheckGroup } from '@wash/ui'
import '@wash/ui/style.css'
```

`createUi()` 会全量注册所有组件；不使用它时手动注册即可。样式统一抽取为 `dist/style.css`。

组件子路径同时提供类型声明（`types/components/*.d.ts`），`@wash/ui/components/AppButton` 可以直接获得 Props 与事件提示。

## 组件状态

### 已完成

| 分类 | 组件 |
| --- | --- |
| 基础 | AppButton（按钮）、AppCard（卡片）、AppCode（代码）、AppChip（标记）、AppTag（标签）、AppBadge（消息角标）、AppTabs（标签页）、AppStat（统计）、AppNumber（数字跳动）、AppEmpty（空状态）、AppThemeToggle（主题切换） |
| 导航 | AppNavMenu（导航菜单） |
| 加载 | AppSpinner（加载圈）、AppSkeleton（骨架屏） |
| 数据 | AppTable（表格）、AppPagination（分页） |
| 表单 | AppInput（输入框）、AppTextarea（文本域）、AppSwitch（开关）、AppCheck（复选框）、AppCheckGroup（复选框组）、AppRadio（单选框）、AppRadioGroup（单选框组）、AppSelect（下拉框）、AppSelectPanel（下拉面板）、AppChoiceList（选择列表）、AppCheckPanel（多选面板）、AppRadioPanel（单选面板）、AppUpload（上传） |
| 反馈 | AppPanel（展示框）、AppPopover（弹出框）、AppDialog（弹框）、AppTooltip（文字提示）、AppCheckMenu（多选菜单）、Toast（轻提示）、Loading（加载） |
| 布局 | AppShell（壳层）、AppRouteBar（路由进度条）、PageTransition（页面过渡）、PageHeader（页面标题）、PageBar（页面操作栏） |
| 能力 | useTheme（主题）、useClipboard（剪贴板）、useRequest（请求）、useChoiceGroup（选择组状态）、useChoiceSummary（选择摘要）、useValidation（校验规则） |
| 基础能力 | 图标、tokens、代码高亮、主题切换 |

### 进行中

- 文档站移动端标题栏、侧边栏与内容间距持续校准
- 动效中断、反向过渡、reduced-motion 持续校准
- 表单校验的异步规则与跨字段能力设计

### 计划中

| 分类 | 计划 |
| --- | --- |
| 表单 | AppForm / AppFormItem（表单 / 表单项）、异步与跨字段校验、Slider（滑块）、Rate（评分）、ColorPicker（颜色选择）、DatePicker（日期选择）、TimePicker（时间选择）、Cascader（级联选择）、Transfer（穿梭框） |
| 数据展示 | AppTree（树）、AppTreeSelect（树选择）、AppVirtualList（虚拟列表）、AppVirtualTable（虚拟表格） |
| 反馈与导航 | AppDrawer（抽屉）、AppNotification（通知）、AppTour（漫游引导）、AppMenu（菜单）、AppDropdown（下拉菜单）、Command（命令面板） |
| 工程与质量 | 单元测试、视觉回归、SSR / Nuxt 适配、i18n、完整无障碍审计、发布流水线 |

完整路线图见文档站 **指南 → 路线图**。

## TODO

- [x] 复选框拆分为 `AppCheck` + `AppCheckGroup`
- [x] 新增 `AppRadio` + `AppRadioGroup`
- [x] 抽取 `AppChoiceList`、`useChoiceGroup`
- [x] `AppCheck` 支持 indeterminate
- [x] `AppRadio` 复用复选框的尺寸、标签、排版和动效节奏
- [x] 统一组件按压、悬停、reduced-motion 规范
- [x] 重写 README 设计、动效、命名、事件、Props 规范
- [x] 新增 Roadmap、Radio、ChoiceList 文档页
- [x] 迁移旧 `AppCheck` 分组 API 的存量示例
- [x] 新增 `PageBar` 响应式页面操作栏与 `bleed` 铺满
- [x] Input / Textarea / Select 支持 `rule` 校验
- [x] 文档校验示例统一改为 `rule`
- [x] 新增 `AppTable`、`AppPagination` 与对应文档页
- [x] 枚举 Prop 的可选值统一改为 JSDoc
- [x] Popover 关闭时恢复焦点，Select / 更多菜单支持方向键导航
- [x] 修复深色主题辅助文字对比度与全局键盘焦点环
- [x] 增加 Vitest 测试与 GitHub Actions 校验
- [x] 生成 `ui/types` 组件 Props 声明
- [x] 文档站增加搜索（Ctrl/Cmd+K）与页内目录
- [x] 新增 `AppNavMenu` 导航菜单，文档侧栏改用真实链接
- [ ] 补齐 ChoiceList 更多自定义触发器示例
- [ ] 为 PageBar 补充更多插槽内容示例与移动端回归
- [ ] 为表单 `rule` 增加异步校验与跨字段校验
- [ ] 为 Radio / RadioGroup 增加浏览器回归用例
- [ ] 形成正式的版本迁移指南
- [ ] 按路线图实现 Form、Tree 等计划组件

## 构建与发布

```bash
pnpm build:ui
cd ui
pnpm publish --registry=https://你的私有源地址
```

`ui/package.json` 的 `files` 包含 `dist`、`types`、`tokens.css`、`tokens.js` 与 `README.md`，文档不会发布。发布前需要在私有源拥有 `@wash` 作用域。

`pnpm build:ui` 会先用 `vue-tsc` 生成 `ui/types`，再由 `scripts/build-types.mjs` 从 `defineProps` 生成组件的 Props 声明。类型目录不提交到仓库，发布时由 `prepublishOnly` 重新生成。

## 提交约定

格式：

```text
<emoji> <type>(<scope>): <subject>
```

| 类型 | Emoji | 说明 |
| --- | --- | --- |
| `feat` | ✨ | 新功能 |
| `fix` | 🐛 | 修复 bug |
| `docs` | 📝 | 文档 |
| `style` | 🎨 | 代码格式 |
| `refactor` | ♻️ | 重构 |
| `test` | ✅ | 测试 |
| `chore` | 🔧 | 配置 / 工具 |
| `perf` | ⚡️ | 性能优化 |
| `build` | 📦 | 构建 |
| `ci` | 👷 | CI 配置 |
| `revert` | ⏪️ | 回滚 |
| `wip` | 🚧 | 进行中 |
| `init` | 🎉 | 初次提交 |
| `merge` | 🔀 | 合并分支 |

`scope` 写这次改动涉及的具体组件或页面，不写 `ui`、`docs` 这类目录名：

- 组件用 PascalCase：`AppInput`、`AppTextarea`、`AppChoiceList`
- 文档站页面用页面名：`InputPage`、`TextareaPage`、`RoadmapPage`
- 多个组件共用同一改动时写共享核心或主线组件，例如 `fix(AppChoiceList)`
- 工程配置写具体模块：`vite`、`package`、`tokens`

- 一个提交只做一类事情；涉及公共 API 时同步更新 README、文档页和路线图。
- `subject` 用中文、动词开头、不加句号。

示例：

```text
✨ feat(AppInput): 增加 rule 校验
🐛 fix(AppTextarea): 修复横向缩放失效
📝 docs(InputPage): 补充密码输入示例
♻️ refactor(AppChoiceList): 抽取共享选中逻辑
🔧 chore(vite): 增加组件路由回退
```
