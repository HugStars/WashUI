import { describe, expect, it, vi } from 'vitest'
import { createChoiceGroup } from '@ui/src/composables/useChoiceGroup.js'

function setup(multiple, modelValue) {
    const emit = vi.fn()
    const props = {
        modelValue,
        disabled: false,
        align: 'between',
        direction: 'vertical',
        size: 18,
        labelPosition: 'before',
    }
    const api = createChoiceGroup(props, emit, multiple)
    return { ...api, props, emit }
}

describe('createChoiceGroup', () => {
    it('adds and removes values in multiple mode', () => {
        const { group, emit } = setup(true, ['a'])

        group.toggle('b', true)
        expect(emit).toHaveBeenCalledWith('update:modelValue', ['a', 'b'])
        expect(emit).toHaveBeenCalledWith('change', ['a', 'b'])

        emit.mockClear()
        group.toggle('a', false)
        expect(emit).toHaveBeenCalledWith('update:modelValue', [])
    })

    it('does not duplicate an existing value', () => {
        const { group, emit } = setup(true, ['a'])
        group.toggle('a', true)
        expect(emit).toHaveBeenCalledWith('update:modelValue', ['a'])
    })

    it('selects a scalar in single mode', () => {
        const { group, emit } = setup(false, 'a')
        group.select('b')
        expect(emit).toHaveBeenCalledWith('update:modelValue', 'b')
        expect(emit).toHaveBeenCalledWith('change', 'b')
    })

    it('ignores selecting the current value', () => {
        const { group, emit } = setup(false, 'a')
        group.select('a')
        expect(emit).not.toHaveBeenCalled()
    })

    it('does nothing while disabled', () => {
        const { group, emit, props } = setup(true, [])
        props.disabled = true

        group.toggle('a', true)
        group.select('a')
        expect(emit).not.toHaveBeenCalled()
    })

    it('exposes layout state to items', () => {
        const { group } = setup(true, ['a'])

        expect(group.multiple).toBe(true)
        expect(group.values.value).toEqual(['a'])
        expect(group.between.value).toBe(true)
        expect(group.size.value).toBe(18)
        expect(group.labelPosition.value).toBe('before')
    })

    it('exposes the segmented variant to items', () => {
        const { group } = setup(false, 'a')
        expect(group.variant.value).toBe('default')

        const segmented = createChoiceGroup({ modelValue: 'a', variant: 'segmented' }, vi.fn(), false)
        expect(segmented.group.variant.value).toBe('segmented')
    })
})
