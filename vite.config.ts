import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT) || 3001

  return {
    plugins: [vue()],
    envDir: process.cwd(), // 현재 디렉토리의 .env 파일 사용
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      allowedHosts: ['eulgpt-dev.duckdns.org', 'localhost'], // DuckDNS 도메인 허용
      host: 'localhost', // 로컬 개발 시 localhost 사용
      port: port,
      strictPort: false, // 포트가 사용 중이면 다른 포트 자동 선택
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        timeout: 30000, // 30초 타임아웃
      },
      '/gemini-api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/gemini-api/, ''),
        timeout: 60000, // 60초 타임아웃 (AI 응답 대기)
        proxyTimeout: 60000,
      },
    },
    },
    preview: {
      host: '0.0.0.0', // 프로덕션 미리보기도 외부 접속 허용
      port: port,
    },
  }
})
