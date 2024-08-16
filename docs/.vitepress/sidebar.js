// 未选择当前选项是 该项是否展开
// collapsed: false,
// items: [
//     { text: '基本', link: '/components/button#基本' },
//     { text: '尺寸', link: '/components/button#尺寸' },
//     { text: '宽高', link: '/components/button#宽高' },
//     { text: '颜色', link: '/components/button#颜色' },
// ]


export default {
    '/components/': [
        {
            "text": "基础组件",
            "items": [
                { ...base_menu('按钮', 'button') },
                { ...base_menu('开关', 'switch') },
                { ...base_menu('图标', 'icon') },
                { ...base_menu('链接', 'link') },
                { ...base_menu('标签', 'label') },
                { ...base_menu('验证码', 'verification') },
                { ...base_menu('分隔线', 'divider') },
                { ...base_menu('下拉菜单', 'dropdown') },
                { ...base_menu('徽章', 'badge') },
                { ...base_menu('布局容器', 'layout') },
                { ...base_menu('加载指示器', 'loader') }
            ]
        },
        {
            "text": "表单组件",
            "items": [
                { ...base_menu('单选', 'radio') },
                { ...base_menu('多选', 'checkbox') },
                { ...base_menu('输入框', 'input') },
                { ...base_menu('下拉框', 'select') },
                { ...base_menu('文件上传', 'upload') },
                { ...base_menu('评分', 'rate') },
                { ...base_menu('滑动选择器', 'slider') },
                { ...base_menu('数字选择器', 'number picker') },
                { ...base_menu('时间选择器', 'time picker') },
                { ...base_menu('日期选择器', 'date picker') },
                { ...base_menu('颜色选择器', 'color picker') },
            ]
        },
        {
            "text": "数据展示组件",
            "items": [
                { ...base_menu('列表', 'list') },
                { ...base_menu('卡片', 'card') },
                { ...base_menu('表格', 'table') },
                { ...base_menu('时间线', 'timeline') },
                { ...base_menu('倒计时', 'countdown') },
                { ...base_menu('轮播图', 'carousel') },
                { ...base_menu('日历', 'calendar') },
                { ...base_menu('图片预览', 'preview image') },
                { ...base_menu('分页', 'pagination') },
            ]
        },
        {
            "text": "导航组件",
            "items": [
                { ...base_menu('面包屑', 'breadcrumb') },
                { ...base_menu('导航栏', 'navbar') },
                { ...base_menu('侧边栏', 'sidebar') },
                { ...base_menu('标签页', 'tabs') },
                { ...base_menu('步骤', 'steps') },
                { ...base_menu('回到顶部', 'to tops') },
            ]
        },
        {
            "text": "反馈组件",
            "items": [
                { ...base_menu('警告', 'alert') },
                { ...base_menu('模态框', 'modal') },
                { ...base_menu('消息提示', 'message and toast') },
                { ...base_menu('通知', 'notification') },
                { ...base_menu('进度条', 'progress') },
                { ...base_menu('弹出框', 'popover') },
                { ...base_menu('文字提示', 'text tips') },
                { ...base_menu('右键菜单', 'context menu') },
            ]
        },
        {
            "text": "高级组件",
            "items": [
                { ...base_menu('向导', 'guide') },
            ]
        },
        {
            "text": "关于",
            "items": [
                { text: '作者：HugStars' },
                { text: 'Copyright © 2024 HugStars' },
                { text: 'All rights reserved.' }
            ]
        }
    ],
    '/function/': [
        {
            "text": "便捷方法",
            "items": [
                { ...base_menu('时间格式化', 'time format') },
                { ...base_menu('金额格式化', 'money format') },
                { ...base_menu('Base64转换', 'base64') },
                { ...base_menu('文件下载', 'down') }
            ]
        },
        {
            "text": "关于",
            "items": [
                { text: '作者：HugStars' },
                { text: 'Copyright © 2024 HugStars' },
                { text: 'All rights reserved.' }
            ]
        }
    ]
}

function base_menu(title, name) {
    const words = name.split(' ')
    const capitalizedWords = words.map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    const formattedString = capitalizedWords.join(' ')
    const linkString = capitalizedWords.join('_').toLowerCase()

    return {
        text: `${title} <span style="font-size:12px">${formattedString}</span>`,
        link: `/components/${linkString}`
    }
}