<template>
    <nav class="wa_pagination" :class="[`wa_pagination_${size}`, { wa_pagination_disabled: disabled }]" role="navigation"
        :aria-label="ariaLabel">
        <span v-if="showTotal && !simple" class="wa_pagination_total">共 {{ total }} 条</span>

        <div class="wa_pagination_main">
            <button type="button" class="wa_pagination_btn wa_pagination_arrow" :disabled="AtStart" aria-label="上一页"
                @click="Go(CurrentPage - 1)">
                <AppIcon name="chevron-left" :size="IconSize" />
            </button>

            <span v-if="simple" class="wa_pagination_simple">{{ CurrentPage }} / {{ PageCount }}</span>

            <template v-else>
                <template v-for="(item, index) in PageItems" :key="`${item}-${index}`">
                    <span v-if="typeof item !== 'number'" class="wa_pagination_ellipsis" aria-hidden="true">…</span>
                    <button v-else type="button" class="wa_pagination_btn" :class="{ on: item === CurrentPage }"
                        :aria-current="item === CurrentPage ? 'page' : undefined" :aria-label="`第 ${item} 页`"
                        :disabled="disabled" @click="Go(item)">
                        {{ item }}
                    </button>
                </template>
            </template>

            <button type="button" class="wa_pagination_btn wa_pagination_arrow" :disabled="AtEnd" aria-label="下一页"
                @click="Go(CurrentPage + 1)">
                <AppIcon name="chevron" :size="IconSize" />
            </button>
        </div>

        <div v-if="showSizeChanger && !simple" class="wa_pagination_size">
            <AppSelect :model-value="PageSize" :options="SizeOptions" size="sm" aria-label="每页条数" :disabled="disabled"
                @update:model-value="ChangeSize" />
        </div>
    </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import AppSelect from './AppSelect.vue'

const props = defineProps({
    /** 当前页，从 1 开始；不传时组件内部维护 */
    modelValue: {
        type: Number,
        default: null,
    },
    /** 每页条数；不传时默认 10，也可以在内部切换 */
    pageSize: {
        type: Number,
        default: null,
    },
    total: {
        type: Number,
        default: 0,
    },
    pageSizeOptions: {
        type: Array,
        default: () => [10, 20, 50, 100],
    },
    /** 显示每页条数切换 */
    showSizeChanger: Boolean,
    /** 显示“共 N 条” */
    showTotal: {
        type: Boolean,
        default: true,
    },
    /** 简单模式：只显示上一页、当前页 / 总页数、下一页 */
    simple: Boolean,
    /** 中间页码按钮的最大数量 */
    maxButtons: {
        type: Number,
        default: 5,
    },
    size: {
        type: String,
        default: 'sm',
        allows: ['sm', 'md'],
    },
    disabled: Boolean,
    ariaLabel: {
        type: String,
        default: '分页',
    },
})

const emit = defineEmits(['update:modelValue', 'update:pageSize', 'change', 'page-size-change'])

const InternalPage = ref(1)
const InternalPageSize = ref(10)

const PageSize = computed(() => Math.max(1, Number(props.pageSize ?? InternalPageSize.value) || 10))
const PageCount = computed(() => Math.max(1, Math.ceil((Number(props.total) || 0) / PageSize.value)))
const CurrentPage = computed(() => Clamp(Number(props.modelValue ?? InternalPage.value) || 1, 1, PageCount.value))
const AtStart = computed(() => props.disabled || CurrentPage.value <= 1)
const AtEnd = computed(() => props.disabled || CurrentPage.value >= PageCount.value)
const IconSize = computed(() => props.size === 'md' ? 16 : 15)

const SizeOptions = computed(() => {
    const values = [...new Set([...props.pageSizeOptions, PageSize.value])].sort((a, b) => a - b)
    return values.map(value => ({
        label: `${value} 条/页`,
        value,
    }))
})

