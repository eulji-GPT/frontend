<template>
  <div class="login-container">
    <div class="login-card">
      <img src="/src/assets/logo.svg" alt="로고" class="login-logo" />
      <h2 class="login-title">카카오톡으로 간편 로그인</h2>
      <button class="kakao-login-btn" @click="kakaoLogin">
        <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="카카오 로그인" class="kakao-icon" />
        <span>카카오로 로그인</span>
      </button>
      <p class="login-desc">로그인하면 챗봇의 모든 기능을 이용할 수 있습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const KAKAO_REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY'; // 실제 REST API 키로 교체
const REDIRECT_URI = window.location.origin + '/login';

function kakaoLogin() {
  const kakaoAuthUrl =
    `https://kauth.kakao.com/oauth/authorize?` +
    `client_id=${KAKAO_REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;
  window.location.href = kakaoAuthUrl;
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #E6EDF3 0%, #02478A 100%);
}
.login-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 #B3C8DC33;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 340px;
}
  .login-logo {
    width: 72px;
    margin-bottom: 1.5rem;
  }
  .login-title {
    font-family: 'Pretendard', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #02478A;
    margin-bottom: 2rem;
  }
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
    transition: background 0.2s, box-shadow 0.2s;
  }
  .kakao-login-btn:hover {
    background: #ffe14a;
    box-shadow: 0 4px 16px 0 #FEE50055;
  }
  .kakao-icon {
    width: 28px;
    height: 28px;
  }
  .login-desc {
    margin-top: 2.2rem;
    color: #888;
    font-size: 1rem;
    text-align: center;
  }
  @media (max-width: 500px) {
    .login-card {
      min-width: 90vw;
      padding: 2rem 1rem;
    }
    .login-logo {
      width: 56px;
    }
  }
</style>
