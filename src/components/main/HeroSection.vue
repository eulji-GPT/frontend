<template>
  <div class="hero-section">
    <div class="main-content-wrapper">
      <div class="title-and-decoration">
        <p class="main-title">
          학교생활의<br />
          <span class="gradient-text">모든 순간</span>에 답하다
        </p>
        <img class="hero-svg" src="../../assets/HeroSection/Frame-2147227367.svg" alt="장식 이미지" />
      </div>
      <div class="hero-bottom-section">
        <img class="hero-image" src="../../assets/HeroSection/Group-48097225.svg" alt="EULGPT 메인 이미지" />
      </div>
    </div>
    <!-- 고정 버튼을 hero-section 외부로 이동 -->
    <div class="floating-btn-wrapper">
      <button class="floating-start-btn" @click="goToChatApp">시작하기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  width: auto;
  height: auto;
  max-width: 500px;
  object-fit: contain;
  display: block;
  /* margin-left: 120px; */
}

.hero-section {
  width: 100%;
  height: 800px;
  overflow-x: hidden;
  background: linear-gradient(-180deg, white, rgb(243, 248, 255));
  position: relative;
  align-self: stretch;
  flex-shrink: 0;
  margin: 0;
}

.main-content-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 59px;
  width: 95%;
  max-width: 1414px;
  height: 536px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 160px;
}

.title-and-decoration {
  display: flex;
  justify-content: center;
  width : 100%;
  flex-direction: row;
  align-items: center;
  gap: clamp(40px, 8vw, 80px);
  align-self: flex-start;
  box-sizing: border-box;
  flex-shrink: 0;
}

