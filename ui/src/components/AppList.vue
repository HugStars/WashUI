<template>
    <div class="wa_list" :class="[`wa_list_${variant}`, { wa_list_divided: divided, wa_list_inset: inset }]">
        <slot />
    </div>
</template>

<script setup>
defineProps({
    /**
     * plain：普通列表；group：圆角卡片分组（首尾行随外框圆角裁切）
     * @type {'plain' | 'group'}
     */
    variant: {
        type: String,
        default: 'plain',
    },
    /** 行与行之间显示分割线 */
    divided: {
        type: Boolean,
        default: true,
    },
    /** 分割线左右内缩，不贴到列表边缘 */
    inset: Boolean,
})
</script>

<style>
.wa_list {
    display: grid;
    min-width: 0;
}

/* * group：外层圆角 + overflow 裁切，首尾行自然获得相同圆角 */
.wa_list_group {
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_popover);
    background: var(--wa_color_surface);
}

.wa_list_divided .wa_list_row+.wa_list_row {
    border-top: 1px solid var(--wa_color_line);
}

/* * 选中行与它相邻的上下分割线一起隐藏，避免线条穿过高亮块 */
.wa_list_divided .wa_list_row.on,
.wa_list_divided .wa_list_row.on+.wa_list_row,
.wa_list_divided .wa_list_row:has(+ .wa_list_row.on) {
    border-top-color: transparent;
}

/* * inset：分割线左右内缩，用伪元素画线，避免影响行内容宽度 */
.wa_list_inset.wa_list_divided .wa_list_row+.wa_list_row {
    position: relative;
    border-top-color: transparent;
}

.wa_list_inset.wa_list_divided .wa_list_row+.wa_list_row::before {
    content: '';
    position: absolute;
    top: -1px;
    right: 14px;
    left: 14px;
    height: 1px;
    background: var(--wa_color_line);
}

.wa_list_inset.wa_list_divided .wa_list_row.on::before,
.wa_list_inset.wa_list_divided .wa_list_row.on+.wa_list_row::before,
.wa_list_inset.wa_list_divided .wa_list_row:has(+ .wa_list_row.on)::before {
    background: transparent;
}
</style>
