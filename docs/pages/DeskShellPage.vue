<template>
    <DocPage category="布局" name="AppDeskShell" title="桌面壳层"
        description="桌面窗口的 Grid 壳层：Title、Header、Aside、Main、Toolbar 五个区域。导航复用 AppNavMenu，窗口按钮复用 AppWindowControls。">
        <DemoBlock title="基础桌面壳层" description="Title 在左侧、Header 在右侧；Aside 从第二行开始，Main 独立滚动，Toolbar 固定在底部。Header 中间同时展示全局 Action 和 PageBar 投递的路由 Action。" frosted>
            <div class="doc_desk_stage">
                <AppDeskShell :config="bookConfig" :items="bookItems" v-model:active="bookActive"
                    @navigate="OnNavigate" @minimize="Notify('最小化')" @maximize="Notify('最大化')"
                    @close="mode => Notify(`关闭：${mode}`)">
                    <template #header-actions>
                        <AppButton size="sm">搜索</AppButton>
                    </template>

                    <PageBar placement="header">
                        <AppButton size="sm" variant="line">新增书籍</AppButton>
                    </PageBar>

                    <div class="doc_desk_content">
                        <AppCard title="Main" frosted>
                            <p class="wa_hint">
                                路由页里的 PageBar placement="header" 会投递到 Header 中间；Main 自己滚动，Toolbar 不跟着滚。
                            </p>
                        </AppCard>
                    </div>

                    <template #toolbar>
                        <span class="doc_desk_toolbar_text">已选 {{ bookActive }} · 状态栏</span>
                    </template>
                </AppDeskShell>
            </div>
        </DemoBlock>

        <DemoBlock title="侧栏满高 + icon 模式" description="关闭 Title 并使用 title.fallback='aside'，Aside 从顶部贯穿到底；mode='icon' 只显示图标，variant='bordered' 显示右边框。" frosted>
            <div class="doc_desk_stage">
                <AppDeskShell :config="flowConfig" :items="flowItems" v-model:active="flowActive"
                    @navigate="OnNavigate" @minimize="Notify('最小化')" @close="mode => Notify(`关闭：${mode}`)">
                    <template #aside-footer>
                        <AppIconButton name="settings" label="设置" @click="Notify('设置')" />
                    </template>

                    <div class="doc_desk_content">
                        <AppCard title="FlowTime 式布局" frosted>
                            <p class="wa_hint">
                                Aside 占满左侧整列，Header 只覆盖主内容列；底部入口固定在 Aside 最下方。
                            </p>
                        </AppCard>
                    </div>
                </AppDeskShell>
            </div>
        </DemoBlock>

        <p class="doc_note doc_gap">
            spacing 默认 0，不产生任何间隙；设置后通过 Grid gap 统一控制 Title / Header 底部、Aside 右侧和 Toolbar 顶部间距。
        </p>

        <h2 class="doc_h2">基本结构</h2>
        <AppCode :code="baseCode" lang="html" />

        <h2 class="doc_h2">Header 中的路由 Action</h2>
        <p class="doc_text doc_gap">
            PageBar 是页面操作栏。默认在桌面端留在页面内，移动端投递到壳层 Header；placement="header" 会强制投递到
            AppDeskShell 的 Header 中间，适合把“新增、导出、筛选”等路由级操作放到顶部。
        </p>
        <AppCode :code="pageBarCode" lang="html" />
        <ApiTable kind="values" :rows="pageBarPlacements" />

        <h2 class="doc_h2">窗口按钮</h2>
        <p class="doc_text doc_gap">
            AppWindowControls 只负责视觉和事件，最小化 / 最大化 / 关闭由业务调用 Tauri 或浏览器 API。关闭按钮 hover
            为红色背景。
        </p>
        <ApiTable :rows="windowPropsRows" />
        <ApiTable title="事件" kind="events" :rows="windowEventRows" />

        <template #api>
            <ApiTable :rows="configRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const bookItems = [
    { label: '书架', value: 'home', icon: 'book' },
    { label: '目录', value: 'catalog', icon: 'bookshelf' },
    { label: '书签', value: 'bookmark', icon: 'bookmark' },
    { label: '设置', value: 'settings', icon: 'settings', badge: 2 },
]

