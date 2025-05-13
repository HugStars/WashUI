import sidebar from "./sidebar"
import lang_change from "./lang_change"

export default {
    title: 'CyanUI',
    lang: 'zh-CN',
    description: '基于 Vite 和 Vue3 的 前端自定义 UI 框架:CyanUI',
    assetsDir: 'public',
    appearance: true,
    head: [
        ['meta', { name: 'viewport', content: "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" }],
    ],
    themeConfig: {
        sidebar,
        logo: '../assets/favicon.svg',
        nav: [
            { text: '组件', link: '/components/badge', activeMatch: '/components/' },
            { text: '方法', link: '/function/base64', activeMatch: '/function/' },
            {
                text: 'v0.01',
                items: [
                    { text: '关于', link: '/about' },
                    { text: '更新日志', link: '/update' },
                    { text: '开发日志', link: '/records' },
                    { text: '常见问题', link: '/question' },
                    { text: '贡献者', link: '/contributors' }
                ]
            }
        ],
        outline: {
            level: [2, 4], // 显示2-4级标题
            label: '目录' // 文字显示
        },
        socialLinks: [
            { icon: {
                    title: "GitHub",
                    svg: `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512"><path d="M855.557 216.855c35.621-66.153-5.089-152.661-5.089-152.661-91.597 0-157.75 61.064-157.75 61.064-35.621-20.355-152.661-20.355-152.661-20.355s-117.04 0-152.661 20.355c0 0-66.153-61.064-157.75-61.064 0 0-40.71 86.508-5.089 152.661 0 0-81.419 76.331-50.887 239.169 28.691 153.018 162.838 193.371 249.346 193.371 0 0-35.621 30.532-30.532 81.419 0 0-50.887 30.532-101.774 10.177s-76.331-71.242-76.331-71.242-50.887-66.153-101.774-40.71c0 0-15.266 15.266 40.71 40.71 0 0 40.71 61.064 55.976 96.685 15.266 35.621 96.685 66.153 178.105 45.798v117.04s0 10.177-20.355 15.266-20.355 15.266-10.177 15.266H723.25c10.177 0 10.177-10.177-10.177-15.266-20.355-5.089-20.355-15.266-20.355-15.266v-117.04s0.447-61.03 0-81.419c-1.119-51.128-35.621-81.419-35.621-81.419 86.508 0 220.655-40.353 249.346-193.371 30.533-162.837-50.886-239.168-50.886-239.168z" fill="#5092ff"></path></svg>`
            }, link: 'https://github.com/vuejs/vitepress' },
            {
                icon: {
                    title: "发送邮件",
                    svg: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512"><path d="M153.236734 163.111422l714.763665 0c48.810633 0 88.718697 38.475467 89.332667 85.853503l-446.458679 242.518237L64.313381 249.169581C64.722694 201.689218 104.323773 163.111422 153.236734 163.111422L153.236734 163.111422zM64.313381 341.981413l-0.409313 429.062856c0 47.787349 40.215049 86.876786 89.332667 86.876786l714.763665 0c49.117618 0 89.332667-39.089437 89.332667-86.876786L957.333067 341.776756 521.311882 573.038873c-6.651344 3.581493-14.735285 3.581493-21.386629 0L64.313381 341.981413 64.313381 341.981413zM64.313381 341.981413" fill="#5092ff"></path></svg>'
                },
                link: '',
            },
        ],
        lastUpdated: {
            text: '最后更新于',
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            },
        },
        footer: {
            message: '<a href="https://beian.miit.gov.cn/">豫ICP备2022026852号</a>',
            copyright: 'Copyright © 2024 HugStars'
        },
        ...lang_change,
    },
    rewrites: {
        'components/:type/:name': 'components/:name',
        'function/:type/:name': 'function/:name',
    }
}