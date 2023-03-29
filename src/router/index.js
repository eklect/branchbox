import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes : [
        {
            path     : '/',
            name     : 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path     : '/containers',
            name     : 'containers',
            component: () => import('../views/ContainerView.vue')
        }
    ]
})

export default router
