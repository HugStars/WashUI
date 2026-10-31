<template>
    <DocPage category="能力" name="use-clipboard" title="剪贴板"
        description="复制文本，成功后 copied 在默认 1.5 秒后复位；浏览器剪贴板不可用时自动降级。">
        <DemoBlock title="复制" lang="js" :code="clipboardCode">
            <div class="doc_row">
                <AppButton variant="line" @click="copyText">{{ copied ? '已复制' : '复制示例文本' }}</AppButton>
                <code class="doc_code_inline">{{ sampleText }}</code>
            </div>
        </DemoBlock>
        <ApiTable title="选项" :rows="clipboardOptions" />
        <ApiTable title="返回" kind="values" :rows="clipboardRows" />
    </DocPage>
</template>

<script setup>
import { useClipboard } from '@wash/ui'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const sampleText = 'WashUI'
const { copied, copy } = useClipboard()

function copyText() {
    copy(sampleText)
}

const clipboardOptions = [
    { name: 'resetDelay', type: 'number', default: '1500', desc: 'copied 复位毫秒数' },
]

const clipboardRows = [
    { name: 'copied', desc: '是否刚刚复制成功' },
    { name: 'copy(text)', desc: '复制文本，返回 Promise<boolean>' },
]

const clipboardCode = `import { useClipboard } from '@wash/ui'

const { copied, copy } = useClipboard({ resetDelay: 1500 })
const ok = await copy('要复制的文本')`
</script>
