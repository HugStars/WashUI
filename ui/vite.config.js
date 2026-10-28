import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    root: fileURLToPath(new URL('.', import.meta.url)),
    plugins: [
        vue(),
    ],
    build: {
        lib: {
            entry: {
                index: 'src/index.js',
                utils: 'src/utils/index.js',
                router: 'src/router/index.js',
            },
            formats: ['es'],
            fileName: (format, entryName) => `${entryName}.js`,
            cssFileName: 'style',
        },
        rollupOptions: {
            external: ['vue', 'vue-router'],
        },
        sourcemap: true,
    },
})
