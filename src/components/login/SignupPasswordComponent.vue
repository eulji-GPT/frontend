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
      <div class="password-form-wrapper">
        <span class="password-title">
          로그인에 사용할 <br/>
비밀번호를 입력해 주세요
        </span>
        <div class="password-form-container">
          <span class="password-label">비밀번호</span>
          <div class="password-inputs-container">
            <!-- 첫 번째 비밀번호 입력 -->
            <div class="password-input-wrapper">
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="영문, 숫자, 특수문자가 모두 들어간 8-16자"
                class="password-input"
                @input="validatePassword"
              />
              <button 
                @click="togglePasswordVisibility"
                class="eye-button"
                type="button"
              >
                <img 
                  :src="showPassword ? eyeIcon : eyeSlashIcon" 
                  alt="toggle password visibility"
                  class="eye-icon"
                />
              </button>
            </div>
            
            <!-- 두 번째 비밀번호 입력 (확인) -->
            <div class="password-input-wrapper">
              <input 
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="한번 더 입력해 주세요."
                class="password-input"
                @input="validateConfirmPassword"
              />
              <button 
                @click="toggleConfirmPasswordVisibility"
                class="eye-button"
                type="button"
              >
                <img 
                  :src="showConfirmPassword ? eyeIcon : eyeSlashIcon" 
                  alt="toggle password visibility"
                  class="eye-icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 확인 버튼 -->
      <div class="confirm-button" @click="handleConfirm">
        <div class="confirm-button-inner">
          <span class="confirm-text">확인</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HeaderSection from '../main/HeaderSection.vue';
import { useRouter } from 'vue-router';
import eyeIcon from '@/assets/eye.svg';
import eyeSlashIcon from '@/assets/eye-slash.svg';

const router = useRouter();

// 비밀번호 상태
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 비밀번호 유효성 검사
const isPasswordValid = ref(false);
const isConfirmPasswordValid = ref(false);

// 비밀번호 유효성 검사 함수
const validatePassword = () => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  isPasswordValid.value = passwordRegex.test(password.value);
  console.log('비밀번호 유효성 검사:', password.value, '결과:', isPasswordValid.value);
};

// 비밀번호 확인 유효성 검사 함수
const validateConfirmPassword = () => {
  isConfirmPasswordValid.value = password.value === confirmPassword.value && confirmPassword.value.length > 0;
  console.log('비밀번호 확인 유효성 검사:', confirmPassword.value, '결과:', isConfirmPasswordValid.value);
};

// 전체 유효성 검사
const isFormValid = computed(() => {
  return isPasswordValid.value && isConfirmPasswordValid.value;
});

// 비밀번호 보기/숨기기 토글
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 확인 버튼 클릭 처리
const handleConfirm = () => {
  console.log('확인 버튼 클릭됨');
  console.log('비밀번호 유효성:', isPasswordValid.value);
  console.log('비밀번호 확인 유효성:', isConfirmPasswordValid.value);
  console.log('폼 전체 유효성:', isFormValid.value);
  
  if (!isPasswordValid.value) {
    alert('비밀번호는 영문, 숫자, 특수문자가 모두 포함된 8-16자로 입력해주세요.');
    return;
  }
  
  if (!isConfirmPasswordValid.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  
  console.log('비밀번호 설정 완료:', password.value);
  
  // 이메일과 비밀번호를 localStorage에 저장
  const signupEmail = localStorage.getItem('signup_email');
  if (signupEmail) {
    localStorage.setItem('signup_password', password.value);
    console.log('비밀번호가 localStorage에 저장됨');
  } else {
    console.error('signup_email이 localStorage에 없음');
    alert('이메일 정보가 없습니다. 처음부터 다시 시도해주세요.');
    router.push('/signup-email');
    return;
  }
  
  // 개인정보 입력 페이지로 이동
  console.log('개인정보 입력 페이지로 이동');
  router.push('/signup-form');
};
</script>

<style scoped>
/* 메인 래퍼 */
.root-wrapper {
  min-height: 100vh;
  background-color: white;
  position: relative;
}

/* 푸터 - 기존 스타일과 동일 */
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

/* 메인 컨텐츠 */
.frame-main-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 60px;
  width: 407px;
  height: 352px;
  background-color: white;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 203px);
  top: 244px;
}

/* 비밀번호 폼 래퍼 */
.password-form-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 제목 */
.password-title {
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

/* 비밀번호 폼 컨테이너 */
.password-form-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 10px;
  width: 407px;
  box-sizing: border-box;
}

/* 비밀번호 라벨 */
.password-label {
  color: black;
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

/* 비밀번호 입력 컨테이너 */
.password-inputs-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 비밀번호 입력 래퍼 */
.password-input-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 10px;
  align-self: stretch;
  height: 46px;
  box-sizing: border-box;
  padding: 10px 20px;
  flex-shrink: 0;
  position: relative;
}

/* 비밀번호 입력 필드 */
.password-input {
  color: rgb(55, 65, 81);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: left;
  width: 353px;
  border: none;
  outline: none;
  background: transparent;
}

.password-input::placeholder {
  color: rgb(156, 163, 175);
}

/* 눈 모양 버튼 */
.eye-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
}

/* 확인 버튼 */
.confirm-button {
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
  padding: 13px 60px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.confirm-button:hover {
  background-color: rgb(224, 236, 255);
}

.confirm-button-inner {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.confirm-text {
  color: rgb(2, 71, 138);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: left;
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
  
  .password-form-container {
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
  
  .password-title {
    font-size: 20px;
  }
  
  .confirm-button {
    padding: 15px 20px;
  }
  
  .confirm-text {
    font-size: 16px;
  }
  
  .common-footer-notice {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
