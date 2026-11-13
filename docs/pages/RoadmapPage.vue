<template>
    <DocPage category="指南" name="Roadmap" title="路线图"
        description="以仓库里已经实现的内容为准，记录设计系统、组件、布局、能力与文档的当前状态；计划项会随实现进度移动。">
        <div class="doc_roadmap">
            <AppPanel title="已完成" tone="success">
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">设计基础</p>
                    <p>亮暗主题与跟随系统、CSS 设计变量（颜色 / 圆角 / 间距 / 阴影 / 层级 / 断点）、运行时 configureTokens、统一动画时长与缓动 token、磨砂统一 token、代码高亮独立配色、选中高亮独立变量、reduced-motion 兜底。</p>
                </div>

                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">基础组件</p>
                    <p>AppButton、AppCard、AppCode、AppChip、AppTag、AppBadge、AppTabs、AppStat、AppNumber、AppEmpty、AppList / AppListRow、AppHint、AppThemeToggle。</p>
                </div>

                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">表单</p>
                    <p>AppInput、AppTextarea、AppPinInput、AppSwitch、AppCheck、AppCheckGroup、AppRadio、AppRadioGroup、AppSelect、AppSelectPanel、AppChoiceList、AppCheckPanel、AppRadioPanel、AppCheckMenu、AppUpload。</p>
                </div>

                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">数据与反馈</p>
                    <p>AppTable（排序 / 行选择 / 固定列 / 骨架 / 空状态 / 行入场动画）、AppPagination（页码滑块）、AppPanel（default / tip / soft / plain）、AppPopover、AppDialog、AppTooltip、Toast、Loading、AppSpinner（状态点）、AppSkeleton。</p>
                </div>

                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">图标</p>
                    <p>内置线性图标与 fill 图标、AppIcon 基于 Morphicons 的图标形变、描边 / 弹簧 / 播放速度全局配置、configureIcons 运行时增删改。</p>
                </div>

                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">布局与三端</p>
                    <p>AppShell（PC 侧栏 / 移动底部导航 / safe-area / 手势隐藏导航）、AppDeskShell（桌面窗口壳层）、PageHeader（居中与左右图标插槽）、PageBar、PageTransition、AppRouteBar、AppNavMenu（分组 / 滑块 / hover 动效）。</p>
                </div>

                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">能力</p>
                    <p>useTheme、useClipboard、useRequest、useChoiceGroup、useChoiceSummary、useValidation、createAppRouter、loading / toast / routeLoading、格式化与文本 / 日期 / 并发控制工具函数。</p>
                </div>

                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">文档</p>
                    <p>组件示例与 API 表格、代码高亮与复制、实验场（标签式编辑器 / 可拖拽分栏 / 视口切换 / 全屏预览）、搜索、移动端文档布局、能力总览、设计变量页、工具函数按用途拆分。</p>
                </div>
            </AppPanel>

            <AppPanel title="进行中" tone="warning">
                <ul class="doc_roadmap_list">
                    <li>文档站移动端标题栏、侧边栏与内容间距持续校准</li>
                    <li>动效中断、反向过渡与 reduced-motion 的逐组件回归</li>
                    <li>表单校验的异步规则与跨字段能力设计</li>
                    <li>表格筛选、展开行与更多服务端分页示例</li>
                </ul>
            </AppPanel>

            <AppPanel title="计划" tone="help">
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">表单</p>
                    <p>AppForm / AppFormItem、异步与跨字段校验、DatePicker、TimePicker、Cascader、Transfer、ColorPicker、Rate。</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">数据展示</p>
                    <p>AppTree、AppTreeSelect、AppVirtualList、AppVirtualTable、表格筛选 / 展开行 / 多级表头 / 列宽拖拽。</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">反馈与导航</p>
                    <p>AppDrawer、AppNotification、AppTour、AppMenu、AppDropdown、Command 命令面板。</p>
                </div>
                <div class="doc_roadmap_group">
                    <p class="doc_roadmap_label">工程与质量</p>
                    <p>单元测试覆盖、视觉回归、SSR / Nuxt 适配、i18n、无障碍审计、发布流水线。</p>
                </div>
            </AppPanel>

            <AppPanel title="暂不做" tone="default">
                <ul class="doc_roadmap_list">
                    <li>抖音式整屏上下滑动组件：评估过，交互与视频生命周期成本较高，暂不实现</li>
                    <li>重型日期 / 级联 / 穿梭框：优先使用轻量实现或业务侧组合，避免组件库膨胀</li>
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