const PageItems = computed(() => {
    const total = PageCount.value
    const current = CurrentPage.value
    const max = Math.max(3, Math.floor(props.maxButtons) || 5)

    if (total <= max + 2) {
        return Array.from({ length: total }, (_, index) => index + 1)
    }

    let start = Math.max(2, current - Math.floor(max / 2))
    let end = start + max - 1

    if (end > total - 1) {
        end = total - 1
        start = end - max + 1
    }

    const items = [1]
    if (start > 2) items.push('left')
    for (let page = start; page <= end; page++) items.push(page)
    if (end < total - 1) items.push('right')
    items.push(total)

    return items
})

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function Go(page) {
    const next = Clamp(page, 1, PageCount.value)
    if (props.disabled || next === CurrentPage.value) return

    if (props.modelValue === null) InternalPage.value = next
    emit('update:modelValue', next)
    emit('change', { page: next, pageSize: PageSize.value })
}

function ChangeSize(value) {
    const size = Math.max(1, Number(value) || 10)
    if (props.disabled || size === PageSize.value) return

    if (props.pageSize === null) InternalPageSize.value = size

    const max = Math.max(1, Math.ceil((Number(props.total) || 0) / size))
    const page = Clamp(CurrentPage.value, 1, max)

    if (page !== CurrentPage.value) {
        if (props.modelValue === null) InternalPage.value = page
        emit('update:modelValue', page)
    }

    emit('update:pageSize', size)
    emit('page-size-change', { pageSize: size, page })
    emit('change', { page, pageSize: size })
}
</script>

<style>
.wa_pagination {
    --wa_pagination_size: 32px;
    --wa_pagination_font: 12px;

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 14px;
    min-width: 0;
    font-size: var(--wa_pagination_font);
    color: var(--wa_color_text_subtle);
}

.wa_pagination_md {
    --wa_pagination_size: 36px;
    --wa_pagination_font: 13px;
}

.wa_pagination_total {
    white-space: nowrap;
}

.wa_pagination_main {
    display: flex;
    align-items: center;
    gap: 4px;
}

.wa_pagination_btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--wa_pagination_size);
    height: var(--wa_pagination_size);
    padding: 0 8px;
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_subtle);
    background: transparent;
    font: inherit;
    font-size: var(--wa_pagination_font);
    line-height: 1;
    cursor: pointer;
    transform-origin: center;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out),
        transform var(--wa_duration_base) var(--wa_ease_spring);
}

@media (hover: hover) and (pointer: fine) {
    .wa_pagination_btn:hover:not(:disabled) {
        color: var(--wa_color_text);
        background: var(--wa_color_hover);
    }
}

.wa_pagination_btn:active:not(:disabled) {
    transform: scale(.94);
}

.wa_pagination_btn:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_pagination_btn.on,
.wa_pagination_btn.on:hover:not(:disabled) {
    color: var(--wa_color_on_nav_active);
    background: var(--wa_color_nav_active);
    font-weight: 600;
}

.wa_pagination_btn:disabled {
    opacity: .4;
    cursor: not-allowed;
}

.wa_pagination_arrow>svg,
.wa_pagination_arrow>.wa_icon_raw {
    display: block;
    flex: none;
}

.wa_pagination_ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--wa_pagination_size);
    height: var(--wa_pagination_size);
    color: var(--wa_color_text_faint);
    user-select: none;
}

.wa_pagination_simple {
    min-width: 64px;
    padding: 0 8px;
    color: var(--wa_color_text_muted);
    text-align: center;
    white-space: nowrap;
}

.wa_pagination_size {
    width: 120px;
    margin-left: auto;
}

.wa_pagination_size .wa_field {
    width: 100%;
}

@media (prefers-reduced-motion: reduce) {
    .wa_pagination_btn {
        transition: none;
    }

    .wa_pagination_btn:active:not(:disabled) {
        transform: none;
    }
}
</style>
