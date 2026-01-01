// Frontend port configuration
const PORTS_CONFIG = {
  services: {
    backend: {
      port: 8000,
      host: "0.0.0.0",
      url: "http://0.0.0.0:8000"
    },
    frontend: {
      port: 3000,
      host: "0.0.0.0",
      url: "http://0.0.0.0:3000"
    },
    // [DISABLED] Gemini AI 서비스 - 사용하지 않음
    // "gemini-fastapi": {
    //   port: 8001,
    //   host: "0.0.0.0",
    //   url: "http://0.0.0.0:8001"
    // }
  },
  cors: {
    allowed_origins: [
      "http://0.0.0.0:3000",
      "http://127.0.0.1:3000",
      "http://0.0.0.0:8000",
      "http://127.0.0.1:8000",
      "http://0.0.0.0:8001",
      "http://127.0.0.1:8001"
    ]
  }
};

// Production URLs - 환경변수에서 가져오며, 기본값 없음 (환경변수 필수)
const PRODUCTION_BACKEND_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || import.meta.env.VITE_FASTAPI_URL || '';
// [DISABLED] Gemini AI 프로덕션 URL - 사용하지 않음
// const PRODUCTION_GEMINI_URL = import.meta.env.VITE_PRODUCTION_GEMINI_URL || '';

/**
 * Get the API base URL for the backend service.
 * Handles Railway internal URL detection and fallback to production URL.
 *
 * URL Resolution Priority:
 * 1. Railway internal URL (.railway.internal) → PRODUCTION_BACKEND_URL
 * 2. Production domains (euljigpt.com, railway.app) → PRODUCTION_BACKEND_URL
 * 3. Environment variable VITE_FASTAPI_URL
 * 4. Fallback to '/api' (for local development with proxy)
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_FASTAPI_URL;

  // Railway 내부 URL 감지 및 외부 URL로 대체
  if (envUrl && envUrl.includes('.railway.internal')) {
    return PRODUCTION_BACKEND_URL;
  }

  // 프로덕션 환경에서 /api 프록시 경로 사용 시 외부 URL로 대체
  if (!envUrl || envUrl === '/api') {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Railway 호스트 또는 euljigpt.com 프로덕션 도메인인 경우
      if (hostname.includes('railway.app') ||
          hostname === 'euljigpt.com' ||
          hostname === 'www.euljigpt.com') {
        return PRODUCTION_BACKEND_URL;
      }
    }
  }

  return envUrl || '/api';
};

// [DISABLED] Gemini API base URL 함수 - 사용하지 않음
// /**
//  * Get the Gemini API base URL.
//  */
// export const getGeminiApiBaseUrl = (): string => {
//   const envUrl = import.meta.env.VITE_GEMINI_FASTAPI_URL;
//
//   if (envUrl && envUrl.includes('.railway.internal')) {
//     return PRODUCTION_GEMINI_URL || envUrl;
//   }
//
//   return envUrl || '/gemini-api';
// };

export const BACKEND_URL = PORTS_CONFIG.services.backend.url;
// [DISABLED] Gemini AI URL - 사용하지 않음
// export const GEMINI_API_URL = PORTS_CONFIG.services["gemini-fastapi"].url;
export const FRONTEND_URL = PORTS_CONFIG.services.frontend.url;

export const API_ENDPOINTS = {
  backend: BACKEND_URL,
  // [DISABLED] geminiApi: GEMINI_API_URL,
  frontend: FRONTEND_URL
};

export { PORTS_CONFIG };
export default PORTS_CONFIG;
