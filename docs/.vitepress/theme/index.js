import DefaultTheme from "vitepress/theme"
import "./custom.css"

import Cyan from '../../../Cyan'


export default {
    ...DefaultTheme,
    NotFound: () => "404",
    enhanceApp(argument) {
        let { app, router, siteData } = argument
        app.use(Cyan)
    }
}