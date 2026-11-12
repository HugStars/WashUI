<template>
    <button type="button" class="doc_search_trigger" @click="Open">
        <AppIcon name="search" :size="16" />
        <span class="doc_search_trigger_text">搜索文档</span>
        <kbd class="doc_search_kbd" aria-hidden="true">{{ Shortcut }}</kbd>
    </button>

    <AppDialog v-model:open="Visible" :width="640" :closable="false" :gesture="false" aria-label="搜索文档">
        <div class="doc_search">
            <div class="doc_search_head">
                <div class="doc_search_field">
                    <AppIcon name="search" :size="18" />
                    <input ref="InputEl" v-model="Query" class="doc_search_input" type="text"
                        placeholder="搜索组件、指南、能力…" aria-label="搜索文档" @keydown="OnKeydown">
                    <kbd class="doc_search_kbd" aria-hidden="true">Esc</kbd>
                </div>

                <p class="doc_search_meta">
                    {{ Query.trim() ? `${Results.length} 个结果` : '快速跳转' }}
                </p>
            </div>

            <!-- * 快速跳转复用下拉面板：高度和滚动交给 AppSelectPanel，选项不显示描述 -->
            <AppSelectPanel v-if="!Query.trim()" class="doc_search_panel" :options="QuickOptions"
                :model-value="ActivePath" :check-icon="false" size="md" role="listbox" aria-label="快速跳转"
                @select="SelectQuick" />

            <ul v-else-if="Results.length" ref="ResultsEl" class="doc_search_results" role="listbox"
                aria-label="搜索结果">
                <li v-for="(item, index) in Results" :key="item.path" role="presentation">
                    <button type="button" class="doc_search_item" :class="{ on: index === Active }" role="option"
                        :aria-selected="index === Active" @mouseenter="Active = index" @click="Go(item)">
                        <span class="doc_search_item_main">
                            <b>{{ item.label }}</b>
                            <small>{{ item.en || item.component || item.path }}</small>
                        </span>
                        <span v-if="item.summary" class="doc_search_item_desc">{{ item.summary }}</span>
                    </button>
                </li>
            </ul>

            <p v-else class="doc_search_empty">没有找到匹配的页面</p>
        </div>
    </AppDialog>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppDialog, AppIcon, AppSelectPanel } from 'wash-ui'
import { searchDocs, searchItems } from '../search.js'

const router = useRouter()
const route = useRoute()
const Visible = ref(false)
const Query = ref('')
const Active = ref(0)
const InputEl = ref(null)
const ResultsEl = ref(null)

const IsMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const Shortcut = IsMac ? '⌘ K' : 'Ctrl K'
const QuickItems = searchItems.slice(0, 8)
const QuickOptions = QuickItems.map(item => {
    const detail = item.en || item.component
    return {
        value: item.path,
        label: detail ? `${item.label} · ${detail}` : item.label,
    }
})
const Results = computed(() => {
    const query = Query.value.trim()
    return query ? searchDocs(query) : QuickItems
})
const ActivePath = computed(() => Results.value[Active.value]?.path || '')

function FocusInput() {
    nextTick(() => nextTick(() => InputEl.value?.focus()))
}

function Open() {
    Query.value = ''
    Active.value = 0
    Visible.value = true
    FocusInput()
}

function Move(delta) {
    const total = Results.value.length
    if (!total) return

    Active.value = (Active.value + delta + total) % total
    nextTick(() => {
        // note 只在搜索组件内部查询，避免全局 document.querySelector 误选其他实例
        ResultsEl.value?.querySelector('.doc_search_item.on')?.scrollIntoView({ block: 'nearest' })
    })
}

function OnKeydown(event) {
    if (event.key === 'ArrowDown') {
        event.preventDefault()
        Move(1)
        return
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault()
        Move(-1)
        return
    }

    if (event.key === 'Enter') {
        event.preventDefault()
        Go(Results.value[Active.value])
    }
}

function Go(item) {
    if (!item) return

    Visible.value = false
    Query.value = ''
    if (route.path !== item.path) router.push(item.path)
}

function SelectQuick(option) {
    Go(Results.value.find(item => item.path === option.value))
}

function OnGlobalKeydown(event) {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return

    event.preventDefault()
    if (Visible.value) InputEl.value?.focus()
    else Open()
}

watch(Query, () => {
    Active.value = 0
})

