<template>
  <div class="callback-wrapper">
    <div class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">카카오 로그인 처리 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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

const API_BASE_URL = getApiBaseUrl();

onMounted(async () => {
  try {
    // URL에서 인가 코드 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      throw new Error('인가 코드를 받지 못했습니다.');
    }

    console.log('카카오 인가 코드:', code);

    // 백엔드로 인가 코드 전송
    const response = await fetch(`${API_BASE_URL}/member/kakao/callback?code=${code}`, {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '카카오 로그인에 실패했습니다.');
    }

    const data = await response.json();
    console.log('카카오 로그인 응답:', data);

    // 로그인 성공
    if (data.status === 'success' && data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_id', data.user_id);

      alert('카카오 로그인에 성공했습니다!');
      router.push('/chat');
      return;
    }

    throw new Error('알 수 없는 응답 형식입니다.');

  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '카카오 로그인 중 오류가 발생했습니다.';
    alert(errorMessage);
    router.push('/login');
  }
});
</script>

<style scoped>
.callback-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgb(229, 231, 235);
  border-top: 4px solid rgb(2, 71, 138);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: rgb(55, 65, 81);
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  text-align: center;
}
</style>
