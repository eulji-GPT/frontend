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

### 공식 브레이크포인트 (PRD 기준)
```css
/* Desktop - 1025px 이상 */
@media (min-width: 1025px) { }

/* Tablet - 641px ~ 1024px */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Mobile - 640px 이하 */
@media (max-width: 640px) { }

/* Small Mobile - 480px 이하 */
@media (max-width: 480px) { }
```

### 브레이크포인트 적용 원칙
| 브레이크포인트 | 대상 디바이스 | 레이아웃 |
|--------------|-------------|---------|
| Desktop (1025px+) | PC, 대형 태블릿 | 사이드바 + 메인 컨텐츠 |
| Tablet (641-1024px) | 태블릿, 작은 노트북 | 축소된 사이드바 |
| Mobile (≤640px) | 스마트폰 | 풀스크린 + 드로어 |
| Small Mobile (≤480px) | 작은 스마트폰 | 최소화된 UI |

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

@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }
}

/* 채팅 버블 너비 */
.chat-bubble {
  max-width: 70%;  /* Desktop */
}

@media (max-width: 640px) {
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

---

## 7-1. 데스크톱 UX 가이드

### 데스크톱 레이아웃 구조
```
┌────────────────────────────────────────────────────────────────────┐
│                            헤더 (고정)                              │
├──────────────┬─────────────────────────────────────────────────────┤
│              │                                                     │
│   사이드바     │              메인 채팅 영역                         │
│   (256px)    │              (유동적 너비)                           │
│              │                                                     │
│  - 프로필     │    ┌─────────────────────────────────────────┐     │
│  - 대화 목록   │    │          채팅 메시지 영역                 │     │
│  - 새 대화    │    │          (스크롤 가능)                   │     │
│  - FAQ 버튼   │    │                                         │     │
│              │    └─────────────────────────────────────────┘     │
│              │    ┌─────────────────────────────────────────┐     │
│              │    │  메시지 입력...                    [전송] │     │
│              │    └─────────────────────────────────────────┘     │
└──────────────┴─────────────────────────────────────────────────────┘
```

### 사이드바 스타일 (데스크톱)
```css
.sidebar {
  width: 256px;
  min-width: 256px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

/* 프로필 섹션 */
.profile-section {
  padding: 0 20px 20px;
  border-bottom: 1px solid #F3F4F6;
}

/* 대화 목록 */
.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-list-item {
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-list-item:hover {
  background-color: #F3F4F6;
}

.chat-list-item.active {
  background-color: #F0F6FF;
}
```

### 메인 채팅 영역 (데스크톱)
```css
.main-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 40px;
}

.chat-input-container {
  padding: 20px 40px;
  border-top: 1px solid #E5E7EB;
  background: #ffffff;
}

/* 입력 박스 */
.input-box {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid #D1D5DB;
  border-radius: 16px;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-box:focus-within {
  border-color: #02478A;
  box-shadow: 0 0 0 3px rgba(2, 71, 138, 0.1);
}
```

### 호버 효과 (데스크톱 전용)
```css
/* 버튼 호버 */
.btn-primary:hover {
  background-color: #013C74;
  transform: translateY(-1px);
  box-shadow: 0px 6px 8px 0px rgba(2, 71, 138, 0.35);
}

.btn-secondary:hover {
  background-color: #E5E7EB;
}

/* 카드 호버 */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 리스트 아이템 호버 */
.list-item:hover {
  background-color: #F3F4F6;
}

/* 삭제 버튼 - 호버 시에만 표시 */
.chat-list-item .delete-button {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-list-item:hover .delete-button {
  visibility: visible;
  opacity: 1;
}
```

### 마우스 커서 상태
```css
/* 기본 인터랙티브 요소 */
.clickable {
  cursor: pointer;
}

/* 비활성화 상태 */
.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 드래그 가능 */
.draggable {
  cursor: grab;
}

.draggable:active {
  cursor: grabbing;
}

/* 텍스트 선택 */
.selectable {
  cursor: text;
}

/* 리사이즈 */
.resizable {
  cursor: ew-resize;  /* 좌우 */
  cursor: ns-resize;  /* 상하 */
}
```

### 키보드 단축키
| 단축키 | 동작 |
|-------|------|
| `Enter` | 메시지 전송 |
| `Shift + Enter` | 줄바꿈 |
| `Escape` | 모달/드롭다운 닫기 |
| `Tab` | 다음 요소로 포커스 이동 |

---

## 7-2. 모바일 반응형 UX 가이드

### 모바일 레이아웃 구조
```
┌─────────────────────────────────────┐
│  [≡]     EULGPT          [+]       │  ← 모바일 헤더 (56px)
├─────────────────────────────────────┤
│                                     │
│         채팅 메시지 영역              │  ← 유동적 높이
│         (스크롤 가능)                 │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │  메시지 입력...        [전송] │   │  ← 입력 영역 (키보드 대응)
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 모바일 헤더 스타일
```css
.mobile-header {
  display: none;  /* 데스크톱에서 숨김 */
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #E5E7EB;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

@media (max-width: 640px) {
  .mobile-header {
    display: flex;
  }
}
```

### 모바일 드로어 (사이드바)
```css
/* 오버레이 */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

.sidebar-overlay.visible {
  display: block;
}

/* 드로어 패널 */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 85%;
  max-width: 320px;
  background: #ffffff;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.sidebar.visible {
  transform: translateX(0);
}
```

### CSS 변수 (모바일 전용)
```css
:root {
  /* 키보드 높이 (JavaScript에서 동적 설정) */
  --keyboard-height: 0px;

  /* 모바일 헤더 높이 */
  --mobile-header-height: 56px;

  /* Safe Area (iOS) */
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
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

## 12. 터치 인터랙션 가이드

### 터치 타겟 크기 (필수)
모든 인터랙티브 요소는 **최소 44x44px** 터치 영역을 가져야 합니다.

```css
/* 기본 터치 타겟 */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;  /* 시각적으로 작아도 터치 영역 확보 */
}

/* 모바일 버튼 예시 */
.mobile-button {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 터치 피드백 (필수)
사용자 터치에 즉각적인 시각적 피드백을 제공합니다.

```css
/* 터치 피드백 - scale 효과 */
.button:active {
  transform: scale(0.95);
}

/* 배경색 변화와 함께 */
.mobile-menu-toggle:active {
  background: #e5e7eb;
  transform: scale(0.95);
}

/* 전송 버튼 (Primary) */
.send-button:active {
  background-color: #9CA3AF;
  transform: scale(0.95);
}
```

### 스크롤 최적화
```css
/* iOS 부드러운 스크롤 */
.scrollable-container {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  overscroll-behavior: contain;  /* 스크롤 체이닝 방지 */
}

/* 스냅 스크롤 (선택적) */
.snap-scroll {
  scroll-snap-type: y mandatory;
}

.snap-item {
  scroll-snap-align: start;
}
```

### 제스처 가이드라인
| 제스처 | 동작 | 구현 |
|-------|------|------|
| 탭 | 선택/활성화 | `@click` |
| 더블탭 | 이름 변경 | `@dblclick` |
| 길게 누르기 | 컨텍스트 메뉴 | `@contextmenu` |
| 스와이프 | 드로어 닫기 | 오버레이 탭 |

---

## 13. 키보드 대응 패턴

### visualViewport API 활용
모바일 키보드가 화면을 가리지 않도록 동적으로 레이아웃을 조정합니다.

```typescript
// ChatInput.vue에서 구현
const setupKeyboardHandling = () => {
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportResize);
  }
};

