<template>
    <DocPage category="服务" name="toast" title="轻提示"
        description="全局轻提示服务，内容通过 textContent 写入，不解析 HTML。支持类型、常驻、顶部距离与安全区。">
        <DemoBlock title="基础类型" description="默认 2200ms 自动关闭。" lang="js" :code="typeCode">
            <div class="doc_row">
                <AppButton @click="toast('普通提示')">普通</AppButton>
                <AppButton @click="toast.success('已保存')">成功</AppButton>
                <AppButton @click="toast.warning('请注意')">警告</AppButton>
                <AppButton @click="toast.help('使用说明')">帮助</AppButton>
                <AppButton variant="danger" @click="toast.danger('请求失败')">失败</AppButton>
            </div>
        </DemoBlock>

        <DemoBlock title="顶部距离"
            description="默认桌面 22px、移动端 14px，并自动叠加 safe-area-inset-top；可按调用或全局覆盖。" lang="js"
            :code="topCode">
            <div class="doc_row">
                <AppButton @click="toast('距顶部 120px', { top: 120 })">局部 top: 120</AppButton>
                <AppButton variant="line" @click="setGlobalTop">全局 top: 80</AppButton>
                <AppButton variant="line" @click="resetGlobalTop">恢复默认</AppButton>
            </div>
        </DemoBlock>

        <p class="doc_note doc_gap">初始化时也可以通过 createUi({ toast: { top: 80 } }) 设置全局默认。</p>

        <DemoBlock title="加载、更新与清理" description="toast.loading 返回 update 与 close；update 后按默认时长关闭。" lang="js" :code="taskCode">
            <div class="doc_row">
                <AppButton variant="primary" @click="startTask">模拟任务</AppButton>
                <AppButton variant="line" @click="startPersistent">常驻加载</AppButton>
                <AppButton variant="line" @click="toast('常驻提示', { persistent: true })">常驻提示</AppButton>
                <AppButton variant="line" @click="toast.clear()">清空全部</AppButton>
            </div>
        </DemoBlock>

        <h2 class="doc_h2">API</h2>
        <ApiTable kind="values" :rows="methodRows" />
        <ApiTable title="选项" :rows="optionRows" />
        <ApiTable title="loading 返回" kind="values" :rows="loadingRows" />
    </DocPage>
</template>

<script setup>
import { onUnmounted } from 'vue'
import { toast } from 'wash-ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

let timer = null

function setGlobalTop() {
    toast.configure({ top: 80 })
    toast('全局 top 已设为 80px')
}

function resetGlobalTop() {
    toast.clear()
    toast.configure({ top: null })
    toast('已恢复默认 top')
}

function startTask() {
    clearTimeout(timer)
    const task = toast.loading('处理中...')
    timer = setTimeout(() => {
        task.update('success', '处理完成')
    }, 1200)
}

function startPersistent() {
    toast.loading('常驻任务，点击“清空全部”结束')
}

onUnmounted(() => clearTimeout(timer))

const methodRows = [
    { name: "toast(text, options)", desc: '普通提示，返回关闭函数' },
    { name: 'toast.success(text)', desc: '成功提示' },
    { name: 'toast.warning(text)', desc: '警告提示' },
    { name: 'toast.help(text)', desc: '帮助提示' },
    { name: 'toast.danger(text)', desc: '失败提示' },
    { name: 'toast.loading(text, options)', desc: '常驻加载提示，返回 update / close' },
    { name: 'toast.configure({ top })', desc: '全局设置顶部距离；top 传 null 恢复 CSS 默认' },
    { name: 'toast.clear()', desc: '关闭全部提示' },
]

const optionRows = [
    { name: 'type', type: 'default | success | warning | help | danger | loading', default: "''", desc: '类型' },
    { name: 'duration', type: 'number', default: '2200', desc: '自动关闭毫秒数，0 不自动关闭' },
    { name: 'persistent', type: 'boolean', default: 'false', desc: '常驻提示' },
    { name: 'top', type: 'number | string', default: 'CSS 默认', desc: '距顶部距离；数字按 px，自动叠加 safe-area-inset-top' },
]

const loadingRows = [
    { name: 'update(type, text, options)', desc: '更新类型与文案，并按 options 重新计时' },
    { name: 'close()', desc: '立即关闭' },
]

const typeCode = `toast('普通提示')
toast.success('已保存')
toast.warning('请注意')
toast.help('使用说明')
toast.danger('请求失败')`

const topCode = `toast('距顶部 120px', { top: 120 })

toast.configure({ top: 80 })   // 全局默认
toast.configure({ top: null }) // 恢复 CSS 默认

// 初始化时也可以：
// createUi({ toast: { top: 80 } })`

const taskCode = `const task = toast.loading('处理中...')
task.update('success', '处理完成')
task.close()

toast('常驻提示', { persistent: true })
toast('三秒后关闭', { duration: 3000 })
toast.clear()`
</script>
