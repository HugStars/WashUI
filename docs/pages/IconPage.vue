<template>
    <DocPage category="图标" name="AppIcon" title="图标"
        :description="`内置 ${icons.length} 个图标。动画优先：先看形变，再从图标库挑两个图标实时预览。`">
        <section class="doc_morph_hero">
            <div class="doc_morph_stage doc_aurora">
                <span class="doc_morph_eyebrow">
                    <AppSpinner dot :size="10" />
                    Morphicons · spring physics
                </span>

                <button type="button" class="doc_morph_icon" title="切换一次" aria-label="切换一次图标形变"
                    @click="Play">
                    <AppIcon :name="PreviewName || 'circle'" :size="168" :stroke-width="StrokeWidth"
                        :spring="Spring" :speed="Speed" />
                </button>

                <div class="doc_morph_caption">
                    <span class="doc_morph_name">{{ First || '图标 A' }}</span>
                    <AppIcon name="chevron" :size="12" class="doc_morph_arrow" aria-hidden="true" />
                    <span class="doc_morph_name">{{ Second || '图标 B' }}</span>
                </div>

                <p class="doc_morph_stage_hint">点击图标切换，或在下方图标库中挑选</p>
            </div>

            <aside class="doc_morph_console">
                <header class="doc_morph_console_head">
                    <h2 class="doc_h2">形变控制台</h2>
                    <p class="doc_morph_desc">弹簧、速度与描边即时生效。AppIcon 的 name 变化时自动播放，不需要额外 CSS。</p>
                </header>

                <div class="doc_morph_field">
                    <div class="doc_morph_field_head">
                        <span class="doc_morph_label">弹簧</span>
                        <code class="doc_morph_value">{{ SpringLabel }}</code>
                    </div>
                    <AppRadioGroup v-model="Spring" :options="SpringOptions" variant="segmented"
                        aria-label="弹簧预设" @change="Replay" />
                </div>

                <div class="doc_morph_field">
                    <div class="doc_morph_field_head">
                        <span class="doc_morph_label">速度</span>
                        <code class="doc_morph_value">{{ Speed }}×</code>
                    </div>
                    <AppRadioGroup v-model="Speed" :options="SpeedOptions" variant="segmented"
                        aria-label="播放速度" />
                </div>

                <div class="doc_morph_field">
                    <div class="doc_morph_field_head">
                        <span class="doc_morph_label">描边</span>
                        <span class="doc_morph_hint">1.0 – 3.0</span>
                    </div>
                    <AppStepper v-model="StrokeWidth" :min="1" :max="3" :step="0.1" aria-label="描边宽度" />
                </div>

                <div class="doc_morph_actions">
                    <AppButton size="sm" variant="primary" :disabled="!CanMorph" @click="Play">
                        切换一次
                    </AppButton>
                    <AppButton size="sm" variant="line" :disabled="!CanMorph" @click="Swap">
                        交换
                    </AppButton>
                    <AppButton size="sm" variant="line" @click="CopyCode">
                        复制代码
                    </AppButton>
                </div>

                <div class="doc_morph_auto">
                    <AppSwitch v-model="Auto" label="自动循环" />
                    <span class="doc_morph_hint">{{ CanMorph ? '点击大图标也可以切换' : '在下方选择两个图标' }}</span>
                </div>
            </aside>
        </section>

        <section class="doc_morph_examples">
            <div class="doc_morph_examples_head">
                <div>
                    <h2 class="doc_h2">动画示例</h2>
                    <p class="doc_text">这些图标正在实时形变。点击任意一组，把这对图标送进上方预览。</p>
                </div>
                <span class="doc_morph_live">
                    <i aria-hidden="true"></i>
                    实时形变
                </span>
            </div>

            <div class="doc_morph_tiles">
                <button v-for="tile in Tiles" :key="`${tile.from}-${tile.to}`" type="button" class="doc_morph_tile"
                    :title="`预览 ${tile.from} → ${tile.to}`" @click="UsePair(tile)">
                    <span class="doc_morph_tile_icon">
                        <AppIcon :name="tile.current" :size="30" :stroke-width="StrokeWidth" :spring="Spring"
                            :speed="Speed" />
                    </span>
                    <span class="doc_morph_tile_text">
                        {{ tile.from }}<i aria-hidden="true">→</i>{{ tile.to }}
                    </span>
                </button>
            </div>
        </section>

        <p class="doc_note doc_gap">图标形变由 <a class="doc_link" href="https://www.morphicons.com" target="_blank"
                rel="noreferrer">Morphicons</a> 提供（MIT）。</p>

        <div class="doc_icon_head">
            <h2 class="doc_h2">全部图标</h2>
            <div class="doc_icon_toolbar">
                <div class="doc_icon_category">
                    <AppSelect v-model="Category" :options="CategoryOptions" size="sm" :check-icon="false"
                        aria-label="图标分类" />
                </div>
                <div class="doc_icon_search">
                    <AppInput v-model="Search" placeholder="搜索图标" aria-label="搜索图标" clearable />
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
                    @keydown="OnIconKeydown($event, name)" @contextmenu.prevent="OpenMenu($event, name)">
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
        <h3 class="doc_h3">形变默认值</h3>
        <p class="doc_text">spring、speed、strokeWidth、reducedMotion 可以通过 createUi 的 iconDefaults 全局配置，组件上的 props 优先。
        </p>
        <AppCode :code="motionConfigCode" lang="js" />
        <p class="doc_note doc_gap">运行时可以调用 configureIconDefaults 修改默认值，已在页面上的 AppIcon 会按新配置生效。</p>

        <h3 class="doc_h3">图标注册</h3>
        <AppCode :code="configCode" lang="js" />
        <p class="doc_text doc_gap">icons 支持数组、d 字符串和 SVG 字符串。SVG 会先通过 Morphicons 的 svgToIcon 转成 24
            网格并参与形变；无法解析的标记会经过安全过滤后渲染，无法安全解析时忽略。</p>
        <p class="doc_note doc_gap">运行时也可以调用 configureIcons({ name: 配置 }) 覆盖或新增图标，传 null 可以移除图标。</p>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>

        <AppPopover v-model:open="MenuOpen" placement="bottom-left" :width="160" :gap="4" :padding="4"
            role="menu" aria-label="图标操作">
            <template #trigger>
                <!-- * 1px 固定锚点承接右键坐标，AppPopover 只认 trigger 的 rect -->
                <span class="doc_icon_menu_anchor" :style="{ left: `${MenuX}px`, top: `${MenuY}px` }"
                    aria-hidden="true"></span>
            </template>
            <div ref="MenuEl" class="doc_icon_menu" @keydown="OnMenuKeydown" @contextmenu.prevent>
                <button type="button" class="doc_icon_menu_item" role="menuitem" @click="CopyName">复制名称</button>
                <button type="button" class="doc_icon_menu_item" role="menuitem" @click="CopyComponent">复制组件</button>
            </div>
        </AppPopover>
    </DocPage>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { AppPopover, AppRadioGroup, AppStepper, iconGroups, iconNames, toast, useClipboard } from 'wash-ui'
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
const CanMorph = computed(() => Selected.value.length >= 2)
const { copy } = useClipboard()

