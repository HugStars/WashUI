import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function resolvePath(value) {
    return fileURLToPath(new URL(value, import.meta.url))
}

export default defineConfig({
    root: resolvePath('./docs'),
    appType: 'spa',
    plugins: [
        vue(),
    ],
    optimizeDeps: {
        include: ['vue', 'vue-router'],
    },
    resolve: {
        alias: [
            { find: /^@wash\/ui\/style\.css$/, replacement: resolvePath('./ui/src/styles/index.css') },
            { find: /^@wash\/ui\/tokens\.css$/, replacement: resolvePath('./ui/tokens.css') },
            { find: /^@wash\/ui\/tokens\.js$/, replacement: resolvePath('./ui/tokens.js') },
            { find: /^@wash\/ui\/router$/, replacement: resolvePath('./ui/src/router/index.js') },
            { find: /^@wash\/ui\/utils$/, replacement: resolvePath('./ui/src/utils/index.js') },
            { find: /^@wash\/ui$/, replacement: resolvePath('./ui/src/index.js') },
        ],
    },
    server: {
        host: 'localhost',
        port: 5180,
        strictPort: true,
        open: true,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
})