const handleViewportResize = () => {
  if (!window.visualViewport) return;

  const keyboardHeight = window.innerHeight - window.visualViewport.height;
  document.documentElement.style.setProperty(
    '--keyboard-height',
    `${keyboardHeight}px`
  );
};
```

### 입력 영역 키보드 대응
```css
/* 키보드가 열렸을 때 입력 영역 고정 */
.chat-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: env(safe-area-inset-bottom);
  transition: padding-bottom 0.15s ease-out;
}

@media (max-width: 640px) {
  .chat-input-container {
    padding-bottom: calc(var(--keyboard-height, 0px) + env(safe-area-inset-bottom));
  }
}
```

### 메시지 영역 조정
```css
@media (max-width: 640px) {
  .chat-messages-container {
    padding-bottom: calc(var(--keyboard-height, 0px) + 16px);
    transition: padding-bottom 0.15s ease-out;
  }
}
```

### 자동 스크롤
```typescript
// 키보드가 열릴 때 마지막 메시지로 스크롤
const scrollToBottom = () => {
  nextTick(() => {
    if (messageAreaRef.value) {
      messageAreaRef.value.scrollTop = messageAreaRef.value.scrollHeight;
    }
  });
};
```

---

## 14. 접근성 가이드라인

### 기본 원칙
- 모든 인터랙티브 요소에 `cursor: pointer` 적용
- 포커스 상태에 명확한 시각적 표시 제공
- 충분한 색상 대비 유지 (최소 4.5:1)
- 터치 타겟 최소 44x44px 유지
- 키보드 네비게이션 지원

### 키보드 포커스 스타일 (필수)
```css
/* focus-visible: 키보드 포커스만 표시 */
.button:focus-visible {
  outline: 2px solid #02478a;
  outline-offset: 2px;
}

