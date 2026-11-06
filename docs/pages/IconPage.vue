<template>
    <DocPage category="图标" name="AppIcon" title="图标"
        :description="`内置 ${icons.length} 个图标，选择两个可预览形变，并复制切换代码。`">
        <section class="doc_icon_morph_section">
            <div class="doc_icon_morph_head">
                <div>
                    <h2 class="doc_h2">图标形变</h2>
                    <p class="doc_text">选择两个图标，或直接改变 AppIcon 的 name，图标会自动形变。</p>
                </div>
                <span class="wa_tag">Morphicons</span>
            </div>

            <div class="doc_icon_morph">
                <div class="doc_icon_preview" title="点击切换" @click="Play">
                    <AppIcon :name="PreviewName || 'circle'" :size="72" :stroke-width="1.8" />
                </div>

                <div class="doc_icon_morph_body">
                    <div class="doc_icon_pairs">
                        <span class="doc_icon_pair">{{ First || '图标 A' }}</span>
                        <span class="doc_icon_arrow">→</span>
                        <span class="doc_icon_pair">{{ Second || '图标 B' }}</span>
                    </div>

                    <div class="doc_icon_actions">
                        <AppButton size="sm" variant="primary" :disabled="Selected.length < 2" @click="Play">
                            切换一次
                        </AppButton>
                        <AppButton size="sm" variant="line" :disabled="Selected.length < 2" @click="Swap">
                            交换
                        </AppButton>
                        <AppButton size="sm" variant="line" @click="CopyCode">
                            复制切换代码
                        </AppButton>
                        <AppSwitch v-model="Auto" label="自动循环" />
                    </div>

                    <p class="doc_note">AppIcon 的 name 变化时会自动播放，不需要额外 CSS。</p>
                </div>
            </div>
        </section>

        <p class="doc_note doc_gap">图标形变由 <a class="doc_link" href="https://www.morphicons.com"
                target="_blank" rel="noreferrer">Morphicons</a> 提供（MIT）。</p>

        <div class="doc_icon_head">
            <h2 class="doc_h2">全部图标</h2>
            <div class="doc_icon_toolbar">
                <div class="doc_icon_category">
                    <AppSelect v-model="Category" :options="CategoryOptions" size="sm" :check-icon="false"
                        aria-label="图标分类" />
                </div>
                <div class="doc_icon_search">
                    <AppInput v-model="Search" placeholder="搜索图标" clearable />
                </div>
                <AppButton size="sm" variant="icon" :disabled="!Selected.length" aria-label="清空选择"
                    title="清空选择" @click="ClearSelected">
                    <AppIcon name="close" :size="14" />
                </AppButton>
            </div>
        </div>

        <p class="doc_note doc_icon_count">共 {{ icons.length }} 个图标，点击选择两个查看形变。</p>

        <section class="doc_icon_section">
            <div class="doc_icon_grid">
                <button v-for="name in PageIcons" :key="name" type="button" class="doc_icon_item"
                    :class="{ selected: isSelected(name) }" :title="name" @click="Pick(name)"
                    @contextmenu.prevent="OpenMenu($event, name)">
                    <AppIcon :name="name" :size="22" :morph="false" />
                    <span class="doc_icon_name">{{ name }}</span>
                    <span v-if="isSelected(name)" class="doc_icon_pick">{{ Selected.indexOf(name) + 1 }}</span>
                </button>
            </div>

            <p v-if="!PageIcons.length" class="doc_note">没有找到匹配的图标。</p>

            <AppPagination class="doc_icon_pagination" :model-value="Page + 1" :total="Filtered.length"
                :page-size="PageSize" aria-label="图标分页" @update:model-value="SetPage" />
        </section>

        <h2 class="doc_h2">切换代码</h2>
        <AppCode :code="SwitchCode" lang="vue" />
        <p class="doc_note doc_gap">把 active 换成你自己的状态即可；AppIcon 会在 name 变化时自动形变。</p>

        <DemoBlock title="尺寸与描边" description="size 与 strokeWidth 接受数字或字符串。">
            <div class="doc_icon_sizes">
                <div class="doc_icon_size_row">
                    <span class="doc_icon_size_label">size</span>
                    <AppIcon name="home" :size="16" />
                    <AppIcon name="heart" :size="22" />
                    <AppIcon name="settings" :size="28" />
                    <AppIcon name="bell" :size="32" />
                </div>
                <div class="doc_icon_size_row">
                    <span class="doc_icon_size_label">strokeWidth</span>
                    <AppIcon name="star" :size="24" :stroke-width="1.2" />
                    <AppIcon name="star" :size="24" :stroke-width="1.8" />
                    <AppIcon name="star" :size="24" :stroke-width="2.4" />
                    <AppIcon name="star" :size="24" :stroke-width="3" />
                </div>
            </div>
        </DemoBlock>

        <h2 class="doc_h2">接入外部图标库</h2>
        <p class="doc_text">内置图标是一套基础集。需要其他图标库时，可以用 configureIcons 注册任意 IconNode
            数组，名称按你的习惯命名。</p>
        <AppCode lang="js" :code="externalCode" />
        <p class="doc_note doc_gap">除了全局注册，也可以直接通过 AppIcon 的 icon 属性传入单个图标数据。</p>

        <h2 class="doc_h2">全局配置</h2>
        <AppCode :code="configCode" lang="js" />
        <p class="doc_text doc_gap">icons 支持两种配置：数组形式会沿用 strokeWidth、currentColor 等规则；字符串 SVG 会原样渲染，不应用 strokeWidth，尺寸仍由
            size 控制。</p>
        <p class="doc_note doc_gap">运行时也可以调用 configureIcons({ name: 配置 }) 覆盖或新增图标，传 null 可以移除图标。</p>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>

        <Teleport to="body">
            <div v-if="MenuOpen" class="doc_icon_menu"
                :style="{ left: `${MenuX}px`, top: `${MenuY}px` }" @contextmenu.prevent>
                <button type="button" class="doc_icon_menu_item" @click="CopyName">复制名称</button>
                <button type="button" class="doc_icon_menu_item" @click="CopyComponent">复制组件</button>
            </div>
        </Teleport>
    </DocPage>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { iconGroups, iconNames, toast, useClipboard } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const icons = computed(() => iconNames())
