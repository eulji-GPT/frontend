<template>
<section class="features-section" id="features">
    <div class="features-container">
      <div class="features-frame">
        <div class="features-total-ct">
        <div class="features-title">유용한 기능</div>
        <div class="features-subtitle">캠퍼스 생활의 모든 순간, 을GPT로 더 똑똑하고 간편하게</div>
        </div>
        <div class="features-content-frame">
          <div class="Frame2147227299">
            <img class="features-inner-svg" src="../../assets/FeaturesSection/Frame 2147227347.svg" alt="Frame 2147227347" />
            <div class="features-inner-title">실시간 응답 서비스</div>
            <div class="features-inner-desc">
             학교생활에 필요한 질문, 정보 검색, 일정 확인까지<br />
              자연스럽고 빠르게 대화하며 필요한 정보를 찾아봐요. <br />
              챗봇을 넘어선 AI 조교처럼, 언제든 물어보세요
            </div>
          </div>
          <div class="Frame2147227348">
            <div class="features-section-block clickable" @click="navigateToFeature('classroom')">
              <img class="features-section-icon" src="../../assets/FeaturesSection/icon_day.svg" alt="day icon" />
              <div class="features-section-texts">
                <span class="features-section-title">빈 강의실 확인</span>
                <span class="features-section-divider"></span>
                <span class="features-section-desc">지금 비어있는 강의실을 바로 확인하고 예약해 보세요.</span>
              </div>
            </div>
            <div class="features-section-block clickable" @click="navigateToFeature('cafeteria')">
              <img class="features-section-icon" src="../../assets/FeaturesSection/icon_haksic.svg" alt="haksic icon" />
              <div class="features-section-texts">
                <span class="features-section-title">학식</span>
                <span class="features-section-divider"></span>
                <span class="features-section-desc">실시간 학식 대기 시간 혼잡도 그래프를 제공해요.</span>
              </div>
            </div>
            <div class="features-section-block clickable" @click="navigateToFeature('library')">
              <img class="features-section-icon" src="../../assets/FeaturesSection/icon_computer.svg" alt="computer icon" />
              <div class="features-section-texts">
                <span class="features-section-title">도서관/열람실 자리 예약</span>
                <span class="features-section-divider"></span>
                <span class="features-section-desc">원하는 좌석을 미리 확인하고, 빠르게 예약하세요.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToFeature = (feature: string) => {
  // 채팅 페이지로 이동하면서 해당 기능 관련 쿼리 전달
  router.push({ path: '/chat', query: { feature } })
}
</script>

<style scoped>
.features-section {
  width: 100%;
  min-height: 0;
  height: auto;
  /* background: var(--color-bg-secondary) !important; */
  background: #f3f8ff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.features-container {
  width: 100%;
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 max(40px, 5vw) 127px max(40px, 5vw);
  box-sizing: border-box;
  background: transparent;
}

.features-frame {
  width: 100%;
  min-height: 103px;
  height: auto;
  /* border: 2px solid rgba(0,0,0,0.08);
  border-radius: 24px; */
  background: transparent;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  align-self: stretch;
}

.features-total-ct {
  display : flex;
  flex-direction: column;
  width : 85%;
}
.features-title {
  align-self: stretch;
  color: var(--color-primary);
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
  width : 100%;
}

.features-section {
  /* ...기존 코드... */
  scroll-margin-top: 84px;
}

.features-subtitle {
  align-self: stretch;
  color: var(--color-text-primary);
  font-family: 'Pretendard', sans-serif;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 54px */
  margin-top: 15px;
  margin-bottom: 0;
}

.features-content-frame {
  display: flex;
  width: 100%;
  max-width: 1013px;
  align-items: flex-start;
  gap: 45px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
}

.Frame2147227299 {
  display: flex;
  width: 100%;
  max-width: 411px;
  min-height: 568px;
  padding: 56px 35px 30px 35px;
  flex-direction: column;
  align-items: stretch;
  gap: 36px;
  flex: 1;
  border-radius: 35px;
  background: var(--color-button-primary-bg);
  box-sizing: border-box;
}

.features-inner-svg {
  width: 90%;
  height: 90%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: -10px;
}

.features-inner-title {
  align-self: stretch;
  color: var(--color-button-primary-text);
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-top: 10px;
  margin-bottom: 0px;
  padding: 0px;
  text-align: left;
}

.features-inner-desc {
  align-self: stretch;
  color: var(--color-button-primary-text);
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px; /* 156.25% */
  margin-top: -10px;
  margin-bottom: 0px;
  padding: 0px;
  text-align: left;
}

.Frame2147227348 {
  display: flex;
  width: 100%;
  max-width: 557px;
  min-height: 568px;
  flex-direction: column;
  align-items: stretch;
  gap: 25px;
  flex: 1;
  box-sizing: border-box;
}

