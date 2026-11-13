<template>
    <div class="doc_stack">
        <section class="doc_hero">
            <div class="doc_hero_head">
                <h1 class="doc_hero_title">WashUI</h1>
                <AppTag>v{{ Version }}</AppTag>
                <AppTag class="doc_hero_tag">Vue3·私有设计系统</AppTag>
            </div>
            <p class="doc_hero_lead">
                WashUI 是一套自用的 Vue 3 设计系统，供多个网站共用基础样式、组件和配套能力。
            </p>
            <div class="doc_actions">
                <AppButton variant="primary" @click="router.push('/guide/quick-start')">快速开始</AppButton>
                <AppButton variant="line" @click="router.push('/components')">浏览组件</AppButton>
                <AppButton variant="line" @click="router.push('/tokens')">设计变量</AppButton>
            </div>
            <div class="doc_tags">
                <AppChip v-for="tag in HeroTags" :key="tag.icon" frosted :tabindex="tag.href ? 0 : -1"
                    :title="tag.title" @click="tag.href && OpenLink(tag.href)">
                    <AppIcon :name="tag.icon" :size="14" />
                    <span>{{ tag.label }}</span>
                </AppChip>
            </div>
        </section>

        <div class="doc_feature_grid">
            <RouterLink v-for="item in features" :key="item.path" :to="item.path"
                class="doc_feature_link doc_card_link">
                <AppCard compact>
                    <template #title>{{ item.title }}</template>
                    <template #extra>
                        <AppIcon name="chevron" :size="16" class="doc_feature_arrow" />
                    </template>
                    <p class="wa_hint">{{ item.text }}</p>
                </AppCard>
            </RouterLink>
        </div>

        <section class="doc_home_section">
            <h2 class="doc_h2">统一化设计</h2>
            <div class="doc_home_principles">
                <AppPanel v-for="item in principles" :key="item.title" variant="soft" :title="item.title">
                    <p>{{ item.text }}</p>
                </AppPanel>
            </div>
        </section>

        <section class="doc_home_section">
            <div class="doc_home_section_head">
                <h2 class="doc_h2">最近更新</h2>
                <RouterLink to="/guide/roadmap" class="doc_home_more">查看路线图</RouterLink>
            </div>
            <AppList variant="group" divided inset>
                <AppListRow v-for="item in updates" :key="item.label" :label="item.label" :value="item.value"
                    label-position="responsive" />
            </AppList>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatCount, formatDate } from 'wash-ui/utils'
import pkg from '../../ui/package.json'

const Version = pkg.version
const NpmDownloads = ref('')
const NPM_CACHE_KEY = 'wa_npm_downloads'
const NPM_CACHE_TTL = 60 * 60 * 1000

/**
 * 读取本地缓存，避免每次进入首页都请求 npm API
 * @param {string} key 缓存键
 * @returns {number|null} 缓存中的下载量
 */
function readDownloadsCache(key) {
    try {
        const cached = JSON.parse(localStorage.getItem(key) || 'null')
        if (!cached || Date.now() - cached.time > NPM_CACHE_TTL) return null
        return Number.isFinite(cached.value) ? cached.value : null
    } catch {
        return null
    }
}

/**
 * 请求 npm 下载量；失败时隐藏徽标，不影响页面
 */
async function loadNpmDownloads() {
    const range = `2026-11-01:${formatDate(new Date(), 'YYYY-MM-DD')}`
    const cacheKey = `${NPM_CACHE_KEY}:${range}`
    const cached = readDownloadsCache(cacheKey)

    if (cached !== null) {
        NpmDownloads.value = formatCount(cached)
        return
    }

    try {
        const response = await fetch(`https://api.npmjs.org/downloads/point/${range}/wash-ui`)
        if (!response.ok) return

        const value = Number((await response.json()).downloads)
        if (!Number.isFinite(value)) return

        NpmDownloads.value = formatCount(value)
        localStorage.setItem(cacheKey, JSON.stringify({ value, time: Date.now() }))
    } catch {
        // 网络或存储不可用时保持隐藏
    }
}

onMounted(loadNpmDownloads)

const HeroTags = computed(() => [
    {
        label: NpmDownloads.value ? `Downloads ${NpmDownloads.value}` : '',
        icon: 'download',
        href: 'https://www.npmjs.com/package/wash-ui',
        title: 'npm 下载量'
    },
    { label: 'Vue 3.5+', icon: 'vue', title: 'Vue 3.5+' },
    { label: '纯 CSS 变量', icon: 'braces', title: '纯 CSS 变量' },
    { label: '三端适配', icon: 'devices', title: 'PC / 移动端 / 桌面壳层' },
    { label: '动效统一', icon: 'activity', title: '统一动效与 reduced-motion' },
    { label: '按需导入', icon: 'package', title: '按需导入' }
].filter(tag => tag.label))

