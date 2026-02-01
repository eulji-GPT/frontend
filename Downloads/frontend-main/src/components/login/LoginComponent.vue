<template>
  <div class="login-page-wrapper">
    <!-- 헤더 -->
    <HeaderSection />

    <!-- 푸터 -->
    <div class="common-footer-notice">
      <span class="footer-text">개인정보 처리방침</span>
      <span class="footer-separator">|</span>
      <span class="footer-copyright">Copyright ⓒ EULGPT. All Rights Reserved</span>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="frame-main-content">
      <span class="title-text">
        내가 찾던 정보, <br />
        이제 쉽게 만나요.
      </span>

      <div class="frame-2147227518">
        <!-- EULGPT 계정 회원가입 섹션 완전 제거 (카카오 전용) -->

        <div class="frame-2147227519">
          <!-- 구분선 완전 제거 (카카오 버튼만 있으므로 불필요) -->
          <div class="frame-2147227518-inner">
            <div class="button-pc-yellow" @click="handleKakaoLogin">
              <div class="frame-2147227341-inner">
                <div class="kakao-icon">💬</div>
                <span class="text-black">카카오 계정으로 회원가입</span>
              </div>
            </div>
            <!-- 개발 환경 전용: 이메일 로그인 토글 버튼 -->
            <div v-if="isDevelopment" class="frame-2147227520">
              <span class="text-gray" @click="handleLogin">
                {{ showLoginForm ? '로그인 폼 닫기' : '이메일로 로그인' }}
              </span>
            </div>

            <!-- 개발 환경 전용: 이메일 로그인 폼 -->
            <form v-if="isDevelopment && showLoginForm" class="login-form" @submit.prevent="submitLogin">
              <div class="form-group">
                <label for="login-email" class="visually-hidden">이메일</label>
                <input
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  placeholder="이메일 주소"
                  class="form-input"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="form-group">
                <label for="login-password" class="visually-hidden">비밀번호</label>
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  type="password"
                  placeholder="비밀번호"
                  class="form-input"
                  autocomplete="current-password"
                  required
                />
              </div>
              <button
                type="submit"
                :disabled="isLoading"
                class="login-submit-btn"
              >
                {{ isLoading ? '로그인 중...' : '로그인' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 로딩/에러 상태 -->
    <div v-if="isLoading" class="loading-indicator">
      로그인 중...
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import HeaderSection from '../main/HeaderSection.vue';
import { AuthService } from '../../services/auth';
import { healthAPI } from '../../services/api';

const router = useRouter();
const authService = AuthService.getInstance();

// 개발 환경 감지 (이메일 로그인은 개발 환경에서만 표시)
// 환경변수 또는 localhost 접속 시 개발 환경으로 간주
const isDevelopment = computed(() => {
  const envForceEnable = import.meta.env.VITE_ENABLE_EMAIL_LOGIN === 'true';
  const isDevMode = import.meta.env.DEV;
  const isLocalhost = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';
  const isDevEnvironment = envForceEnable || isDevMode || isLocalhost;

  console.log('[Dev Check]', {
    envForceEnable,
    isDevMode,
    isLocalhost,
    hostname: window.location.hostname,
    result: isDevEnvironment
  });

  return isDevEnvironment;
});

// 환경변수에서 카카오 설정 가져오기
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY || '6946f5fc07f24c4ab3e161bab6de3b4a';
// 프로덕션에서는 현재 도메인 사용, 개발환경에서는 환경변수 또는 localhost 사용
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/kakao/callback`;

const isLoading = ref(false);
const errorMessage = ref('');

// 백엔드 연결 테스트
const testBackendConnection = async () => {
  try {
    const response = await healthAPI.checkHealth();
    console.log('Backend connection successful');
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    errorMessage.value = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
    return false;
  }
};

const handleEulgptSignup = async () => {
  // 백엔드 연결 확인 후 이메일 인증 페이지로 이동
  const isConnected = await testBackendConnection();
  if (isConnected) {
    router.push('/signup-email');
  }
};

const handleKakaoLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // 백엔드 연결 확인
    const isConnected = await testBackendConnection();
    if (!isConnected) {
      isLoading.value = false;
      return;
    }
    
    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${KAKAO_REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code`;
    
    window.location.href = kakaoAuthUrl;
  } catch (error) {
    isLoading.value = false;
    errorMessage.value = '로그인 중 오류가 발생했습니다.';
  }
};

// 간단한 로그인 폼을 위한 상태
const showLoginForm = ref(false);
const loginForm = ref({
  email: '',
  password: ''
});

const handleLogin = () => {
  showLoginForm.value = !showLoginForm.value;
  errorMessage.value = '';
};

const submitLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = '이메일과 비밀번호를 입력해주세요.';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    const result = await authService.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    });
    
    console.log('Login successful');
    
    // 메인 페이지로 이동 (또는 채팅 페이지)
    router.push('/');
    
  } catch (error: any) {
    errorMessage.value = error.message || '로그인에 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

const handleFindAccount = () => {
  // 계정 찾기 기능은 나중에 구현
  alert('계정 찾기 기능은 준비 중입니다.');
};

// 컴포넌트 마운트 시 백엔드 연결 테스트
import { onMounted } from 'vue';
onMounted(() => {
  testBackendConnection();
});
</script>

<style scoped>
/* 메인 래퍼 - 헤더 포함한 전체 페이지 */
.login-page-wrapper {
  min-height: 100vh;
  background-color: white;
  position: relative;
}

/* 헤더 컴포넌트 사용으로 헤더 스타일 제거 */

/* 푸터 - React CommonFooterNotice와 동일 */
.common-footer-notice {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
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

/* 메인 컨텐츠 - 기존 헤더를 고려한 위치 조정 */
.frame-main-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px; /* gap 줄임 */
  align-self: stretch;
  width: 407px;
  height: 370px;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 203px);
  top: 120px; /* 더 위로 이동 */
  flex-shrink: 0;
}

.title-text {
  color: black;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.frame-2147227518 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  height: 199px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.frame-2147227608 {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.button-pc {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 4px 4px 0px rgb(240, 246, 255);
  border-radius: 12px;
  align-self: stretch;
  height: 50px;
  background-color: rgb(2, 71, 138);
  box-sizing: border-box;
  padding: 15px 60px;
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.button-pc:hover {
  background-color: rgb(1, 60, 118);
  transform: translateY(-1px);
}

.frame-2147227341 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
}

.frame-2147227341-inner {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.text-white {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: center;
}

.frame-2147227609 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 5px;
  box-sizing: border-box;
}

.eulgpt-text {
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: center;
}

.union-icon {
  width: 10px;
  height: 10px;
  transform: rotate(-15deg);
  transform-origin: top left;
  font-size: 10px;
}

.frame-2147227519 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.line-103 {
  height: 0px;
  border-top: solid 1px rgb(229, 231, 235);
  align-self: stretch;
  flex-shrink: 0;
}

.frame-2147227518-inner {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.button-pc-yellow {
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
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.button-pc-yellow:hover {
  background-color: rgb(254, 215, 0);
  transform: translateY(-1px);
}

.kakao-icon {
  width: 18px;
  height: 18px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-black {
  color: black;
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: center;
}

.frame-2147227520 {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  width: 407px;
  box-sizing: border-box;
  padding: 0px 10px;
}

.text-gray {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

.text-gray:hover {
  color: rgb(2, 71, 138);
}

.dot {
  color: rgb(229, 231, 235);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
}

.loading-indicator {
  margin-top: 1rem;
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

.error-message {
  margin-top: 1rem;
  color: var(--color-error);
  font-size: 0.9rem;
  text-align: center;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  width: 100%;
  box-sizing: border-box;
}

/* 상태 표시 */
.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-primary);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  background: var(--color-card-bg);
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.error-message {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-error);
  font-size: 0.9rem;
  text-align: center;
  background: #fee2e2;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  max-width: 350px;
  width: auto;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
  z-index: 9999;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .frame-main-content {
    width: 90%;
    left: 5%;
    top: 120px;
    height: auto;
  }
  
  .common-footer-notice {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
  }
}

@media (max-width: 480px) {
  .frame-main-content {
    width: 95%;
    left: 2.5%;
    top: 100px;
    gap: 30px;
  }
  
  .title-text {
    font-size: 20px;
  }
  
  .frame-2147227518 {
    gap: 30px;
    height: auto;
  }
  
  .button-pc,
  .button-pc-yellow {
    padding: 15px 30px;
    font-size: 14px;
  }
  
  .frame-2147227520 {
    width: 100%;
  }
  
  .common-footer-notice {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}

/* 로그인 폼 스타일 */
.login-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--color-card-border);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid var(--color-input-border);
  border-radius: 8px;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  background: var(--color-input-bg);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-input-focus-border);
  box-shadow: 0 0 0 3px rgba(2, 71, 138, 0.1);
}

.form-input::placeholder {
  color: var(--color-input-placeholder);
}

.login-submit-btn {
  padding: 12px 16px;
  background-color: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.login-submit-btn:hover:not(:disabled) {
  background-color: var(--color-button-primary-hover);
  transform: translateY(-1px);
}

.login-submit-btn:disabled {
  background-color: var(--color-text-disabled);
  cursor: not-allowed;
  transform: none;
}

/* 접근성을 위한 시각적으로 숨김 클래스 */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>