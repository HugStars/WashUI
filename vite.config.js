import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import demoBlockAutoCode from './docs/vite-plugin-demo-block.js'

function resolvePath(value) {
    return fileURLToPath(new URL(value, import.meta.url))
}

// /components 是页面路由，但 docs/components 同时是源码目录。
// 开发服务器刷新时会优先命中目录下的 index.js，这里强制回落到 SPA 入口。
function docsRouteFallback() {
    return {
        name: 'docs-route-fallback',
        configureServer(server) {
            server.middlewares.use((req, _res, next) => {
                const [pathname, query] = (req.url || '').split('?')

                if (pathname === '/components' || pathname === '/components/') {
                    req.url = `/index.html${query ? `?${query}` : ''}`
                }

                next()
            })
        },
    }
}

export default defineConfig({
    root: resolvePath('./docs'),
    appType: 'spa',
    plugins: [
        docsRouteFallback(),
        demoBlockAutoCode(),
        vue(),
    ],
    optimizeDeps: {
        include: ['vue', 'vue-router'],
    },
    resolve: {
        alias: [
            { find: /^@ui\//, replacement: `${resolvePath('./ui')}/` },
            { find: /^@docs\//, replacement: `${resolvePath('./docs')}/` },
            { find: /^@\//, replacement: `${resolvePath('./ui/src')}/` },
            { find: /^@wash\/ui\/style\.css$/, replacement: resolvePath('./ui/src/styles/index.css') },
            { find: /^@wash\/ui\/tokens\.css$/, replacement: resolvePath('./ui/tokens.css') },
            { find: /^@wash\/ui\/tokens\.js$/, replacement: resolvePath('./ui/tokens.js') },
            { find: /^@wash\/ui\/router$/, replacement: resolvePath('./ui/src/router/index.js') },
            { find: /^@wash\/ui\/utils$/, replacement: resolvePath('./ui/src/utils/index.js') },
            { find: /^@wash\/ui$/, replacement: resolvePath('./ui/src/index.js') },
        ],
    },
    server: {
        host: '0.0.0.0',
        port: 5180,
        strictPort: true,
        open: true,
    },
    build: {
        outDir: resolvePath('./dist'),
        emptyOutDir: true,
    },
})
