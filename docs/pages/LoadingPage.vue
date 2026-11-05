<template>
    <DocPage category="服务" name="loading" title="加载"
        description="全局加载遮罩服务，支持多任务 id、优先级、实时更新文字与自定义图标，全局只维护一个实例。遮罩支持渐变与磨砂等运行时配置，演示中可通过页面底部控制栏更新、切换或关闭。">
        <DemoBlock title="基础" description="show 显示，hide 关闭；同一时间只显示优先级最高的任务。" :code="basicCode" lang="js">
            <div class="doc_row">
                <AppButton @click="ShowBasic">显示加载</AppButton>
                <AppButton variant="line" @click="HideBasic">关闭加载</AppButton>
            </div>
        </DemoBlock>

        <DemoBlock title="更新文字" description="update 可以更新指定 id 的文案、图标与优先级。" :code="updateCode" lang="js">
            <div class="doc_row">
                <AppButton @click="ShowUpdate">开始任务</AppButton>
                <AppButton variant="line" @click="UpdateText">更新文案</AppButton>
                <AppButton variant="line" @click="HideUpdate">结束任务</AppButton>
            </div>
        </DemoBlock>

        <DemoBlock title="多任务与优先级" description="高优先级覆盖低优先级；关闭高优先级后自动回退到低优先级。" :code="priorityCode" lang="js">
            <div class="doc_row">
                <AppButton @click="ShowLow">低优先级</AppButton>
                <AppButton variant="line" @click="ShowHigh">高优先级</AppButton>
                <AppButton variant="line" @click="HideHigh">关闭高优先级</AppButton>
                <AppButton variant="line" @click="HideLow">关闭低优先级</AppButton>
            </div>
            <p class="wa_hint doc_gap">当前：{{ info }}</p>
        </DemoBlock>

        <DemoBlock title="自定义图标" description="icon 使用内置图标名，spin 控制图标是否旋转；不传 icon 时显示默认圆环。" :code="iconCode" lang="js">
            <div class="doc_row">
                <AppButton @click="ShowRefresh">旋转图标</AppButton>
                <AppButton variant="line" @click="ShowDatabase">数据库图标</AppButton>
                <AppButton variant="line" @click="HideIcons">关闭图标加载</AppButton>
            </div>
        </DemoBlock>

        <h2 class="doc_h2">遮罩外观</h2>
        <p class="doc_text">通过 gradient 开启从顶部透明到底部 #00000059 的渐变背景，通过 blur 设置磨砂模糊半径（px），0 表示关闭。</p>
        <DemoBlock title="磨砂遮罩" description="blur 使用 2px 的磨砂模糊；gradient 仍可用于需要渐变背景的场景。" :code="appearanceCode" lang="js">
            <div class="doc_row">
                <AppButton @click="ShowFrosted">磨砂 2px</AppButton>
                <AppButton variant="line" @click="ShowSolid">纯色遮罩</AppButton>
                <AppButton variant="line" @click="loading.hide('loading-appearance')">关闭加载</AppButton>
            </div>
        </DemoBlock>

        <p class="doc_note doc_gap">多个任务同时存在时，以当前显示的优先级最高任务的配置为准。</p>

        <div v-if="demoActive" class="doc_loading_controls" role="toolbar" aria-label="加载演示控制">
            <span class="doc_loading_controls_label">演示控制</span>
            <AppButton size="sm" @click="DemoUpdate">更新文案</AppButton>
            <AppButton size="sm" variant="line" @click="DemoIcon">切换图标</AppButton>
            <AppButton size="sm" variant="line" @click="DemoClose">关闭当前</AppButton>
            <AppButton size="sm" variant="line" @click="DemoClear">全部关闭</AppButton>
        </div>

        <template #api>
            <ApiTable :rows="methodRows" />
            <ApiTable title="选项" :rows="optionRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { loading } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const info = ref('无加载任务')
const demoActive = ref(false)
const demoStep = ref(0)
const iconIndex = ref(0)

const demoIcons = ['loader', 'database', 'cpu']

const basicCode = `loading.show('save', '加载中...')

loading.hide('save')`

const updateCode = `loading.show('save', '准备中...')

loading.update('save', '正在处理 50%...')

loading.hide('save')`

const priorityCode = `loading.show('sync', '低优先级任务', { priority: 0 })
loading.show('save', '高优先级任务', { priority: 10 })

loading.hide('save')
loading.hide('sync')`

const iconCode = `loading.show('refresh', '正在刷新...', { icon: 'loader' })

loading.show('sync', '同步数据...', {
    icon: 'database',
    spin: false,
})

loading.hide('refresh')
loading.hide('sync')`

const appearanceCode = `loading.show('save', '保存中...', {
    blur: 2,
})

loading.update('save', {
    blur: 0,
})`

function RefreshInfo() {
    const state = loading.state()
    info.value = state.currentDisplayId
        ? `${state.currentDisplayId} · ${state.items.length} 个任务`
        : '无加载任务'
    demoActive.value = state.items.length > 0
}

function ShowBasic() {
    loading.show('loading-demo', '加载中...', {})
    RefreshInfo()
}