const flowItems = [
    { label: '总览', value: 'overview', icon: 'chart' },
    { label: '排行', value: 'ranking', icon: 'ranking' },
    { label: '趋势', value: 'trend', icon: 'trend' },
    { label: '设置', value: 'settings', icon: 'settings' },
]

const bookActive = ref('home')
const flowActive = ref('overview')

const bookConfig = {
    transparent: true,
    frosted: true,
    title: {
        show: true,
        text: 'Read Books',
        icon: 'book',
        height: 46,
        fallback: 'header',
    },
    header: {
        showTitle: true,
        title: '书架',
        height: 46,
        winAction: ['min', 'close'],
        closeMode: 'window',
    },
    aside: {
        mode: 'icon-text',
        variant: 'bordered',
        iconWidth: 56,
        iconTextWidth:180,
        textWidth: 164,
        navSize: 'md',
    },
    main: {
        padded: false,
        toolbar: {
            show: true,
            height: 40,
        },
    },
    window: {
        width: '100%',
        height: 420,
        minWidth: 480,
        minHeight: 320,
    },
}

const flowConfig = {
    transparent: true,
    frosted: true,
    title: {
        show: false,
        fallback: 'aside',
    },
    header: {
        title: '总览',
        winAction: ['min', 'close'],
        closeMode: 'window',
    },
    aside: {
        mode: 'icon',
        variant: 'bordered',
        iconWidth: 56,
    },
    main: {
        padded: false,
    },
    window: {
        height: 420,
    },
}

function OnNavigate(item) {
    toast(`选择：${item.label}`)
}

function Notify(text) {
    toast(`${text}（示例）`)
}

const configRows = [
    { name: 'dragRegion', type: 'boolean', default: 'false', desc: 'Title 和 Header 是否添加 data-tauri-drag-region' },
    { name: 'transparent', type: 'boolean', default: 'false', desc: '去掉壳层画布背景' },
    { name: 'frosted', type: 'boolean', default: 'false', desc: 'Title / Header / Aside / Toolbar 使用磨砂玻璃' },
    { name: 'glass', type: 'string', default: "''", desc: '自定义磨砂面板颜色，空值时使用全局 --wa_color_glass' },
    { name: 'glassOpacity', type: 'number', default: '100', desc: '整体磨砂面板的相对不透明度，0-100' },
    { name: 'spacing', type: 'number | string', default: '0', desc: '通过 Grid gap 控制 Title/Header 底部、Aside 右侧、Toolbar 顶部间距；0 不显示' },
    { name: 'title.show', type: 'boolean', default: 'true', desc: '是否显示 Title' },
    { name: 'title.text', type: 'string', default: "''", desc: '软件名称' },
    { name: 'title.icon', type: 'string | Array', default: "''", desc: 'AppIcon 名或 IconNode' },
    { name: 'title.iconSrc', type: 'string', default: "''", desc: '图片 logo，优先于 title.icon' },
    { name: 'title.height', type: 'number | string', default: '46', desc: 'Title 高度' },
    { name: 'title.fallback', type: 'header | aside', default: 'header', desc: 'Title 隐藏时由 Header 或 Aside 占据顶部空间' },
    { name: 'header.showTitle', type: 'boolean', default: 'true', desc: '是否显示左侧路由名称' },
    { name: 'header.title', type: 'string', default: "''", desc: '左侧路由名称，业务可传 route.meta.title' },
    { name: 'header.height', type: 'number | string', default: '46', desc: 'Header 高度' },
    { name: 'header.winAction', type: "'min' | 'max' | 'close'[]", default: "['min', 'close']", desc: '窗口按钮及顺序' },
    { name: 'header.closeMode', type: 'window | app', default: 'window', desc: '关闭当前界面还是关闭应用；通过 close 事件抛给业务' },
    { name: 'aside.mode', type: 'icon | icon-text | text', default: 'icon-text', desc: 'Aside 展示模式' },
    { name: 'aside.variant', type: 'plain | bordered', default: 'plain', desc: '无背景或背景 + 右边框' },
    { name: 'aside.iconWidth', type: 'number | string', default: '56', desc: 'icon 模式宽度，按钮保持正方形' },
    { name: 'aside.iconTextWidth', type: 'number | string', default: '180', desc: 'icon-text 模式宽度' },
    { name: 'aside.textWidth', type: 'number | string', default: '180', desc: 'text 模式宽度' },
    { name: 'aside.navSize', type: 'md | sm', default: 'md', desc: 'AppNavMenu 尺寸' },
    { name: 'main.padded', type: 'boolean', default: 'false', desc: 'Main 是否加默认内边距' },
    { name: 'main.toolbar.show', type: 'boolean', default: 'false', desc: '是否显示底部 Toolbar' },
    { name: 'main.toolbar.height', type: 'number | string', default: '40', desc: 'Toolbar 高度' },
    { name: 'window.width', type: 'number | string', default: "100%", desc: '壳层根节点宽度' },
    { name: 'window.height', type: 'number | string', default: '100vh', desc: '壳层根节点高度' },
    { name: 'window.minWidth', type: 'number | string', default: '0', desc: '壳层根节点最小宽度' },
    { name: 'window.minHeight', type: 'number | string', default: '0', desc: '壳层根节点最小高度' },
]

