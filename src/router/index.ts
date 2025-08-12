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
  },
  {
    path: '/lotte-preview',
    component: () => import('../views/LottiePreview.vue')
  },
  {
    path: '/crew',
    component: () => import('../components/crew/Desktop21.vue')
  },
  {
    path: '/crew-main',
    component: () => import('../components/crew/CrewMain.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
