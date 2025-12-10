<template>
  <div class="pro-verification-page">
    <!-- Header -->
    <HeaderSection />

    <!-- Main Content -->
    <div class="pro-verification-container">
      <div class="verification-card">
        <!-- Step 1: Email Input -->
        <div v-if="currentStep === 1" class="step-content">
          <h1 class="title">프리미엄 혜택을 위해<br>이메일 인증을 진행할게요</h1>

          <div class="input-section">
            <div class="input-row">
              <input
                v-model="email"
                type="email"
                class="email-input"
                :class="{ error: errorMessage }"
                placeholder="이메일 주소 입력"
                @input="validateEmail"
              />
              <button
                class="send-code-btn"
                :class="{ active: isEmailValid && !isLoading }"
                :disabled="!isEmailValid || codeSent || isLoading"
                @click="sendVerificationCode"
              >
                {{ isLoading ? '전송 중...' : (codeSent ? '인증번호 전송됨' : '인증번호 받기') }}
              </button>
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </div>

          <button
            class="next-btn"
            :class="{ active: codeSent }"
            :disabled="!codeSent"
            @click="goToStep2"
          >
            다음
          </button>
        </div>

        <!-- Step 2: Verification Code Input -->
        <div v-if="currentStep === 2" class="step-content">
          <!-- Toast notification -->
          <div v-if="showToast" class="toast">
            <div class="toast-icon">
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                <circle cx="10.5" cy="10.5" r="10.5" fill="#10B981"/>
                <path d="M6 10.5L9 13.5L15 7.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>인증번호가 다시 전송되었어요</span>
          </div>

          <div class="step2-input-wrapper">
            <div class="step2-title-email">
              <h1 class="title">프리미엄 혜택을 위해<br>이메일 인증을 진행할게요</h1>

              <input
                v-model="email"
                type="email"
                class="email-input disabled"
                :disabled="true"
              />
            </div>

            <div class="code-input-wrapper">
              <input
                v-model="verificationCode"
                type="text"
                class="verification-input"
                :class="{ error: errorMessage }"
                placeholder="이메일로 발송된 6자리 인증번호"
                maxlength="6"
                @input="validateCode"
              />
              <div class="timer">{{ formattedTime }}</div>
            </div>

            <div v-if="errorMessage" class="error-message-step2">
              {{ errorMessage }}
            </div>
          </div>

          <div class="step2-button-wrapper">
            <button
              class="next-btn"
              :class="{ active: isCodeValid && !isLoading }"
              :disabled="!isCodeValid || isLoading"
              @click="verifyCode"
            >
              {{ isLoading ? '확인 중...' : '다음' }}
            </button>

            <button class="resend-link" :disabled="isLoading" @click="resendCode">
              {{ isLoading ? '전송 중...' : '인증번호 다시 받기' }}
            </button>
          </div>
        </div>

        <!-- Step 3: Success -->
        <div v-if="currentStep === 3" class="step-content success-content">
          <div class="success-icon">
            <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
              <circle cx="19.5" cy="19.5" r="19.5" fill="#16A34A"/>
              <path d="M10 19.5L16 25.5L29 12.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <h1 class="success-title">인증이 완료 되었어요</h1>
          <p class="success-subtitle">EULGPT의 다양한 서비스와 헤택을 제공 받으실 수 있어요</p>

          <button class="home-btn" @click="goToHome">
            메인으로
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-wrapper">
      <div class="simple-footer">
        <span>개인정보 처리방침</span>
        <span class="divider">|</span>
        <span>Copyright ⓒ EULGPT. All Rights Reserved</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderSection from '../components/main/HeaderSection.vue'

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

// State
const currentStep = ref(1)
const email = ref('')
const verificationCode = ref('')
const codeSent = ref(false)
const isEmailValid = ref(false)
const isCodeValid = ref(false)
const showToast = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const timeLeft = ref(1200) // 20 minutes in seconds
let timerInterval: number | null = null

// Computed
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

// Methods
const validateEmail = () => {
  // Check if email ends with @g.eulji.ac.kr
  const emailPattern = /^[a-zA-Z0-9._%+-]+@g\.eulji\.ac\.kr$/
  isEmailValid.value = emailPattern.test(email.value)
  if (errorMessage.value) errorMessage.value = ''
}

const validateCode = () => {
  // Check if code is 6 digits
  isCodeValid.value = /^\d{6}$/.test(verificationCode.value)
  if (errorMessage.value) errorMessage.value = ''
}

