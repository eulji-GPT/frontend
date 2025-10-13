<template>
  <div class="root-wrapper">
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
      <div class="signup-form-wrapper">
        <span class="signup-title">
          회원가입을 위해 <br/>
이메일 인증을 진행할게요
        </span>
        <div class="email-form-container">
          <div class="email-input-wrapper">
            <input 
              v-model="email" 
              type="email" 
              placeholder="이메일 주소 입력" 
              class="email-input"
            />
          </div>
          <div class="verify-button" @click="handleSendVerification">
            <div class="verify-button-inner">
              <span class="verify-text">인증번호 받기</span>
            </div>
          </div>
        </div>
        
        <!-- 인증번호 입력 필드 (인증번호 발송 후 표시) -->
        <div v-if="isVerificationSent" class="verification-input-wrapper">
          <input 
            v-model="verificationCode" 
            type="text" 
            placeholder="이메일로 발송된 6자리 인증번호" 
            class="verification-input"
            maxlength="6"
          />
          <span class="timer-text">{{ formattedTime }}</span>
        </div>
      </div>
      <div class="signup-actions">
        <div class="next-button" @click="handleNext">
          <div class="next-button-inner">
            <span class="next-text">다음</span>
          </div>
        </div>
        <span class="login-link" @click="handleGoToLogin">이미 계정이 있어요</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import HeaderSection from '../main/HeaderSection.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_FASTAPI_URL || '/api';
const email = ref('');
const verificationCode = ref('');
const isVerificationSent = ref(false);
const timeLeft = ref(300); // 5분 = 300초
let timer: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer!);
      timer = null;
      // 타이머 만료 처리
      isVerificationSent.value = false;
      alert('인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.');
    }
  }, 1000);
};

const handleSendVerification = async () => {
  if (!email.value) {
    alert('이메일 주소를 입력해주세요.');
    return;
  }

  // 이메일 형식 기본 확인
  if (!email.value.includes('@')) {
    alert('올바른 이메일 형식을 입력해주세요.');
    return;
  }

  try {
    // 기존 타이머가 있으면 정리
    if (timer) {
      clearInterval(timer);
    }

    console.log('이메일 중복 확인 중:', email.value);

    // 1. 이메일 중복 확인
    const checkResponse = await fetch(`${API_BASE_URL}/member/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    if (!checkResponse.ok) {
      const errorData = await checkResponse.json();
      alert(errorData.detail || '이미 사용 중인 이메일입니다.');
      return;
    }

    console.log('인증번호 발송 요청:', email.value);

    // 2. 인증번호 발송
    const response = await fetch(`${API_BASE_URL}/member/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '인증번호 전송에 실패했습니다.');
    }

    const result = await response.json();
    console.log('인증번호 전송 성공:', result);

    // 이메일 전송이 성공한 후에만 타이머 시작
    if (result.email_sent) {
      isVerificationSent.value = true;
      timeLeft.value = 300; // 5분 = 300초로 수정
      startTimer();

      alert('인증번호가 이메일로 전송되었습니다. 5분 내에 입력해주세요.');
    } else {
      throw new Error('이메일 전송 상태를 확인할 수 없습니다.');
    }

  } catch (error) {
    console.error('인증번호 전송 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '인증번호 전송에 실패했습니다. 다시 시도해주세요.';
    alert(errorMessage);
  }
};

