<template>
  <div class="intro-section" id="intro">
    <div class="intro-content">
      <div class="intro-text">
        <h2 class="intro-header">궁금한 건 뭐든지, 을GPT와 함께 물어보세요.</h2>
        <p class="intro-description">
          당신의 대학 생활이 을GPT와 연결될 때,<br />
          더 빠르고 정확한 정보와 함께<br />
          캠퍼스 생활이 쉬워집니다.
        </p>
      </div>
      <div class="intro-image">
        <img src="../../assets/Introsection/EULGPT-3D-Logo.svg" alt="EULGPT 3D 로고" class="intro-image-svg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// props나 다른 로직이 필요한 경우 여기에 추가
</script>

<style scoped>
.intro-section {
  width: 100%;
  min-height: 100vh;
  height: auto;
  /* background: var(--color-bg-secondary); */
  background: #f3f8ff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  scroll-margin-top: 84px;
}

.intro-content {
  display: flex;
  width: 75vw; /* 1044/1440 * 100 */
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  max-width: 1080px;
  padding: 2rem 0;
}

.intro-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  align-self: stretch;
  justify-content: center;
}

.intro-header {
  color: var(--color-primary);
  font-family: 'Pretendard', sans-serif;
  font-size: clamp(18px, 1.67vw, 24px); /* 동적 크기 조정 */
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin: 0;
  width: 40vw;
  max-width: 676px;
  height: calc(1.4em * 1); /* 1줄 고정 높이 */
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.intro-description {
  color: var(--color-text-primary);
  font-family: 'Pretendard', sans-serif;
  font-size: clamp(24px, 2.5vw, 36px); /* 동적 크기 조정 */
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  margin: 0;
  width: 40vw;
  max-width: 676px;
  height: calc(1.5em * 3); /* 3줄 고정 높이 */
  display: flex;
  align-items: center;
  overflow: hidden;
  word-break: keep-all;
  hyphens: auto;
}

.intro-image {
  width: 32.5vw; /* 468/1440 * 100 */
  height: 32.5vw; /* 비율 유지를 위해 width와 동일하게 */
  max-width: 468px;
  max-height: 468px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.intro-image-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 태블릿 크기 조정 */
@media (max-width: 1024px) {
  .intro-content {
    width: 90vw;
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
  
  .intro-header {
    font-size: clamp(16px, 2.2vw, 22px);
    width: 90vw;
    height: calc(1.4em * 1); /* 1줄 고정 높이 */
    justify-content: center;
  }
  
  .intro-description {
    font-size: clamp(20px, 3.2vw, 32px);
    width: 90vw;
    height: calc(1.4em * 3); /* 3줄 고정 높이 */
    line-height: 140%;
    justify-content: center;
  }
  
  .intro-image {
    width: 50vw;
    height: 50vw;
    max-width: 400px;
    max-height: 400px;
    margin-top: 0;
  }
    .intro-section {
    border-radius: 0px;
  }

  .intro-text {
    align-items: center;
  }
  
}

/* 모바일 크기 조정 */
@media (max-width: 768px) {
  .intro-section {
    padding: 2rem 1rem;
  }
  
  .intro-content {
    width: 100%;
    gap: 2rem;
  }
  
  .intro-header {
    font-size: clamp(14px, 4vw, 18px);
    width: 100%;
    height: calc(1.4em * 1); /* 1줄 고정 높이 */
  }
  
  .intro-description {
    font-size: clamp(18px, 5vw, 24px);
    width: 100%;
    line-height: 140%;
    height: calc(1.4em * 3); /* 3줄 고정 높이 */
  }
  
  .intro-image {
    width: 70vw;
    height: 70vw;
    max-width: 300px;
    max-height: 300px;
    margin-top: 0;
  }
}

/* 소형 모바일 크기 조정 */
@media (max-width: 480px) {
  .intro-header {
    font-size: clamp(12px, 3.5vw, 16px);
    height: calc(1.4em * 1); /* 1줄 고정 높이 */
  }
  
  .intro-description {
    font-size: clamp(14px, 4vw, 20px);
    height: calc(1.4em * 3); /* 3줄 고정 높이 */
    line-height: 140%;
  }
  
  .intro-image {
    width: 80vw;
    height: 80vw;
    max-width: 250px;
    max-height: 250px;
    margin-top: 0;
  }
}
</style>