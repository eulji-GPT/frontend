import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/MainView.vue')
  },
  {
    path: '/login',
    component: () => import('../components/login/LoginPageComponent.vue')
  },
  {
    path: '/signup',
    component: () => import('../components/login/LoginComponent.vue')
  },
  {
    path: '/signup-email',
    component: () => import('../components/login/SignupComponent.vue')
  },
  {
    path: '/signup-agreement',
    component: () => import('../components/login/SignupAgreementComponent.vue')
  },
  {
    path: '/signup-password',
    component: () => import('../components/login/SignupPasswordComponent.vue')
  },
  {
    path: '/signup-form',
    component: () => import('../components/login/SignupPersonalInfoFormComponent.vue')
  },
  {
    path: '/signup-complete',
    component: () => import('../components/login/SignupCompleteComponent.vue')
  },
  {
    path: '/chat',
    component: () => import('../components/chat/index.vue')
  },
  {
    path: '/ready/:service',
    component: () => import('../components/common/ReadyBar.vue'),
    props: true
  },
  {
    path: '/lotte-preview',
    component: () => import('../views/LottiePreview.vue')
  },
  {
    path: '/crew',
    component: () => import('../components/crew/index.vue')
  },
  {
    path: '/development-status',
    component: () => import('../views/DevelopmentStatusView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