const Common = iconGroups.flatMap(group => group.icons)

const AllNames = computed(() => {
    const names = icons.value
    const common = Common.filter(name => names.includes(name))
    const known = new Set(common)
    return [...common, ...names.filter(name => !known.has(name))]
})

const Search = ref('')
const Category = ref('all')
const CategoryOptions = computed(() => [
    { label: '全部分类', value: 'all' },
    ...iconGroups.map(group => ({ label: group.title, value: group.title })),
])
const Page = ref(0)
const PageSize = 96

const Filtered = computed(() => {
    const query = Search.value.trim().toLowerCase()
    let pool

    if (Category.value === 'all') {
        pool = AllNames.value
    } else {
        const group = iconGroups.find(item => item.title === Category.value)
        pool = (group?.icons || []).filter(name => icons.value.includes(name))
    }

    if (query) pool = pool.filter(name => name.includes(query))
    return pool
})

const PageCount = computed(() => Math.max(1, Math.ceil(Filtered.value.length / PageSize)))
const PageIcons = computed(() => Filtered.value.slice(Page.value * PageSize, (Page.value + 1) * PageSize))

const Selected = ref(['home', 'search'])
const PreviewName = ref('home')
const First = computed(() => Selected.value[0] || '')
const Second = computed(() => Selected.value[1] || '')
const { copy } = useClipboard()

const Auto = ref(true)
let PreviewTimer = 0

function StopPreview() {
    clearInterval(PreviewTimer)
    PreviewTimer = 0
}

function StartPreview() {
    StopPreview()
    if (!Auto.value || !First.value || !Second.value) return

    PreviewName.value = First.value
    PreviewTimer = setInterval(() => {
        PreviewName.value = PreviewName.value === First.value ? Second.value : First.value
    }, 1200)
}

watch([First, Second, Auto], StartPreview, { immediate: true })

