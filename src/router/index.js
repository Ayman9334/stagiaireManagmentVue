import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InscriptionPage from '../views/InscriptionPage.vue'
import StagiairePage from '../views/StagiairePage.vue'
import ProfPage from '../views/ProfPage.vue'
import EtabPage from '../views/EtabPage.vue'
import MatierePage from '../views/MatierePage.vue'

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
      path : '/stagiaire',
      name : 'stagiaire',
      component : StagiairePage
    },
    {
      path : '/professeur',
      name : 'professeur',
      component : ProfPage
    },
    {
      path : '/etablissement',
      name : 'etablissement',
      component : EtabPage
    },
    {
      path : '/matiere',
      name : 'matiere',
      component : MatierePage
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
