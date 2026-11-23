<template>
    <DocPage title="设计变量" description="颜色、圆角、阴影、层级与断点全部通过 --wa_ 前缀的 CSS 变量和 tokens.js 暴露。">
        <h2 class="doc_h2">颜色</h2>
        <div class="doc_tokens">
            <div v-for="token in colors" :key="token" class="doc_token">
                <span class="doc_swatch" :style="{ background: `var(${token})` }"></span>
                <code>{{ token }}</code>
            </div>
        </div>

        <h2 class="doc_h2">尺寸与动效</h2>
        <ApiTable kind="values" :rows="shapeRows" />

        <h2 class="doc_h2">层级</h2>
        <ApiTable kind="values" :rows="zRows" />

        <h2 class="doc_h2">JS Tokens</h2>
        <AppCode :code="tokenCode" lang="js" />

        <h2 class="doc_h2">命名规范</h2>
        <ul class="doc_list">
            <li>CSS 类名、CSS 变量与动画名使用下划线拼接，统一 wa_ 前缀。</li>
            <li>状态类统一使用 .on，例如 .wa_nav_item.on、.wa_chip.on。</li>
            <li>组件样式只引用变量和修饰类，不使用 !important。</li>
            <li>主题通过 [data-theme='dark'] 覆盖变量，不覆盖组件规则。</li>
        </ul>

        <h2 class="doc_h2">自定义</h2>
        <AppCode :code="overrideCode" lang="css" />
    </DocPage>
</template>

<script setup>
import { ApiTable, DocPage } from '../components/index.js'

const colors = [
    '--wa_color_canvas',
    '--wa_color_surface',
    '--wa_color_dialog',
    '--wa_color_text',
    '--wa_color_text_muted',
    '--wa_color_text_subtle',
    '--wa_color_text_faint',
    '--wa_color_on_text',
    '--wa_color_glass',
    '--wa_color_border',
    '--wa_color_soft',
    '--wa_color_hover',
    '--wa_color_active',
    '--wa_color_field',
    '--wa_color_line',
    '--wa_color_line_strong',
    '--wa_color_accent',
    '--wa_color_on_accent',
    '--wa_color_accent_soft',
    '--wa_color_accent_text',
    '--wa_color_success',
    '--wa_color_success_soft',
    '--wa_color_success_text',
    '--wa_color_warning',
    '--wa_color_warning_soft',
    '--wa_color_warning_text',
    '--wa_color_help',
    '--wa_color_help_soft',
    '--wa_color_help_text',
    '--wa_color_danger',
    '--wa_color_danger_soft',
    '--wa_color_danger_text',
    '--wa_color_neutral',
    '--wa_color_neutral_soft',
    '--wa_color_neutral_text',
    '--wa_color_nav_active',
    '--wa_color_on_nav_active',
]

const shapeRows = [
    { name: '--wa_radius_card', desc: '卡片圆角，默认 24px' },
    { name: '--wa_radius_popover', desc: '内容块 / 弹出层圆角，默认 16px' },
    { name: '--wa_radius_control', desc: '控件圆角，默认 8px' },
    { name: '--wa_radius_small', desc: '控件圆角别名，等同 8px' },
    { name: '--wa_radius_sm', desc: '小标记 / 行内代码圆角，默认 6px' },
    { name: '--wa_radius_dialog', desc: '弹框圆角，默认 24px' },
    { name: '--wa_radius_pill', desc: '胶囊圆角' },
    { name: '--wa_popover_padding', desc: '弹出层内边距，默认 8px' },
    { name: '--wa_space_1', desc: '间距 4px' },
    { name: '--wa_space_2', desc: '间距 8px' },
    { name: '--wa_space_3', desc: '间距 12px' },
    { name: '--wa_control_height', desc: '控件高度，默认 40px' },
    { name: '--wa_control_height_sm', desc: '小控件高度，默认 32px' },
    { name: '--wa_size_control_md', desc: '控件高度别名，等同 --wa_control_height' },
    { name: '--wa_size_control_sm', desc: '小控件高度别名，等同 --wa_control_height_sm' },
    { name: '--wa_size_check_sm', desc: '小复选框 16px' },
    { name: '--wa_size_check_md', desc: '复选框 20px' },
    { name: '--wa_size_tag_sm', desc: '标签高度 22px' },
    { name: '--wa_size_tag_md', desc: '标签高度 27px' },
    { name: '--wa_size_badge_sm', desc: '角标 16px' },
    { name: '--wa_size_badge_md', desc: '角标 20px' },
    { name: '--wa_size_icon_btn_sm', desc: '图标按钮 28px' },
    { name: '--wa_size_icon_btn_md', desc: '图标按钮 32px' },
    { name: '--wa_size_list_row', desc: '列表行最小高度 44px' },
    { name: '--wa_size_empty', desc: '空状态高度 420px' },
    { name: '--wa_size_empty_compact', desc: '紧凑空状态 180px' },
    { name: '--wa_font_size_2xs', desc: '10px' },
    { name: '--wa_font_size_xs', desc: '11px' },
    { name: '--wa_font_size_sm', desc: '12px' },
    { name: '--wa_font_size_base', desc: '13px' },
    { name: '--wa_font_size_md', desc: '14px' },
    { name: '--wa_font_size_lg', desc: '15px' },
    { name: '--wa_font_size_xl', desc: '18px' },
    { name: '--wa_font_size_2xl', desc: '22px' },
    { name: '--wa_space_4', desc: '16px' },
    { name: '--wa_space_5', desc: '20px' },
    { name: '--wa_space_6', desc: '24px' },
    { name: '--wa_blur', desc: '磨砂模糊半径，默认 10px' },
    { name: '--wa_shadow_nav', desc: '导航阴影' },
    { name: '--wa_shadow_dialog', desc: '弹框阴影' },
    { name: '--wa_shadow_toast', desc: 'Toast 阴影' },
    { name: '--wa_duration_fast', desc: '快速动效时长' },
    { name: '--wa_duration_base', desc: '基础动效时长' },
    { name: '--wa_ease_out', desc: '缓出曲线' },
    { name: '--wa_ease_spring', desc: '带轻微回弹的缓出曲线' },
    { name: '--wa_body_width', desc: '页面最大宽度' },
    { name: '--wa_font_family', desc: '正文字体' },
    { name: '--wa_font_mono', desc: '等宽字体' },
]

const zRows = [
    { name: '--wa_z_header', desc: '顶部栏' },
    { name: '--wa_z_nav', desc: '导航' },
    { name: '--wa_z_popover', desc: '弹出框' },
    { name: '--wa_z_dialog', desc: '弹框' },
    { name: '--wa_z_toast', desc: 'Toast' },
    { name: '--wa_z_route', desc: '路由进度条' },
]

const tokenCode = `import { chartColors, breakpoints, zIndex } from 'wash-ui/tokens.js'

chartColors.accent
breakpoints.mobile
zIndex.dialog`

const overrideCode = `:root {
    --wa_color_accent: #6366f1;
    --wa_radius_card: 20px;
}

[data-theme='dark'] {
    --wa_color_canvas: #101012;
}`
</script>
