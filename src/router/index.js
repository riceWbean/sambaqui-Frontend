import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArtefactView from '@/views/collections/ArtefactView.vue'
import AddArtefact from '@/views/managements/AddArtefact.vue'
import path from 'node:path'
import { useSignInStore } from '@/stores'

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
      component: ArtefactView,
    },
    {
      path: "/management",
      component: "",
      children: [
        { path: "", name: "management", component: () => import('../views/managements/Management.vue') },
        { path: ":id", name: "managementArtefact", component: () => import('../views/managements/ArtefactDetail.vue') },
        { path: "add", name: "addArtefact", component: AddArtefact },
        { path: "categories", name: "categories", component: ""},
        { path: "log-changes", name: "logChanges", component: () => import('../views/managements/LogChanges.vue') },
        { path: "sub-types", name: "subTypes", component: () => import('../views/managements/SubType.vue') },
        { path: "raw-materials", name: "rawMaterials", component: () => import('../views/managements/RawMaterials.vue') },
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
    {
      path: '/siteMap',
      name: 'siteMap',
      component: () => import('../views/SiteMapView.vue')
    }
  ],

scrollBehavior(to, from, savedPosition) {
    // Retorna o comportamento de scroll desejado.
    // { top: 0 } fará o scroll ir para o topo (posição 0)
    // sempre que você navegar para uma nova página.
    return { top: 0 } 
  },

  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
})

router.beforeEach(async (to, from, next) => {
  const signinStore = useSignInStore();
  
  const isAuthenticated = await signinStore.verifyLogin();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      next();
      return;
    }
    next('/signin');
  }
  if (to.path == "/signin") {
    if (isAuthenticated) {
      next('/management');
      return;
    }
    next();
  }
  next();
});

export default router;
