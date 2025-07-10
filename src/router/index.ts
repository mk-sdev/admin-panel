import { createRouter, createWebHistory } from 'vue-router'
import '../style.css'
import { useAuth } from '../useAuth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  { path: '/login', name: 'login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const auth = useAuth()

router.beforeEach(async (to, from, next) => {
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

