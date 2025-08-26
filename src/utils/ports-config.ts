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
    "gemini-fastapi": {
      port: 8001,
      host: "0.0.0.0",
      url: "http://0.0.0.0:8001"
    }
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

export const BACKEND_URL = PORTS_CONFIG.services.backend.url;
export const GEMINI_API_URL = PORTS_CONFIG.services["gemini-fastapi"].url;
export const FRONTEND_URL = PORTS_CONFIG.services.frontend.url;

export const API_ENDPOINTS = {
  backend: BACKEND_URL,
  geminiApi: GEMINI_API_URL,
  frontend: FRONTEND_URL
};

export { PORTS_CONFIG };
export default PORTS_CONFIG;
