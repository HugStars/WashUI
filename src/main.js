import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import CyanUI from '../Cyan/index'
// import CyanUI from '../Cyan_Lib/cyan_ui'

const app = createApp(App)

// - 也可使用 CyanUI(app,'c-')

app.use(CyanUI)

app.use(router)

app.mount('body')