const eventRows = [
    { name: 'navigate', type: 'item', desc: '点击导航项，参数为 AppNavMenu 的 item' },
    { name: 'update:active', type: 'string | number | symbol', desc: '选中值变化，支持 v-model:active' },
    { name: 'minimize', type: '-', desc: '点击最小化' },
    { name: 'maximize', type: '-', desc: '点击最大化 / 还原' },
    { name: 'close', type: 'window | app', desc: '点击关闭，参数来自 header.closeMode' },
]

const slotRows = [
    { name: 'title', type: '-', desc: '自定义 Title 内容' },
    { name: 'header-left', type: '-', desc: '覆盖 Header 左侧路由名称' },
    { name: 'header-actions', type: '-', desc: '全局 Header 中间操作' },
    { name: 'win-actions', type: '-', desc: '覆盖右侧窗口按钮' },
    { name: 'aside-footer', type: '-', desc: 'Aside 底部入口，始终贴底' },
    { name: 'toolbar', type: '-', desc: 'Main 底部工具栏' },
    { name: 'default', type: '-', desc: 'Main 主内容' },
]

const windowPropsRows = [
    { name: 'winAction', type: "'min' | 'max' | 'close'[]", default: "['min', 'max', 'close']", desc: '按钮及顺序' },
    { name: 'maximized', type: 'boolean', default: 'false', desc: '切换最大化 / 还原图标' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用全部按钮' },
    { name: 'size', type: 'sm | md', default: 'sm', desc: '按钮尺寸' },
]

const windowEventRows = [
    { name: 'minimize', type: '-', desc: '点击最小化' },
    { name: 'maximize', type: '-', desc: '点击最大化 / 还原' },
    { name: 'close', type: '-', desc: '点击关闭' },
]

const pageBarPlacements = [
    { name: 'auto', desc: '默认。桌面端留在页面内，移动端投递到 Header' },
    { name: 'header', desc: '始终投递到 AppDeskShell / AppShell 的 Header 中间' },
    { name: 'inline', desc: '始终留在页面内' },
]

const baseCode = `<AppDeskShell
    :config="shellConfig"
    :items="navItems"
    v-model:active="active"
    @navigate="OnNavigate"
    @close="OnClose"
>
    <template #header-actions>
        <AppButton>搜索</AppButton>
    </template>

    <PageBar placement="header">
        <AppButton>新增书籍</AppButton>
    </PageBar>

    <RouterView />

    <template #toolbar>
        状态栏
    </template>
</AppDeskShell>`

const pageBarCode = `<PageBar placement="header">
    <AppButton>新增</AppButton>
    <AppButton variant="line">导出</AppButton>
</PageBar>`
</script>

<style>
.doc_desk_stage {
    height: 420px;
    overflow: hidden;
    border-radius: var(--wa_radius_small);
}

.doc_desk_stage .wa_desk {
    height: 420px;
    min-height: 420px;
}

.doc_desk_content {
    display: grid;
    gap: 12px;
    padding: 18px;
}

.doc_desk_toolbar_text {
    font-size: 12px;
    color: var(--wa_color_text_muted);
}
</style>