/* 모바일 버튼 */
.mobile-menu-toggle:focus-visible,
.mobile-new-chat-button:focus-visible {
  outline: 2px solid #02478a;
  outline-offset: 2px;
}

/* 입력 필드 */
.input-field:focus-visible {
  border-color: #02478A;
  box-shadow: 0 0 0 3px rgba(2, 71, 138, 0.1);
  outline: none;
}
```

### ARIA 레이블
```html
<!-- 버튼에 설명 추가 -->
<button aria-label="메뉴 열기" class="mobile-menu-toggle">
  <span class="hamburger-icon"></span>
</button>

<!-- 상태 표시 -->
<div role="status" aria-live="polite">
  {{ loadingMessage }}
</div>
```

### 색상 대비
| 용도 | 전경색 | 배경색 | 대비율 |
|------|-------|-------|--------|
| 본문 텍스트 | #1F2937 | #FFFFFF | 12.6:1 ✓ |
| Primary 버튼 | #F0F6FF | #02478A | 7.2:1 ✓ |
| 플레이스홀더 | #9CA3AF | #FFFFFF | 3.0:1 (대형 텍스트만) |
| 에러 텍스트 | #DC2626 | #FFFFFF | 4.5:1 ✓ |

---

## 15. 네이밍 컨벤션

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

## 16. 컴포넌트별 상세 가이드

### 채팅 컴포넌트 (chat/)

| 컴포넌트 | 역할 | 반응형 동작 |
|---------|------|-----------|
| `index.vue` | 메인 채팅 페이지 | 모바일: 드로어 + 헤더 / 데스크톱: 사이드바 |
| `ChatBubble.vue` | 메시지 버블 | 모바일: 85-90% 너비 / 데스크톱: 70% |
| `ChatMessageArea.vue` | 메시지 표시 영역 | 키보드 대응 패딩 조정 |
| `ChatInput.vue` | 입력 컴포넌트 | 키보드 높이 감지, 44px 터치 타겟 |
| `ChatHistory.vue` | 대화 목록 | 모바일: 드로어 / 데스크톱: 사이드바 |
| `ChatModeSelector.vue` | 모드 선택 | 모바일: 간소화 / 데스크톱: 전체 표시 |

### 채팅 버블 상세
```css
/* 사용자 메시지 */
.chat-bubble-user {
  background: #F0F6FF;
  border-radius: 30px;
  padding: 10px 20px;
  max-width: 70%;  /* 데스크톱 */
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 640px) {
  .chat-bubble-user {
    max-width: 85%;
    padding: 12px 16px;
    border-radius: 20px;
  }
}