const sendVerificationCode = async () => {
  if (!isEmailValid.value || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_BASE_URL}/member/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (response.ok) {
      codeSent.value = true
      startTimer()
      // Step 2로 자동 전환
      currentStep.value = 2
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    } else {
      errorMessage.value = data.detail || '인증번호 전송에 실패했습니다.'
    }
  } catch (error) {
    console.error('Error sending verification code:', error)
    errorMessage.value = '네트워크 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_BASE_URL}/member/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (response.ok) {
      // Reset timer
      timeLeft.value = 1200
      if (!timerInterval) startTimer()

      // Show toast
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    } else {
      errorMessage.value = data.detail || '인증번호 재전송에 실패했습니다.'
    }
  } catch (error) {
    console.error('Error resending verification code:', error)
    errorMessage.value = '네트워크 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

const verifyCode = async () => {
  if (!isCodeValid.value || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 인증번호를 정수로 변환
    const codeAsInt = parseInt(verificationCode.value, 10)

    console.log('[DEBUG] 인증 요청:', {
      email: email.value,
      code: codeAsInt,
      codeString: verificationCode.value
    })

    const response = await fetch(
      `${API_BASE_URL}/member/verify-pro?email=${encodeURIComponent(email.value)}&code=${codeAsInt}`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    )

    const data = await response.json()
    console.log('[DEBUG] 인증 응답:', response.status, data)

    if (response.ok) {
      console.log('[DEBUG] 인증 성공!')
      stopTimer()

      // Pro 인증 성공 - 사용자 정보 갱신
      await refreshUserInfo()

      currentStep.value = 3
    } else {
      console.error('[DEBUG] 인증 실패:', data.detail)
      errorMessage.value = data.detail || '인증번호가 올바르지 않습니다.'
    }
  } catch (error) {
    console.error('Error verifying code:', error)
    errorMessage.value = '네트워크 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 사용자 정보 갱신 함수
const refreshUserInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    if (!token) return

    const response = await fetch(`${API_BASE_URL}/member/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const userData = await response.json()
      console.log('[DEBUG] 사용자 정보 갱신 완료:', userData)

      // 로컬 스토리지에 Pro 상태 저장 (선택사항)
      if (userData.is_pro) {
        localStorage.setItem('user_is_pro', 'true')
      }
    }
  } catch (error) {
    console.error('사용자 정보 갱신 실패:', error)
  }
}

const goToStep2 = () => {
  currentStep.value = 2
}

const goToHome = () => {
  // Pro 인증 완료 후 메인으로 이동 - 페이지 리로드하여 최신 사용자 정보 반영
  window.location.href = '/'
}

const startTimer = () => {
  timerInterval = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      stopTimer()
      errorMessage.value = '인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요.'
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Cleanup
onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
/* Page Layout */
.pro-verification-page {
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
}

.pro-verification-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.verification-card {
  width: 100%;
  max-width: 407px;
  background: white;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.title {
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  color: #000000;
  margin: 0;
  white-space: pre-line;
}

/* Input Section */
.input-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Step 2 Specific Styles */
.step2-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.step2-title-email {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.step2-button-wrapper {
  display: flex;
  flex-direction: column;
  gap: 17px;
  align-items: center;
  width: 100%;
}

.error-message-step2 {
  color: #ef4444;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  padding: 0 4px;
  margin-top: -5px;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.email-input {
  flex: 1;
  max-width: 263px;
  height: 46px;
  padding: 10px 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.email-input::placeholder {
  color: #9CA3AF;
}

.email-input:focus {
  border-color: #02478A;
}

.email-input.disabled {
  background: #F3F4F6;
  color: #9CA3AF;
  cursor: not-allowed;
}

.email-input.error,
.verification-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  margin-top: -30px;
  padding: 0 4px;
}

.send-code-btn {
  width: 134px;
  height: 46px;
  padding: 13px 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #02478A;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.send-code-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-code-btn.active {
  color: #02478A;
  background: white;
  border-color: #E5E7EB;
  cursor: pointer;
}

.send-code-btn.active:hover {
  background: #F0F6FF;
}

/* Verification Input */
.code-input-wrapper {
  position: relative;
  width: 100%;
}

.verification-input {
  width: 100%;
  height: 46px;
  padding: 10px 80px 10px 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  border: 1.5px solid #02478A;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.verification-input::placeholder {
  color: #9CA3AF;
}

.timer {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #EF4444;
  line-height: 23px;
}

/* Buttons */
.next-btn {
  width: 100%;
  height: 48px;
  padding: 14px 60px;
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #02478A;
  background: #F0F6FF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  cursor: not-allowed;
  transition: all 0.2s;
}

.next-btn.active {
  color: #02478A;
  background: #F0F6FF;
  cursor: pointer;
}

.next-btn.active:hover {
  background: #E0ECFF;
}

.resend-link {
  width: 100%;
  background: none;
  border: none;
  color: #6B7280;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 25px;
  cursor: pointer;
  padding: 17px 0 0 0;
  text-align: center;
}

.resend-link:hover {
  color: #4B5563;
  text-decoration: underline;
}

.resend-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Toast */
.toast {
  position: fixed;
  top: 105px;
  left: 50%;
  transform: translateX(-50%);
  background: #F0F6FF;
  padding: 10px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast span {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #02478A;
  line-height: 25px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Step 3: Success */
.success-content {
  align-items: center;
  text-align: center;
  gap: 50px;
}

.success-icon {
  margin-bottom: 0;
}

.success-title {
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  color: #000000;
  margin: 0;
}

.success-subtitle {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 25px;
  color: #4B5563;
  margin: -20px 0 0 0;
}

.home-btn {
  width: 181px;
  height: 44px;
  padding: 13px 60px;
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #F0F6FF;
  background: #02478A;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: -10px;
}

.home-btn:hover {
  background: #013869;
}

/* Footer */
.footer-wrapper {
  width: 100%;
  background: white;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.simple-footer {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Pretendard', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #9CA3AF;
  line-height: 1;
}

.simple-footer .divider {
  margin: 0 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .verification-card {
    max-width: 100%;
    padding: 0 20px;
  }

  .title {
    font-size: 20px;
  }

  .success-title {
    font-size: 22px;
  }

  .input-row {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .email-input {
    max-width: 100%;
  }

  .send-code-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .pro-verification-container {
    padding: 20px 16px;
  }

  .title {
    font-size: 18px;
  }

  .email-input,
  .verification-input,
  .send-code-btn,
  .next-btn {
    font-size: 14px;
  }

  .success-title {
    font-size: 20px;
  }

  .success-subtitle {
    font-size: 14px;
  }

  .home-btn {
    width: 100%;
    font-size: 16px;
  }
}
</style>
