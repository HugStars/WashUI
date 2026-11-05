<template>
    <DocPage category="指南" name="Roadmap" title="路线图"
        description="组件、文档与工程能力的当前状态。状态只反映仓库里已经提交的内容，计划项会随实现进度移动。">
        <div class="doc_roadmap">
            <AppPanel title="已完成" tone="success">
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">基础</p>
                    <p>AppButton（按钮）、AppCard（卡片）、AppCode（代码）、AppChip（标记）、AppTag（标签）、AppTabs（标签页）、AppStat（统计）、AppNumber（数字跳动）、AppEmpty（空状态）、AppThemeToggle（主题切换）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">加载</p>
                    <p>AppSpinner（加载圈）、AppSkeleton（骨架屏）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">表单</p>
                    <p>AppInput（输入框）、AppTextarea（文本域）、AppSwitch（开关）、AppCheck（复选框）、AppCheckGroup（复选框组）、AppRadio（单选框）、AppRadioGroup（单选框组）、AppSelect（下拉框）、AppSelectPanel（下拉面板）、AppChoiceList（选择列表）、AppCheckPanel（多选面板）、AppRadioPanel（单选面板）、AppUpload（上传）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">反馈</p>
                    <p>AppPanel（展示框）、AppPopover（弹出框）、AppDialog（弹框）、AppTooltip（文字提示）、AppCheckMenu（多选菜单）、Toast（轻提示）、Loading（加载）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">数据</p>
                    <p>AppTable（表格）、AppPagination（分页）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">布局与能力</p>
                    <p>AppShell（壳层）、AppRouteBar（路由进度条）、PageTransition（页面过渡）、PageHeader（页面标题）、PageBar（页面操作栏）、useTheme（主题）、useClipboard（剪贴板）、useRequest（请求）、useChoiceGroup（选择组状态）、useChoiceSummary（选择摘要）、useValidation（校验规则）、createAppRouter（路由工厂，导航栈策略）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">文档与适配</p>
                    <p>表单 rule 校验示例、移动端标题栏与页面操作栏、组件状态表</p>
                </div>
            </AppPanel>

            <AppPanel title="进行中" tone="warning">
                <ul class="doc_roadmap_list">
                    <li>文档站移动端标题栏、侧边栏与内容间距持续校准</li>
                    <li>动效中断、反向过渡、reduced-motion 持续校准</li>
                    <li>表单校验的异步规则与跨字段能力设计</li>
                </ul>
            </AppPanel>

            <AppPanel title="计划中" tone="help">
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">表单</p>
                    <p>AppForm / AppFormItem（表单 / 表单项）、异步与跨字段校验、Slider（滑块）、Rate（评分）、ColorPicker（颜色选择）、DatePicker（日期选择）、TimePicker（时间选择）、Cascader（级联选择）、Transfer（穿梭框）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">数据展示</p>
                    <p>AppTree（树）、AppTreeSelect（树选择）、AppVirtualList（虚拟列表）、AppVirtualTable（虚拟表格）、表格筛选 / 展开行 / 多级表头 / 列宽拖拽</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">反馈与导航</p>
                    <p>AppDrawer（抽屉）、AppNotification（通知）、AppTour（漫游引导）、AppMenu（菜单）、AppDropdown（下拉菜单）、Command（命令面板）</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">工程与质量</p>
                    <p>单元测试、视觉回归、SSR / Nuxt 适配、i18n、完整无障碍审计、发布流水线</p>
                </div>
            </AppPanel>

            <AppPanel title="本期 TODO" tone="default">
                <ul class="doc_roadmap_list">
                    <li>检查所有组件的 reduced-motion 与按压反馈</li>
                    <li>为 PageBar 补充按钮组、筛选器等更多插槽示例与移动端回归</li>
                    <li>为 AppChoiceList 补充更多面板示例与自定义触发器示例</li>
                    <li>为 AppRadio / AppRadioGroup 增加尺寸、禁用和自定义插槽的浏览器回归</li>
                    <li>为表单 rule 增加异步校验与跨字段校验示例</li>
                    <li>整理 README 的组件状态表，保持与 Roadmap 同步</li>
                    <li>形成正式的版本迁移指南</li>
                </ul>
            </AppPanel>
        </div>
    </DocPage>
</template>

<script setup>
import { DocPage } from '../components/index.js'
</script>

<style>
.doc_roadmap {
    display: grid;
    gap: 16px;
}

.doc_roadmap_group {
    display: grid;
    gap: 4px;
}

.doc_roadmap_group + .doc_roadmap_group {
    margin-top: 12px;
}

.doc_roadmap_label {
    font-size: 12px;
    font-weight: 600;
    color: var(--wa_color_text_muted);
}

.doc_roadmap_list {
    display: grid;
    gap: 6px;
    margin: 0;
    padding-left: 18px;
    color: var(--wa_color_text_muted);
}
</style>
