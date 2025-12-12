# EulGPT 디자인 시스템 가이드

이 문서는 EulGPT 프론트엔드의 디자인 시스템을 정의합니다. 모든 새로운 컴포넌트는 이 가이드를 따라야 합니다.

## 1. 컬러 팔레트

### Primary Colors
```css
--primary-400: #02478A;     /* 메인 파란색 - 버튼, 강조 */
--primary-300: #F0F6FF;     /* 밝은 파란색 - 배경, 채팅 버블 */
--primary-200: #F3F8FF;     /* 매우 밝은 파란색 - 라이트 배경 */
--primary-hover: #013C74;   /* 호버 상태 */
```

### Neutral Colors
```css
--black: #000000;
--white: #FFFFFF;
--gray-100: #F3F4F6;        /* 라이트 배경 */
--gray-200: #E5E7EB;        /* 테두리 */
--gray-300: #D1D5DB;        /* 테두리 (진함) */
--gray-400: #9CA3AF;        /* 플레이스홀더 */
--gray-600: #1F2937;        /* 바디 텍스트 */
--gray-700: #374151;        /* 강조 텍스트 */
```

### Semantic Colors
```css
--success: #10B981;         /* 성공, 완료 */
--warning: #F59E0B;         /* 경고, Pro 배지 */
--error: #DC2626;           /* 에러 */
--error-bg: #FEE2E2;        /* 에러 배경 */
--info: #DBEAFE;            /* 정보 배경 */
--kakao: #FEE502;           /* 카카오 */
```

### Gradients
```css
--gradient-primary: linear-gradient(254deg, #17315F 5.17%, #02478A 45.43%, #0A6ECF 80.95%);
--gradient-premium: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 2. 타이포그래피

### 폰트 패밀리
```css
font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### 폰트 스케일
| 용도 | 크기 | 굵기 | 라인높이 |
|------|------|------|---------|
| Hero Title | 64px | 700 | 90px |
| Section Title | 36px | 700 | 150% |
| Subtitle | 24px | 600 | 140% |
| Body | 16px | 500 | 1.5 |
| Button | 16px | 600 | 25px |
| Small | 14px | 500 | 23px |
| Caption | 12px | 500 | normal |

### 사용 예시
```css
/* Hero Title */
.hero-title {
  font-size: 64px;
  font-weight: 700;
  line-height: 90px;
}

/* Section Title */
.section-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 150%;
  color: #1F2937;
}

/* Body Text */
.body-text {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: #1F2937;
}
```

## 3. 간격 시스템

### Spacing Scale
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-2xl: 24px;
--spacing-3xl: 32px;
--spacing-4xl: 40px;
--spacing-5xl: 56px;
```

### 컴포넌트별 패딩
- **버튼**: `13px 60px` (large), `13px 24px` (standard)
- **카드**: `20px - 35px`
- **입력필드**: `12px 16px`
- **모달**: `24px - 32px`

## 4. 버튼 스타일

### Primary Button
```css
.btn-primary {
  background-color: #02478A;
  color: #F0F6FF;
  padding: 13px 60px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #02478A;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #013C74;
  transform: translateY(-1px);
  box-shadow: 0px 6px 8px 0px rgba(2, 71, 138, 0.35);
}
```

### Secondary Button
```css
.btn-secondary {
  background-color: #F3F4F6;
  color: #1F2937;
  padding: 13px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #E5E7EB;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #E5E7EB;
}
```

### Icon Button
```css
.btn-icon {
  width: 34px;
  height: 34px;
  padding: 6px;
  border-radius: 100px;
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: #F3F4F6;
}

