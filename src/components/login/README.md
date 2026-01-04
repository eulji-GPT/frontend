# Login Components

EULGPT 로그인 관련 Vue 컴포넌트들입니다.

## 컴포넌트 목록

### LoginComponent.vue
메인 로그인 페이지 컴포넌트입니다.

**특징:**
- 카카오 로그인 버튼 포함
- 로딩 상태 및 에러 처리
- 반응형 디자인

### SignupComponent.vue
회원가입 페이지 컴포넌트입니다.

**특징:**
- 카카오 회원가입 버튼 포함
- 서비스 혜택 안내
- 로그인 페이지로의 링크

### KakaoLoginButton.vue
재사용 가능한 카카오 로그인 버튼 컴포넌트입니다.

**Props:**
- `apiKey`: 카카오 REST API 키 (선택사항)
- `redirectUri`: 리다이렉트 URI (선택사항)

**Events:**
- `loginStart`: 로그인 시작 시 발생
- `loginError`: 로그인 오류 시 발생

## 사용법

```vue
<template>
  <div>
    <!-- 전체 로그인 페이지 -->
    <LoginComponent />
    
    <!-- 또는 개별 버튼만 사용 -->
    <KakaoLoginButton 
      :api-key="YOUR_API_KEY"
      :redirect-uri="REDIRECT_URI"
      @loginStart="handleStart"
      @loginError="handleError"
    />
  </div>
</template>

<script setup>
import { LoginComponent, KakaoLoginButton } from '@/components/login';

const handleStart = () => {
  console.log('로그인 시작');
};

const handleError = (error) => {
  console.error('로그인 오류:', error);
};
</script>
```

## 스타일링

모든 컴포넌트는 Pretendard 폰트와 EULGPT 브랜드 컬러를 사용합니다.
- Primary Color: #02478A
- Background Gradient: #E6EDF3 → #02478A
- Kakao Yellow: #FEE500

## 반응형 지원

모든 컴포넌트는 모바일 환경을 지원합니다:
- 500px 이하: 모바일 최적화 레이아웃
- 태블릿 및 데스크톱: 기본 레이아웃