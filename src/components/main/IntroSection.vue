<template>
  <div class="intro-section">
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
        <img src="../../assets/IntroSection/EULGPT-3D-Logo.svg" alt="EULGPT 3D 로고" class="intro-image-svg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// props나 다른 로직이 필요한 경우 여기에 추가
</script>

<style scoped>
.intro-section {
  background: #F3F8FF !important;

  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  background: #fff;
}

.intro-content {
  display: flex;
  width: 72.5vw; /* 1044/1440 * 100 */
  align-items: center;
  gap: 2rem;
  max-width: 1044px;
}

.intro-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  align-self: stretch;
}

.intro-header {
  color: var(--Primary-400, #02478A);
  font-family: 'Pretendard', sans-serif;
  font-size: 1.67vw; /* 24/1440 * 100 */
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
  margin: 0;
  width: 46.94vw; /* 676/1440 * 100 */
  max-width: 676px;
}

.intro-description {
  color: var(--Black, #000);
  font-family: 'Pretendard', sans-serif;
  font-size: 2.5vw; /* 36/1440 * 100 */
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 54px */
  margin: 0;
  width: 46.94vw; /* 676/1440 * 100 */
  max-width: 676px;
}

.intro-image {
  width: 32.5vw; /* 468/1440 * 100 */
  height: 58.5vh; /* 468/800 * 100 */
  max-width: 468px;
  max-height: 468px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  background: url('../../assets/IntroSection/intro-image.svg') / cover no-repeat;
  border-radius: 12px; /* 선택사항 */
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
    font-size: 2.2vw;
    width: 90vw;
  }
  
  .intro-description {
    font-size: 3.2vw;
    width: 90vw;
  }
  
  .intro-image {
    width: 50vw;
    height: 50vw;
    max-width: 400px;
    max-height: 400px;
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
    font-size: 18px;
    width: 100%;
  }
  
  .intro-description {
    font-size: 24px;
    width: 100%;
    line-height: 140%;
  }
  
  .intro-image {
    width: 70vw;
    height: 70vw;
    max-width: 300px;
    max-height: 300px;
  }
}

/* 소형 모바일 크기 조정 */
@media (max-width: 480px) {
  .intro-header {
    font-size: 16px;
  }
  
  .intro-description {
    font-size: 20px;
  }
  
  .intro-image {
    width: 80vw;
    height: 80vw;
    max-width: 250px;
    max-height: 250px;
  }
}</style>