.features-section-block {
  display: flex;
  padding: 35px;
  align-items: center;
  gap: 43px;
  align-self: stretch;
  border-radius: 30px;
  background: var(--color-card-bg);
  flex: 1 1 0;
  min-height: 0;
  margin-bottom: 20px;
  transition: all 0.2s ease;
}

.features-section-block.clickable {
  cursor: pointer;
}

.features-section-block.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(2, 71, 138, 0.15);
}

.features-section-block:last-child {
  margin-bottom: 0;
}

.features-section-icon {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 108px;
  margin-right: 24px;
  flex-shrink: 0;
}


.features-section-texts {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.features-section-title {
  color: var(--color-primary);
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
}

.features-section-desc {
  color: var(--color-text-secondary);
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px; /* 164.286% */
}

.features-section-divider {
  display: block;
  width: 100%;
  height: 2px;
  margin: 8px 0 8px 0;
  background: var(--color-primary-light);
  border: none;
  border-radius: 1px;
}

/* 태블릿 반응형 */
@media (max-width: 1024px) {
  .features-section {
    border-radius: 0px;
  }
  .features-container {
    padding-bottom: 80px;
  }
  
  .features-content-frame {
    flex-direction: column;
    gap: 40px;
    align-items: center;
    width : 90%;
  }
  
  .Frame2147227299,
  .Frame2147227348 {
    width: 100%;
    max-width: 600px;
  }
  
  .Frame2147227299 {
    min-height: auto;
    padding: 50px 40px 30px 40px;
  }
  
  .features-title {
    font-size: 20px;
    text-align: center;
  }
  
  .features-subtitle {
    font-size: 28px;
    text-align: center;
  }

    .features-section-block {
    flex : none;
  }
  
  .features-section-desc {
    text-align: left;
  }
  
  .features-inner-title {
    margin-top : 10px;
    margin-left: 20px;
    font-size: 28px;
  }
  
  .features-inner-desc {
    margin-left : 20px;
    font-size: 20px;
  }
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .features-container {
    padding-bottom: 60px;
  }
  
  .features-content-frame {
    gap: 30px;
    margin-top: 30px;
  }
  
  .Frame2147227299 {
    padding: 30px 24px 24px 24px;
    gap: 24px;
  }
  
  .features-inner-title {
    font-size: 20px;
    margin-top : 5px;
  }
  
  .features-inner-desc {
    font-size: 14px;
    line-height: 22px;
  }
  
  .features-section-block {
    padding: 24px;
    gap: 20px;
    flex-direction: column;
    text-align: center;
  }
  
  .features-section-icon {
    margin-right: 0;
    margin-bottom: 12px;
    max-height: 80px;
  }
  
  .features-section-title {
    font-size: 18px;
  }
  
  .features-section-desc {
    font-size: 13px;
  }
  
  .features-title {
    font-size: 18px;
    text-align: center;
  }
  
  .features-subtitle {
    font-size: 22px;
    text-align: center;
  }

  .features-content-frame {
    width : 80%;
  }
}
@media (min-width:600px) and (max-width: 768px) {
  .Frame2147227299 {
    padding: 40px 34px 24px 34px;
  }
  .features-section-title {
    font-size : 20px;
  }
  .features-section-desc {
    font-size: 14px;
  }
}

@media (min-width:550px) and (max-width: 768px) {
  .features-inner-title {
    margin-left : 20px;
  }
  .features-inner-desc {
    margin-left : 20px; 
  }
}

/* 소형 모바일 반응형 */
@media (max-width: 480px) {
  .features-container {
    padding-bottom: 50px;
  }
  
  .Frame2147227299 {
    padding: 34px 30px 30px 30px;
    gap: 20px;
  }
  
  .features-inner-title {
    font-size: 18px;
  }
  
  .features-inner-desc {
    font-size: 13px;
    line-height: 20px;
  }
  
  .features-section-block {
    padding: 20px;
    gap: 16px;
  }
  
  .features-section-icon {
    max-height: 60px;
  }
  
  .features-section-title {
    font-size: 16px;
  }
  
  .features-section-desc {
    font-size: 12px;
  }
  
  .features-title {
    font-size: 16px;
  }
  
  .features-subtitle {
    font-size: 20px;
  }

  .features-content-frame {
    width : 90%;
  }
}
@media (min-width:320px) and (max-width: 400px) {
  .Frame2147227299 {
    padding: 34px 30px 30px 30px;
    gap: 20px;
  }

  .features-inner-title {
    font-size : 16px;
    margin-top : 10px;
  }

  .features-inner-desc {
    font-size: 12px;
    line-height: 25px;
  }

  .features-section-block {
    flex : none;
  }

  .features-section-desc {
    text-align: left;
  }

  .features-content-frame {
    width : 100%;
  }

}
</style>
