<template>
    <Teleport v-if="Target" :to="Target">
        <div class="wa_page_header" :class="[`wa_page_header_${align}`]">
            <span v-if="$slots['icon-left'] || $slots.icon" class="wa_page_icon wa_page_icon_left">
                <slot name="icon-left">
                    <slot name="icon" />
                </slot>
            </span>

            <h1 v-if="title || $slots.title || $slots.default">
                <slot name="title">
                    <slot>{{ title }}</slot>
                </slot>
            </h1>

            <span v-if="$slots['icon-right']" class="wa_page_icon wa_page_icon_right">
                <slot name="icon-right" />
            </span>

            <div v-if="$slots.center" class="wa_page_center">
                <slot name="center" />
            </div>
            <div v-if="$slots.actions" class="wa_page_actions">
                <slot name="actions" />
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { inject } from 'vue'
import { HEADER_TARGET } from '../core/keys.js'

defineProps({
    title: {
        type: String,
        default: '',
    },
    /**
     * left：标题靠左；center：标题居中，操作仍靠右
     * @type {'left' | 'center'}
     */
    align: {
        type: String,
        default: 'left',
    },
})

const Target = inject(HEADER_TARGET, null)
</script>

<style>
.wa_page_header :focus-visible {
    outline: 2px solid var(--wa_color_accent);
    outline-offset: 2px;
}

.wa_page_header {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.wa_page_header h1 {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
}

.wa_page_icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    color: var(--wa_color_text_muted);
}

.wa_page_center {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
}

.wa_page_actions {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    margin-left: auto;
}

/* * align=center：标题占满剩余空间并居中，左右图标跟随标题 */
.wa_page_header_center h1 {
    flex: 1;
    justify-content: center;
    text-align: center;
}

@media (max-width: 860px) {
    .wa_page_header h1 {
        max-width: 100%;
        overflow: hidden;
        font-size: 18px;
        text-overflow: ellipsis;
    }
}
</style>
