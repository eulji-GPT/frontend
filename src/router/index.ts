import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../utils/auth'

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
    component: () => import('../components/chat/index.vue'),
    meta: { requiresAuth: true }
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
    path: '/pro-verification',
    component: () => import('../views/ProVerificationView.vue'),
    meta: { requiresAuth: true }
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

// 인증 가드 추가
router.beforeEach((to, from, next) => {
  // requiresAuth 메타 필드가 true인 경로 체크
  if (to.meta.requiresAuth) {
    if (isAuthenticated()) {
      // 인증되어 있으면 진행
      next()
    } else {
      // 인증되지 않았으면 로그인 페이지로 리다이렉트
      console.log('인증되지 않은 사용자 - 로그인 페이지로 이동')
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 로그인 후 돌아갈 경로 저장
      })
    }
  } else {
    // 인증이 필요없는 경로는 그냥 진행
    next()
  }
})

export default router
