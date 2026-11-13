<template>
    <component :is="clickable ? 'button' : 'div'" class="wa_list_row"
        :class="{
            on: selected,
            off: disabled,
            wa_list_row_top: labelPosition === 'top',
            wa_list_row_responsive: labelPosition === 'responsive',
        }"
        :type="clickable ? 'button' : undefined" :disabled="clickable ? disabled : undefined"
        :aria-current="selected ? 'true' : undefined" @click="OnClick">
        <slot name="icon" />
        <span v-if="label || $slots.label" class="wa_list_label">
            <slot name="label">{{ label }}</slot>
        </span>
        <span v-if="value || $slots.default" class="wa_list_value">
            <slot>{{ value }}</slot>
        </span>
        <slot name="suffix" />
        <AppIcon v-if="arrow" name="chevron" :size="16" class="wa_list_arrow" />
    </component>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    value: {
        type: [String, Number],
        default: '',
    },
    /**
     * left：label 与 value 左右排列；top：label 在上、value 在下；
     * responsive：PC 左右排列，移动端自动改为 top
     * @type {'left' | 'top' | 'responsive'}
     */
    labelPosition: {
        type: String,
        default: 'left',
    },
    /** 行本身可点击 */
    clickable: Boolean,
    /** 右侧显示进入箭头 */
    arrow: Boolean,
    selected: Boolean,
    disabled: Boolean,
})

const emit = defineEmits(['click'])

function OnClick(event) {
    if (!props.clickable || props.disabled) return
    emit('click', event)
}
</script>

<style>
.wa_list_row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-width: 0;
    min-height: 44px;
    padding: 10px 14px;
    border: 0;
    border-radius: 0;
    color: var(--wa_color_text);
    background: transparent;
    font: inherit;
    font-size: 13px;
    line-height: 1.6;
    text-align: left;
    transition:
        background var(--wa_duration_fast) var(--wa_ease_out),
        color var(--wa_duration_fast) var(--wa_ease_out);
}

.wa_list_row[type='button'] {
    cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
    .wa_list_row[type='button']:hover:not(:disabled) {
        background: var(--wa_color_hover);
    }
}

.wa_list_row.on {
    background: var(--wa_color_active);
}

.wa_list_row.off {
    opacity: .45;
    cursor: not-allowed;
}

.wa_list_label {
    flex: none;
    max-width: 46%;
    color: var(--wa_color_text_muted);
}

.wa_list_value {
    flex: 1;
    min-width: 0;
    text-align: right;
    overflow-wrap: anywhere;
}

.wa_list_arrow {
    flex: none;
    color: var(--wa_color_text_faint);
}

/* * label 在上：整行改为纵向，value 靠左 */
.wa_list_row_top {
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    padding-block: 11px;
}

.wa_list_row_top .wa_list_label {
    max-width: 100%;
    font-size: 12px;
}

.wa_list_row_top .wa_list_value {
    flex: none;
    width: 100%;
    padding-right: 22px;
    text-align: left;
}

.wa_list_row_top .wa_list_arrow {
    position: absolute;
    top: 50%;
    right: 14px;
    translate: 0 -50%;
}

/* * responsive：PC 保持左右排列，移动端再切换成上下排列 */
@media (max-width: 860px) {
    .wa_list_row_responsive {
        position: relative;
        flex-direction: column;
        align-items: flex-start;
        gap: 3px;
        padding-block: 11px;
    }

    .wa_list_row_responsive .wa_list_label {
        max-width: 100%;
        font-size: 12px;
    }

    .wa_list_row_responsive .wa_list_value {
        flex: none;
        width: 100%;
        padding-right: 22px;
        text-align: left;
    }

    .wa_list_row_responsive .wa_list_arrow {
        position: absolute;
        top: 50%;
        right: 14px;
        translate: 0 -50%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .wa_list_row {
        transition: none;
    }
}
</style>
