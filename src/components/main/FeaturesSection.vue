<template>
  <section class="features-section">
    <div class="features-container">
      <div class="features-frame">
        <div class="features-title">유용한 기능</div>
        <div class="features-subtitle">캠퍼스 생활의 모든 순간, 을GPT로 더 똑똑하고 간편하게</div>
        <div class="features-content-frame">
          <div class="Frame2147227299">
            <img class="features-inner-svg" src="../../assets/FeaturesSection/Frame 2147227347.svg" alt="Frame 2147227347" />
            <div class="features-inner-title">실시간 응답 서비스</div>
            <div class="features-inner-desc">
              학교생활에 필요한 질문, 정보 검색, 일정 확인까지<br />
              자연스럽고 빠르게 대화하며 필요한 정보를 찾아드려요.<br />
              챗봇을 넘어선 AI 조교처럼, 언제든 궁금한 걸 물어보세요.
            </div>
          </div>
          <div class="Frame2147227348">
            <div class="features-section-block">
              <img class="features-section-icon" src="../../assets/FeaturesSection/icon_day.svg" alt="day icon" />
              <div class="features-section-texts">
                <span class="features-section-title">빈 강의실 확인</span>
                <span class="features-section-divider"></span>
                <span class="features-section-desc">지금 비어있는 강의실을 바로 확인하고 예약해 보세요.</span>
              </div>
            </div>
            <div class="features-section-block">
              <img class="features-section-icon" src="../../assets/FeaturesSection/icon_haksic.svg" alt="haksic icon" />
              <div class="features-section-texts">
                <span class="features-section-title">학식</span>
                <span class="features-section-divider"></span>
                <span class="features-section-desc">실시간 학식 대기 시간 혼잡도 그래프를 제공해요.</span>
              </div>
            </div>
            <div class="features-section-block">
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

<script setup>
// Add your script here if needed
</script>

<style scoped>
.features-section {
  width: 100vw;
  min-width: 100vw;
  min-height: 0;
  height: auto;
  background: #F3F8FF !important;
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
  padding: 128px 180px 127px 180px;
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

.features-title {
  align-self: stretch;
  color: var(--Primary-400, #02478A);
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
}

.features-subtitle {
  align-self: stretch;
  color: var(--Black, #000);
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
  width: 1013px;
  align-items: center;
  gap: 45px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  /* border: 2px dashed #ff6f00; */
  /* background: rgba(255, 223, 186, 0.3); */
}

.Frame2147227299 {
  display: flex;
  width: 411px;
  height: 568px;
  padding: 56px 35px 30px 35px;
  flex-direction: column;
  align-items: stretch;
  gap: 36px;
  flex-shrink: 0;
  border-radius: 35px;
  background: var(--Primary-400, #02478A);
  /* border: 2px solid #fff200; */
  /* color and font-size removed to prevent inheritance issues for child */
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
  color: var(--White, #FFF);
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-top: -24px;
  margin-bottom: 0px;
  padding: 0px;
  text-align: left;
}

.features-inner-desc {
  align-self: stretch;
  color: var(--White, #FFF);
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px; /* 156.25% */
  margin-top: -30px;
  margin-bottom: 0px;
  padding: 0px;
  text-align: left;
}

.Frame2147227348 {
  display: flex;
  width: 557px;
  height: 568px;
  /* padding: 56px 35px 30px 35px; */
  flex-direction: column;
  align-items: stretch;
  gap: 25px;
  flex-shrink: 0;
  /* border-radius: 35px; */
  /* background: #fff; */
  /* border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04); */
}

.features-section-block {
  display: flex;
  padding: 35px;
  align-items: center;
  gap: 43px;
  align-self: stretch;
  border-radius: 30px;
  background: var(--White, #FFF);
  flex: 1 1 0;
  min-height: 0;
  margin-bottom: 20px;
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
  color: var(--Primary-400, #02478A);
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
}

.features-section-desc {
  color: var(--Gray-600, #1F2937);
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
  background: var(--Primary-200, #F3F8FF);
  border: none;
  border-radius: 1px;
}



</style>
