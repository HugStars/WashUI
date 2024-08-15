import DefaultTheme from "vitepress/theme"
import "./custom.css"
import UICode from './UICode.vue'


import Cyan from '../../../Cyan'


export default {
    ...DefaultTheme,
    NotFound: () => "404",
    enhanceApp(argument) {
        let { app, router, siteData } = argument
        app.component('UICode', UICode)
        app.use(Cyan)
    }
}