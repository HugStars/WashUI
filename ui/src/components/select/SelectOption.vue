<template>
    <button type="button" class="wa_select_option" :class="{ on: item.value === modelValue }" role="option"
        :aria-selected="item.value === modelValue"
        :tabindex="item.value === modelValue && !item.disabled ? 0 : -1" :disabled="item.disabled"
        @click="emit('select', item)">
        <component v-if="item.icon && iconComponent" :is="iconComponent" :name="item.icon" :size="17"
            class="wa_select_option_icon" aria-hidden="true" />
        <span class="wa_select_label"
            :class="{ wa_select_label_before: checkPosition === 'before' }">{{ item.label }}</span>
        <AppBadge v-if="item.badge" readonly class="wa_select_badge" :value="item.badge.text"
            :dot="item.badge.dot" :tone="item.badge.tone || 'danger'" :max="item.badge.max ?? 99"
            aria-hidden="true" />
        <template v-if="item.value === modelValue">
            <span v-if="checkRender?.mode === 'text'" class="wa_select_check"
                :class="{ wa_select_check_before: checkPosition === 'before' }" aria-hidden="true">
                {{ checkRender.value }}</span>
            <component v-else-if="checkRender?.mode === 'icon'" :is="iconComponent" :name="checkRender.name"
                class="wa_select_check" :class="{ wa_select_check_before: checkPosition === 'before' }"
                aria-hidden="true" />
        </template>
    </button>
</template>

<script setup>
import AppBadge from '../AppBadge.vue'

// section 下拉面板内部选项
// * 分组选项与平铺选项共用这一份结构，AppSelectPanel 只负责分组容器
// ! 仅供 select 子目录内部使用，不加入公共组件导出
defineProps({
    item: {
        type: Object,
        required: true,
    },
    modelValue: {
        type: [String, Number, Symbol],
        default: '',
    },
    checkRender: {
        type: Object,
        default: null,
    },
    checkPosition: {
        type: String,
        default: 'after',
    },
    iconComponent: {
        type: [Object, Function],
        default: null,
    },
})

const emit = defineEmits(['select'])
</script>
