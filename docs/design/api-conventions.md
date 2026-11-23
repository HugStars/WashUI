# WashUI 统一 API 设计稿

-   **目标版本**：0.5.0（breaking，不保留旧别名）
-   **状态**：执行稿，作为本轮改造的验收依据
-   **范围**：`ui/src/components`、`ui/src/layout`、`ui/src/styles`、`ui/src/composables`、`docs`
-   **原则**：一次改到位，不做兼容层；旧名字直接移除，文档同步更新

## 1. 总原则

1. **同一语义只保留一个名字**：受控值统一 `modelValue`，选项统一 `value`，状态统一 `disabled` / `readonly` / `loading`。
2. **同一类事件只保留一种载荷**：表单值变化统一 `change(value)`；复杂变化用明确的 `xxx-change`。
3. **尺寸与像素分离**：`size` 只接受 `'sm' | 'md'`；需要具体像素时使用 `controlSize`、`checkSize`、`iconSize`。
4. **组件样式只作用于自身根类**：禁止在组件内定义其他组件的顶层类；共享样式放 `ui/src/styles/`。
5. **可访问性是默认能力**：键盘、aria、焦点管理、`prefers-reduced-motion` 不靠业务侧补。
6. **文档、类型、实现同源**：文档里的每个 prop / event / slot 必须能在类型或实现中找到。
7. **不保留别名**：`name`、`nav`、`active`、`page-size-change` 等旧写法直接移除，README 与文档给迁移说明。

## 2. 通用 Props

### 2.1 受控值

| 场景 | 统一写法 |
| --- | --- |
| 单值 | `v-model` → `modelValue` + `update:modelValue` |
| 多值 | `modelValue: Array` |
| 打开状态 | `v-model:open` → `open` + `update:open` |
| 排序 | `v-model:sort` → `sort` + `update:sort` |
| 选中行 | `v-model:selectedKeys` |
| 导航选中 | `v-model:active` |

规则：

-   `AppChip.active` 改为 `selected`。
-   `AppListRow.selected` 保持。
-   `AppNumber` 改为 `AppAnimatedNumber`，只读展示，避免与数字输入混淆。
-   `AppShell` 的 `nav` 改为 `items` / `groups`，并支持 `v-model:active`。
-   `AppTab` 的 `items` 项统一 `{ label, value }`，不再使用 `name`。

### 2.2 尺寸

-   通用按钮与表单控件枚举：`'sm' | 'md'`。
-   像素：`controlSize`（控件整体）、`checkSize`（复选框/单选框）、`iconSize`（图标）。
-   `AppCheck` / `AppRadio` / `AppCheckGroup` / `AppRadioGroup` 的 `size` 改为 `checkSize`，默认 `20`。
-   `AppIconButton` 作为独立图标按钮，允许 `'xs' | 'sm' | 'md' | 'lg'`（24 / 28 / 32 / 36px）并增加 `line`、`frosted`、`active`、`loading`；`AppButton` 移除 `variant="icon"`。
-   `AppTag` 高度：sm 22px、md 27px；图标默认 14/15px。

### 2.3 语义色

统一 `tone`：

```text
default | accent | success | warning | help | danger
```

-   `AppBadge.tone` 移除 `neutral`，改用 `default`。
-   组件特有的 `variant`（如 Tabs 的 `nav/plain/group`）不并入 `tone`。
-   所有 tone 使用 token，不再依赖 `color-mix` 计算文字色/背景色。

### 2.4 状态

-   `disabled: Boolean`
-   `readonly: Boolean`
-   `loading: Boolean`
-   `required: Boolean`（表单字段）
-   禁止用 `off` / `on` 作为公开 prop；它们只作为内部类名。

### 2.5 表单字段契约

所有可输入/可选字段统一支持：

```text
modelValue
label
hint
error
rule
size
disabled
readonly
required
ariaLabel
```

统一结构：

```html
<div class="wa_field">
    <label class="wa_field_label" :for="controlId">...</label>
    <control :id="controlId" :aria-invalid="..." :aria-describedby="..." />
    <div class="wa_field_message">...</div>
</div>
```

统一事件：

-   `update:modelValue(value)`
-   `change(value)`
-   `clear()`（有清除按钮时）

实施范围：

-   补 `change`：`AppInput`、`AppTextarea`。
-   补 `hint` / `error`：`AppSwitch`、`AppStepper`、`AppSlider`。
-   补 `label` / `hint` / `error` / `rule`：`AppCheckGroup`、`AppRadioGroup`。
-   `AppPinInput.error` 改为 `string`，与其它字段一致。
-   `AppUpload` 增加 `duplicate` 策略（默认跳过同名同大小同修改时间的文件）。

### 2.6 浮层契约

统一 props：

```text
open
placement
offset
gap
width
padding
disabled
closeOnOutside
closeOnEsc
ariaLabel
```

统一事件：

```text
update:open(boolean)
open()
close()
```

Trigger 规范：

