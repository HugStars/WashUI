import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = fileURLToPath(new URL('.', import.meta.url))

function entries(dir, prefix) {
    const folder = fileURLToPath(new URL(dir, import.meta.url))
    return Object.fromEntries(
        readdirSync(folder)
            .filter(file => file.endsWith('.vue'))
            .map(file => [`${prefix}/${file.slice(0, -4)}`, `${folder}/${file}`])
    )
}

export default defineConfig({
    root,
    plugins: [
        vue(),
    ],
    build: {
        lib: {
            entry: {
                index: 'src/index.js',
                utils: 'src/utils/index.js',
                router: 'src/router/index.js',
                ...entries('./src/components', 'components'),
                ...entries('./src/layout', 'layout'),
            },
            formats: ['es'],
            fileName: (format, entryName) => `${entryName}.js`,
            cssFileName: 'style',
        },
        rollupOptions: {
            external: ['vue', 'vue-router', /^morphicons(\/.*)?$/],
        },
        sourcemap: true,
    },
})
