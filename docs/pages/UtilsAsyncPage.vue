<template>
    <DocPage title="防抖与节流" description="限制高频函数执行次数，返回的函数都带 cancel()。">
        <h2 class="doc_h2">防抖</h2>
        <p class="doc_text">连续触发时只在停止一段时间后执行一次，适合输入搜索、窗口 resize。</p>
        <AppCode lang="js" :code="debounceCode" />

        <h2 class="doc_h2">节流</h2>
        <p class="doc_text">固定时间间隔最多执行一次，适合滚动、拖拽等持续高频事件。</p>
        <AppCode lang="js" :code="throttleCode" />

        <h2 class="doc_h2">API</h2>
        <ApiTable :rows="rows" />
    </DocPage>
</template>

<script setup>
import { ApiTable, DocPage } from '../components/index.js'

const debounceCode = `import { debounce } from 'wash-ui/utils'

const onSearch = debounce(keyword => {
    fetchResult(keyword)
}, 300)

onSearch('wash')
onSearch.cancel()`

const throttleCode = `import { throttle } from 'wash-ui/utils'

const onScroll = throttle(() => {
    syncPosition()
}, 100)

window.addEventListener('scroll', onScroll)
onScroll.cancel()`

const rows = [
    { name: 'debounce(fn, wait?)', type: 'Function', default: '200', desc: '防抖，返回函数带 cancel()' },
    { name: 'throttle(fn, wait?)', type: 'Function', default: '200', desc: '节流，返回函数带 cancel()' }
]
</script>
