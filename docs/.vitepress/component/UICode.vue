<template>
    <div class="ui_code">
        <ClientOnly>

            <slot></slot>

            <section class="code_box" ref="codeRef">
                <p :class="['look_code', code_status && 'active']" @click="code_status = !code_status">
                    {{ code_status ? '收起代码' : '查看代码' }}
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M508.893248 762.931659a65.039498 65.039498 0 0 1-46.420659-19.485839L97.125746 371.004022c-25.143018-25.634319-24.752868-66.816849 0.881451-91.959868 25.648769-25.164693 66.809624-24.745643 91.959867 0.881451l318.933409 325.125238 318.933408-325.125238a65.025048 65.025048 0 0 1 92.841318 91.078417L555.313907 743.44582a65.025048 65.025048 0 0 1-46.420659 19.485839z"
                            fill="currentColor"></path>
                    </svg>
                </p>
                <transition @beforeEnter="handleBeforeEnter" @enter="handleEnter" @leave="handleLeave">
                    <slot name="code" v-if="code_status"></slot>
                </transition>
            </section>
        </ClientOnly>
    </div>
</template>

<script setup>
import { ref } from 'vue'

let code_status = ref(false)


function handleBeforeEnter(el) {
    el.style.height = 0
    el.style['overflow-y'] = 'hidden'
}

function handleEnter(el) {
    el.style.height = 'auto'
    const h = el.clientHeight
    el.style.height = 0
    el.style.opacity = 0
    requestAnimationFrame(() => {
        el.style.height = h + 'px'
        el.style.transition = '.2s'
        el.style.opacity = 1
    })
}

function handleLeave(el, done) {
    requestAnimationFrame(() => {
        el.style.height = 0
        el.style.opacity = 0
        el.style.padding = 0
        el.style.transition = 'all .2s ease-in-out'
        el.style['margin-top'] = '-16px'
    })
}


</script>


<style lang="scss">
.ui_code {
    .look_code {
        line-height: 40px;
        background: var(--vp-code-block-bg);
        padding: 0 15px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        user-select: none;

        &.active {
            svg {
                transform: rotate(180deg);
            }
        }

        svg {
            width: 16px;
            height: 16px;
            float: right;
            margin-top: 12px;
            transition: transform 0.3s;
        }
    }
}
</style>