<template>
    <DocPage title="组合式函数" description="主题、剪贴板与请求状态。全部从主入口导入。">
        <h2 class="doc_h2">useTheme</h2>
        <p class="doc_text">管理亮色、暗色与跟随系统，默认存储键为 wa_theme。</p>
        <DemoBlock title="切换主题" :code="themeCode">
            <div class="doc_row">
                <AppButton :variant="mode === 'light' ? 'primary' : 'line'" @click="setTheme('light')">亮色</AppButton>
                <AppButton :variant="mode === 'dark' ? 'primary' : 'line'" @click="setTheme('dark')">暗色</AppButton>
                <AppButton :variant="mode === 'auto' ? 'primary' : 'line'" @click="setTheme('auto')">跟随系统</AppButton>
            </div>
            <div class="doc_row doc_gap">
                <span class="wa_tag">mode: {{ mode }}</span>
                <span class="wa_tag">theme: {{ theme }}</span>
            </div>
        </DemoBlock>
        <ApiTable title="返回" kind="values" :rows="themeRows" />

        <h2 class="doc_h2">useClipboard</h2>
        <p class="doc_text">复制文本，成功后 copied 在默认 1.5 秒后复位；浏览器剪贴板不可用时自动降级。</p>
        <DemoBlock title="复制" :code="clipboardCode">
            <div class="doc_row">
                <AppButton variant="line" @click="copyText">{{ copied ? '已复制' : '复制示例文本' }}</AppButton>
                <code class="doc_code_inline">{{ sampleText }}</code>
            </div>
        </DemoBlock>
        <ApiTable title="选项" :rows="clipboardOptions" />
        <ApiTable title="返回" kind="values" :rows="clipboardRows" />

        <h2 class="doc_h2">useRequest</h2>
        <p class="doc_text">管理加载、错误与取消。再次 run 会取消上一次请求，组件卸载时自动取消。</p>
        <DemoBlock title="分页请求" :code="requestCode">
            <div class="doc_row">
                <AppButton variant="primary" :loading="loading" @click="nextPage">加载下一页</AppButton>
                <AppButton variant="line" :disabled="!loading" @click="cancel">取消</AppButton>
                <AppButton variant="line" @click="run({ page: 1, fail: true })">触发错误</AppButton>
                <AppButton variant="line" @click="reset">重置</AppButton>
            </div>

            <p v-if="error" class="doc_error">{{ error.message }}</p>

            <div class="doc_stack doc_gap">
                <template v-if="loading">
                    <AppSkeleton v-for="n in 3" :key="n" :height="54" />
                </template>
                <template v-else>
                    <div v-for="item in data.items" :key="item.id" class="doc_kv_row">
                        <span>{{ item.name }}</span>
                        <code>{{ formatBytes(item.size) }}</code>
                    </div>
                </template>
            </div>

            <p v-if="!loading && !error" class="wa_hint doc_gap">第 {{ data.page }} 页，共 {{ data.total }} 条</p>
        </DemoBlock>
        <ApiTable title="选项" :rows="requestOptions" />
        <ApiTable title="返回" kind="values" :rows="requestRows" />
    </DocPage>
</template>

<script setup>
import { formatBytes, toast, useClipboard, useRequest, useTheme } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'
import { fetchItems } from '../api/mock.js'

const { mode, theme, setTheme } = useTheme()
const sampleText = 'WashUI'
const { copied, copy } = useClipboard()

const { data, error, loading, run, cancel, reset } = useRequest(
    (params, { signal }) => fetchItems({ ...params, signal }),
    {
        initialData: { page: 1, total: 0, items: [] },
        immediate: true,
        onError(err) {
            toast.danger(err.message)
        },
    },
)

function copyText() {
    copy(sampleText)
}

function nextPage() {
    run({ page: data.value.page + 1 })
}

const themeRows = [
    { name: 'mode', desc: '当前模式：light / dark / auto' },
    { name: 'theme', desc: '当前实际主题：light / dark' },
    { name: 'setTheme(value)', desc: '设置模式并持久化' },
    { name: 'toggleTheme()', desc: '在亮色与暗色之间切换' },
]

const clipboardOptions = [
    { name: 'resetDelay', type: 'number', default: '1500', desc: 'copied 复位毫秒数' },
]

const clipboardRows = [
    { name: 'copied', desc: '是否刚刚复制成功' },
    { name: 'copy(text)', desc: '复制文本，返回 Promise<boolean>' },
]

const requestOptions = [
    { name: 'initialData', type: 'any', default: 'null', desc: '初始数据' },
    { name: 'immediate', type: 'boolean', default: 'false', desc: '初始化后立即执行' },
    { name: 'onSuccess', type: '(data, params) => void', default: '—', desc: '成功回调' },
    { name: 'onError', type: '(error, params) => void', default: '—', desc: '失败回调' },
]

const requestRows = [
    { name: 'data', desc: '请求结果' },
    { name: 'error', desc: '错误对象，取消不会写入' },
    { name: 'loading', desc: '是否请求中' },
    { name: 'run(params)', desc: '执行请求，自动取消上一次' },
    { name: 'cancel()', desc: '取消当前请求' },
    { name: 'reset()', desc: '取消并恢复初始数据' },
]

const themeCode = `import { useTheme } from '@wash/ui'

const { mode, theme, setTheme, toggleTheme } = useTheme()`

const clipboardCode = `import { useClipboard } from '@wash/ui'

const { copied, copy } = useClipboard({ resetDelay: 1500 })
const ok = await copy('要复制的文本')`

const requestCode = `import { useRequest } from '@wash/ui'

const { data, error, loading, run, cancel, reset } = useRequest(
    (params, { signal }) => fetchItems({ ...params, signal }),
    {
        initialData: { page: 1, total: 0, items: [] },
        immediate: true,
        onError: err => toast.danger(err.message),
    },
)

run({ page: 2 })`
</script>

<style>
.doc_error {
    margin-top: 12px;
    font-size: 13px;
    color: var(--wa_color_danger);
}
</style>
