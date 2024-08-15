export default {
    '/components/': [
        {
            text: '基础组件',
            items: [
                {
                    text: set_title('按钮', 'BUTTON'),
                    link: '/components/button',
                    // collapsed: false,
                    items: [
                        { text: '按钮 &lt;button&gt;', }
                    ]
                },
                { text: set_title('分割线', 'HR'), link: '/components/hr' },
            ]
        }
    ]
}


function set_title(title, name) {
    return `${title} <span style="font-size:12px">${name}</span>`
}