/**
 * 新窗口打开外链
 * @param {string} href 目标地址
 */
function OpenLink(href) {
    window.open(href, '_blank', 'noopener,noreferrer')
}

const router = useRouter()

const features = [
    {
        title: '安装与初始化',
        text: '安装依赖、引入样式、注册组件，接入主题与图标默认值。',
        path: '/guide/install'
    },
    {
        title: '主题与变量',
        text: '亮暗主题、颜色 / 圆角 / 间距 / 阴影 / 动效 token，以及运行时覆盖。',
        path: '/guide/theme'
    },
    {
        title: '组件',
        text: '基础、表单、数据、反馈、加载与内容展示组件，附示例和 API。',
        path: '/components'
    },
    {
        title: '布局与三端',
        text: 'PC 页面、移动端底部导航、桌面壳层、页面标题与路由过渡。',
        path: '/layout'
    },
    {
        title: '能力与函数',
        text: '全局服务、组合式函数、格式化工具、日期与并发控制。',
        path: '/abilities'
    },
    {
        title: '图标',
        text: '内置线性与 fill 图标、Morphicons 形变、描边与速度配置。',
        path: '/icons'
    }
]

const principles = [
    { title: '变量先行', text: '组件样式只引用变量，不写死颜色、圆角和秒数；换主题或调整节奏只改一处。' },
    { title: '动效统一', text: '滑块、分页、按压、校验、角标清除共用同一套时长与缓动，并统一处理 reduced-motion。' },
    { title: '图标行为', text: '线性与 fill 图标共用一套配置，name 变化时由 Morphicons 做形变，不额外写动画。' },
    { title: '三端一致', text: 'PC、移动端和桌面壳层共享组件与交互语义，差异只体现在布局和输入方式。' },
    { title: '反馈一致', text: '校验、Tooltip、Toast、Loading 使用同一套出现 / 收起节奏和层级规则。' },
    { title: '可覆盖', text: '默认值只是起点；token、图标、磨砂、动效都可以在项目侧覆盖，不侵入组件源码。' }
]

const updates = [
    { label: '设计变量', value: '动画时长、选中高亮、磨砂、代码高亮独立为可覆盖 token' },
    { label: '动效', value: '表格行入场、分页滑块、校验高度过渡、角标松手清除' },
    { label: '移动端', value: 'AppShell 上滑隐藏导航、长按震动与按压阴影统一' },
    { label: '组件', value: '新增 AppList、AppHint、AppPinInput；AppPanel 增加 tip / soft / plain' },
    { label: '布局', value: 'PageHeader 支持居中与左右图标插槽；文档翻页顺序自动派生' },
    { label: '实验场', value: '标签式单编辑器、可拖拽分栏、视口切换与全屏预览' },
    { label: '文档', value: 'API 表格加宽、工具函数拆分、首页与路线图重写' }
]
</script>

<style>
.doc_hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding: 34px;
    border: 1px solid var(--wa_color_border);
    border-radius: var(--wa_radius_card);
    background:
        radial-gradient(110% 130% at 100% 0%, var(--wa_color_soft), transparent 58%),
        var(--wa_color_surface);
}

.doc_hero_head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 12px;
}

.doc_hero_title {
    font-size: clamp(34px, 6vw, 54px);
    font-weight: 600;
    letter-spacing: -.03em;
    line-height: 1.05;
}

.doc_hero_tag {
    flex: none;
    margin-right: auto;
}

.doc_hero_lead {
    max-width: 780px;
    font-size: 15px;
    line-height: 1.8;
    color: var(--wa_color_text_muted);
}

.doc_actions,
.doc_tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.doc_actions {
    gap: 10px;
}

.doc_hero>* {
    min-width: 0;
}

.doc_home_section {
    display: grid;
    gap: 10px;
}

.doc_home_section_head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
}

.doc_home_section_head .doc_h2 {
    margin-bottom: 0;
}

.doc_home_more {
    font-size: 12px;
    color: var(--wa_color_text_subtle);
    text-decoration: none;
    transition: color var(--wa_duration_fast);
}

.doc_home_more:hover {
    color: var(--wa_color_text);
}

.doc_home_principles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    --wa_color_soft: var(--wa_color_surface);
}

.doc_feature_grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}

.doc_feature_grid>* {
    min-width: 0;
}

.doc_feature_grid .wa_card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.doc_feature_link {
    display: block;
    height: 100%;
    color: inherit;
    text-decoration: none;
}

.doc_feature_link .wa_card {
    border: 1px solid transparent;
}

.doc_feature_arrow {
    color: var(--wa_color_text_faint);
    transition: transform var(--wa_duration_base) var(--wa_ease_spring);
}

.doc_feature_link:hover .doc_feature_arrow {
    transform: translateX(2px);
}

@media (max-width: 860px) {
    .doc_hero {
        padding: 22px;
    }

    .doc_feature_grid,
    .doc_home_principles {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
