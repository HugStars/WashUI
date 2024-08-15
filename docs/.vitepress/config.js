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
            { text: '组件', link: '/components/button', activeMatch: '/components/' },
            { text: '记录', link: '/records' },
        ],
        socialLinks: [
            {
                icon: {
                    title: "发送邮件",
                    svg: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512"><path d="M153.236734 163.111422l714.763665 0c48.810633 0 88.718697 38.475467 89.332667 85.853503l-446.458679 242.518237L64.313381 249.169581C64.722694 201.689218 104.323773 163.111422 153.236734 163.111422L153.236734 163.111422zM64.313381 341.981413l-0.409313 429.062856c0 47.787349 40.215049 86.876786 89.332667 86.876786l714.763665 0c49.117618 0 89.332667-39.089437 89.332667-86.876786L957.333067 341.776756 521.311882 573.038873c-6.651344 3.581493-14.735285 3.581493-21.386629 0L64.313381 341.981413 64.313381 341.981413zM64.313381 341.981413" fill="#22A2C3"></path></svg>'
                },
                link: '',
            },
        ],
        footer: {
            message: '<a href="https://beian.miit.gov.cn/">豫ICP备2022026852号</a>',
            copyright: 'Copyright © 2024 HugStars'
        },
        ...lang_change,
    },
}