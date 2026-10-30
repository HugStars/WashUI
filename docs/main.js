import { createApp } from 'vue'
import '@wash/ui/style.css'
import { createUi } from '@wash/ui'
import App from './App.vue'
import { createDocsRouter } from './router.js'

const app = createApp(App)
const router = createDocsRouter()

app.use(createUi({ theme: 'auto' }))
app.use(router)

router.isReady().then(() => app.mount('body'))
