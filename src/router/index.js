import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutViewVue from '../views/AboutView.vue'
import InscriptionPage from '../views/InscriptionPage.vue'
import StagiairePage from '../views/StagiairePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/inscription',
      name: 'inscription',
      component: InscriptionPage
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutViewVue
    },
    {
      path : '/stagiaire',
      name : 'stagiaire',
      component : StagiairePage
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPage = '/inscription'
  const path = to.path
  const auth = localStorage.getItem('ACCESS_TOKEN')

  if (path != publicPage && !auth) {
    next('/inscription')
  } else if (path == publicPage && auth) {
    next('/')
  } else {
    next()
  }
})

export default router