.main-title {
  text-overflow: ellipsis;
  font-size: 64px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 90px;
  text-align: left;
  width: 500px;
  color: var(--Black, #000);
  margin: 0;
  max-width: 100%;
  display: block;
  padding: 0;
  position: relative;
}

.gradient-text {
  background: var(--Gradiant-200, linear-gradient(254deg, #17315F 5.17%, #02478A 45.43%, #0A6ECF 80.95%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* Title/Bold0 */
  font-family: Pretendard;
  font-size: 64px;
  font-style: normal;
  font-weight: 700;
  line-height: 90px;
}


.hero-bottom-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 127px;
  align-self: flex-start;
}

.hero-image {
  width: auto;
  height: 127px;
  object-fit: contain;
}

/* 플로팅 버튼 스타일 */
.floating-btn-wrapper {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
}

.floating-start-btn {
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  gap: 8px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  background-color: black;
  box-sizing: border-box;
  padding: 13px 60px;
  color: white;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  text-overflow: ellipsis;
}

.floating-start-btn:hover {
  background-color: #0356a8;
  box-shadow: 0px 6px 8px 0px rgba(2, 71, 138, 0.35);
  transform: translateY(-1px);
}

.floating-start-btn:active {
  background-color: #013c74;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
}
@media (min-width:1025px) and (max-width: 1110px) {
  .main-title {
    font-size : 60px;
  }
  .gradient-text {
    font-size : 60px;
  }

   .hero-svg {
    width: 450px;
   }
}

/* 태블릿 크기에서의 추가 조정 */
@media (max-width: 1024px) {
    .hero-section {
    padding: 0px max(20px, 5vw) 0px max(20px, 5vw);
    height : 600px;
    overflow-x :unset;
  }

  .main-content-wrapper {
    top : 100px;
    gap : 30px;
    height: 760px;
  }

   .hero-bottom-section {
    height : 100px;

  }

  .title-and-decoration {
    justify-content: flex-start;
    align-items: center;
    gap: clamp(15px, 3vw, 80px);
    width : 90vw;
    margin : 0 auto;
  }

  .hero-svg {
    width: 41vw; /* 550/1440 * 100 */
    height: auto; /* hero-image와 같은 높이 유지 */
    top: 0px; /* -120/800 * 100 */
    right: 0px; /* 오른쪽으로 180px 이동 */
    position: relative;
  }
  
  .main-title {
    font-size: min(44px, 8vw);
    line-height: min(70px, 9vw);
    letter-spacing: 0.03em;
    text-align: left;
    padding: 0;
    top: 0;
    width: 90vw;
    height: auto;
  }

    .hero-image {
    width: calc(100% - 40px); /* 모바일에서는 좌우 20px씩 */
    margin: 0 20px;
  }

  .gradient-text {
    font-size: min(44px, 10vw);
    line-height: 20px;
  }

  .floating-start-btn {
    width : 200px;
    font-size : 20px;
    padding : 0px;
    height : 55px;
  }

  .floating-btn-wrapper {
    bottom : 70px;
  }
}

@media (min-width : 800px) and (max-width : 900px) {
    .main-title {
    font-size: min(48px, 8vw);
    }

    .gradient-text {
    font-size: min(48px, 10vw);
    }
}

@media (min-width : 901px) and (max-width : 1023px) {
    .main-title {
    font-size: min(52px, 8vw);
    }

    .gradient-text {
    font-size: min(52px, 10vw);
    }
}

@media (max-width: 768px) {
  .main-title-row {
    flex-direction: column;
    align-items: center;
    width: 90vw;
  }

  .main-content-wrapper {
    top : 80px;
    gap : 30px;
    height: 500px;
  }

  .hero-bottom-section {
    height : 70px;

  }

  .title-and-decoration {
    justify-content: flex-start;
    align-items: center;
    gap: clamp(15px, 3vw, 80px);
    width : 90vw;
    margin : 0 auto;
  }
  
  .hero-svg {
    width: 40vw; /* 550/1440 * 100 */
    height: auto; /* hero-image와 같은 높이 유지 */
    top: 0px; /* 모바일에서는 90px 이동 */
    right: 0px;
    position: relative;
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
    font-size: min(28px, 8vw);
    line-height: min(56px, 9vw);
    letter-spacing: 0.05em;
    text-align: left;
    padding: 0;
    top: 0;
    width: 90vw;
    height: auto;
  }
  
  .hero-btn-wrapper {
    transform: translateX(0);
  }
  
  .gradient-text {
    font-size: min(28px, 10vw);
    line-height: 20px;
  }

  .start-btn {
    width: clamp(100px, 40vw, 160px);
    height: clamp(32px, 6vh, 45px);
    font-size: clamp(12px, 3.5vw, 14px);
  }

  .hero-section {
    padding: 0px max(20px, 5vw) 0px max(20px, 5vw);
    height : 500px;
    overflow-x :unset;
  }

  .floating-start-btn {
    width : 170px;
    font-size : 16px;
    padding : 0px;
    height : 45px;
  }
  .floating-btn-wrapper {
    bottom : 50px;
  }
}

@media (min-width : 580px) and (max-width:680px) {
    .main-title {
    font-size: min(34px, 8vw);
    }

    .gradient-text {
    font-size: min(34px, 10vw);
    }
}

@media (min-width : 680px) and (max-width : 768px) {
    .main-title {
    font-size: min(38px, 8vw);
    }

    .gradient-text {
    font-size: min(38px, 10vw);
    }
}

@media (max-width: 480px) {
  .main-content-wrapper {
    top : 60px;
    gap : 20px;
    height: 300px;
  }

  .hero-bottom-section {
    height : 50px;

  }
    
  .title-and-decoration {
    gap: clamp(10px, 3vw, 80px);

  }
    .hero-svg {
    width: 39vw; /* 550/1440 * 100 */
    height: auto; /* hero-image와 같은 높이 유지 */
  }
  
  .hero-image {
    width: calc(100% - 20px); /* 소형 모바일에서는 좌우 10px씩 */
    margin: 0 10px;
  }
  
  .main-title {
    font-size: min(25px, 10vw);
    line-height: min(45px, 11vw);
    letter-spacing: 0.02em;
    width : 80vw;
  }
    .gradient-text {
    font-size: min(25px, 10vw);
  }

  .start-btn {
    width: clamp(90px, 50vw, 140px);
    height: clamp(28px, 7vh, 40px);
    font-size: clamp(11px, 4vw, 12px);
  }
  
  .hero-section {
    height : 350px;
  }

  .floating-start-btn {
    width : 150px;
    height : 40px;
  }
  .floating-btn-wrapper {
    bottom : 30px;
  }
}

@media (min-width: 320px) and (max-width: 400px) {
    .main-title {
    font-size: min(20px, 10vw);
    }

    .gradient-text {
    font-size: min(20px, 10vw);
  }

    .hero-svg {
    width: 39vw; /* 550/1440 * 100 */
  }
  
  .floating-start-btn {
    width : 100px;
    font-size : 12px;
    height : 30px;
  }
  
}

</style>