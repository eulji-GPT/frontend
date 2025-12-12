// src/main.js 또는 main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/pretendard.css'
import './assets/tailwind.css'

const app = createApp(App)
app.use(router)

// 전역 에러 핸들러 설정
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err)
  console.error('Component:', instance)
  console.error('Info:', info)

  // 프로덕션 환경에서는 에러 로깅 서비스로 전송 가능
  if (import.meta.env.PROD) {
    // TODO: 에러 로깅 서비스 연동 (예: Sentry)
  }
}

// Unhandled Promise Rejection 핸들러
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason)

  // 프로덕션 환경에서는 에러 로깅 서비스로 전송 가능
  if (import.meta.env.PROD) {
    // TODO: 에러 로깅 서비스 연동
  }
})

// 전역 에러 핸들러 (일반 JavaScript 에러)
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error)
})

// 라우터 준비 완료 후 마운트
router.isReady().then(() => {
  app.mount('#app')
})