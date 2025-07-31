import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/MainView.vue')
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/chat',
    component: () => import('../components/chat/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
