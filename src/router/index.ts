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
  // {
  //   path: '/fortune',
  //   component: () => import('../views/FortuneView.vue')
  // },  // 운세 기능 비활성화
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
    path: '/crew/apply',
    component: () => import('../views/CrewApplyView.vue')
  },
  {
    path: '/crew/explore',
    component: () => import('../views/CrewExploreView.vue')
  },
  {
    path: '/development-status',
    component: () => import('../views/DevelopmentStatusView.vue')
  },
  {
    path: '/kakao/callback',
    component: () => import('../views/KakaoCallbackView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
