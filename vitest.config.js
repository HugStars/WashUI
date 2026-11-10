import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

function resolvePath(value) {
    return fileURLToPath(new URL(value, import.meta.url))
}

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            { find: /^@ui\//, replacement: `${resolvePath('./ui')}/` },
            { find: /^@docs\//, replacement: `${resolvePath('./docs')}/` },
            { find: /^@\//, replacement: `${resolvePath('./ui/src')}/` },
        ],
    },
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.test.js'],
        setupFiles: ['./tests/setup.js'],
        restoreMocks: true,
    },
})
