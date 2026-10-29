<template>
    <div class="wa_select_panel">
        <div v-for="group in groups" :key="group.label" class="wa_select_group">
            <p v-if="group.label" class="wa_select_group_label">{{ group.label }}</p>
            <button v-for="item in group.options" :key="item.value" type="button" class="wa_select_option"
                :class="{ on: item.value === modelValue }" role="option" :aria-selected="item.value === modelValue"
                :disabled="item.disabled" @click="emit('select', item)">
                <span>{{ item.label }}</span>
                <template v-if="item.value === modelValue">
                    <span v-if="checkRender?.mode === 'text'" class="wa_select_check" aria-hidden="true">
                        {{ checkRender.value }}</span>
                    <component v-else-if="checkRender?.mode === 'icon'" :is="iconComponent" :name="checkRender.name"
                        class="wa_select_check" aria-hidden="true" />
                </template>
            </button>
        </div>

        <button v-for="item in options" :key="item.value" type="button" class="wa_select_option"
            :class="{ on: item.value === modelValue }" role="option" :aria-selected="item.value === modelValue"
            :disabled="item.disabled" @click="emit('select', item)">
            <span>{{ item.label }}</span>
            <template v-if="item.value === modelValue">
                <span v-if="checkRender?.mode === 'text'" class="wa_select_check" aria-hidden="true">
                    {{ checkRender.value }}</span>
                <component v-else-if="checkRender?.mode === 'icon'" :is="iconComponent" :name="checkRender.name"
                    class="wa_select_check" aria-hidden="true" />
            </template>
        </button>

        <p v-if="!HasOptions" class="wa_select_empty">{{ emptyText }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    /**
     * 对号图标，一个属性覆盖三种场景：
     * - true（默认）：显示默认 ✓
     * - false：不显示
     * - 字符串：短字符（如 '✓' '✔' '√' '●'）按文本显示；
     *          长名称（如 'check' 'check-circle'）按图标名渲染
     */
    checkIcon: {
        type: [Boolean, String],
        default: true,
    },
    /**
     * 图标组件，用于渲染「图标名称」。
     * 项目里有统一 Icon 组件时传入，例如：
     *   import { Icon } from '@wash/ui'
     *   <WaSelect :icon-component="Icon" check-icon="check" />
     * 不传时，图标名会降级显示默认 ✓。
     */
    iconComponent: {
        type: [Object, Function],
        default: null,
    },
})

const emit = defineEmits(['select'])

const HasOptions = computed(
    () => props.groups.some(group => group.options?.length) || props.options.length > 0
)

// 常见可直接作为文本显示的字符图标
const CHECK_TEXT_ICONS = new Set(['✓', '✔', '√', '☑', '●', '•', '★', '×', '✕'])

// 是否显示对号
const showCheck = computed(() => props.checkIcon !== false && props.checkIcon != null)

// 统一计算渲染方式：{ mode: 'text', value } | { mode: 'icon', name } | null
const checkRender = computed(() => {
    if (!showCheck.value) return null
    const v = props.checkIcon

    // 默认 true：文本 ✓
    if (v === true) return { mode: 'text', value: '✓' }
    if (typeof v !== 'string') return null

    // 短字符或白名单：按文本显示
    const isText = CHECK_TEXT_ICONS.has(v) || [...v].length <= 2
    if (isText) return { mode: 'text', value: v }

    // 长字符串：按图标名渲染；没有图标组件时降级为 ✓
    if (props.iconComponent) return { mode: 'icon', name: v }
    return { mode: 'text', value: '✓' }
})
</script>

<style>
.wa_select_panel {
    display: grid;
    gap: calc(var(--wa_popover_padding) * 2);
    min-width: 0;
    max-height: min(320px, calc(100vh - 120px));
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: auto;
    scrollbar-color: auto;
}

.wa_select_panel::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.wa_select_panel::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
}

.wa_select_panel::-webkit-scrollbar-button:vertical:start:decrement,
.wa_select_panel::-webkit-scrollbar-button:vertical:end:increment {
    display: none;
    width: 0;
    height: 0;
}

.wa_select_panel::-webkit-scrollbar-track {
    margin-top: var(--wa_radius_popover);
    margin-bottom: var(--wa_radius_popover);
    background: transparent;
}

.wa_select_panel::-webkit-scrollbar-thumb {
    border-radius: var(--wa_radius_pill);
}

.wa_select_group {
    display: grid;
    gap: var(--wa_popover_padding);
}

.wa_select_group_label {
    padding: var(--wa_space_1) var(--wa_space_3);
    font-size: 11px;
    color: var(--wa_color_text_faint);
}

.wa_select_option {
    display: flex;
    align-items: center;
    gap: var(--wa_space_2);
    width: 100%;
    padding: var(--wa_space_2) var(--wa_space_3);
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_muted);
    background: transparent;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.wa_select_option:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.wa_select_option.on,
.wa_select_option.on:hover {
    color: var(--wa_color_on_text);
    background: var(--wa_color_text);
    font-weight: 600;
}

.wa_select_option:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.wa_select_check {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    font-size: 12px;
    line-height: 1;
}

.wa_select_check svg {
    width: 1em;
    height: 1em;
    display: block;
}

.wa_select_empty {
    padding: 10px;
    font-size: 12px;
    color: var(--wa_color_text_faint);
}
</style>