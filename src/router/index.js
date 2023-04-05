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
        },
        {
            path     : '/create',
            name     : 'create',
            component: () => import('../views/CreateView.vue')
        },
        //Create path for settings
        {
            path     : '/settings',
            name     : 'settings',
            component: () => import('../views/SettingsView.vue')

        },
        //Create path for ssh
        {
            path     : '/ssh',
            name     : 'ssh',
            component: () => import('../views/SshView.vue')
        }

    ]
})

export default router
