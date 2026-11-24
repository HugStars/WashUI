import { computed, onScopeDispose, ref, watch } from 'vue'

/**
 * 字段提示文本的收起过渡状态
 * @param {() => string} getError 当前错误文本
 * @param {() => string} getHint 当前提示文本
 * @returns {{ Message: import('vue').ComputedRef<boolean>, MessageText: import('vue').Ref<string>, MessageIsError: import('vue').Ref<boolean> }}
 */
export function useFieldMessage(getError, getHint) {
    const Message = computed(() => Boolean(getError() || getHint()))
    const MessageText = ref('')
    const MessageIsError = ref(false)
    let timer = 0

    // * 消息收起时延迟清空文本，让容器高度过渡能完整播放
    watch([getError, getHint], ([error, hint]) => {
        clearTimeout(timer)

        if (error || hint) {
            MessageIsError.value = Boolean(error)
            MessageText.value = error || hint
            return
        }

        timer = setTimeout(() => {
            MessageText.value = ''
        }, 220)
    }, { immediate: true })

    onScopeDispose(() => {
        clearTimeout(timer)
    })

    return { Message, MessageText, MessageIsError }
}
