import { computed } from 'vue'

export function useCheckSummary(props) {
    const AllOptions = computed(() => [
        ...(props.groups || []).flatMap(group => group.options || []),
        ...(props.options || []),
    ])

    const Values = computed(() => Array.isArray(props.modelValue) ? props.modelValue : [])

    const SelectedItems = computed(() => {
        const values = Values.value
        return AllOptions.value.filter(item => values.includes(item.value))
    })

    const Summary = computed(() => {
        const selected = SelectedItems.value
        if (!selected.length) return props.placeholder || '请选择'
        if (selected.length === 1) return selected[0].label
        return `${selected[0].label} 等 ${selected.length} 项`
    })

    return { AllOptions, Values, SelectedItems, Summary }
}
