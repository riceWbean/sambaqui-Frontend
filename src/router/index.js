import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArtefactView from '@/views/collections/ArtefactView.vue'
import AddArtefact from '@/views/managements/AddArtefact.vue'
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
      path: "/collection",
      name: "collection",
      component: "",
    },
    {
      path: "/artefact/:id/",
      name: "artefact",
      component: "",
    },
    {
      path: "/management",
      component: "",
      children: [
        { path: "", name: "management", component: () => import('../views/managements/Management.vue') },
        { path: ":id", name: "managementArtefact", component: ArtefactView },
        { path: "add", name: "addArtefact", component: AddArtefact },
        { path: "categories", name: "categories", component: "" },
        { path: "artefactsList", name: "artefactsList", component: () => import('../views/managements/ArtefactList.vue') },
      ],
      meta: { requiresAuth: true }
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
    },
    {
      path: '/exhibitions',
      name: 'exhibitions',
      component: () => import('../views/exhibitions/ExhibitionsView.vue')
    },
    {
      path: '/acervo',
      name: 'acervo',
      component: () => import('../views/acervo/AcervoView.vue')
    },
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})

export default router
