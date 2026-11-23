# WashUI 组件与布局清单

-   **统计**：49 个公开组件、6 个布局组件、4 个内部子组件
-   **状态**：稳定 / 需统一 / 需补文档 / 内部
-   **优先级**：P0 影响可用性，P1 影响一致性，P2 增强
-   **改造策略**：0.5.0 breaking，不保留旧别名；`name`、`nav`、`active`、`page-size-change` 等旧写法直接移除

## 0. 本轮已完成（0.5.0）

-   选项统一 `value`：AppTabs、AppShell、AppNavMenu、AppDeskShell
-   AppChip `active` → `selected`
-   AppNumber → AppAnimatedNumber，增加 `live`
-   AppButton 移除 `variant="icon"`；AppIconButton 独立文档，增加 xs / lg 尺寸、line / frosted、active / loading 状态
-   AppCard `extra` → `actions`
-   AppListRow 增加 `href` / `to` / `linkComponent` / `external`
-   AppCheck / AppRadio 的 `size` → `checkSize`
-   AppCheckGroup / AppRadioGroup 增加 `label` / `hint` / `error` / `rule`，RadioGroup 增加方向键 roving tabindex
-   AppSwitch / AppStepper / AppSlider 增加 `hint` / `error` / `rule`
-   AppInput / AppTextarea 增加 `change`
-   AppPinInput `error` 支持字符串；格子改为正方形，增加 `width` / `fluid` 自适应与 `keyboard` 虚拟键盘选择，点击任意格聚焦第一个空位
-   AppPagination 删除 `page-size-change`
-   AppSelect 多选自动聚焦，AppPopover / AppCheckMenu 提供 `triggerProps`
-   AppColorPicker 色板支持方向键
-   AppTable 增加 `rowClickable`
-   AppEmpty 增加 `compact` / `minHeight`
-   AppUpload 增加重复文件过滤
-   PageHeader 无 Teleport 目标时原地渲染
-   AppSpinner 增加 `label` / `role="status"`
-   新增 `useReducedMotion`，替换组件内的 motion 快照
-   语义色 `_soft` / `_text`、尺寸、字号、间距 token 已补齐
-   DatePicker / TimePicker / DateTimePicker 显式 props 与类型；类型生成支持 `defineModel`

## 1. 公开组件

### 1.1 基础展示

| 组件 | 状态 | 主要问题 |
| --- | --- | --- |
| AppButton | 需统一 | `variant="icon"` 与 AppIconButton 重叠；loading 依赖 `.wa_spinner` 类 |
| AppCard | 稳定 | 头部插槽为 `title` / `extra`，与 Panel/Dialog 的 `actions` 命名不完全一致 |
| AppChip | 需统一 | 没有 `disabled`；`active` 与 `selected/modelValue` 命名不统一 |
| AppTag | 稳定 | 文档「默认等宽」错误；长文本插槽省略号能力有限 |
| AppBadge | 需统一 | `tone` 集合与其他组件不同；文档缺 `readonly`；`aria-label` 对文本值不准确 |
| AppStat | 稳定 | 功能基础，缺 `tone` / `trend` / `icon` |
| AppAnimatedNumber | 已修复 | 已改名并增加 `live`；文档强调只读，数字输入使用 AppStepper |
| AppEmpty | 需统一 | `min-height: 420px` 固定；缺 `compact` / `minHeight` |
| AppSkeleton | 稳定 | 缺 `circle` / `lines` / `animated`，但当前够用 |
| AppSpinner | 需统一 | 独立使用 `aria-hidden`，无加载语义 |
| AppHint | 稳定 | tone 已补 color-mix 兜底 |
| AppPanel | 稳定 | `variant` 与 tone 组合清晰 |
| AppCode | 稳定 | 依赖 `toast` 服务；高亮 HTML 已转义 |
| AppIcon | 稳定（风格例外） | 唯一 Options API 组件；morphicons 生命周期复杂 |
| AppList | 稳定 | 缺 `size` / `bordered` / `hoverable` |
| AppListRow | 需统一 | 缺 `href` / `to` / `linkComponent`；`selected` 与 `active` 不统一 |
| AppThemeToggle | 稳定 | 依赖全局主题单例，符合定位 |

