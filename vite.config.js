import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath, URL } from 'node:url'


// - Vite官网：https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => {
    console.log("模式：" + mode)

    let config = {
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '^': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            open: true,
            port: 4173,
        },
        preview: {
            open: true,
            port: 4173,
        }
    }

    if (mode == 'lib') config['build'] = {
        outDir: 'Cyan_Lib', // 指定构建结果的输出目录
        target: 'es2015', // 指定要构建的目标环境，可以是某个浏览器的版本，或者是Node.js的版本
        minify: 'esbuild', // 是否为代码开启压缩
        cssTarget: 'chrome80',
        chunkSizeWarningLimit: 2000, // 设置大块大小（以字节为单位）的警告限制
        emptyOutDir: true, // 在构建前是否清空outDir目录
        rollupOptions: { // 修改内部Rollup配置
            // 请确保外部化那些你的库中不需要的依赖
            external: ['vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
            },
        },
        lib: {
            entry: './Cyan/index.js', // 入口文件，可以是相对于项目根目录的路径
            name: 'CyanUI', // 设置库的名称
        }
    }

    return config
})
