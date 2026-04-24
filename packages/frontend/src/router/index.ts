import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"
import ErrorView from "../views/ErrorView.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/auth/error',
            name: 'auth-error',
            component: ErrorView,
            props: (route) => ({
                error: route.query.error,
                message: route.query.message,
            }),
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        }
    ]
})

export default router