.btn-icon.active {
  background-color: #02478A;
  border-color: #02478A;
  color: white;
}
```

## 5. 카드 스타일

### Standard Card
```css
.card {
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #F3F4F6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Chat Bubble (User)
```css
.chat-bubble-user {
  background-color: #F0F6FF;
  border: 1px solid #F3F4F6;
  border-radius: 30px;
  padding: 10px 20px;
  max-width: 550px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
```

### Chat Bubble (Bot)
```css
.chat-bubble-bot {
  background-color: transparent;
  border: none;
  padding: 16px 20px;
  max-width: 770px;
}
```

### Feature Card
```css
.feature-card {
  background-color: #FFFFFF;
  border-radius: 30px;
  padding: 35px;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
```

## 6. 입력 필드 스타일

### Text Input
```css
.input-text {
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 400;
  background: white;
  transition: all 0.2s ease;
}

.input-text:focus {
  border-color: #02478A;
  box-shadow: 0 0 0 3px rgba(2, 71, 138, 0.1);
  outline: none;
}

.input-text::placeholder {
  color: #9CA3AF;
}
```

### Textarea (Chat)
```css
.chat-textarea {
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  max-height: 150px;
  resize: none;
  line-height: 25px;
}

.chat-textarea::placeholder {
  color: #9CA3AF;
}
```

## 7. 반응형 브레이크포인트

```css
/* Desktop */
@media (min-width: 1024px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Mobile */
@media (max-width: 768px) { }

/* Small Mobile */
@media (max-width: 480px) { }
```

### 반응형 조정 예시
```css
/* 컨테이너 패딩 */
.container {
  padding: 0 180px;  /* Desktop */
}

@media (max-width: 1024px) {
  .container {
    padding: 0 100px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
}

/* 채팅 버블 너비 */
.chat-bubble {
  max-width: 70%;  /* Desktop */
}

@media (max-width: 768px) {
  .chat-bubble {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .chat-bubble {
    max-width: 90%;
  }
}
```

## 8. 애니메이션

### 기본 트랜지션
```css
transition: all 0.2s ease;      /* 기본 */
transition: all 0.3s ease;      /* 느린 전환 */
```

### 버블 등장
```css
@keyframes bubbleAppear {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.bubble-enter {
  animation: bubbleAppear 0.3s ease-out;
}
```

### 로딩 스피너
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### 펄스
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 9. 그림자

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);

--shadow-button: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
--shadow-button-hover: 0px 6px 8px 0px rgba(2, 71, 138, 0.35);
--shadow-chat: 0 4px 12px rgba(102, 126, 234, 0.3);
--shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## 10. 테두리

### Border Radius
```css
--radius-full: 100px;    /* 완전 원형 */
--radius-xl: 30px;       /* 큰 카드 */
--radius-lg: 20px;       /* 모달 */
--radius-md: 16px;       /* 입력 컨테이너 */
--radius-sm: 12px;       /* 버튼, 폼 */
--radius-xs: 8px;        /* 작은 요소 */
```

### Border Colors
```css
--border-light: #F3F4F6;
--border-default: #E5E7EB;
--border-medium: #D1D5DB;
--border-focus: #02478A;
```

## 11. 컴포넌트 템플릿

### 기본 버튼 컴포넌트
```vue
<template>
  <button
    class="btn"
    :class="[variant, size]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn.primary {
  background-color: #02478A;
  color: #F0F6FF;
  border: 1px solid #02478A;
}

.btn.primary:hover:not(:disabled) {
  background-color: #013C74;
  transform: translateY(-1px);
}

.btn.secondary {
  background-color: #F3F4F6;
  color: #1F2937;
  border: 1px solid #E5E7EB;
}

.btn.lg {
  padding: 13px 60px;
  font-size: 16px;
  border-radius: 12px;
}

.btn.md {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 8px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### 기본 카드 컴포넌트
```vue
<template>
  <div class="card" :class="{ hoverable }">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #F3F4F6;
}

.card.hoverable {
  transition: all 0.3s ease;
  cursor: pointer;
}

.card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
```

## 12. 접근성 가이드라인

- 모든 인터랙티브 요소에 `cursor: pointer` 적용
- 포커스 상태에 명확한 시각적 표시 제공
- 충분한 색상 대비 유지 (최소 4.5:1)
- 터치 타겟 최소 44x44px 유지
- 키보드 네비게이션 지원

## 13. 네이밍 컨벤션

### CSS 클래스
- BEM 스타일 또는 컴포넌트 기반 네이밍
- 예: `.chat-bubble`, `.chat-bubble--user`, `.chat-bubble__content`

### 파일 구조
```
components/
├── common/          # 공통 UI 컴포넌트
├── chat/            # 채팅 관련 컴포넌트
├── login/           # 인증 관련 컴포넌트
├── main/            # 랜딩 페이지 섹션
└── [feature]/       # 기능별 컴포넌트
```

---

이 디자인 시스템을 준수하여 일관된 사용자 경험을 제공하세요.