const handleNext = async () => {
  if (!isVerificationSent.value) {
    alert('먼저 인증번호를 요청해주세요.');
    return;
  }
  if (!verificationCode.value) {
    alert('인증번호를 입력해주세요.');
    return;
  }

  try {
    console.log('인증번호 확인 중:', { email: email.value, code: verificationCode.value });

    // 백엔드 API 호출
    const response = await fetch(`${API_BASE_URL}/member/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        code: parseInt(verificationCode.value)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '인증번호가 올바르지 않습니다.');
    }

    const result = await response.json();
    console.log('인증번호 확인 성공:', result);

    // 이메일을 localStorage에 저장
    localStorage.setItem('signup_email', email.value);

    // 인증이 성공하면 동의 페이지로 이동
    router.push('/signup-agreement');

  } catch (error) {
    console.error('인증번호 확인 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '인증번호 확인에 실패했습니다. 다시 시도해주세요.';
    alert(errorMessage);
  }
};

const handleGoToLogin = () => {
  router.push('/login');
};

// 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
/* 메인 래퍼 */
.root-wrapper {
  min-height: 100vh;
  background-color: white;
  position: relative;
}

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

/* 메인 컨텐츠 - React Frame2147227417과 동일 */
.frame-main-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 60px;
  width: 407px;
  height: 306px;
  background-color: white;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 203px);
  top: 267px;
}

/* 회원가입 폼 래퍼 - React Frame2147227416과 동일 */
.signup-form-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 제목 - React NaN_0009와 동일 */
.signup-title {
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

/* 이메일 폼 컨테이너 - React Frame2147227413과 동일 */
.email-form-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 이메일 입력 래퍼 - React Frame2147227411과 동일 */
.email-input-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 4px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 10px;
  width: 263px;
  height: 46px;
  box-sizing: border-box;
  padding: 10px 20px;
}

/* 이메일 입력 필드 */
.email-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: rgb(55, 65, 81);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: left;
}

.email-input::placeholder {
  color: rgb(156, 163, 175);
}

/* 인증번호 버튼 - React ButtonPc와 동일 */
.verify-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 12px;
  width: 134px;
  background-color: white;
  box-sizing: border-box;
  padding: 13px 60px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.verify-button:hover {
  background-color: rgb(240, 246, 255);
}

.verify-button-inner {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.verify-text {
  color: rgb(2, 71, 138);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: left;
}

/* 회원가입 액션들 - React Frame2147227415와 동일 */
.signup-actions {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 17px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 다음 버튼 - React ButtonPc_0001과 동일 */
.next-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 12px;
  align-self: stretch;
  background-color: rgb(240, 246, 255);
  box-sizing: border-box;
  padding: 14px 60px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-button:hover {
  background-color: rgb(224, 236, 255);
}

.next-button-inner {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.next-text {
  color: rgb(2, 71, 138);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: left;
}

/* 로그인 링크 - React NaN_0011과 동일 */
.login-link {
  color: rgb(107, 114, 128);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: center;
  align-self: stretch;
  flex-shrink: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: rgb(2, 71, 138);
}

/* 인증번호 입력 래퍼 - React RootWrapperFrame2147227411과 동일 */
.verification-input-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  border: solid 1px rgb(2, 71, 138);
  border-radius: 10px;
  align-self: stretch;
  width: 407px;
  height: 46px;
  box-sizing: border-box;
  padding: 10px 20px;
  flex-shrink: 0;
  margin-top: 20px;
}

/* 인증번호 입력 필드 */
.verification-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: rgb(55, 65, 81);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: left;
  margin-right: 10px;
}

.verification-input::placeholder {
  color: rgb(156, 163, 175);
}

/* 타이머 텍스트 - React _2000과 동일 */
.timer-text {
  color: rgb(239, 68, 68);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  flex-shrink: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .frame-main-content {
    width: 90%;
    left: 5%;
    top: calc(50vh - 150px);
    height: auto;
  }
  
  .common-footer-notice {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
  }
  
  .email-form-container {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
  
  .email-input-wrapper {
    width: 100%;
  }
  
  .verify-button {
    width: 100%;
    padding: 15px 20px;
  }
  
  .verification-input-wrapper {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .frame-main-content {
    width: 95%;
    left: 2.5%;
    top: calc(50vh - 120px);
    gap: 40px;
  }
  
  .signup-title {
    font-size: 20px;
  }
  
  .signup-form-wrapper {
    gap: 30px;
  }
  
  .next-button {
    padding: 15px 20px;
  }
  
  .verify-text,
  .next-text {
    font-size: 16px;
  }
  
  .common-footer-notice {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .verification-input-wrapper {
    width: 100%;
  }
}
</style>