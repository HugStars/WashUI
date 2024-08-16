import DefaultTheme from "vitepress/theme"
import "./custom.scss"
import UICode from '../component/UICode.vue'
import Layout from '../component/Layout.vue'


import Cyan from '../../../Cyan'


export default {
    ...DefaultTheme,
    Layout,
    NotFound: () => "404",
    enhanceApp(argument) {
        let { app } = argument
        app.component('UICode', UICode)
        app.use(Cyan)
    }
}