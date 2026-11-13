<template>
    <DocPage category="基础" name="AppList" title="列表"
        description="label / value 列表，支持横线分割、label 在上或在左、圆角分组与选中态；选中行相邻的分割线会自动隐藏。">
        <DemoBlock title="基础" description="AppList 负责分割线，AppListRow 负责一行内容；label 默认在左、value 靠右。">
            <AppList class="doc_list_card">
                <AppListRow label="项目名称" value="WashUI" />
                <AppListRow label="版本" value="0.2.2" />
                <AppListRow label="许可证" value="MIT" />
            </AppList>
        </DemoBlock>

        <DemoBlock title="label 在上" description="label-position=top 时整行改为纵向；responsive 则是 PC 保持左右、移动端自动切换为上下。">
            <AppList class="doc_list_card">
                <AppListRow label="当前版本" value="0.2.2" label-position="top" />
                <AppListRow label="更新时间" value="2026-11-13 13:00" label-position="top" />
                <AppListRow label="更新内容" value="组件动效与文档更新" label-position="top" />
            </AppList>
        </DemoBlock>

        <DemoBlock title="可点击与选中" description="clickable 渲染为按钮；selected 显示选中底色，并隐藏相邻的分割线。">
            <AppList variant="group" class="doc_list_card">
                <AppListRow v-for="item in items" :key="item.value" :label="item.label" :value="item.value"
                    clickable :selected="active === item.value" arrow @click="active = item.value" />
            </AppList>
            <p class="wa_hint doc_gap">当前：{{ active }}</p>
        </DemoBlock>

        <DemoBlock title="内缩分割线" description="inset 让分割线左右内缩，贴近地图类 App 的设置列表。">
            <AppList inset class="doc_list_card">
                <AppListRow label="账号与安全" value="已绑定" />
                <AppListRow label="通知" value="全部开启" />
                <AppListRow label="存储空间" value="1.2 GB" />
            </AppList>
        </DemoBlock>

        <template #api>
            <ApiTable title="AppList" :rows="listRows" />
            <ApiTable title="AppListRow" :rows="rowRows" />
            <ApiTable title="AppListRow 插槽" kind="slots" :rows="slotRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const active = ref('wechat')

const items = [
    { label: '微信通知', value: 'wechat' },
    { label: '邮件通知', value: 'email' },
    { label: '短信通知', value: 'sms' },
]

const listRows = [
    { name: 'variant', type: 'plain | group', default: 'plain', desc: 'group 为圆角卡片分组，外层 overflow 裁切首尾行' },
    { name: 'divided', type: 'boolean', default: 'true', desc: '显示行间分割线' },
    { name: 'inset', type: 'boolean', default: 'false', desc: '分割线左右内缩 14px' },
]

const rowRows = [
    { name: 'label', type: 'string', default: "''", desc: '左侧标签' },
    { name: 'value', type: 'string | number', default: "''", desc: '右侧内容' },
    { name: 'labelPosition', type: 'left | top | responsive', default: 'left', desc: '标签在左、在上，或 responsive：PC 在左、移动端自动在上' },
    { name: 'clickable', type: 'boolean', default: 'false', desc: '渲染为按钮并触发 click' },
    { name: 'arrow', type: 'boolean', default: 'false', desc: '右侧显示进入箭头' },
    { name: 'selected', type: 'boolean', default: 'false', desc: '选中态；相邻分割线自动透明' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用行交互' },
]

const slotRows = [
    { name: 'default', type: '—', desc: '自定义右侧内容，替代 value' },
    { name: 'label', type: '—', desc: '自定义左侧标签' },
    { name: 'icon', type: '—', desc: '标签左侧图标' },
    { name: 'suffix', type: '—', desc: '最右侧附加内容' },
]
</script>

<style>
.doc_list_card {
    max-width: 420px;
}
</style>