### 1.2 表单

| 组件 | 状态 | 主要问题 |
| --- | --- | --- |
| AppInput | 需统一 | 没有 `change` 事件；`type` 接受所有原生类型，范围过宽 |
| AppTextarea | 需统一 | 没有 `change` / `clearable` / `showCount` 与 Input 一致 |
| AppSelect | 需统一 | 多选打开后焦点不进入面板；`aria-label` 覆盖当前值 |
| AppSelectPanel | 需补文档 | `autofocus` 未文档化；半公开内部组件 |
| AppCheck | 需统一 | `size` 是像素；`error/hint` 缺失（单选项定位） |
| AppCheckGroup | 需统一 | 缺 `label` / `hint` / `error` / `rule`；`size` 是像素 |
| AppCheckMenu | 需统一 | dialog 模式依赖 span click 冒泡；trigger 键盘依赖内部按钮 |
| AppCheckPanel | 需补文档 | 没有独立文档页/组件总览入口；内部核心 |
| AppChoiceList | 需补文档 | 半公开核心；缺 `autofocus` / roving focus |
| AppRadio | 需统一 | `size` 是像素；跨组件样式职责错位 |
| AppRadioGroup | 需统一 | 缺方向键 roving tabindex；缺 `label/hint/error/rule` |
| AppRadioPanel | 需补文档 | 没有独立文档页/组件总览入口 |
| AppSwitch | 需统一 | 缺 `hint` / `error` / `rule` / `readonly` |
| AppSlider | 需统一 | 缺 `hint` / `error` / `rule`；触摸命中区可再优化 |
| AppStepper | 需统一 | 缺 `label` / `hint` / `error`；`min > max` / `step <= 0` 未校验 |
| AppPinInput | 需统一 | `error` 是 boolean，与其它字段的 string 不一致 |
| AppUpload | 需统一 | 不去重；没有上传请求/进度/取消 |
| AppColorPicker | 需统一 | 二维色板无键盘；缺 `aria-describedby`；文档缺 `placeholder` / `ariaLabel` |
| AppDatePicker | 需统一 | 包装组件类型只有 `modelValue`；文档说「原生」但实现是自绘 |
| AppTimePicker | 需统一 | 同上 |
| AppDateTimePicker | 需统一 | 同上 |
| AppDateTimeField | 内部 | 被三个包装组件复用；`min/max` 注释与行为一致 |

### 1.3 浮层

| 组件 | 状态 | 主要问题 |
| --- | --- | --- |
| AppDialog | 稳定 | 焦点陷阱、Esc、焦点归还、滚动锁定完整 |
| AppPopover | 需统一 | trigger 是 span click；非按钮 trigger 键盘不可用 |
| AppTooltip | 稳定 | `aria-describedby` 已处理；触摸设备行为可再验证 |

### 1.4 数据

| 组件 | 状态 | 主要问题 |
| --- | --- | --- |
| AppTable | 需统一 | 行点击无键盘；固定表头双 table 结构复杂；移动端无卡片模式 |
| AppPagination | 需统一 | `page-size-change` / `update:pageSize` / `change` 重复；小屏不自动 simple |

### 1.5 导航

| 组件 | 状态 | 主要问题 |
| --- | --- | --- |
| AppTabs | 需统一 | 方向键完善；`items` 用 `name` 与 NavMenu 的 `value` 不统一 |
| AppNavMenu | 需统一 | `layoutKey` 未文档化；`value` 与其他导航组件不一致 |
| AppWindowControls | 需补文档 | 只在 DeskShellPage 示例中出现，无独立 API 表 |

## 2. 布局组件

| 组件 | 状态 | 主要问题 |
| --- | --- | --- |
| AppShell | 需统一 | `nav` 用 `name`；`active` 不支持 v-model；`loading` 是预留死 prop |
| AppDeskShell | 需统一 | 顶层 props 未文档化；config 结构复杂但功能完整 |
| AppRouteBar | 稳定 | 依赖 `routeLoading`，示例完整 |
| PageHeader | 需统一 | 无 Teleport 目标时静默不渲染，缺 fallback |
| PageBar | 稳定 | 有 inline fallback，adapter 完整 |
| PageTransition | 稳定 | 固定 out-in 过渡，够用 |

