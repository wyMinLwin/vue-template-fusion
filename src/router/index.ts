import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

import { AppLayout } from '@/layouts'

// auth
import LoginView from '@/modules/auth/login/LoginView.vue'

// not found
import NotFoundView from '@/modules/not-found/NotFoundView.vue'

import LogView from '@/modules/log/LogView.vue'
import ToDoListView from '@/modules/to-do-list/ToDoListView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/auth/',
            name: 'auth',
            children: [
                {
                    path: '',
                    name: 'redirect',
                    redirect: '/auth/login'
                },
                {
                    path: 'login',
                    name: 'login',
                    component: LoginView
                }
            ]
        },
        {
            path: '/',
            name: '',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'to-do-list',
                    component: ToDoListView,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: 'log',
                    name: 'log',
                    component: LogView,
                    meta: {
                        requiresAuth: true
                    }
                },
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFoundView
        }
    ]
})

router.beforeEach((to, _, next) => {
    const token = Cookies.get('template-app-token')

    if (to.meta.requiresAuth && !token) {
        next('/auth/login')
    } else if (to.name === 'NotFound') {
        next()
    }  else if (!to.meta.requiresAuth && token) {
        next('/')
    } else {
        next()
    }
})

export default router
