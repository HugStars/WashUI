<template>
    <DocPage category="指南" name="Roadmap" title="路线图"
        description="组件、文档与工程能力的当前状态。状态只反映仓库里已经提交的内容，计划项会随实现进度移动。">
        <div class="doc_roadmap">
            <AppPanel title="已完成" tone="success">
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">基础</p>
                    <p>AppButton、AppCard、AppCode、AppChip、AppTabs、AppStat、AppNumber、AppEmpty、AppThemeToggle</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">加载</p>
                    <p>AppSpinner、AppSkeleton</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">表单</p>
                    <p>AppInput、AppTextarea、AppSwitch、AppCheck、AppCheckGroup、AppRadio、AppRadioGroup、AppSelect、AppSelectPanel、AppChoiceList、AppCheckPanel、AppRadioPanel、AppUpload</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">反馈</p>
                    <p>AppPanel、AppPopover、AppDialog、AppCheckMenu、Toast、Loading</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">布局与能力</p>
                    <p>AppShell、AppRouteBar、PageTransition、PageHeader、useTheme、useClipboard、useRequest、useChoiceGroup、useChoiceSummary、useValidation</p>
                </div>
            </AppPanel>

            <AppPanel title="进行中" tone="warning">
                <ul class="doc_roadmap_list">
                    <li>README 与设计规范重构：设计理念、动效、命名、事件、Props 约定、组件状态表</li>
                    <li>选择类组件 API 收敛：单选框 / 复选框 / 列表 / 面板共享核心</li>
                    <li>文档站补齐：CheckPage、RadioPage、ChoiceListPage、Roadmap</li>
                    <li>动效持续校准：中断、反向过渡、reduced-motion</li>
                </ul>
            </AppPanel>

            <AppPanel title="计划中" tone="help">
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">表单</p>
                    <p>AppForm / AppFormItem、Slider、Rate、ColorPicker、DatePicker、TimePicker、Cascader、Transfer</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">数据展示</p>
                    <p>AppTable、AppTree、AppTreeSelect、AppVirtualList、AppVirtualTable</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">反馈与导航</p>
                    <p>AppDrawer、AppNotification、AppTour、AppTooltip、AppMenu、AppDropdown、Command</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">工程与质量</p>
                    <p>单元测试、视觉回归、SSR / Nuxt 适配、i18n、完整无障碍审计、发布流水线</p>
                </div>
            </AppPanel>

            <AppPanel title="本期 TODO" tone="default">
                <ul class="doc_roadmap_list">
                    <li>检查所有组件的 reduced-motion 与按压反馈</li>
                    <li>补齐 Check / Radio / ChoiceList 的文档与 API 表</li>
                    <li>整理 README 的组件状态表，保持与 Roadmap 同步</li>
                    <li>为 AppChoiceList 补充更多面板示例与自定义触发器示例</li>
                    <li>为 AppRadio / AppRadioGroup 增加尺寸、禁用和自定义插槽的浏览器回归</li>
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
