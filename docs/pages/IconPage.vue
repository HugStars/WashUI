<template>
    <DocPage category="图标" name="AppIcon" title="图标"
        :description="`内置 ${icons.length} 个线性图标，按分类展示，点击可复制组件代码或名称。`">
        <div class="doc_icon_head">
            <h2 class="doc_h2">全部图标</h2>
            <div class="doc_icon_toolbar">
                <AppSwitch v-model="copyComponent" :label="copyComponent ? '复制组件' : '复制名称'" />
            </div>
        </div>

        <section v-for="group in Groups" :key="group.title" class="doc_icon_section">
            <h3 class="doc_h3">{{ group.title }}</h3>
            <div class="doc_icon_grid">
                <button v-for="name in group.icons" :key="name" type="button" class="doc_icon_item"
                    :class="{ copied: copiedName === name }"
                    :title="`点击复制 ${copyComponent ? componentCode(name) : name}`" @click="Copy(name)">
                    <AppIcon :name="name" :size="22" />
                    <span class="doc_icon_name">{{ name }}</span>
                </button>
            </div>
        </section>

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

        <h2 class="doc_h2">全局配置</h2>
        <AppCode :code="configCode" lang="js" />
        <p class="doc_text doc_gap">icons 支持两种配置：数组形式会沿用 strokeWidth、currentColor 等规则；字符串 SVG 会原样渲染，不应用 strokeWidth，尺寸仍由
            size 控制。</p>
        <p class="doc_note doc_gap">运行时也可以调用 configureIcons({ name: 配置 }) 覆盖或新增图标，传 null 可以移除图标。</p>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { iconGroups, iconNames, toast, useClipboard } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const icons = computed(() => iconNames())
const Groups = computed(() => {
    const known = new Set()
    const groups = iconGroups
        .map(group => {
            const names = group.icons.filter(name => icons.value.includes(name))
            names.forEach(name => known.add(name))
            return { title: group.title, icons: names }
        })
        .filter(group => group.icons.length)

    const rest = icons.value.filter(name => !known.has(name))
    if (rest.length) groups.push({ title: '更多', icons: rest })

    return groups
})
const copyComponent = ref(true)
const copiedName = ref('')
const { copy } = useClipboard()

let resetTimer = null

function componentCode(name) {
    return `<AppIcon name="${name}" />`
}

async function Copy(name) {
    const text = copyComponent.value ? componentCode(name) : name
    const ok = await copy(text)

    if (!ok) {
        toast.danger('复制失败')
        return
    }

    copiedName.value = name
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
        copiedName.value = ''
    }, 1200)

    toast.success(`已复制 ${text}`)
}

onUnmounted(() => clearTimeout(resetTimer))

const propsRows = [
    { name: 'name', type: 'string', default: '必填', desc: '图标名，未知名称渲染空图标' },
    { name: 'size', type: 'number | string', default: '20', desc: '宽高，数字自动补 px' },
    { name: 'strokeWidth', type: 'number | string', default: '1.8', desc: '描边宽度' },
]

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
.doc_icon_head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 30px 0 12px;
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

.doc_icon_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    gap: 6px;
    margin-bottom: 14px;
}

.doc_icon_item {
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

.doc_icon_item.copied {
    color: var(--wa_color_accent);
    border-color: var(--wa_color_accent);
}

.doc_icon_name {
    max-width: 100%;
    overflow: hidden;
    font: 11px var(--wa_font_mono);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.doc_icon_sizes {
    display: grid;
    gap: 12px;
    color: var(--wa_color_text);
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
