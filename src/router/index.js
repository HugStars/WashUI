import { createRouter, createWebHistory } from 'vue-router'
import Button from '../page/Button.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Button
        }
    ],
    scrollBehavior(to, from) {
        if (to.path !== from.path) {
            return { top: 0 };
        }
    }
})

export default router
