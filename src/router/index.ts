import { createRouter, createWebHistory } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout.vue'
import HomeComponent from '@/modules/Home/HomeComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: BlankLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeComponent
        }
      ]
    },
  ]
})

export default router