const SpringOptions = [
    { label: '平滑', value: 'smooth' },
    { label: '利落', value: 'snappy' },
    { label: '弹跳', value: 'bouncy' },
]
const Spring = ref('snappy')
const SpeedOptions = [
    { label: '0.25×', value: 0.25 },
    { label: '0.5×', value: 0.5 },
    { label: '1×', value: 1 },
    { label: '2×', value: 2 },
]
const Speed = ref(1)
const StrokeWidth = ref(1.8)

const SpringLabel = computed(() => SpringOptions.find(item => item.value === Spring.value)?.label || Spring.value)

const Auto = ref(true)
let PreviewTimer = 0

function StopPreview() {
    clearInterval(PreviewTimer)
    PreviewTimer = 0
}

// 只重启计时，不改变当前显示目标；手动切换后必须调用，避免旧节奏立刻把图标切回去
function SchedulePreview() {
    StopPreview()
    if (!Auto.value || !CanMorph.value) return
    // * 页面隐藏时暂停自动预览，恢复可见后由 OnVisibility 重新启动
    if (typeof document !== 'undefined' && document.hidden) return

    PreviewTimer = setInterval(() => {
        PreviewName.value = PreviewName.value === First.value ? Second.value : First.value
    }, Math.max(600, Math.round(1600 / Speed.value)))
}

function ResetPreview() {
    StopPreview()
    if (!Auto.value || !CanMorph.value) return

    PreviewName.value = First.value
    SchedulePreview()
}

watch([First, Second, Auto], ResetPreview, { immediate: true })

