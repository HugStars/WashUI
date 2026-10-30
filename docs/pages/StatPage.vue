<template>
    <DocPage category="基础" name="AppStat" title="统计" description="紧凑的指标展示，适合卡片、弹框与数据概览。">
        <DemoBlock title="基础" description="label 与 value 都是可选属性。">
            <div class="doc_grid">
                <AppStat label="请求数" :value="12345" />
                <AppStat label="耗时" value="1.2 s" />
                <AppStat label="体积" value="1.5 MB" />
                <AppStat label="状态" value="正常" />
            </div>
        </DemoBlock>

        <DemoBlock title="自定义内容" description="label 与默认插槽都可以覆盖。">
            <div class="doc_grid">
                <AppStat>
                    <template #label>
                        <AppIcon name="speed" :size="12" />
                        平均速度
                    </template>
                    <span>8.4 MB/s</span>
                </AppStat>
                <AppStat label="在线节点" value="24 / 24" />
            </div>
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
            <ApiTable title="插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const propsRows = [
    { name: 'label', type: 'string', default: "''", desc: '标签文案' },
    { name: 'value', type: 'string | number', default: "''", desc: '指标值' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '指标值内容' },
    { name: 'label', type: '—', desc: '标签内容' },
]
</script>
