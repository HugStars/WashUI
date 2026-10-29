<script>
import { defineComponent, h } from 'vue'
import { getIcon } from '../icons.js'

function toSize(value) {
    return typeof value === 'number' ? `${value}px` : value
}

export default defineComponent({
    name: 'AppIcon',
    props: {
        name: {
            type: String,
            required: true,
        },
        size: {
            type: [Number, String],
            default: 20,
        },
        strokeWidth: {
            type: [Number, String],
            default: 1.8,
        },
    },
    setup(props) {
        return () => {
            const icon = getIcon(props.name)
            const size = toSize(props.size)

            if (typeof icon === 'string') {
                return h('span', {
                    class: 'wa_icon_raw',
                    style: {
                        width: size,
                        height: size,
                    },
                    innerHTML: icon,
                    'aria-hidden': 'true',
                })
            }

            return h('svg', {
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
            }, (icon || []).map(([tag, attrs]) => h(tag, attrs)))
        }
    },
})
</script>

<style>
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