// 速度变化时立即演示一次，并从这一刻重新计时
watch(Speed, () => {
    if (!CanMorph.value) return
    PreviewName.value = PreviewName.value === First.value ? Second.value : First.value
    SchedulePreview()
})

function Replay() {
    if (!CanMorph.value) return
    PreviewName.value = PreviewName.value === First.value ? Second.value : First.value
    SchedulePreview()
}

const Tiles = reactive([
    { from: 'play', to: 'pause', current: 'play' },
    { from: 'sun', to: 'moon', current: 'sun' },
    { from: 'lock', to: 'unlock', current: 'lock' },
    { from: 'heart', to: 'star', current: 'heart' },
    { from: 'plus', to: 'minus', current: 'plus' },
    { from: 'upload', to: 'download', current: 'upload' },
    { from: 'check', to: 'close', current: 'check' },
    { from: 'mail', to: 'send', current: 'mail' },
])

const MotionMedia = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null
const ReduceMotion = ref(MotionMedia?.matches ?? false)
const TILE_DELAY = 2200
const TILE_STAGGER = 170
let TileTimer = 0
let TileDeadlines = []

function StopTiles() {
    clearTimeout(TileTimer)
    TileTimer = 0
}

// * 每个 tile 保持原来的独立节奏，但共用一个调度器，避免多个常驻定时器
// ! TILE_DELAY + index * TILE_STAGGER 是原始 interval 的节奏，改动前先确认视觉节奏
function ScheduleTiles() {
    clearTimeout(TileTimer)
    if (ReduceMotion.value || !Tiles.length || !TileDeadlines.length) return

    const now = performance.now()
    let next = Infinity

    Tiles.forEach((tile, index) => {
        if (now >= TileDeadlines[index]) {
            tile.current = tile.current === tile.from ? tile.to : tile.from
            TileDeadlines[index] = now + TILE_DELAY + index * TILE_STAGGER
        }
        next = Math.min(next, TileDeadlines[index])
    })

    TileTimer = setTimeout(ScheduleTiles, Math.max(80, next - performance.now()))
}

function StartTiles() {
    StopTiles()
    if (ReduceMotion.value || document.hidden) return

    const now = performance.now()
    TileDeadlines = Tiles.map((_, index) => now + TILE_DELAY + index * TILE_STAGGER)
    ScheduleTiles()
}

function OnMotion(event) {
    ReduceMotion.value = event.matches
    StartTiles()
}

// * 页面不可见时暂停装饰动画，回到页面再恢复
// note 自动预览和示例 tile 共用这个开关，避免后台标签页继续跑形变
function OnVisibility() {
    if (document.hidden) {
        StopPreview()
        StopTiles()
        return
    }

    StartTiles()
    SchedulePreview()
}

function UsePair(tile) {
    Selected.value = [tile.from, tile.to]
    PreviewName.value = tile.from
    requestAnimationFrame(() => {
        PreviewName.value = tile.to
        SchedulePreview()
    })
}

const SpringCode = computed(() => ` spring="${Spring.value}"`)

const SpeedCode = computed(() => {
    const speed = Number(Speed.value)
    return speed === 1 ? '' : ` :speed="${speed}"`
})

const StrokeCode = computed(() => {
    const width = Number(StrokeWidth.value)
    return width === 1.8 ? '' : ` :stroke-width="${width}"`
})

