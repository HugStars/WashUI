<template>
    <DocPage category="反馈" name="AppDialog" title="弹框" description="受控弹框，包含焦点陷阱、Esc 关闭、焦点恢复、背景 inert、滚动锁与移动端下拉关闭。">
        <DemoBlock title="基础" description="必须使用 v-model:open 控制开关。" :code="baseCode">
            <div class="doc_row">
                <AppButton variant="primary" @click="basic = true">基础弹框</AppButton>
                <AppButton variant="line" @click="wide = true">宽弹框</AppButton>
                <AppButton variant="line" @click="form = true">带表单</AppButton>
            </div>
            <p class="wa_hint doc_gap">最近事件：{{ lastEvent }}</p>

            <AppDialog v-model:open="basic" title="接口详情" @close="lastEvent = 'basic close'">
                <p class="wa_hint">默认标题、关闭按钮、Esc 与遮罩点击。</p>
                <AppCode :code="sample" lang="json" :max-height="220" />
                <template #footer>
                    <AppButton variant="line" @click="basic = false">取消</AppButton>
                    <AppButton variant="primary" @click="basic = false">确定</AppButton>
                </template>
            </AppDialog>

            <AppDialog v-model:open="wide" title="宽弹框" :width="960" @close="lastEvent = 'wide close'">
                <p class="wa_hint">width 接受数字（px）或字符串，移动端自动限制为 100%。</p>
                <div class="doc_grid">
                    <AppStat v-for="item in stats" :key="item.label" :label="item.label" :value="item.value" />
                </div>
            </AppDialog>

            <AppDialog v-model:open="form" title="新建配置" @close="lastEvent = 'form close'">
                <div class="doc_grid">
                    <AppInput v-model="draft.name" label="名称" placeholder="例如：生产环境" />
                    <AppInput v-model="draft.endpoint" label="地址" placeholder="https://example.com" />
                </div>
                <template #footer>
                    <AppButton variant="line" @click="form = false">取消</AppButton>
                    <AppButton variant="primary" @click="submit">保存</AppButton>
                </template>
            </AppDialog>
        </DemoBlock>

        <DemoBlock title="关闭方式" description="closable、closeOnMask、closeOnEsc 可以分别关闭。" :code="closeCode">
            <AppButton variant="line" @click="locked = true">仅按钮关闭</AppButton>

            <AppDialog v-model:open="locked" title="仅按钮关闭" :closable="false" :close-on-mask="false" :close-on-esc="false">
                <p>遮罩、Esc 与右上角关闭都已停用。</p>
                <template #footer>
                    <AppButton variant="primary" @click="locked = false">我知道了</AppButton>
                </template>
            </AppDialog>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="事件" kind="events" :rows="eventRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { toast } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const basic = ref(false)
const wide = ref(false)
const form = ref(false)
const locked = ref(false)
const lastEvent = ref('无')
const draft = reactive({ name: '', endpoint: '' })

const sample = `{
    "id": 42,
    "name": "edge-node",
    "status": "active"
}`

const stats = Array.from({ length: 6 }, (_, index) => ({
    label: `指标 ${index + 1}`,
    value: (index + 1) * 100,
}))

function submit() {
    if (!draft.name.trim()) {
        toast.warning('请填写名称')
        return
    }
    form.value = false
    toast.success('配置已保存')
}

const propsRows = [
    { name: 'open', type: 'boolean', default: 'false', desc: '是否打开，配合 v-model:open' },
    { name: 'title', type: 'string', default: "''", desc: '标题' },
    { name: 'ariaLabel', type: 'string', default: "''", desc: '无标题时的无障碍名称' },
    { name: 'describedBy', type: 'string', default: "''", desc: '正文描述元素 id' },
    { name: 'width', type: 'number | string', default: '760', desc: '宽度' },
    { name: 'closable', type: 'boolean', default: 'true', desc: '显示关闭按钮' },
    { name: 'closeOnMask', type: 'boolean', default: 'true', desc: '点击遮罩关闭' },
    { name: 'closeOnEsc', type: 'boolean', default: 'true', desc: 'Esc 关闭' },
    { name: 'gesture', type: 'boolean', default: 'true', desc: '移动端下拉关闭' },
]

const eventRows = [
    { name: 'update:open', type: 'boolean', desc: '请求打开或关闭' },
    { name: 'close', type: '—', desc: '关闭动画结束后触发' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '弹框正文' },
    { name: 'title', type: '—', desc: '自定义标题' },
    { name: 'footer', type: '—', desc: '底部操作区' },
]

const baseCode = `<AppDialog v-model:open="open" title="接口详情">
    <p>内容</p>
    <template #footer>
        <AppButton variant="line" @click="open = false">取消</AppButton>
        <AppButton variant="primary" @click="open = false">确定</AppButton>
    </template>
</AppDialog>`

const closeCode = `<AppDialog v-model:open="open" title="仅按钮关闭"
    :closable="false" :close-on-mask="false" :close-on-esc="false">
    <p>遮罩、Esc 与右上角关闭都已停用。</p>
</AppDialog>`
</script>
