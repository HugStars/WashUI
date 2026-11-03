<template>
    <DocPage category="能力" name="use-request" title="请求"
        description="管理加载、错误与取消。再次 run 会取消上一次请求，组件卸载时自动取消。">
        <DemoBlock title="分页请求" lang="js" :code="requestCode">
            <div class="doc_row">
                <AppButton variant="primary" :loading="loading" @click="nextPage">加载下一页</AppButton>
                <AppButton variant="line" :disabled="!loading" @click="cancel">取消</AppButton>
                <AppButton variant="line" @click="run({ page: 1, fail: true })">触发错误</AppButton>
                <AppButton variant="line" @click="reset">重置</AppButton>
            </div>

            <p v-if="error" class="doc_error">{{ error.message }}</p>

            <div class="doc_stack doc_gap">
                <template v-if="loading">
                    <div v-for="n in 5" :key="n" class="doc_kv_row">
                        <AppSkeleton :width="120" :height="22" />
                        <AppSkeleton :width="64" :height="22" />
                    </div>
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
import { formatBytes, toast, useRequest } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'
import { fetchItems } from '../api/mock.js'

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

function nextPage() {
    run({ page: data.value.page + 1 })
}

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
