import { createRouter, createWebHistory } from 'vue-router'
import '../style.css'
import { useAuth } from '../useAuth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PostView from '../views/PostView.vue'
import HelpView from '../views/HelpView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/pomoc', name: 'pomoc', component: HelpView },
  {
    path: '/dzien/:part/:mystery/:index',
    name: 'dzien',
    component: PostView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dodaj',
    name: 'dodaj',
    component: PostView,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory('/admin-panel/'),
  routes,
})

const auth = useAuth()

router.beforeEach(async (to, _, next) => {
  if (auth.checking) {
    await auth.checkAuth()
  }

  if (to.meta.requiresAuth && !auth.loggedIn.value) {
    next('/login')
  } else if (to.path === '/login' && auth.loggedIn.value) {
    next('/')
  } else {
    next()
  }
})

export default router