-   trigger 必须是可聚焦元素（button / a / input）。
-   组件提供 `#trigger="{ open, toggle, triggerProps }"`，`triggerProps` 包含 `aria-expanded`、`aria-haspopup`、`onClick`、`onKeydown`。
-   非可聚焦 trigger 在开发环境给出警告，不静默失败。

### 2.7 选项数据

统一结构：

```js
const option = {
    label: '显示文本',
    value: '唯一值',
    disabled: false,
    icon: 'settings',
    badge: { text: '2', tone: 'danger' },
    description: '补充说明',
}

const group = {
    label: '分组标题',
    options: [option],
}
```

统一入口：

-   平铺：`options`
-   分组：`groups`
-   导航：`items` + `groups`，导航项额外支持 `href` / `to`
-   `AppShell` 只接受 `items` / `groups`，不再接受 `nav`
-   所有组件新增 `normalizeOption` 工具，统一 `{ label, value, disabled, icon, badge }`

## 3. 事件命名

| 事件 | 载荷 | 适用 |
| --- | --- | --- |
| `update:modelValue` | 新值 | 所有受控组件 |
| `change` | 新值 | 表单字段 |
| `select` | 选项对象 | 选择类 |
| `open` / `close` | 无 | 浮层 |
| `update:open` | boolean | 浮层 |
| `clear` | 无 | 可清除字段/角标 |
| `remove` | `(file, index)` | Upload |
| `reject` | `{ file, reason }` | Upload |
| `sort-change` | `{ key, order }` | Table |
| `page-change` | `{ page, pageSize }` | Pagination |
| `select-all` | `{ keys, selected }` | Table |
| `row-click` | `(row, index, event)` | Table |
| `cell-click` | `(row, column, index, event)` | Table |

规则：

-   `AppPagination` 删除 `page-size-change`，只保留 `page-change` 与 `change`；`change` 载荷统一 `{ page, pageSize }`。
-   `AppTabs` 删除 `change(item, index)`，统一 `update:modelValue(value)` + `select(item)`。
-   `AppNavMenu` 统一 `update:modelValue(value)` + `select(item)`。
-   禁止新增 `update:xxx` 之外的双向绑定事件。

## 4. 插槽命名

-   `default`：主内容
-   `label` / `hint` / `error`：表单字段
-   `title` / `actions` / `footer`：容器
-   `trigger` / `default`：浮层
-   `prefix` / `suffix`：输入类
-   `icon` / `icon-left` / `icon-right`：图标位

容器类组件统一 `title` + `actions`；`AppCard.extra` 改名 `actions`，`AppPanel` 保持 `actions`。

## 5. CSS Token 设计

### 5.1 命名规则

```text
--wa_<category>_<semantic>_<state>
```

-   颜色：`--wa_color_<tone>`、`--wa_color_<tone>_soft`、`--wa_color_<tone>_text`
-   尺寸：`--wa_size_<component>_<size>`
-   字号：`--wa_font_size_<name>`
-   间距：`--wa_space_<n>`
-   动效：`--wa_duration_<name>`、`--wa_ease_<name>`
-   组件固有尺寸优先用组件局部变量，跨组件共享才放 `tokens.css`

### 5.2 语义色

在 `tokens.css` 增加：

```css
/* 亮色 */
--wa_color_accent_soft: #05cfa41f;
--wa_color_success_soft: #05cfa41f;
--wa_color_warning_soft: #f59e0b24;
--wa_color_help_soft: #a855f71f;
--wa_color_neutral: #64748b;
--wa_color_neutral_soft: #64748b14;
--wa_color_success_text: #0a9c7d;
--wa_color_warning_text: #b45309;
--wa_color_help_text: #7e22ce;
--wa_color_neutral_text: #475569;

/* 暗色 */
--wa_color_accent_soft: #05cfa42e;
--wa_color_success_soft: #05cfa42e;
--wa_color_warning_soft: #f59e0b2e;
--wa_color_help_soft: #a855f72e;
--wa_color_neutral: #94a3b8;
--wa_color_neutral_soft: #94a3b81f;
--wa_color_success_text: #3dd9a4;
--wa_color_warning_text: #fbbf24;
--wa_color_help_text: #c084fc;
--wa_color_neutral_text: #cbd5e1;
```

规则：

-   `AppTag` / `AppHint` / `AppPanel` / `AppBadge` 的 tone 只使用上述 token，不再使用 `color-mix`。
-   `--wa_color_<tone>` 用于主色/描边，`_soft` 用于淡背景，`_text` 用于浅背景上的文字。
-   新增 tone 必须同时补 `_soft` 与 `_text`，亮暗两套。

### 5.3 尺寸

```css
--wa_size_control_sm: 32px;
--wa_size_control_md: 40px;
--wa_size_check_sm: 16px;
--wa_size_check_md: 20px;
--wa_size_tag_sm: 22px;
--wa_size_tag_md: 27px;
--wa_size_badge_sm: 16px;
--wa_size_badge_md: 20px;
--wa_size_icon_btn_sm: 28px;
--wa_size_icon_btn_md: 32px;
--wa_size_list_row: 44px;
--wa_size_empty: 420px;
--wa_size_empty_compact: 180px;
```

组件内通过局部变量引用：

