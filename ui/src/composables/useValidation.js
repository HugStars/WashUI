import { computed, ref, watch } from 'vue'

function IsEmpty(value) {
    if (Array.isArray(value)) return value.length === 0
    return value === '' || value === null || value === undefined
}

function LengthOf(value) {
    if (Array.isArray(value)) return value.length
    return String(value ?? '').length
}

function NormalizeRules(rule) {
    if (!rule) return []
    return Array.isArray(rule) ? rule : [rule]
}

function CheckRule(rule, value) {
    if (rule.required && IsEmpty(value)) {
        return rule.message || '请填写此项'
    }

    if (IsEmpty(value)) return ''

    if (rule.min != null && LengthOf(value) < rule.min) {
        return rule.message || `至少 ${rule.min} 个字符`
    }

    if (rule.max != null && LengthOf(value) > rule.max) {
        return rule.message || `最多 ${rule.max} 个字符`
    }

    if (rule.pattern instanceof RegExp && !rule.pattern.test(String(value))) {
        return rule.message || '格式不正确'
    }

    if (typeof rule.validator === 'function') {
        try {
            const result = rule.validator(value)
            if (result === false) return rule.message || '校验未通过'
            if (typeof result === 'string') return result
            if (result instanceof Error) return result.message || rule.message || '校验未通过'
        } catch (error) {
            return error?.message || rule.message || '校验未通过'
        }
    }

    return ''
}

/**
 * 组件级校验。
 * rule 支持对象或数组：
 * { required, min, max, pattern, validator, message, trigger }
 * trigger 支持 'blur' | 'input' | 'change' 或其数组。
 */
export function useValidation(props, getValue, options = {}) {
    const defaultTrigger = options.defaultTrigger || 'blur'
    const Touched = ref(false)
    const RuleError = ref('')

    const Rules = computed(() => NormalizeRules(props.rule))
    const DisplayError = computed(() => props.error || RuleError.value)

    function Run(trigger, value, force = false) {
        const rules = Rules.value.filter(rule => {
            if (force) return true
            const ruleTrigger = rule.trigger ?? defaultTrigger
            return Array.isArray(ruleTrigger)
                ? ruleTrigger.includes(trigger)
                : ruleTrigger === trigger
        })

        for (const rule of rules) {
            const message = CheckRule(rule, value)
            if (message) {
                RuleError.value = message
                return message
            }
        }

        RuleError.value = ''
        return ''
    }

    function Validate(trigger = defaultTrigger, value = getValue(), force = false) {
        return Run(trigger, value, force)
    }

    function OnBlur(value = getValue()) {
        Touched.value = true
        return Validate('blur', value, true)
    }

    function OnInput(value = getValue()) {
        if (Touched.value) return Validate('input', value, true)
        return Validate('input', value)
    }

    function OnChange(value = getValue()) {
        Touched.value = true
        return Validate('change', value, true)
    }

    function Reset() {
        Touched.value = false
        RuleError.value = ''
    }

    watch(
        () => props.rule,
        () => {
            if (Touched.value) Validate(defaultTrigger, getValue(), true)
        },
        { deep: true }
    )

    return {
        Touched,
        RuleError,
        DisplayError,
        Validate,
        OnBlur,
        OnInput,
        OnChange,
        Reset,
    }
}
