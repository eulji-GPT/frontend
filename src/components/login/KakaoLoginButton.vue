<template>
  <button class="kakao-login-btn" @click="handleKakaoLogin">
    <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="카카오 로그인" class="kakao-icon" />
    <span>카카오로 로그인</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  apiKey?: string;
  redirectUri?: string;
}>();

const emit = defineEmits<{
  loginStart: [];
  loginError: [error: string];
}>();

function handleKakaoLogin() {
  try {
    const kakaoApiKey = props.apiKey || 'YOUR_KAKAO_REST_API_KEY';
    const redirectUri = props.redirectUri || (window.location.origin + '/login');
    
    emit('loginStart');
    
    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${kakaoApiKey}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`;
    
    window.location.href = kakaoAuthUrl;
  } catch (error) {
    emit('loginError', '로그인 중 오류가 발생했습니다.');
  }
}
</script>

<style scoped>
.kakao-login-btn {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #FEE500;
  color: #3C1E1E;
  border: none;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.9rem 2.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 #B3C8DC33;
  transition: all 0.2s ease;
  font-family: 'Pretendard', sans-serif;
}

.kakao-login-btn:hover {
  background: #ffe14a;
  box-shadow: 0 4px 16px 0 #FEE50055;
  transform: translateY(-1px);
}

.kakao-login-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px 0 #B3C8DC33;
}

.kakao-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

@media (max-width: 500px) {
  .kakao-login-btn {
    font-size: 1rem;
    padding: 0.8rem 1.8rem;
    gap: 0.5rem;
  }
  
  .kakao-icon {
    width: 24px;
    height: 24px;
  }
}
</style>