import { defineAsyncComponent } from 'vue'

const components = import.meta.glob('./*/*.vue')

// - 传入 vue实例 和 组件前缀 prefix
// - prefix 可自定义组件前缀
const CyanUI = (app, prefix = 'c-') => {
    for (const [key, value] of Object.entries(components)) {
        const name = prefix + key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
        app.component(name, defineAsyncComponent(value))
    }
}

export default CyanUI