const SwitchCode = computed(() => {
    if (First.value && Second.value) {
        return `<AppIcon :name="active ? '${Second.value}' : '${First.value}'" />`
    }
    if (First.value) return `<AppIcon name="${First.value}" />`
    return '<!-- 先选择两个图标 -->'
})

watch([Search, Category], () => {
    Page.value = 0
})

watch(PageCount, (count) => {
    if (Page.value >= count) Page.value = Math.max(0, count - 1)
})

function isSelected(name) {
    return Selected.value.includes(name)
}

function Pick(name) {
    const index = Selected.value.indexOf(name)

    if (index >= 0) {
        Selected.value.splice(index, 1)
    } else if (Selected.value.length < 2) {
        Selected.value.push(name)
    } else {
        Selected.value = [Selected.value[1], name]
    }

    PreviewName.value = Selected.value[0] || ''
}

function Play() {
    if (Selected.value.length < 2) {
        PreviewName.value = Selected.value[0] || ''
        return
    }

    PreviewName.value = PreviewName.value === First.value ? Second.value : First.value
}

function Swap() {
    if (Selected.value.length < 2) return

    Selected.value = [Selected.value[1], Selected.value[0]]
    PreviewName.value = Selected.value[0]
}

function ClearSelected() {
    Selected.value = []
    PreviewName.value = ''
}

function SetPage(value) {
    Page.value = Math.max(0, Number(value) - 1)
}

async function CopyCode() {
    const ok = await copy(SwitchCode.value)
    if (!ok) toast.danger('复制失败')
    else toast.success('已复制切换代码')
}

const MenuOpen = ref(false)
const MenuName = ref('')
const MenuX = ref(0)
const MenuY = ref(0)

function OpenMenu(event, name) {
    MenuName.value = name
    MenuX.value = Math.min(event.clientX, window.innerWidth - 180)
    MenuY.value = Math.min(event.clientY, window.innerHeight - 110)
    MenuOpen.value = true
}

function CloseMenu() {
    MenuOpen.value = false
}

function OnOutside(event) {
    if (!MenuOpen.value) return
    if (event.target instanceof Element && event.target.closest('.doc_icon_menu')) return
    CloseMenu()
}

async function CopyName() {
    const name = MenuName.value
    CloseMenu()
    const ok = await copy(name)
    if (!ok) toast.danger('复制失败')
    else toast.success(`已复制 ${name}`)
}

async function CopyComponent() {
    const text = `<AppIcon name="${MenuName.value}" />`
    CloseMenu()
    const ok = await copy(text)
    if (!ok) toast.danger('复制失败')
    else toast.success(`已复制 ${text}`)
}

onMounted(() => {
    document.addEventListener('pointerdown', OnOutside, true)
})

onUnmounted(() => {
    document.removeEventListener('pointerdown', OnOutside, true)
    StopPreview()
})

const propsRows = [
    { name: 'name', type: 'string', default: '—', desc: '图标名；未知名称渲染空图标' },
    { name: 'icon', type: 'array | string', default: '—', desc: '直接传 IconNode 数组或 d 字符串，优先级高于 name' },
    { name: 'size', type: 'number | string', default: '20', desc: '宽高，数字自动补 px' },
    { name: 'strokeWidth', type: 'number | string', default: '1.8', desc: '描边宽度' },
    { name: 'morph', type: 'boolean', default: 'true', desc: '是否启用图标形变过渡' },
    { name: 'spring', type: 'string | object', default: '{ stiffness: 520, damping: 34 }', desc: '形变弹簧：snappy、smooth、bouncy 或 { stiffness, damping }' },
    { name: 'reducedMotion', type: 'string', default: 'user', desc: '减少动画策略：never、user、always' },
]

const externalCode = `import { configureIcons } from '@wash/ui'

// 任意 IconNode 数组都可以注册
configureIcons({
    badge: [
        ['circle', { cx: 12, cy: 12, r: 9 }],
        ['path', { d: 'm8 12 3 3 5-6' }],
    ],
})`

const configCode = `import { createUi } from '@wash/ui'

app.use(createUi({
    icons: {
        badge: [
            ['circle', { cx: 12, cy: 12, r: 9 }],
            ['path', { d: 'm8 12 3 3 5-6' }],
        ],
        logo: '<svg viewBox="0 0 24 24"><path d="..." fill="currentColor" /></svg>',
    },
}))`
</script>