```css
.wa_tag {
    --wa_tag_height: var(--wa_size_tag_sm);
}
.wa_tag_md {
    --wa_tag_height: var(--wa_size_tag_md);
}
```

### 5.4 字号与间距

```css
--wa_font_size_xs: 11px;
--wa_font_size_sm: 12px;
--wa_font_size_base: 13px;
--wa_font_size_md: 14px;
--wa_font_size_lg: 15px;
--wa_font_size_xl: 18px;
--wa_font_size_2xl: 22px;

--wa_space_4: 16px;
--wa_space_5: 20px;
--wa_space_6: 24px;
```

本轮优先把新增/修改的组件替换为 token；存量组件可以按文件逐步迁移，不做一次性全量替换。

### 5.5 动效

保持现有 `--wa_duration_*` / `--wa_ease_*`，新增组件不再写死秒数。所有动画必须提供 `prefers-reduced-motion` 兜底，并抽 `useReducedMotion` 运行时监听。

## 6. 组件风格

-   统一 `<script setup>`；`AppIcon` 因 morphicons render 生命周期保留 Options API，文件头必须注明例外原因。
-   4 空格缩进，单引号，不写行尾分号，不写尾逗号。
-   props 使用对象写法，类型注释使用中文 JSDoc。
-   样式统一放在组件 `<style>`，不写 `scoped`；根类必须是 `wa_<component>`。
-   修饰类 `wa_<component>_<modifier>`，状态类统一 `.on`。
-   禁止在组件样式中定义其他组件根类；共享样式放 `ui/src/styles/`。
-   组件内硬编码颜色必须注释原因；尺寸优先使用 token 或局部变量。
-   所有公开组件必须有文档页、API 表、至少一个可运行示例。

## 7. 可访问性基线

-   可交互元素优先使用原生 `button` / `a` / `input`。
-   自定义交互必须提供 `role`、`tabindex`、键盘处理。
-   表单字段：`label` 关联、`aria-invalid`、`aria-describedby`。
-   模态：焦点陷阱、Esc 关闭、关闭后焦点归还。
-   列表/标签/单选组：roving tabindex + Arrow/Home/End。
-   浮层：trigger `aria-expanded` / `aria-haspopup`，面板 `aria-label`。
-   加载：独立 Spinner 提供 `role="status"` 或 `label`；按钮用 `aria-busy`。
-   图标：装饰图标 `aria-hidden`，图标按钮必须有 `aria-label`。
-   动态数字：`AppAnimatedNumber` 增加 `aria-live="polite"` 选项。

## 8. 实施顺序

1. **Token 与基础样式**
   - 新增语义色 `_soft` / `_text`、尺寸/字号/间距 token
   - 重写 AppTag / AppHint / AppPanel / AppBadge 的 tone 样式，移除 `color-mix`
2. **基础组件 API**
   - AppChip `active` → `selected`
   - AppNumber → AppAnimatedNumber
   - AppButton 移除 `variant="icon"`，AppIconButton 统一尺寸/variant
   - AppCard `extra` → `actions`
   - AppListRow 增加 `href` / `to` / `linkComponent`
3. **表单组件 API**
   - `size` → `checkSize`（Check/Radio 系列）
   - 补 `change`（Input/Textarea）
   - 补 `hint/error/rule`（Switch/Stepper/Slider/CheckGroup/RadioGroup）
   - PinInput `error` 改 string，格子正方形并增加 `width` / `fluid` / `keyboard`
   - Upload 去重
   - DatePicker/TimePicker/DateTimePicker 显式 props 与类型；DatePicker 增加 `picker` / `range`
4. **导航/数据 API**
   - AppShell `nav` → `items/groups` + `v-model:active`
   - AppTabs `name` → `value`
   - AppNavMenu 统一 `value`
   - Pagination 删除 `page-size-change`
5. **无障碍/键盘**
   - PageHeader fallback
   - Select 多选焦点
   - RadioGroup 方向键
   - ColorPicker 色板键盘
   - Popover trigger 键盘
   - Spinner / AnimatedNumber 语义
6. **抽公共逻辑**
   - useReducedMotion
   - useSlidingIndicator
   - useOverflowItems
   - ChoiceGroupShell
7. **文档/类型同步**
   - 更新所有受影响的 API 表、示例、Site 分类
   - 更新 README 迁移说明
8. **新增组件**
   - 按 component-inventory 的 P0/P1/P2 推进

## 9. 验收清单

-   `pnpm test`、`pnpm build:ui` 通过。
-   每个公开组件都有文档页、API 表、可运行示例。
-   文档中的 prop / event / slot 与 `defineProps` / `defineEmits` / `$slots` 一致。
-   类型文件包含所有透传 props。
-   键盘可完成主要操作：Tab、Enter、Space、Arrow、Home、End、Esc。
-   无跨组件根类样式、无重复顶层类名。
-   无未兜底的 `color-mix` 变量中转。
-   系统切换减少动态效果后，组件无需刷新即可响应。
-   README 与 Roadmap 不再保留已完成的计划项或自相矛盾的说明。