/* AI 메시지 */
.chat-bubble-bot {
  background: transparent;
  padding: 16px 20px;
  max-width: 770px;
}

@media (max-width: 640px) {
  .chat-bubble-bot {
    max-width: 100%;
    padding: 12px 0;
  }
}
```

### 로그인 컴포넌트 (login/)

| 컴포넌트 | 역할 |
|---------|------|
| `LoginComponent.vue` | 로그인 폼 |
| `KakaoLoginButton.vue` | 카카오 OAuth |
| `SignupComponent.vue` | 이메일 가입 |
| `SignupAgreementComponent.vue` | 약관 동의 |
| `SignupPasswordComponent.vue` | 비밀번호 설정 |
| `SignupPersonalInfoFormComponent.vue` | 개인정보 |

### 공통 컴포넌트 (common/)

| 컴포넌트 | 역할 | 사용법 |
|---------|------|-------|
| `CommonFooter.vue` | 푸터 | 모든 페이지 하단 |
| `MyPageModal.vue` | 프로필 모달 | 프로필 클릭 시 |
| `ToastNotification.vue` | 토스트 알림 | 전역 알림 |
| `CommonDeleteModal.vue` | 삭제 확인 모달 | 삭제 액션 전 |

---

## 17. 개발 체크리스트

### 새 컴포넌트 개발 시
- [ ] Composition API (`<script setup lang="ts">`) 사용
- [ ] TypeScript 타입 정의 완료
- [ ] 디자인 시스템 컬러 팔레트 사용
- [ ] Pretendard 폰트 적용
- [ ] 반응형 미디어 쿼리 추가 (640px, 1024px)
- [ ] 호버/포커스 상태 스타일 정의
- [ ] 터치 타겟 44px 이상 확보 (모바일)
- [ ] 터치 피드백 (`:active { transform: scale(0.95) }`)
- [ ] 키보드 접근성 (`:focus-visible` 스타일)

### 모바일 최적화 체크리스트
- [ ] 640px 이하 레이아웃 확인
- [ ] 터치 타겟 크기 (최소 44x44px)
- [ ] 터치 피드백 애니메이션
- [ ] iOS 부드러운 스크롤 (`-webkit-overflow-scrolling: touch`)
- [ ] Safe Area 대응 (`env(safe-area-inset-*)`)
- [ ] 키보드 오버레이 대응 (visualViewport API)
- [ ] 드로어/모달 닫기 동작
- [ ] 가로 스크롤 방지

### 데스크톱 최적화 체크리스트
- [ ] 호버 효과 적용
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 상태 시각화
- [ ] 적절한 최대 너비 설정
- [ ] 마우스 커서 상태 설정

---

## 18. 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-01-01 | 2.0.0 | 모바일 반응형 UX 가이드 추가, 데스크톱 UX 가이드 추가, 터치 인터랙션 패턴 문서화, 키보드 대응 패턴 추가, 접근성 가이드라인 확장 |
| 초기 | 1.0.0 | 기본 디자인 시스템 정의 (컬러, 타이포그래피, 컴포넌트) |

---

## 19. 참고 자료

### 외부 리소스
- [Pretendard 폰트](https://cactus.tistory.com/306)
- [WCAG 2.1 접근성 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)

### 프로젝트 문서
- `CLAUDE.md` - 프로젝트 개발 가이드
- `_bmad-output/project-context.md` - AI 에이전트용 프로젝트 컨텍스트
- `_bmad-output/planning-artifacts/prd.md` - 제품 요구사항 문서

---

**이 디자인 시스템을 준수하여 PC와 모바일 모두에서 일관된 사용자 경험을 제공하세요.**
