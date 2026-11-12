import * as components from '../components/index.js'
import * as layout from '../layout/index.js'
import { configureIconDefaults, configureIcons } from './icons.js'
import { configureTokens, initTheme } from './theme.js'
import { configureToast } from './toast.js'

const registry = { ...components, ...layout }

export function createUi(options = {}) {
    return {
        install(app) {
            for (const [name, component] of Object.entries(registry)) {
                app.component(name, component)
            }
            initTheme(options.theme || 'auto', options.storageKey)
            configureTokens({
                tokens: options.tokens,
                themes: options.themes,
            })
            configureIcons(options.icons)
            configureIconDefaults(options.iconDefaults)
            configureToast(options.toast)
        },
    }
}
