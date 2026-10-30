<template>
    <DocPage category="反馈" name="toast" title="Toast" description="全局轻提示服务，内容通过 textContent 写入，不解析 HTML。">
        <DemoBlock title="基础类型" description="默认 2200ms 自动关闭。" lang="js" :code="typeCode">
            <div class="doc_row">
                <AppButton @click="toast('普通提示')">普通</AppButton>
                <AppButton @click="toast.success('已保存')">成功</AppButton>
                <AppButton @click="toast.warning('请注意')">警告</AppButton>
                <AppButton @click="toast.help('使用说明')">帮助</AppButton>
                <AppButton variant="danger" @click="toast.danger('请求失败')">失败</AppButton>
            </div>
        </DemoBlock>

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
import { toast } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

let timer = null

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
    { name: 'toast.loading(text)', desc: '常驻加载提示，返回 update / close' },
    { name: 'toast.clear()', desc: '关闭全部提示' },
]

const optionRows = [
    { name: 'type', type: 'default | success | warning | help | danger | loading', default: "''", desc: '类型' },
    { name: 'duration', type: 'number', default: '2200', desc: '自动关闭毫秒数，0 不自动关闭' },
    { name: 'persistent', type: 'boolean', default: 'false', desc: '常驻提示' },
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

const taskCode = `const task = toast.loading('处理中...')
task.update('success', '处理完成')
task.close()

toast('常驻提示', { persistent: true })
toast('三秒后关闭', { duration: 3000 })
toast.clear()`
</script>