const SwitchCode = computed(() => {
    if (First.value && Second.value) {
        return `<AppIcon :name="active ? '${Second.value}' : '${First.value}'"${SpringCode.value}${SpeedCode.value}${StrokeCode.value} />`
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
    SchedulePreview()
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
const MenuEl = ref(null)

// section 右键菜单定位
// * 锚点先落到右键位置，等 DOM 更新后再打开，AppPopover 才能读到正确坐标
// ! 不能设置坐标后立刻 open，否则 AppPopover 会按旧锚点定位
async function OpenMenu(event, name) {
    const trigger = event.currentTarget instanceof HTMLElement ? event.currentTarget : null
    MenuName.value = name

    if (event.clientX || event.clientY) {
        MenuX.value = Math.min(event.clientX, window.innerWidth - 180)
        MenuY.value = Math.min(event.clientY, window.innerHeight - 110)
    } else if (trigger) {
        const rect = trigger.getBoundingClientRect()
        MenuX.value = Math.min(rect.left, window.innerWidth - 180)
        MenuY.value = rect.bottom + 4
    }

    await nextTick()
    trigger?.focus({ preventScroll: true })
    MenuOpen.value = true

    // ! 两次 nextTick：第一次等面板渲染，第二次等 AppPopover 完成定位；提前聚焦会让方向键失效
    await nextTick()
    await nextTick()
    MenuEl.value?.querySelector('button')?.focus({ preventScroll: true })
}

// * Shift+F10 / 菜单键与右键使用同一份菜单和定位逻辑
// ! 不能只做右键入口，否则键盘用户无法打开图标操作菜单
function OnIconKeydown(event, name) {
    if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return
    event.preventDefault()
    OpenMenu(event, name)
}

function OnMenuKeydown(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    const items = [...(MenuEl.value?.querySelectorAll('button') || [])]
    if (!items.length) return

    event.preventDefault()
    const index = items.indexOf(document.activeElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    const next = index < 0 ? 0 : (index + step + items.length) % items.length
    items[next].focus()
}

async function CopyName() {
    const name = MenuName.value
    MenuOpen.value = false
    const ok = await copy(name)
    if (!ok) toast.danger('复制失败')
    else toast.success(`已复制 ${name}`)
}

async function CopyComponent() {
    const text = `<AppIcon name="${MenuName.value}" />`
    MenuOpen.value = false
    const ok = await copy(text)
    if (!ok) toast.danger('复制失败')
    else toast.success(`已复制 ${text}`)
}

onMounted(() => {
    document.addEventListener('visibilitychange', OnVisibility)
    MotionMedia?.addEventListener('change', OnMotion)
    StartTiles()
})

onUnmounted(() => {
    document.removeEventListener('visibilitychange', OnVisibility)
    MotionMedia?.removeEventListener('change', OnMotion)
    StopPreview()
    StopTiles()
})

const propsRows = [
    { name: 'name', type: 'string', default: '—', desc: '图标名；未知名称渲染空图标' },
    { name: 'icon', type: 'array | string', default: '—', desc: '直接传 IconNode 数组、d 字符串或 SVG 字符串，优先级高于 name' },
    { name: 'size', type: 'number | string', default: '20', desc: '宽高，数字自动补 px' },
    { name: 'strokeWidth', type: 'number | string', default: '1.8', desc: '描边宽度；可全局配置' },
    { name: 'morph', type: 'boolean', default: 'true', desc: '是否启用图标形变过渡' },
    { name: 'spring', type: 'string | object', default: '{ stiffness: 520, damping: 34 }', desc: '形变弹簧：snappy、smooth、bouncy 或 { stiffness, damping }；可全局配置' },
    { name: 'speed', type: 'number', default: '1', desc: '播放速度倍率，按弹簧时间缩放换算；可全局配置' },
    { name: 'reducedMotion', type: 'string', default: 'user', desc: '减少动画策略：never、user、always；可全局配置' },
]

const externalCode = `import { configureIcons } from 'wash-ui'

// 任意 IconNode 数组都可以注册
configureIcons({
    badge: [
        ['circle', { cx: 12, cy: 12, r: 9 }],
        ['path', { d: 'm8 12 3 3 5-6' }],
    ],
})`

const motionConfigCode = `import { createUi } from 'wash-ui'

app.use(createUi({
    iconDefaults: {
        spring: 'snappy',       // smooth / snappy / bouncy 或 { stiffness, damping }
        speed: 1,               // 播放速度倍率
        strokeWidth: 1.8,
        reducedMotion: 'user',  // never / user / always
    },
}))`

const configCode = `import { createUi } from 'wash-ui'

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
.doc_morph_hero {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr);
    gap: 14px;
    align-items: stretch;
}

.doc_morph_stage {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 372px;
    padding: 60px 24px 24px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_card);
    color: var(--wa_color_text);
}

.doc_morph_eyebrow {
    position: absolute;
    top: 18px;
    left: 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font: 11px var(--wa_font_mono);
    letter-spacing: .04em;
    color: var(--wa_color_text_subtle);
}

.doc_morph_icon {
    display: grid;
    width: 232px;
    height: 232px;
    place-items: center;
    flex: none;
    padding: 0;
    border: 1px solid color-mix(in srgb, var(--wa_color_border) 46%, transparent);
    border-radius: 50%;
    background: color-mix(in srgb, var(--wa_color_glass) 58%, transparent);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
    box-shadow:
        0 24px 60px #00000012,
        inset 0 1px 0 color-mix(in srgb, var(--wa_color_border) 70%, transparent);
    color: var(--wa_color_text);
    cursor: pointer;
    transition: transform var(--wa_duration_slow) var(--wa_ease_spring), border-color var(--wa_duration_fast);
}

.doc_morph_icon:hover {
    border-color: var(--wa_color_line_strong);
    transform: translateY(-2px) scale(1.015);
}

.doc_morph_icon:active {
    transform: scale(.985);
}

.doc_morph_icon:focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 6px;
}

.doc_morph_caption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font: 12px var(--wa_font_mono);
    color: var(--wa_color_text_muted);
}

.doc_morph_name {
    padding: 4px 10px;
    border: 1px solid color-mix(in srgb, var(--wa_color_line) 80%, transparent);
    border-radius: var(--wa_radius_pill);
    background: color-mix(in srgb, var(--wa_color_dialog) 52%, transparent);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}

.doc_morph_arrow {
    color: var(--wa_color_text_faint);
}

.doc_morph_stage_hint {
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}

.doc_morph_console {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 22px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_card);
    background: var(--wa_color_surface);
}

.doc_morph_console_head {
    display: grid;
    gap: 6px;
}

.doc_morph_console_head .doc_h2 {
    margin: 0;
    font-size: 17px;
}

.doc_morph_desc {
    font-size: 12.5px;
    line-height: 1.65;
    color: var(--wa_color_text_subtle);
}

.doc_morph_field {
    display: grid;
    gap: 8px;
}

.doc_morph_field_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.doc_morph_label {
    font-size: 12px;
    color: var(--wa_color_text_muted);
}

.doc_morph_value {
    font: 11px var(--wa_font_mono);
    color: var(--wa_color_text_subtle);
}

.doc_morph_field .wa_choice_group_segmented {
    width: 100%;
}

.doc_morph_actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.doc_morph_auto {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 14px;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--wa_color_line);
}

.doc_morph_hint {
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}

.doc_morph_examples {
    margin-top: 26px;
}

.doc_morph_examples_head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
}

.doc_morph_examples_head .doc_h2 {
    margin: 0 0 8px;
}

.doc_morph_examples_head .doc_text {
    margin: 0;
}

.doc_morph_live {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 4px 10px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_pill);
    font: 11px var(--wa_font_mono);
    color: var(--wa_color_text_subtle);
    background: var(--wa_color_soft);
}

.doc_morph_live i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--wa_color_accent);
    animation: doc_morph_pulse 2.4s var(--wa_ease_in_out) infinite;
}

.doc_morph_tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
}

.doc_morph_tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-width: 0;
    padding: 14px 10px;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_popover);
    color: var(--wa_color_text_muted);
    background: var(--wa_color_surface);
    font: inherit;
    cursor: pointer;
    transition: transform var(--wa_duration_base) var(--wa_ease_out), border-color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.doc_morph_tile:hover {
    border-color: var(--wa_color_line_strong);
    background: var(--wa_color_canvas);
    transform: translateY(-2px);
}

.doc_morph_tile_icon {
    display: grid;
    width: 56px;
    height: 56px;
    place-items: center;
    border-radius: 50%;
    background: var(--wa_color_soft);
    color: var(--wa_color_text);
}

.doc_morph_tile_text {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    overflow: hidden;
    font: 10.5px var(--wa_font_mono);
    color: var(--wa_color_text_subtle);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.doc_morph_tile_text i {
    font-style: normal;
    color: var(--wa_color_text_faint);
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

/* * 1px 固定锚点只负责给 AppPopover 提供右键坐标，不参与布局 */
.doc_icon_menu_anchor {
    position: fixed;
    width: 1px;
    height: 1px;
    pointer-events: none;
}

.doc_icon_menu {
    display: grid;
    gap: 2px;
    min-width: 0;
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

@media (max-width: 980px) {
    .doc_morph_hero {
        grid-template-columns: minmax(0, 1fr);
    }

    .doc_morph_stage {
        min-height: 328px;
    }
}

@media (max-width: 860px) {
    .doc_morph_stage {
        padding: 56px 16px 20px;
    }

    .doc_morph_icon {
        width: 200px;
        height: 200px;
    }

    .doc_morph_console {
        padding: 18px;
    }

    .doc_morph_tiles {
        grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
    }
}

@media (prefers-reduced-motion: reduce) {
    .doc_morph_live i {
        animation: none;
    }

    .doc_morph_icon,
    .doc_morph_tile {
        transition: none;
    }
}
</style>
