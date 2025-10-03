// src/main.js 또는 main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/pretendard.css'
import './assets/tailwind.css'

const app = createApp(App)
app.use(router)

// 라우터 준비 완료 후 마운트
router.isReady().then(() => {
  app.mount('#app')
})