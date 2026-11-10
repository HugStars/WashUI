import { computed, inject, provide } from 'vue'

const CHOICE_GROUP = Symbol('wa_choice_group')

export function provideChoiceGroup(group) {
    provide(CHOICE_GROUP, group)
}

export function useChoiceGroup() {
    return inject(CHOICE_GROUP, null)
}

/**
 * 分组/列表共用的选择状态。
 * multiple=true 时读写数组，multiple=false 时读写标量。
 */
export function createChoiceGroup(props, emit, multiple) {
    const IsBetween = computed(
        () => props.align === 'between' || props.align === 'space-between'
    )

    const Values = computed(
        () => (Array.isArray(props.modelValue) ? props.modelValue : [])
    )

    const Value = computed(() => props.modelValue)

    function toggle(value, checked) {
        if (props.disabled) return

        const current = Values.value
        const next = checked
            ? current.includes(value) ? current : [...current, value]
            : current.filter(item => item !== value)

        emit('update:modelValue', next)
        emit('change', next)
    }

    function select(value) {
        if (props.disabled || value === props.modelValue) return
        emit('update:modelValue', value)
        emit('change', value)
    }

    return {
        IsBetween,
        group: {
            multiple,
            values: Values,
            value: Value,
            disabled: computed(() => props.disabled),
            size: computed(() => props.size),
            labelPosition: computed(() => props.labelPosition),
            variant: computed(() => props.variant || 'default'),
            between: computed(() => props.direction === 'vertical' && IsBetween.value),
            toggle,
            select,
        },
    }
}

/**
 * 单个选项从分组上下文继承的尺寸、标签位置、禁用和两端对齐。
 */
export function useChoiceItemState(props, multiple) {
    const group = useChoiceGroup()

    const Checked = computed(() => {
        if (!group) return Boolean(props.modelValue)
        return multiple
            ? group.values.value.includes(props.value)
            : group.value.value === props.value
    })

    const Disabled = computed(() => Boolean(props.disabled || group?.disabled.value))
    const Size = computed(() => props.size ?? group?.size.value ?? 20)
    const Variant = computed(() => group?.variant?.value || 'default')
    const LabelPosition = computed(
        () => props.labelPosition ?? group?.labelPosition.value ?? 'after'
    )
    const Between = computed(() => Boolean(props.between || group?.between.value))
    const BetweenStyle = computed(() => Between.value
        ? { width: '100%', justifyContent: 'space-between' }
        : undefined)

    return {
        group,
        Checked,
        Disabled,
        Size,
        Variant,
        LabelPosition,
        Between,
        BetweenStyle,
    }
}
