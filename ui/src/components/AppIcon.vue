<script>
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createMorph } from 'morphicons/dom'
import { getIcon } from '../core/icons.js'

function toSize(value) {
    return typeof value === 'number' ? `${value}px` : value
}

function toStrokeWidth(value) {
    return Number.parseFloat(value) || 1.8
}

function renderRaw(source, size, className, style, rest) {
    return h('span', {
        ...rest,
        class: ['wa_icon_raw', className],
        style: [{ width: size, height: size }, style],
        innerHTML: source,
        'aria-hidden': 'true',
    })
}

function toIconData(icon) {
    if (Array.isArray(icon)) return icon.length ? icon : null

    // 裸 d 字符串
    if (typeof icon === 'string' && icon.trim() && !icon.trim().startsWith('<')) {
        return [['path', { d: icon }]]
    }

    // 原始 SVG 字符串继续走 innerHTML，不参与形变
    return null
}

export default defineComponent({
    name: 'AppIcon',
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            default: '',
        },
        /** 直接传图标数据，优先级高于 name */
        icon: {
            type: [Array, String],
            default: undefined,
        },
        size: {
            type: [Number, String],
            default: 20,
        },
        strokeWidth: {
            type: [Number, String],
            default: 1.8,
        },
        /** 是否启用图标形变过渡 */
        morph: {
            type: Boolean,
            default: true,
        },
        /** snappy / smooth / bouncy 或 { stiffness, damping } */
        spring: {
            type: [String, Object],
            default: () => ({ stiffness: 520, damping: 34 }),
        },
        /** never / user / always */
        reducedMotion: {
            type: String,
            default: 'user',
        },
    },
    setup(props, { attrs }) {
        const PathEl = ref(null)
        const Source = computed(() => props.icon ?? getIcon(props.name))
        const IconData = computed(() => toIconData(Source.value))
        const CanMorph = computed(() => Boolean(props.morph && IconData.value))
        const IsRaw = computed(
            () => typeof Source.value === 'string' && Source.value.trim().startsWith('<')
        )

        let morph = null
        let MorphEl = null
        let dead = false

        function EnsureMorph(icon) {
            if (morph || dead || !PathEl.value || !icon) return

            MorphEl = PathEl.value
            morph = createMorph(MorphEl, icon, {
                reducedMotion: props.reducedMotion,
                strokeWidth: toStrokeWidth(props.strokeWidth),
            })
        }

        onMounted(() => {
            if (CanMorph.value) EnsureMorph(IconData.value)
        })

        watch(IconData, (icon) => {
            if (!CanMorph.value || !icon) return

            // DOM 元素被替换时，旧驱动不能再用
            if (morph && MorphEl !== PathEl.value) {
                morph.destroy()
                morph = null
                MorphEl = null
            }

            if (morph) morph.morphTo(icon, props.spring)
            else EnsureMorph(icon)
        })

        watch(CanMorph, async () => {
            morph?.destroy()
            morph = null
            MorphEl = null

            await nextTick()
            if (CanMorph.value) EnsureMorph(IconData.value)
        })

        watch(() => props.strokeWidth, (value) => {
            if (morph) morph.strokeWidth = toStrokeWidth(value)
        })

        watch(() => props.reducedMotion, (value) => {
            if (morph) morph.reducedMotion = value
        })

        onBeforeUnmount(() => {
            dead = true
            morph?.destroy()
            morph = null
            MorphEl = null
        })

        return () => {
            const { class: className, style, ...rest } = attrs
            const size = toSize(props.size)
            const data = IconData.value
            const base = {
                ...rest,
                style,
                viewBox: '0 0 24 24',
                width: size,
                height: size,
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': props.strokeWidth,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'aria-hidden': 'true',
                focusable: 'false',
            }

            if (IsRaw.value) {
                return renderRaw(Source.value, size, className, style, rest)
            }

            if (!data) {
                return h('svg', { ...base, class: ['wa_icon', className] })
            }

            if (!CanMorph.value) {
                return h('svg', { ...base, class: ['wa_icon', className] },
                    data.map(([tag, iconAttrs]) => h(tag, iconAttrs)))
            }

            // d 与 paint 全部交给 createMorph，避免 Vue 更新覆盖动画中间帧
            return h('svg', { ...base, class: ['wa_icon', className] }, [
                h('path', { ref: PathEl }),
            ])
        }
    },
})
</script>

<style>
.wa_icon {
    display: block;
    flex: none;
}

.wa_icon_raw {
    display: inline-flex;
    flex: none;
}

.wa_icon_raw>svg {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
