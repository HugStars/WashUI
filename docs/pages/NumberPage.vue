<template>
    <DocPage category="基础" name="AppNumber" title="数字跳动"
        description="数字变化时的平滑跳动动画，支持千分位、小数位、前后缀与自定义时长。">
        <DemoBlock title="基础" description="value 变化时从当前值跳到新值；首次挂载默认从 0 开始。">
            <div class="doc_number_demo">
                <AppNumber :value="amount" separator class="doc_number_big" />
                <div class="doc_row">
                    <AppButton @click="amount += 100">+100</AppButton>
                    <AppButton variant="line" @click="amount -= 100">-100</AppButton>
                    <AppButton variant="line" @click="amount = Random()">随机</AppButton>
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="时长与小数" description="duration 控制动画时长，decimals 控制显示的小数位。">
            <div class="doc_number_demo">
                <AppNumber :value="ratio" :duration="1600" :decimals="2" class="doc_number_big" />
                <div class="doc_row">
                    <AppButton @click="ratio = 0.8765">0.8765</AppButton>
                    <AppButton variant="line" @click="ratio = 12.3456">12.3456</AppButton>
                </div>
            </div>
        </DemoBlock>

        <DemoBlock title="前缀与后缀" description="prefix 和 suffix 会跟随数字一起渲染。">
            <div class="doc_row">
                <AppNumber :value="price" prefix="¥" :decimals="2" separator :duration="700" />
                <AppNumber :value="percent" suffix="%" :decimals="1" :duration="700" />
            </div>
        </DemoBlock>

        <DemoBlock title="关闭入场动画" description="animate-on-mount=false 时直接显示最终值，不做入场跳动。">
            <AppNumber :value="42" :animate-on-mount="false" />
        </DemoBlock>

        <template #api>
            <ApiTable :rows="propsRows" />
        </template>
    </DocPage>
</template>

<script setup>
import { ref } from 'vue'
import { ApiTable, DemoBlock, DocPage } from '../components/index.js'

const amount = ref(1280)
const ratio = ref(0.8765)
const price = ref(1299)
const percent = ref(68.4)

function Random() {
    return Math.floor(Math.random() * 10000)
}

const propsRows = [
    { name: 'value', type: 'number | string', default: '0', desc: '目标数值，变化时触发跳动' },
    { name: 'from', type: 'number | string', default: '0', desc: '入场动画的起始值' },
    { name: 'duration', type: 'number', default: '900', desc: '动画时长，单位毫秒' },
    { name: 'decimals', type: 'number', default: '0', desc: '保留的小数位' },
    { name: 'separator', type: 'boolean', default: 'false', desc: '是否使用千分位' },
    { name: 'prefix', type: 'string', default: "''", desc: '数字前缀' },
    { name: 'suffix', type: 'string', default: "''", desc: '数字后缀' },
    { name: 'tag', type: 'string', default: 'span', desc: '渲染标签' },
    { name: 'animateOnMount', type: 'boolean', default: 'true', desc: '是否播放入场动画' },
]
</script>

<style>
.doc_number_demo {
    display: grid;
    gap: 12px;
    justify-items: start;
}

.doc_number_big {
    font-size: clamp(30px, 6vw, 44px);
    font-weight: 600;
    letter-spacing: -.02em;
    line-height: 1.1;
}
</style>
