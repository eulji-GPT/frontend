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
import { setUserInfo } from '../utils/auth';

const router = useRouter();

// Railway 내부 URL(.railway.internal)은 브라우저에서 접근 불가하므로 외부 URL로 대체
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_FASTAPI_URL;

  // Railway 내부 URL 감지 및 외부 URL로 대체
  if (envUrl && envUrl.includes('.railway.internal')) {
    
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
  // 연동 요청 여부를 try 블록 밖에서 선언 (catch에서도 접근 가능하도록)
  let isLinkingRequest = false;

  try {
    // URL에서 인가 코드와 state 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code) {
      throw new Error('인가 코드를 받지 못했습니다.');
    }

    console.log('카카오 인가 코드:', code);
    console.log('카카오 state:', state);

    // 계정 연동 요청인 경우 (state가 'link:'로 시작)
    isLinkingRequest = !!(state && state.startsWith('link:'));

    // 백엔드로 인가 코드 전송 (state 포함)
    let callbackUrl = `${API_BASE_URL}/member/kakao/callback?code=${code}`;
    if (state) {
      callbackUrl += `&state=${encodeURIComponent(state)}`;
    }

    const response = await fetch(callbackUrl, {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
      redirect: 'follow', // 리다이렉트 따라가기
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '카카오 로그인에 실패했습니다.');
    }

    const data = await response.json();
    console.log('카카오 응답:', data);

    // 카카오 계정 연동 성공
    if (data.status === 'link_success') {
      alert('카카오 계정 연동이 완료되었습니다!');
      router.push('/chat?kakao_link=success');
      return;
    }

    // 로그인 성공
    if (data.status === 'success' && data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_id', data.user_id);

      // 사용자 정보 조회 및 저장
      try {
        const meResponse = await fetch(`${API_BASE_URL}/member/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        if (meResponse.ok) {
          const userInfo = await meResponse.json();
          setUserInfo(userInfo);
        }
      } catch (e) {
        console.error('사용자 정보 조회 실패:', e);
      }

      alert('카카오 로그인에 성공했습니다!');
      router.push('/chat');
      return;
    }

    throw new Error('알 수 없는 응답 형식입니다.');

  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '카카오 로그인 중 오류가 발생했습니다.';
    alert(errorMessage);

    // 연동 요청 실패 시 채팅 페이지로, 로그인 실패 시 로그인 페이지로
    if (isLinkingRequest) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
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
