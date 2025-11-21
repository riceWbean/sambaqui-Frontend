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
      path: "/artefact/:id",
      name: "artefact",
      component: "",
    },
    {
      path: "/management/",
      component: "",
      children: [
        { path: "", name: "management", component: "" },
        { path: ":id", name: "artefact", component:"" },
        { path: "add", name: "addArtefact", component: "" },
        { path: "categories", name: "categories", component: "" },
        { path: "artefactsList", name: "artefactsList", component: "" },
      ],
      meta: { requiresAuth: true }
    },
    
    {
      path: "/about",
      name: "about",
      component: "",
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
