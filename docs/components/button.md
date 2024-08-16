# 按钮 `Button`

## 基本

<UICode>

按钮的 `type` 分别由 `default` 、 `primary` 、 `info` 、 `success` 、 `error` 、 `warn` 、 `help` 7 种属性组成

<!-- @include: @/code/button/button_type.md -->

<template #code>

<<< @/code/button/button_type.md

</template>

</UICode>

## 尺寸

<UICode>

尺寸由 4 种属性组成 ： `mini` 、 `small` 、 `medium` 、 `large`

<!-- @include: @/code/button/button_size.md -->

<template #code>

<<< @/code/button/button_size.md

</template>

</UICode>

## 宽高

当组件的 4 个尺寸都不符合需求时，可以通过 `w` 和 `h` 来设置组件的宽高

当设置了宽时，元素内容过长溢出时会默认显示省略号

<UICode>

<!-- @include: @/code/button/button_user_size.md -->

<template #code>

<<< @/code/button/button_user_size.md

</template>

</UICode>

## 颜色

当组件的 7 种颜色都不符合需求时，可以通过 `color` 来设置组件的颜色

<UICode>

<!-- @include: @/code/button/button_color.md -->

<template #code>

<<< @/code/button/button_color.md

</template>

</UICode>

## 更多属性

<UICode>

- 圆角 ： `round` 、 `circle`
- 透明 ： `transparent` 、 `fade`
- 虚线 ： `dotted` 、 `dashed`
- 文本 ： `text`
- 禁用 ： `disabled`

<!-- @include: @/code/button/button_attribute.md -->

<template #code>

<<< @/code/button/button_attribute.md

</template>

</UICode>

## 其他

也可自行通过 `style=""` 行内样式来修改其他样式

## API

### 按钮属性

| 属性        | 说明    | 类型                                                     | 默认值    |
| ----------- | ------- | -------------------------------------------------------- | --------- |
| type        | 类型    | default\| primary\| info\| success\| error\| warn\| help | `default` |
| size        | 大小    | mini\| small\| medium\| large                            | `medium`  |
| w           | 宽度    | String\<Length\>                                         | `无`      |
| h           | 高度    | String\<Length\>                                         | `无`      |
| color       | 颜色    | String                                                   | `无`      |
| round       | 圆角    | Boolean                                                  | `false`   |
| circle      | 圆形    | Boolean                                                  | `false`   |
| transparent | 透明    | Boolean                                                  | `false`   |
| fade        | 半透明  | Boolean                                                  | `false`   |
| dotted      | 边框-点 | Boolean                                                  | `false`   |
| dashed      | 边框-线 | Boolean                                                  | `false`   |
| text        | 文本    | Boolean                                                  | `false`   |
| disabled    | 禁用    | Boolean                                                  | `false`   |
