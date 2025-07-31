<template>
  <div class="hero-section">
    <div class="title-block">
      <div class="main-title-row">
        <div class="main-title-frame">
          <h1 class="main-title">
            학교생활의<br />
            <span class="gradient-title">모든 순간에 답하다</span>
          </h1>
        </div>
        <img class="hero-svg" src="../../assets/HeroSection/Frame-2147227367.svg" alt="장식 이미지" />
        <div class="main-title-extra-frame">
          <!-- 여기에 원하는 내용을 추가하세요 -->
        </div>
      </div>
    </div>
    <img class="hero-image" :src="heroImg" alt="EULGPT 메인 이미지" />
    <div class="hero-btn-wrapper">
      <button class="start-btn" @click="goToChatApp">시작하기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import heroImg from '../../assets/HeroSection/Group-48097225.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToChatApp() {
  router.push('/chat')
}
</script>

<style scoped>
.main-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 0;
  position: relative;
}

.hero-svg {
  width: 38.19vw; /* 550/1440 * 100 */
  height: 16vh; /* 128/800 * 100 */
  object-fit: contain;
  display: block;
  padding: 0 !important;
  margin: 0 !important;
  position: absolute;
  top: -10.38vh; /* /* -155/800 * 100 */
  right: -230px;
}

.hero-section {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, #FFF 60.58%, #F3F8FF 100%);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-in-out;
  position: relative;
  overflow: hidden;
}

.title-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 2.5rem 0 0 0;
  padding: 0 12.5vw; /* 180/1440 * 100 */
  align-items: flex-start;
}

.main-title {
  /* Title/Bold0 */
  font-family: 'Pretendard', sans-serif;
  font-size: 4.44vw; /* 64/1440 * 100 */
  font-style: normal;
  font-weight: 700;
  line-height: 11.25vh; /* 90/800 * 100 */
  color: var(--Black, #000);
  letter-spacing: 0.14em;
  text-align: left;
  margin: 0;
  width: 59.1vw; /* 851/1440 * 100 */
  height: 22.5vh; /* 180/800 * 100 */
  max-width: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  position: relative;
  top: -19.38vh; /* -155/800 * 100 */
}

.gradient-title {
  background: var(--Gradiant-200, linear-gradient(254deg, #17315F 5.17%, #02478A 45.43%, #0A6ECF 80.95%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  display: inline;
}

.hero-image {
  text-decoration: none;
  width: calc(100% - 360px); /* 좌우 180px씩 제외 */
  max-width: calc(100% - 360px);
  height: auto;
  display: block;
  object-fit: contain;
  margin: 0 180px; /* 좌우 180px 여백 */
}

.hero-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 40px;
}

.start-btn {
  display: flex;
  width: clamp(120px, 12.5vw, 180px);
  height: clamp(38px, 6.25vh, 50px);
  min-width: 120px;
  min-height: 38px;
  max-width: 180px;
  max-height: 50px;
  padding: 0;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 30px;
  background: var(--Black, #000);
  color: white;
  border: none;
  cursor: pointer;
  font-size: clamp(13px, 1.2vw, 16px);
  font-weight: 500;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.start-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* 태블릿 크기에서의 추가 조정 */
@media (max-width: 1024px) {
  .hero-svg {
    width: 38.19vw; /* 550/1440 * 100 */
    height: auto; /* hero-image와 같은 높이 유지 */
    top: -15vh; /* -120/800 * 100 */
    right: -180px; /* 오른쪽으로 180px 이동 */
    position: absolute;
  }
  
  .main-title {
    font-size: 3.89vw; /* 56/1440 * 100 */
    line-height: 9.75vh; /* 78/800 * 100 */
    top: -15vh;
  }
}

@media (max-width: 768px) {
  .main-title-row {
    flex-direction: column;
    align-items: center;
    width: 90vw;
  }
  
  .hero-svg {
    width: 38.19vw; /* 550/1440 * 100 */
    height: auto; /* hero-image와 같은 높이 유지 */
    top: -10vh; /* -80/800 * 100 */
    right: -90px; /* 모바일에서는 90px 이동 */
    position: absolute;
  }
  
  .hero-image {
    width: calc(100% - 40px); /* 모바일에서는 좌우 20px씩 */
    margin: 0 20px;
  }
  
  .title-block {
    align-items: center;
    margin: 2.5rem 0 0 0;
    padding: 0 20px;
  }
  
  .main-title-frame {
    padding: 0.5rem 2rem;
  }
  
  .main-title {
    font-size: min(40px, 8vw);
    line-height: min(56px, 9vw);
    letter-spacing: 0.05em;
    text-align: center;
    padding: 0;
    top: 0;
    width: 90vw;
    height: auto;
  }
  
  .hero-btn-wrapper {
    transform: translateX(0);
  }
  
  .start-btn {
    width: clamp(100px, 40vw, 160px);
    height: clamp(32px, 6vh, 45px);
    font-size: clamp(12px, 3.5vw, 14px);
  }
}

@media (max-width: 480px) {
  .hero-svg {
    width: 38.19vw; /* 550/1440 * 100 */
    height: auto; /* hero-image와 같은 높이 유지 */
    top: -7.5vh; /* -60/800 * 100 */
    right: -45px; /* 소형 모바일에서는 45px 이동 */
    position: absolute;
  }
  
  .hero-image {
    width: calc(100% - 20px); /* 소형 모바일에서는 좌우 10px씩 */
    margin: 0 10px;
  }
  
  .main-title {
    font-size: min(32px, 10vw);
    line-height: min(45px, 11vw);
    letter-spacing: 0.02em;
  }
  
  .start-btn {
    width: clamp(90px, 50vw, 140px);
    height: clamp(28px, 7vh, 40px);
    font-size: clamp(11px, 4vw, 12px);
  }
  
  .hero-section {
    padding: 0px max(20px, 5vw) 0px max(20px, 5vw);
  }
}</style>