## 3. 内部子组件

| 组件 | 说明 |
| --- | --- |
| `components/table/TableHead.vue` | 表头、排序、全选，含 `aria-sort` |
| `components/table/TableBody.vue` | 表体、加载骨架、空状态、行/单元格事件 |
| `components/table/TableColgroup.vue` | 列宽与选择列 |
| `components/select/SelectOption.vue` | 下拉选项按钮，`role="option"` |

内部组件不加入公共导出，但样式和 aria 仍按公共标准要求。

## 4. 缺失组件

### P0：优先补齐

| 组件 | 分类 | 理由 |
| --- | --- | --- |
| AppForm / AppFormItem | 表单 | 统一提交、跨字段、异步校验、字段布局；目前字段各自为战 |
| AppDivider | 布局 | 设置页、卡片、列表的基础分隔 |
| AppStack / AppGrid / AppRow / AppCol | 布局 | 文档站自己在用 `.doc_row` / `.doc_entry_grid`，库内缺原子布局 |
| AppDrawer | 浮层 | 移动端筛选/菜单/详情；Dialog 不能替代侧滑 |
| AppProgress | 反馈 | Upload 无进度，Spinner 不能显示百分比 |
| AppAvatar | 展示 | 用户头像 + 状态点，目前只能拼 Badge |

### P1：常见业务

| 组件 | 分类 | 理由 |
| --- | --- | --- |
| AppDropdown / AppMenu | 导航 | Popover + List 可拼，但缺键盘、子菜单、危险项 |
| AppBreadcrumb | 导航 | 页面层级 |
| AppSteps | 导航 | 流程/向导 |
| AppResult | 反馈 | 成功/失败/空结果页 |
| AppDescriptions | 展示 | 详情页键值对，List 只能覆盖简单场景 |
| AppCollapse | 展示 | FAQ/设置分组/折叠面板 |
| AppDateRangePicker | 表单 | 现有 DatePicker 只有单日期 + min/max |

### P2：按项目需要

`AppTree` / `AppTreeSelect`、`AppVirtualList` / `AppVirtualTable`、`AppNotification`、`AppTour`、`AppCommand`、`AppRate`、`AppTimeline`、`AppAnchor` / `AppAffix` / `AppBackTop`、`AppImage`、`AppSplitPane` / `AppResizable`。

### 不建议优先做

-   `AppCascader`、`AppTransfer`：Roadmap 已注明暂不实现，避免组件库膨胀。
-   重型富文本、图表、拖拽看板：应作为独立包或业务组合。

## 5. 文档缺口

| 组件/能力 | 缺口 |
| --- | --- |
| AppCheckPanel、AppRadioPanel | 只在 ChoiceListPage / RadioPage 示例中出现，无独立 API 表 |
| AppWindowControls | 只在 DeskShellPage 示例中出现，无独立文档 |
| AppDateTimeField | 被包装组件复用，无独立文档 |
| useChoiceGroup、useChoiceSummary、useValidation | 已导出，无独立文档页 |
| createGooeyPath | 已导出，无文档；更适合作为内部实现 |
| TokensPage | 颜色/尺寸/动效 token 列表不完整 |
| Roadmap | 已完成项仍列在计划；Cascader/Transfer 与「暂不做」矛盾 |

## 6. 实施顺序

1. 修文档与类型（TagPage、site.js、Roadmap、BadgePage、ColorPickerPage、SelectPanelPage、DeskShellPage、TokensPage、DatePicker 类型）。
2. 修 P0 无障碍（PageHeader fallback、Select 多选焦点、RadioGroup 方向键、ColorPicker 色板、Spinner/Number 语义、Popover trigger）。
3. 加兼容层（Input/Textarea change、PinInput error、useValidation min/max、Shell v-model:active、Pagination 事件、选项 normalize）。
4. 抽公共逻辑（useReducedMotion、useSlidingIndicator、useOverflowItems、ChoiceGroupShell）。
5. 补 P0 组件（AppForm/AppFormItem、AppDivider、AppStack/AppGrid、AppDrawer、AppProgress、AppAvatar）。
6. 按 P1/P2 继续补齐。
