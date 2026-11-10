<script>
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { svgToIcon } from 'morphicons/adapters'
import { createMorph } from 'morphicons/dom'
import { getIcon, getIconDefaults } from '../core/icons.js'

const SPRING_PRESETS = {
    smooth: { stiffness: 170, damping: 26 },
    snappy: { stiffness: 420, damping: 30 },
    bouncy: { stiffness: 300, damping: 14 },
}

function toSize(value) {
    return typeof value === 'number' ? `${value}px` : value
}

function toStrokeWidth(value) {
    return Number.parseFloat(value) || 1.8
}

// 速度按时间缩放：刚度乘 speed²、阻尼乘 speed，保持原弹簧手感
function toSpring(spring, speed) {
    if (speed === 1 || spring === undefined || spring === null) return spring

    const base = typeof spring === 'string' ? SPRING_PRESETS[spring] : spring
    if (!base || !Number.isFinite(base.stiffness) || !Number.isFinite(base.damping)) return spring

    return {
        stiffness: base.stiffness * speed * speed,
        damping: base.damping * speed,
    }
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

function normalizeIconData(data) {
    if (Array.isArray(data)) return data.length ? data : null
    if (typeof data === 'string' && data.trim()) return [['path', { d: data }]]
    return null
}

function toIconData(icon) {
    // 原始 SVG 先转成 24 网格，转换失败时保留原样渲染
    if (typeof icon === 'string' && icon.trim().startsWith('<')) {
        try {
            return normalizeIconData(svgToIcon(icon))
        } catch {
            return null
        }
    }

    return normalizeIconData(icon)
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
            default: undefined,
        },
        /** 是否启用图标形变过渡 */
        morph: {
            type: Boolean,
            default: true,
        },
        /** snappy / smooth / bouncy 或 { stiffness, damping } */
        spring: {
            type: [String, Object],
            default: undefined,
        },
        /** 播放速度倍率，按弹簧时间缩放换算 */
        speed: {
            type: Number,
            default: undefined,
        },
        /** never / user / always */
        reducedMotion: {
            type: String,
            default: undefined,
        },
    },
    setup(props, { attrs }) {
        const Defaults = getIconDefaults()
        const PathEl = ref(null)
        const Source = computed(() => props.icon ?? getIcon(props.name))
        const IconData = computed(() => toIconData(Source.value))
        const CanMorph = computed(() => Boolean(props.morph && IconData.value))
        const IsRaw = computed(
            () => typeof Source.value === 'string'
                && Source.value.trim().startsWith('<')
                && !IconData.value
        )

        const StrokeWidth = computed(() => props.strokeWidth ?? Defaults.strokeWidth ?? 1.8)
        const ReducedMotion = computed(() => props.reducedMotion ?? Defaults.reducedMotion ?? 'user')
        const Speed = computed(() => {
            const value = Number(props.speed ?? Defaults.speed ?? 1)
            return Number.isFinite(value) && value > 0 ? value : 1
        })
        const EffectiveSpring = computed(() => toSpring(props.spring ?? Defaults.spring, Speed.value))

        let morph = null
        let MorphEl = null
        let dead = false

        function EnsureMorph(icon) {
            if (morph || dead || !PathEl.value || !icon) return

            MorphEl = PathEl.value
            morph = createMorph(MorphEl, icon, {
                reducedMotion: ReducedMotion.value,
                strokeWidth: toStrokeWidth(StrokeWidth.value),
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

            if (morph) morph.morphTo(icon, EffectiveSpring.value)
            else EnsureMorph(icon)
        })

        watch(CanMorph, async () => {
            morph?.destroy()
            morph = null
            MorphEl = null

            await nextTick()
            if (CanMorph.value) EnsureMorph(IconData.value)
        })

        watch(StrokeWidth, (value) => {
            if (morph) morph.strokeWidth = toStrokeWidth(value)
        })

        watch(ReducedMotion, (value) => {
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
                'stroke-width': StrokeWidth.value,
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
