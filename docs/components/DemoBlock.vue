<template>
    <section class="doc_demo" :class="{ 'is-expanded': expanded }">
        <header v-if="title || description" class="doc_demo_head">
            <h2 v-if="title" class="doc_demo_title">{{ title }}</h2>
            <p v-if="description" class="doc_demo_desc">{{ description }}</p>
        </header>

        <div class="doc_demo_frame">
            <div class="doc_demo_view" :class="{ 'doc_frosted_stage': frosted }">
                <slot />
            </div>

            <div v-if="code" class="doc_demo_code">
                <div class="doc_demo_bar">
                    <button v-if="HasPlayground" type="button" class="doc_demo_toggle" @click="OpenPlayground">
                        <AppIcon name="terminal" :size="13" />
                        <span>推送到实验场</span>
                    </button>
                    <button type="button" class="doc_demo_toggle" :aria-expanded="expanded"
                        @click="expanded = !expanded">
                        <AppIcon name="chevron" :size="13" class="doc_demo_chevron" :class="{ on: expanded }" />
                        <span>{{ expanded ? '收起代码' : '查看代码' }}</span>
                    </button>
                </div>

                <div class="doc_demo_code_body">
                    <div class="doc_demo_code_inner">
                        <AppCode v-if="codeMounted" :code="code" :lang="lang" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { toast } from 'wash-ui'
import { OpenInPlayground } from '../playground-bridge.js'

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    // 不传时由 Vite 插件自动注入默认插槽源码
    code: {
        type: String,
        default: '',
    },
    lang: {
        type: String,
        default: 'html',
    },
    // 是否默认展开代码
    defaultExpanded: {
        type: Boolean,
        default: false,
    },
    // 使用彩色光斑舞台，适合磨砂 / 透明组件的示例
    frosted: {
        type: Boolean,
        default: false,
    },
    /**
     * 实验场入口：
     * - false 时不显示按钮
     * - true 时使用当前示例代码
     * - 字符串时作为自定义 SFC 代码打开
     */
    playground: {
        type: [Boolean, String],
        default: true,
    },
    // 由构建插件自动生成，包含示例代码所需的脚本变量
    playgroundCode: {
        type: String,
        default: '',
    },
})

const expanded = ref(props.defaultExpanded)
// * 首次展开前不挂载代码块，避免未展开的示例也执行语法高亮
// ! 展开过之后不要卸载，否则收起动画和代码内容都会丢
const codeMounted = ref(props.defaultExpanded)
const HasPlayground = computed(() => props.playground !== false)

watch(expanded, value => {
    if (value) codeMounted.value = true
})

function OpenPlayground() {
    const source = typeof props.playground === 'string'
        ? props.playground
        : props.playgroundCode || props.code
    OpenInPlayground(source, {
        onSuccess: () => toast.success('已推送到实验场'),
        onError: error => toast.danger(error?.message || '推送失败'),
    })
}
</script>

<style>
.doc_demo {
    display: grid;
    gap: 10px;
}

.doc_demo+.doc_demo {
    margin-top: 34px;
}

.doc_demo_head {
    display: grid;
    gap: 4px;
}

.doc_demo_title {
    font-size: 15px;
    font-weight: 600;
}

.doc_demo_desc {
    max-width: 72ch;
    font-size: 12.5px;
    line-height: 1.65;
    color: var(--wa_color_text_subtle);
}

.doc_demo_frame {
    overflow: hidden;
    border: 1px solid var(--wa_color_line);
    border-radius: var(--wa_radius_control);
    background: var(--wa_color_canvas);
}

.doc_demo_view {
    --doc_demo_padding: 20px;

    padding: var(--doc_demo_padding);
}

/* doc_frosted_stage 的负 margin 是给页面内包裹层用的，直接放在 view 上要归零 */
.doc_demo_view.doc_frosted_stage {
    margin: 0;
    padding: var(--doc_demo_padding);
    border-radius: 0;
}

.doc_demo_code {
    border-top: 1px solid var(--wa_color_line);
}

.doc_demo_bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 6px 8px;
}

.doc_demo_toggle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border: 0;
    border-radius: var(--wa_radius_pill);
    color: var(--wa_color_text_subtle);
    background: var(--wa_color_field);
    font: inherit;
    font-size: 12px;
    line-height: 1.4;
    cursor: pointer;
    transition: color var(--wa_duration_fast), background var(--wa_duration_fast);
}

.doc_demo_toggle:hover {
    color: var(--wa_color_text);
    background: var(--wa_color_active);
}

.doc_demo_chevron {
    transition: transform var(--wa_duration_fast) var(--wa_ease_out);
}

.doc_demo_chevron.on {
    transform: rotate(90deg);
}

.doc_demo_code_body {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    visibility: hidden;
    transition: grid-template-rows var(--wa_duration_base) var(--wa_ease_out), visibility var(--wa_duration_base);
}

.doc_demo.is-expanded .doc_demo_code_body {
    grid-template-rows: 1fr;
    visibility: visible;
}

.doc_demo_code_inner {
    min-height: 0;
    overflow: hidden;
}

/* 代码块直接铺满分组，不再套一层左右内边距，移动端也有完整宽度 */
.doc_demo_code_inner .wa_code {
    border: 0;
    border-radius: 0;
    background: var(--wa_color_field);
}

@media (max-width: 860px) {

    .doc_demo_view {
        --doc_demo_padding: 16px;
    }
}
</style>
