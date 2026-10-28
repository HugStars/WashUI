<template>
    <span ref="TriggerEl" class="wa_popover_trigger" @click="OnTriggerClick">
        <slot name="trigger" :open="Visible" :toggle="Toggle" />
    </span>

    <Teleport to="body">
        <Transition enter-active-class="wa_popover_enter_active" leave-active-class="wa_popover_leave_active"
            enter-from-class="wa_popover_enter_from" leave-to-class="wa_popover_leave_to" @after-leave="OnAfterLeave">
            <div v-if="Visible" ref="PanelEl" class="wa_popover_panel" :style="PanelStyle" :role="role"
                :aria-label="ariaLabel" tabindex="-1">
                <slot :close="Close" />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    placement: {
        type: String,
        default: 'top',
    },
    offset: {
        type: Number,
        default: 8,
    },
    width: {
        type: [Number, String],
        default: 220,
    },
    matchTrigger: Boolean,
    role: {
        type: String,
        default: 'dialog',
    },
    ariaLabel: {
        type: String,
        default: '弹出内容',
    },
    disabled: Boolean,
    closeOnOutside: {
        type: Boolean,
        default: true,
    },
    closeOnEsc: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['update:open', 'open', 'close'])

const Visible = ref(props.open)
const TriggerEl = ref(null)
const PanelEl = ref(null)
const PanelStyle = ref({
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    visibility: 'hidden',
})

let Listening = false

function TriggerRect() {
    const el = TriggerEl.value
    if (!el) return null
    return el.firstElementChild?.getBoundingClientRect() || el.getBoundingClientRect()
}

function Position() {
    const rect = TriggerRect()
    const panel = PanelEl.value
    if (!rect || !panel) return

    if (props.matchTrigger) {
        const nextWidth = `${rect.width}px`
        if (PanelStyle.value.width !== nextWidth) {
            PanelStyle.value = { ...PanelStyle.value, width: nextWidth, visibility: 'hidden' }
            nextTick(Position)
            return
        }
    }

    const width = panel.offsetWidth
    const height = panel.offsetHeight
    const edge = 12
    const gap = props.offset
    let placement = props.placement
    let left = 0
    let top = 0

    if (placement === 'top' && rect.top - height - gap < edge) placement = 'bottom'
    else if (placement === 'bottom' && rect.bottom + height + gap > window.innerHeight - edge) placement = 'top'

    if (placement === 'bottom') {
        left = rect.left + rect.width / 2 - width / 2
        top = rect.bottom + gap
    } else if (placement === 'left') {
        left = rect.left - width - gap
        top = rect.top + rect.height / 2 - height / 2
    } else if (placement === 'right') {
        left = rect.right + gap
        top = rect.top + rect.height / 2 - height / 2
    } else {
        left = rect.left + rect.width / 2 - width / 2
        top = rect.top - height - gap
    }

    left = Math.min(Math.max(edge, left), Math.max(edge, window.innerWidth - width - edge))
    top = Math.min(Math.max(edge, top), Math.max(edge, window.innerHeight - height - edge))

    PanelStyle.value = {
        ...PanelStyle.value,
        left: `${left}px`,
        top: `${top}px`,
        visibility: 'visible',
    }
}

function Listen() {
    if (Listening) return
    Listening = true
    window.addEventListener('resize', Position)
    window.addEventListener('scroll', Position, true)
    document.addEventListener('pointerdown', OnPointerDown, true)
    document.addEventListener('keydown', OnKeydown)
}

function Unlisten() {
    if (!Listening) return
    Listening = false
    window.removeEventListener('resize', Position)
    window.removeEventListener('scroll', Position, true)
    document.removeEventListener('pointerdown', OnPointerDown, true)
    document.removeEventListener('keydown', OnKeydown)
}

function OnPointerDown(event) {
    if (!props.closeOnOutside) return
    if (TriggerEl.value?.contains(event.target) || PanelEl.value?.contains(event.target)) return
    Close()
}

function OnKeydown(event) {
    if (event.key !== 'Escape' || !props.closeOnEsc) return
    event.preventDefault()
    Close()
}

function Open() {
    if (Visible.value || props.disabled) return
    if (props.matchTrigger) {
        const rect = TriggerRect()
        if (rect) PanelStyle.value = { ...PanelStyle.value, width: `${rect.width}px` }
    }
    Visible.value = true
    emit('update:open', true)
    emit('open')
    nextTick(() => {
        Position()
        Listen()
    })
}

function Close() {
    if (!Visible.value) return
    Visible.value = false
    emit('update:open', false)
    emit('close')
    Unlisten()
}

function Toggle() {
    if (Visible.value) Close()
    else Open()
}

function OnTriggerClick() {
    if (props.disabled) return
    Toggle()
}

function OnAfterLeave() {
    Unlisten()
    PanelStyle.value = { ...PanelStyle.value, visibility: 'hidden' }
}

watch(() => props.open, value => {
    if (value === Visible.value) return
    if (value) Open()
    else Close()
})

watch(() => props.placement, () => {
    if (Visible.value) nextTick(Position)
})

onMounted(() => {
    if (!Visible.value) return
    nextTick(() => {
        Position()
        Listen()
    })
})

onUnmounted(Unlisten)
</script>
