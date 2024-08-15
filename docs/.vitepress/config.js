export default {
    title: 'title',
    description: 'description',
    lang: 'zh-CN',
    themeConfig: {
        nav: [

            { text: 'nav text', link: '' },
        ],
    },
    head: [
        [
            'link', { rel: 'icon', href: './favicon.ico' }
        ]
    ],
    // 默认配置
    vite: {
        define: {
            __VITEPRESS_MODE__: JSON.stringify(process.env.VITEPRESS_MODE)
        }
    },
}