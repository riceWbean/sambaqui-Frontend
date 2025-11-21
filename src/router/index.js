import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/signIn/SignInView.vue')
    }
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})

export default router
