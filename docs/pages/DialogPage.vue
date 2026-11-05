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

        <DemoBlock title="关闭方式" description="closable、closeOnMask、closeOnEsc、gesture 可以分别关闭。" :code="closeCode">
            <AppButton variant="line" @click="locked = true">仅按钮关闭</AppButton>

            <AppDialog v-model:open="locked" title="仅按钮关闭" :closable="false" :close-on-mask="false"
                :close-on-esc="false" :gesture="false">
                <p>遮罩、Esc、右上角关闭与下拉关闭都已停用。</p>
                <template #footer>
                    <AppButton variant="primary" @click="locked = false">我知道了</AppButton>
                </template>
            </AppDialog>
        </DemoBlock>

        <DemoBlock title="无标题、无关闭按钮"
            description="不传 title，并设置 closable=false 时，不渲染标题栏和右上角关闭按钮；移动端仍可通过下拉关闭。">
            <AppButton variant="line" @click="plainDialog = true">无标题弹框</AppButton>

            <AppDialog v-model:open="plainDialog" :closable="false" aria-label="无标题弹框">
                <p>这个弹框没有标题栏，也没有右上角关闭按钮。</p>
                <template #footer>
                    <AppButton variant="primary" @click="plainDialog = false">关闭</AppButton>
                </template>
            </AppDialog>
        </DemoBlock>

        <DemoBlock title="操作栏位置"
            description="默认 footer-placement=bar，操作栏固定在底部；footer-placement=content 时按钮放进内容区，需要滚动到底部才显示。移动端弹框高度固定，内容区独立滚动。">
            <div class="doc_row">
                <AppButton variant="line" @click="barDialog = true">底部操作栏</AppButton>
                <AppButton variant="line" @click="contentDialog = true">内容内操作</AppButton>
            </div>

            <AppDialog v-model:open="barDialog" title="底部操作栏" footer-placement="bar">
                <div class="doc_dialog_scroll">
                    <p v-for="n in 16" :key="n" class="doc_text">
                        第 {{ n }} 段内容。移动端弹框高度固定，内容区独立滚动；操作栏固定在底部，任何时候都能操作。
                    </p>
                </div>
                <template #footer>
                    <AppButton variant="line" @click="barDialog = false">取消</AppButton>
                    <AppButton variant="primary" @click="barDialog = false">确认</AppButton>
                </template>
            </AppDialog>

            <AppDialog v-model:open="contentDialog" title="内容内操作" footer-placement="content">
                <div class="doc_dialog_scroll">
                    <p v-for="n in 16" :key="n" class="doc_text">
                        第 {{ n }} 段内容。操作栏在内容末尾，需要滚动到底部才能看到取消和确认按钮。
                    </p>
                </div>
                <template #footer>
                    <AppButton variant="line" @click="contentDialog = false">取消</AppButton>
                    <AppButton variant="primary" @click="contentDialog = false">确认</AppButton>
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
const plainDialog = ref(false)
const barDialog = ref(false)
const contentDialog = ref(false)
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
    { name: 'footerPlacement', type: 'bar | content', default: 'bar', desc: '移动端操作栏固定在底部，或放进内容区随内容滚动' },
    { name: 'mobileHeight', type: 'number | string', default: 'min(60vh, 720px)', desc: '移动端弹框高度，数字按 px 处理' },
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
    :closable="false" :close-on-mask="false" :close-on-esc="false" :gesture="false">
    <p>遮罩、Esc、右上角关闭与下拉关闭都已停用。</p>
</AppDialog>`
</script>

<style>
.doc_dialog_scroll {
    display: grid;
    gap: 10px;
}

.doc_dialog_scroll .doc_text {
    margin: 0;
}
</style>