<style>
.doc_icon_morph_section {
    margin-bottom: 20px;
}

.doc_icon_morph_head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.doc_icon_morph_head .doc_h2 {
    margin: 0 0 8px;
}

.doc_icon_morph_head .doc_text {
    margin: 0;
}

.doc_icon_morph {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 28px;
    margin-top: 18px;
}

.doc_icon_preview {
    display: grid;
    width: 120px;
    height: 120px;
    place-items: center;
    flex: none;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_card);
    background:
        radial-gradient(120% 120% at 50% 0%, var(--wa_color_soft), transparent 70%),
        var(--wa_color_canvas);
    color: var(--wa_color_text);
    cursor: pointer;
    user-select: none;
    transition: border-color var(--wa_duration_fast), transform var(--wa_duration_fast);
}

.doc_icon_preview:hover {
    border-color: var(--wa_color_line_strong);
    transform: translateY(-1px);
}

.doc_icon_morph_body {
    display: grid;
    gap: 14px;
    min-width: 0;
}

.doc_icon_pairs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font: 12px var(--wa_font_mono);
    color: var(--wa_color_text_muted);
}

.doc_icon_pair {
    padding: 4px 8px;
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_hover);
}

.doc_icon_arrow {
    color: var(--wa_color_text_faint);
}

.doc_icon_actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.doc_icon_actions .wa_switch_row {
    margin-left: auto;
}

.doc_icon_head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 30px 0 8px;
}

.doc_icon_head .doc_h2 {
    margin: 0;
}

.doc_icon_toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}

.doc_icon_category {
    width: 150px;
    flex: none;
}

.doc_icon_search {
    width: 220px;
    flex: none;
}

.doc_icon_search .wa_field {
    width: 100%;
}

.doc_icon_count {
    margin-bottom: 12px;
}

.doc_icon_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    gap: 6px;
    margin-bottom: 14px;
}

.doc_icon_item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    aspect-ratio: 1;
    padding: 8px 6px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_canvas);
    color: var(--wa_color_text_muted);
    cursor: pointer;
    transition: color var(--wa_duration_fast), border-color var(--wa_duration_fast), background var(--wa_duration_fast), transform var(--wa_duration_fast);
}

.doc_icon_item:hover {
    color: var(--wa_color_text);
    border-color: var(--wa_color_line_strong);
    background: var(--wa_color_surface);
    transform: translateY(-1px);
}

.doc_icon_item.selected {
    color: var(--wa_color_accent);
    border-color: var(--wa_color_accent);
    background: var(--wa_color_surface);
}

.doc_icon_name {
    max-width: 100%;
    overflow: hidden;
    font: 11px var(--wa_font_mono);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.doc_icon_pick {
    position: absolute;
    top: 4px;
    right: 4px;
    display: grid;
    width: 16px;
    height: 16px;
    place-items: center;
    border-radius: 50%;
    background: var(--wa_color_accent);
    color: var(--wa_color_on_accent, #fff);
    font: 10px var(--wa_font_mono);
}

.doc_icon_pagination {
    margin-top: 12px;
}

.doc_icon_sizes {
    display: grid;
    gap: 12px;
    color: var(--wa_color_text);
}

.doc_icon_menu {
    position: fixed;
    z-index: var(--wa_z_popover, 1000);
    display: grid;
    min-width: 150px;
    padding: 4px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_surface);
    box-shadow: var(--wa_shadow_popover, 0 12px 28px #00000018);
}

.doc_icon_menu_item {
    padding: 8px 10px;
    border: 0;
    border-radius: var(--wa_radius_control);
    color: var(--wa_color_text);
    background: transparent;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.doc_icon_menu_item:hover {
    background: var(--wa_color_hover);
}

.doc_link {
    color: var(--wa_color_accent);
    text-decoration: none;
}

.doc_link:hover {
    text-decoration: underline;
}

.doc_icon_size_row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
}

.doc_icon_size_label {
    min-width: 88px;
    font: 11px var(--wa_font_mono);
    color: var(--wa_color_text_subtle);
}
</style>