watch(Visible, value => {
    if (!value) Query.value = ''
})

onMounted(() => {
    window.addEventListener('keydown', OnGlobalKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', OnGlobalKeydown)
})
</script>

<style>
.doc_search_trigger {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 30px;
    padding: 0 9px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text_subtle);
    background: var(--wa_color_field);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.doc_search_trigger:hover {
    border-color: var(--wa_color_line_strong);
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
}

.doc_search_kbd {
    padding: 1px 5px;
    border: 1px solid var(--wa_color_line);
    border-radius: 5px;
    color: var(--wa_color_text_subtle);
    background: var(--wa_color_soft);
    font: 10px/1.5 var(--wa_font_mono);
    white-space: nowrap;
}

.doc_search {
    display: grid;
    gap: 10px;
}

/* 输入框和结果数固定在滚动区域顶部，只让结果列表滚动 */
.doc_search_head {
    position: sticky;
    top: 0;
    z-index: 2;
    display: grid;
    gap: 10px;
    padding: 6px 0;
    background: var(--wa_color_dialog);
}

.doc_search_field {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_field);
    transition:
        border-color var(--wa_duration_fast) var(--wa_ease_out),
        box-shadow var(--wa_duration_fast) var(--wa_ease_out);
}

.doc_search_field:focus-within {
    border-color: var(--wa_color_text);
    box-shadow: 0 0 0 3px var(--wa_color_focus_ring);
}

.doc_search_field>svg {
    flex: none;
    color: var(--wa_color_text_subtle);
}

.doc_search_input {
    flex: 1;
    min-width: 0;
    height: 42px;
    padding: 0;
    border: 0;
    outline: 0;
    color: var(--wa_color_text);
    background: transparent;
    box-shadow: none;
    font: inherit;
    font-size: 14px;
}

/* 焦点环由外层 .doc_search_field:focus-within 统一绘制 */
.doc_search_input:focus,
.doc_search_input:focus-visible {
    border: 0;
    outline: 0;
    box-shadow: none;
}

.doc_search_input::placeholder {
    color: var(--wa_color_text_subtle);
}

.doc_search_meta {
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}

/* * 快速跳转直接复用 AppSelectPanel，这里只覆盖计算高度，超出时由面板自身滚动 */
.doc_search .doc_search_panel {
    max-height: min(360px, calc(100vh - 240px));
}

/* * 快速跳转里的 on 表示键盘/鼠标高亮，不是已选值，沿用轻量 hover 样式 */
.doc_search .doc_search_panel .wa_select_option.on,
.doc_search .doc_search_panel .wa_select_option.on:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_hover);
    font-weight: 400;
}

.doc_search_results {
    display: grid;
    gap: 3px;
    max-height: min(360px, calc(100vh - 240px));
    margin: 0;
    padding: 0 4px 0 0;
    overflow-y: auto;
    list-style: none;
    scrollbar-width: thin;
}

.doc_search_results::-webkit-scrollbar {
    width: 6px;
}

.doc_search_results::-webkit-scrollbar-thumb {
    border-radius: var(--wa_radius_pill);
    background: var(--wa_color_scroll);
}

.doc_search_item {
    display: grid;
    gap: 3px;
    width: 100%;
    padding: 9px 11px;
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text);
    background: transparent;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        color var(--wa_duration_fast) var(--wa_ease_out),
        background var(--wa_duration_fast) var(--wa_ease_out);
}

.doc_search_item.on,
.doc_search_item:hover {
    background: var(--wa_color_hover);
}

.doc_search_item_main {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
}

.doc_search_item_main b {
    font-size: 13px;
    font-weight: 600;
}

.doc_search_item_main small {
    color: var(--wa_color_text_subtle);
    font: 11px var(--wa_font_mono);
}

.doc_search_item_desc {
    overflow: hidden;
    color: var(--wa_color_text_subtle);
    font-size: 12px;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.doc_search_empty {
    padding: 28px 0;
    color: var(--wa_color_text_subtle);
    font-size: 13px;
    text-align: center;
}

@media (max-width: 860px) {
    .doc_search_trigger_text {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
    }

    .doc_search_trigger .doc_search_kbd {
        display: none;
    }

    .doc_search_trigger {
        position: relative;
        width: 30px;
        justify-content: center;
        padding: 0;
    }
}
</style>
