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
        <div class="frame-2147227608">
          <div class="button-pc" @click="handleEulgptSignup">
            <div class="frame-2147227341">
              <div class="frame-2147227341-inner">
                <span class="text-white">EULGPT 계정으로 회원가입</span>
              </div>
            </div>
          </div>
          <div class="frame-2147227609">
            <span class="eulgpt-text">EULGPT로 가입하면 프리미엄 이용이 가능해요</span>
            <div class="union-icon">✨</div>
          </div>
        </div>

        <div class="frame-2147227519">
          <div class="line-103"></div>
          <div class="frame-2147227518-inner">
            <div class="button-pc-yellow" @click="handleKakaoLogin">
              <div class="frame-2147227341-inner">
                <div class="kakao-icon">💬</div>
                <span class="text-black">카카오 계정으로 회원가입</span>
              </div>
            </div>
            <div class="frame-2147227520">
              <span class="text-gray" @click="handleLogin">로그인</span>
              <span class="dot">•</span>
              <span class="text-gray" @click="handleFindAccount">내 계정 찾기</span>
            </div>
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
import { ref } from 'vue';
import HeaderSection from '../main/HeaderSection.vue';

const KAKAO_REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY';
const REDIRECT_URI = window.location.origin + '/login';

const isLoading = ref(false);
const errorMessage = ref('');

const handleEulgptSignup = () => {
  // EULGPT 직접 회원가입 로직
  console.log('EULGPT 회원가입');
};

const handleKakaoLogin = () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
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

const handleLogin = () => {
  // 로그인 페이지로 이동 또는 로그인 모달 표시
  console.log('로그인');
};

const handleFindAccount = () => {
  // 계정 찾기 로직
  console.log('계정 찾기');
};
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
  gap: 50px;
  align-self: stretch;
  width: 407px;
  height: 370px;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 203px);
  top: calc(50vh - 185px); /* 전체 뷰포트 기준으로 중앙 배치 */
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
  color: #02478A;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

.error-message {
  margin-top: 1rem;
  color: #dc2626;
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
  color: #02478A;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  background: white;
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
  color: #dc2626;
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
}

@media (max-width: 480px) {
  .frame-main-content {
    width: 95%;
    left: 2.5%;
    top: calc(50vh - 120px);
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
</style>