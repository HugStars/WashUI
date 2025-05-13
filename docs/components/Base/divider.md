# 分隔线 `Divider`

## 类型 `type`

<UICode>

分割线的 `type` 分别由 `default` 、 `info` 、 `success` 、 `error` 、 `warn` 、 `help` 6 种属性组成

<!-- @include: @/code/divider/divider_type.md -->

<template #code>

<<< @/code/divider/divider_type.md

</template>

</UICode>

## 颜色 `color`


当组件的 6 种颜色都不符合需求时，可以通过 `color` 来自定义分割线颜色

支持 `16进制` 、 `RGB` 格式颜色

<UICode>

<!-- @include: @/code/divider/divider_color.md -->

<template #code>

<<< @/code/divider/divider_color.md

</template>

</UICode>

## 文本

当需要设置分割线文本时，可以使用 `left` 、 `right` 、 `center` 来设置分割线文本的位置以及文本

<UICode>

<!-- @include: @/code/divider/divider_text.md -->


<template #code>

<<< @/code/divider/divider_text.md

</template>

</UICode>

## 宽、高、间隔

当组件宽高不符合需求时，可以通过 `w` 和 `h` 来设置组件的宽高

组件默认间隔为 `6px` ，当不符合需求时，可通过 `m` 属性进行修改

<UICode>

<!-- @include: @/code/divider/divider_user_size.md -->

<template #code>

<<< @/code/divider/divider_user_size.md

</template>

</UICode>

## 方向

分割线默认为水平方向，当需要设置为垂直方向时，可以使用 `v` 属性

<UICode>

<!-- @include: @/code/divider/divider_direction.md -->

<template #code>

<<< @/code/divider/divider_direction.md

</template>

</UICode>


## 更多属性

分割线样式： `centered` 、 `dotted` 、 `dashed`

<UICode>

<!-- @include: @/code/divider/divider_attribute.md -->

<template #code>

<<< @/code/divider/divider_attribute.md

</template>

</UICode>
