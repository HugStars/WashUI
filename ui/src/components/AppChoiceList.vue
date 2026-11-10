<template>
    <div ref="PanelEl" class="wa_choice_list" :role="multiple ? 'group' : 'radiogroup'" :aria-label="ariaLabel">
        <div v-for="group in groups" :key="group.label" class="wa_choice_list_group">
            <p v-if="group.label" class="wa_choice_list_label">{{ group.label }}</p>
            <component :is="ItemComponent" v-for="item in group.options" :key="item.value"
                class="wa_choice_list_item" :value="item.value" :label="item.label" :disabled="item.disabled" />
        </div>

        <component :is="ItemComponent" v-for="item in options" :key="item.value" class="wa_choice_list_item"
            :value="item.value" :label="item.label" :disabled="item.disabled" />

        <p v-if="!HasOptions" class="wa_choice_list_empty">{{ emptyText }}</p>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { createChoiceGroup, provideChoiceGroup } from '../composables/useChoiceGroup.js'
import AppCheck from './AppCheck.vue'
import AppRadio from './AppRadio.vue'

const props = defineProps({
    /** multiple 时为数组，单选时为标量 */
    modelValue: {
        type: [Array, String, Number, Symbol, Boolean],
        default: undefined,
    },
    /** true：复选框；false：单选框 */
    multiple: Boolean,
    options: {
        type: Array,
        default: () => [],
    },
    groups: {
        type: Array,
        default: () => [],
    },
    size: {
        type: [Number, String],
        default: 18,
    },
    /**
     * @type {'before' | 'after'}
     */
    labelPosition: {
        type: String,
        default: 'after',
    },
    disabled: Boolean,
    emptyText: {
        type: String,
        default: '暂无选项',
    },
    ariaLabel: {
        type: String,
        default: '选项列表',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const PanelEl = ref(null)
const ItemComponent = computed(() => props.multiple ? AppCheck : AppRadio)
const HasOptions = computed(
    () => props.groups.some(group => group.options?.length) || props.options.length > 0
)

const { group } = createChoiceGroup(props, emit, props.multiple)
provideChoiceGroup(group)

// 打开时把第一个已选项滚动到面板中间，长列表里不至于看不到当前选择
function ScrollCheckedToCenter() {
    const el = PanelEl.value
    const checked = el?.querySelector('.wa_check.on, .wa_radio.on')
    if (!el || !checked) return

    const row = checked.closest('.wa_choice_list_item') || checked
    const rowRect = row.getBoundingClientRect()
    const panelRect = el.getBoundingClientRect()
    const top = rowRect.top - panelRect.top + el.scrollTop
    const max = Math.max(0, el.scrollHeight - el.clientHeight)
    const target = top - (el.clientHeight - rowRect.height) / 2

    el.scrollTop = Math.max(0, Math.min(max, target))
}

onMounted(() => nextTick(ScrollCheckedToCenter))
</script>