function HideBasic() {
    loading.hide('loading-demo')
    RefreshInfo()
}

function ShowUpdate() {
    loading.show('loading-update', '准备中...', {})
    RefreshInfo()
}

function UpdateText() {
    loading.update('loading-update', '正在处理 50%...')
    RefreshInfo()
}

function HideUpdate() {
    loading.hide('loading-update')
    RefreshInfo()
}

function ShowLow() {
    loading.show('task-low', '低优先级任务', { priority: 0 })
    RefreshInfo()
}

function ShowHigh() {
    loading.show('task-high', '高优先级任务', { priority: 10 })
    RefreshInfo()
}

function HideHigh() {
    loading.hide('task-high')
    RefreshInfo()
}

function HideLow() {
    loading.hide('task-low')
    RefreshInfo()
}

function ShowRefresh() {
    loading.show('loading-refresh', '正在刷新...', { icon: 'loader' })
    RefreshInfo()
}

function ShowDatabase() {
    loading.show('loading-database', '同步数据...', { icon: 'database', spin: false })
    RefreshInfo()
}

function HideIcons() {
    loading.hide('loading-refresh')
    loading.hide('loading-database')
    RefreshInfo()
}

function ShowFrosted() {
    loading.show('loading-appearance', '磨砂 2px...', { blur: 2 })
    RefreshInfo()
}

function ShowSolid() {
    loading.show('loading-appearance', '纯色遮罩...', { gradient: false, blur: 0 })
    RefreshInfo()
}

function CurrentId() {
    return loading.state().currentDisplayId
}

function DemoUpdate() {
    const id = CurrentId()
    if (!id) return

    demoStep.value = demoStep.value % 3 + 1
    loading.update(id, `正在处理 ${demoStep.value * 30}%...`)
    RefreshInfo()
}

function DemoIcon() {
    const id = CurrentId()
    if (!id) return

    const icon = demoIcons[iconIndex.value % demoIcons.length]
    iconIndex.value++
    loading.update(id, { icon, spin: icon === 'loader' })
    RefreshInfo()
}

function DemoClose() {
    const id = CurrentId()
    if (id) loading.hide(id)
    RefreshInfo()
}

function DemoClear() {
    loading.clear()
    RefreshInfo()
}

onMounted(RefreshInfo)

onUnmounted(() => {
    loading.hide('loading-demo')
    loading.hide('loading-update')
    loading.hide('task-low')
    loading.hide('task-high')
    loading.hide('loading-refresh')
    loading.hide('loading-database')
    loading.hide('loading-appearance')
})

const methodRows = [
    { name: 'show(id, text?, options?)', type: 'string', default: '—', desc: '显示或更新一个 loading，返回 id' },
    { name: 'update(id, textOrOptions)', type: 'boolean', default: '—', desc: '更新指定 id 的文案、图标、优先级或遮罩外观' },
    { name: 'hide(id)', type: 'boolean', default: '—', desc: '关闭指定 id，不影响其他任务' },
    { name: 'clear()', type: 'boolean', default: '—', desc: '清空全部 loading' },
    { name: 'count()', type: 'number', default: '0', desc: '当前 loading 数量' },
    { name: 'has(id)', type: 'boolean', default: 'false', desc: '判断 id 是否存在' },
    { name: 'state()', type: 'object', default: '—', desc: '调试用状态快照' },
]

const optionRows = [
    { name: 'priority', type: 'number', default: '0', desc: '优先级，越大越优先；同级取最新' },
    { name: 'icon', type: 'string', default: "''", desc: '内置图标名，不传时显示圆环' },
    { name: 'spin', type: 'boolean', default: 'true', desc: '自定义图标是否旋转' },
    { name: 'gradient', type: 'boolean', default: 'false', desc: '使用透明到 #00000059 的渐变背景' },
    { name: 'blur', type: 'number', default: '0', desc: '磨砂模糊半径（px），0 为关闭' },
]
</script>

<style>
.doc_loading_controls {
    position: fixed;
    left: 50%;
    bottom: calc(92px + env(safe-area-inset-bottom));
    z-index: calc(var(--wa_z_toast) + 1);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: max-content;
    max-width: calc(100vw - 24px);
    padding: 6px 8px;
    border: 1px solid var(--wa_color_border);
    border-radius: var(--wa_radius_pill);
    background: var(--wa_color_dialog);
    box-shadow: var(--wa_shadow_nav);
    transform: translateX(-50%);
}

.doc_loading_controls_label {
    padding: 0 4px;
    font-size: 12px;
    color: var(--wa_color_text_subtle);
}

@media (max-width: 640px) {
    .doc_loading_controls {
        bottom: calc(92px + env(safe-area-inset-bottom));
        flex-wrap: nowrap;
        gap: 4px;
        width: calc(100vw - 16px);
        max-width: 420px;
        padding: 4px;
    }

    .doc_loading_controls_label {
        display: none;
    }

    .doc_loading_controls .wa_btn {
        flex: 1 1 0;
        min-width: 0;
        padding-inline: 6px;
        font-size: 12px;
    }
}
</style>
