<template>
  <div class="root-wrapper">
    <!-- Toast Notification -->
    <ToastNotification 
      :show="showToast" 
      :message="toastMessage" 
      @hide="showToast = false" 
    />

    <!-- Header -->
    <HeaderSection />

    <!-- Footer -->
    <div class="common-footer-notice">
      <span class="footer-text">개인정보 처리방침</span>
      <span class="footer-separator">|</span>
      <span class="footer-copyright">Copyright ⓒ EULGPT. All Rights Reserved</span>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="login-container">
        <div class="title-section">
          <span class="login-title">
            내가 찾던 정보, <br/>
            이제 쉽게 만나요.
          </span>
          <div class="form-container">
            <div class="input-group">
              <input 
                v-model="email" 
                type="email" 
                placeholder="이메일" 
                class="input-field"
              />
            </div>
            <div class="password-group">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="비밀번호" 
                class="input-field"
              />
              <button @click="togglePassword" class="eye-button">
                <svg v-if="showPassword" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c4.42 0 8 2.79 10 7a13.16 13.16 0 0 1-1.67 2.68" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12c2 4.21 5.58 7 10 7a9.74 9.74 0 0 0 5.39-1.61" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button class="login-button" @click="handleLogin" :disabled="isLoading">
          <span class="button-text">{{ isLoading ? '로그인 중...' : '로그인' }}</span>
        </button>

        <div class="divider-section">
          <div class="divider-line"></div>
          <div class="alternative-login">
            <button class="kakao-button" @click="handleKakaoLogin">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2C5.13 2 2 4.58 2 7.75c0 2.03 1.33 3.82 3.35 4.85l-.89 3.27c-.08.3.26.54.51.36L8.66 14c.11 0 .22.01.34.01 3.87 0 7-2.58 7-5.75S12.87 2 9 2z" fill="currentColor"/>
              </svg>
              <span class="kakao-text">카카오 계정으로 로그인</span>
            </button>
            <div class="bottom-links">
              <span class="link-text" @click="() => router.push('/signup')">회원가입</span>
              <span class="separator">•</span>
              <span class="link-text">내 계정 찾기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ToastNotification from '../common/ToastNotification.vue'
import HeaderSection from '../main/HeaderSection.vue'
import { setAccessToken } from '../../utils/auth'

const router = useRouter()

// Railway 내부 URL(.railway.internal)은 브라우저에서 접근 불가하므로 외부 URL로 대체
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_FASTAPI_URL;

  // Railway 내부 URL 감지 및 외부 URL로 대체
  if (envUrl && envUrl.includes('.railway.internal')) {
    console.warn('Railway internal URL detected, using public URL instead');
    return 'https://fastapi-backend-production-2cd0.up.railway.app';
  }

  // 프로덕션 환경에서 /api 프록시 경로 사용 시 외부 URL로 대체
  if (!envUrl || envUrl === '/api') {
    // 브라우저에서 Railway 호스트인지 확인
    if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
      return 'https://fastapi-backend-production-2cd0.up.railway.app';
    }
  }

  return envUrl || '/api';
};

const API_BASE_URL = getApiBaseUrl()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    showToastMessage('이메일과 비밀번호를 입력해주세요.')
    return
  }

  isLoading.value = true

  try {
    console.log('로그인 시도:', { email: email.value })

    const response = await fetch(`${API_BASE_URL}/member/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify({
        email: email.value,
        password: password.value
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '로그인에 실패했습니다.')
    }

    const result = await response.json()
    console.log('로그인 성공:', result)

    // 액세스 토큰을 localStorage에 저장
    setAccessToken(result.access_token)

    // redirect 쿼리 파라미터가 있으면 그 경로로, 없으면 메인 페이지로 이동
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.push(redirect)

  } catch (error: any) {
    console.error('로그인 오류:', error)
    if (error.message.includes('이메일 또는 비밀번호가 올바르지 않습니다')) {
      showToastMessage('이메일 ID 또는 비밀번호가 일치하지 않아요')
    } else {
      showToastMessage(error.message || '로그인 중 오류가 발생했습니다.')
    }
  } finally {
    isLoading.value = false
  }
}

const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true
}

const handleKakaoLogin = () => {
  console.log('카카오 로그인 시도')
  // 백엔드 카카오 로그인 엔드포인트로 리다이렉트
  window.location.href = `${API_BASE_URL}/member/kakao/login`
}
</script>

<style scoped>
.root-wrapper {
  min-height: 100vh;
  background-color: white;
  position: relative;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
}

/* Footer Styles */
.common-footer-notice {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  width: 277px;
  height: 12px;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 138px);
  top: 810px;
}

.footer-text {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  text-align: left;
}

.footer-separator {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  text-align: left;
  width: 4px;
}

.footer-copyright {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  text-align: left;
  width: 191px;
}

/* Main Content */
.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 84px - 50px);
  padding: 50px 20px 20px 20px; /* 수동으로 패딩 조정 가능: top right bottom left */
}

.login-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 407px;
  height: 1300px; /* 수동으로 높이 조정 가능 */
  background-color: white;
  box-sizing: border-box;
  margin: 0 auto; /* 중앙 정렬 추가 */
}

.title-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
}

.login-title {
  color: black;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  align-self: stretch;
}

.form-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  box-sizing: border-box;
}

.input-group {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 10px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 14px 20px;
}

.password-group {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 10px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 14px 20px;
}

.input-field {
  color: rgb(156, 163, 175);
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
}

.input-field:focus {
  color: black;
}

.eye-button {
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(156, 163, 175);
  padding: 0;
  display: flex;
  align-items: center;
}

.login-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  align-self: stretch;
  background-color: rgb(240, 246, 255);
  box-sizing: border-box;
  padding: 14px 60px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-button:hover:not(:disabled) {
  background-color: rgb(219, 234, 254);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-text {
  color: rgb(2, 71, 138);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: left;
}

.divider-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
}

.divider-line {
  height: 0px;
  border-top: solid 1px rgb(229, 231, 235);
  align-self: stretch;
}

.alternative-login {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
}

.kakao-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  align-self: stretch;
  height: 46px;
  background-color: rgb(254, 229, 2);
  box-sizing: border-box;
  padding: 15px 60px;
  border: none;
  cursor: pointer;
}

.kakao-text {
  color: black;
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: center;
}

.bottom-links {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 0px 10px;
}

.link-text {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  cursor: pointer;
}

.separator {
  color: rgb(229, 231, 235);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .login-container {
    width: 90%;
    max-width: 407px;
  }
  
  .main-content {
    padding: 84px 20px 20px;
  }
}
</style>
