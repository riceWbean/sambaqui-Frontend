import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import path from 'node:path'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/exhibitions",
      name: "exhibitions",
      component: "",
    },
    {
      path: "/collection",
      name: "collection",
      component: "",
    },
    {
      path: "/artefact",
      component: "",
      children: [
        // { path: ":id", name: "product", component: ProductView, props: true },
      ],
    },
    {
      path: "/about",
      name: "about",
      component: () => import('../views/AboutView.vue'),
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
