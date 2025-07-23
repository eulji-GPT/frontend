// src/main.js 또는 main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

const app = createApp(App)
app.use(router)
app.mount('#app')