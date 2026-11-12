import { createApp } from 'vue'
import 'wash-ui/style.css'
import { createUi } from 'wash-ui'
import App from './App.vue'
import { createDocsRouter } from './router.js'

const app = createApp(App)
const router = createDocsRouter()

app.use(createUi({ theme: 'auto' }))
app.use(router)

// ! 必须挂载到 body，禁止改回 #app（用户明确要求）
router.isReady().then(() => app.mount('body'))
