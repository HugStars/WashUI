import * as components from '../components/index.js'
import * as layout from '../layout/index.js'
import { configureIcons } from './icons.js'
import { configureTokens, initTheme } from './theme.js'

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
        },
    }
}
