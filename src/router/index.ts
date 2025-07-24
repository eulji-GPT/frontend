import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

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
    component: () => import('../components/layout/ChatApp.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
