<template>
    <DocPage category="布局" name="PageTransition" title="页面过渡" description="路由切换的 out-in 过渡，先卸载旧页面，再挂载新页面。">
        <h2 class="doc_h2">基本用法</h2>
        <pre class="doc_pre"><code>{{ baseCode }}</code></pre>

        <h2 class="doc_h2">要求</h2>
        <ul class="doc_list">
            <li>页面组件必须是单根元素，否则过渡不会生效。</li>
            <li>页面有多块内容时，用一个元素包住。</li>
            <li>模式固定为 out-in，标题栏不要放进被包裹的页面组件。</li>
        </ul>

        <h2 class="doc_h2">过渡类名</h2>
        <ApiTable kind="values" :rows="classRows" />

        <template #api>
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DocPage } from '../components/index.js'

const classRows = [
    { name: 'wa_page_enter_active', desc: '进入过渡的激活类' },
    { name: 'wa_page_enter_from', desc: '进入起始状态' },
    { name: 'wa_page_leave_active', desc: '离开过渡的激活类' },
    { name: 'wa_page_leave_to', desc: '离开结束状态' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '页面组件，必须是单根元素' },
]

const baseCode = `<RouterView v-slot="{ Component }">
    <PageTransition>
        <component :is="Component" />
    </PageTransition>
</RouterView>`
</script>
