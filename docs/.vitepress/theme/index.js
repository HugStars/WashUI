import DefaultTheme from "vitepress/theme"
import "./custom.css"
import UICode from './UICode.vue'
// import Layout from './Layout.vue'


import Cyan from '../../../Cyan'


export default {
    ...DefaultTheme,
    NotFound: () => "404",
    enhanceApp(argument) {
        let { app, router, siteData } = argument
        app.component('UICode', UICode)
        // app.component('Layout', Layout)
        app.use(Cyan)
    }
}