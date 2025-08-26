<template>
  <div class="crew-container">
    <!-- Background blur effects -->
    <div class="blur-bg-1"></div>
    <div class="blur-bg-2"></div>
    <div class="blur-bg-3"></div>
    <div class="blur-bg-4"></div>
    <div class="blur-bg-5"></div>
    <div class="blur-bg-6"></div>
    <div class="blur-bg-7"></div>
    <div class="blur-bg-8"></div>
    <div class="blur-bg-9"></div>
    
    <!-- Small decorative circles -->
    <div class="small-circle-1"></div>
    <div class="small-circle-2"></div>

    <!-- Header -->
    <div class="header">
      <img 
        src="https://api.builder.io/api/v1/image/assets/TEMP/f3de7b9128084f54f5e561ccf0ebd57029bdb1bf?width=2880" 
        alt="Common / 랜딩 / header" 
        class="header-image"
      />
    </div>

    <!-- Main content -->
    <div class="main-content">
      <div class="hero-section">
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/83ffc94aa1b6ec1d4ed4f6afe3f6172f5fc06a7d?width=1142" 
          alt="EULGPT" 
          class="logo"
        />
        <div class="title-section">
          <span class="recruitment-title">팀원 모집</span>
          <div class="arrow-icon">
            <div class="arrow-line-1"></div>
            <div class="arrow-line-2"></div>
          </div>
        </div>
      </div>
      
      <div class="buttons-section">
        <button class="action-button">지원하기</button>
        <button class="action-button">둘러보기</button>
      </div>
    </div>

    <!-- Description section -->
    <div class="description-section">
      <h2 class="description-title">을지피티는 어떤 서비스인가요?</h2>
      <p class="description-text">
        을지대학교 성남캠퍼스에서 학생들의<br>
        편의를 위한 기능을 담은 AI 웹사이트입니다!
      </p>
    </div>

    <!-- Features illustration -->
    <div class="features-illustration">
      <!-- Curved line -->
      <svg class="curved-line" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-66.7722 417.187C6.57928 363.347 196.186 322.525 341.055 398.435C522.141 493.323 632.892 752.005 964.461 643.576C1280.61 540.191 1573.94 560.89 1663.59 662.853" stroke="white" stroke-width="1.5"/>
        <path opacity="0.15" d="M-66.7737 395.365C24.4823 335.514 187.186 304.703 332.055 380.613C513.141 475.501 647.889 776.504 964.46 667.754C1279.04 559.687 1573.94 583.067 1663.59 685.03" stroke="white" stroke-width="1.5"/>
        <path opacity="0.3" d="M-74.7714 405.802C12.9854 354.514 187.187 310.14 332.056 386.051C513.142 480.938 644.819 766.822 964.461 657.191C1279.09 549.278 1573.94 572.505 1663.59 674.468" stroke="white" stroke-width="1.5"/>
      </svg>

      <!-- Feature points -->
      <div class="feature-point point-1">
        <div class="point-blur"></div>
        <div class="point-circle"></div>
      </div>
      <div class="feature-point point-2">
        <div class="point-blur"></div>
        <div class="point-circle"></div>
      </div>
      <div class="feature-point point-3">
        <div class="point-blur"></div>
        <div class="point-circle"></div>
      </div>
      <div class="feature-point point-4">
        <div class="point-blur"></div>
        <div class="point-circle"></div>
      </div>

      <!-- Feature descriptions -->
      <div class="feature-desc feature-1">
        <h3>지식 시스템</h3>
        <p>
          EULGPT AI 질문���교생활<br>
          정보, 일정, 공지사항까지<br>
          질문 하나면 확인할 수 있어요.
        </p>
      </div>

      <div class="feature-desc feature-2">
        <h3>빈 강의실 확인</h3>
        <p>
          빈 강의실, 어디 있는지 한눈에!<br>
          수업 없는 시간대의 강의실을<br>
          확인하고 바로 이용해보세요.
        </p>
      </div>

      <div class="feature-desc feature-3">
        <h3>학식당 혼잡도</h3>
        <p>
          오늘의 학식, 기다리지 마세요.<br>
          메뉴 확인은 기본<br>
          혼잡도 그래프로 줄까지 예측!
        </p>
      </div>

      <div class="feature-desc feature-4">
        <h3>열람실 • 도서관 예약</h3>
        <p>
          좌석 예약도 스마트하게!<br>
          열람실 좌석 현황과 예약까지<br>
          클릭 한 번으로 해결해요.
        </p>
      </div>

      <!-- Blur elements for features -->
      <div class="feature-blur-1"></div>
      <div class="feature-blur-2"></div>
      
      <!-- Central illustration -->
      <div class="central-illustration">
        <div class="illustration-blur"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
:root {
  --dark-primary: #141D30;
  --dark-sub1: #4789EE;
  --dark-sub2: #665CED;
  --white: #FFF;
  --etc-light-blue: rgba(2, 71, 138, 0.10);
}

.crew-container {
  width: 100vw;
  min-height: 2332px;
  background: linear-gradient(135deg, #141D30 0%, #1a2440 50%, #141D30 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  color: #FFFFFF;
}

.crew-container * {
  box-sizing: border-box;
}

/* Background blur effects */
.blur-bg-1 {
  width: 672px;
  height: 672px;
  position: absolute;
  left: 761px;
  top: -488px;
  background: radial-gradient(circle, #4789EE 0%, #3574d9 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(250px);
  transform: rotate(-9.474deg);
  z-index: 1;
}

.blur-bg-2 {
  width: 708px;
  height: 708px;
  position: absolute;
  left: -563px;
  top: 537px;
  background: radial-gradient(circle, #665CED 0%, #5649d8 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(225px);
  transform: rotate(-148.783deg);
  z-index: 1;
}

.blur-bg-3 {
  width: 842px;
  height: 842px;
  position: absolute;
  left: 1149px;
  top: -260px;
  background: radial-gradient(circle, #665CED 0%, #5649d8 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(250px);
  transform: rotate(-9.474deg);
  z-index: 1;
}

.blur-bg-4 {
  width: 471px;
  height: 473px;
  position: absolute;
  left: 63px;
  top: 903px;
  background: radial-gradient(circle, #4789EE 0%, #3574d9 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(250px);
  transform: rotate(-148.783deg);
  z-index: 1;
}

.blur-bg-5 {
  width: 471px;
  height: 473px;
  position: absolute;
  left: 1142px;
  top: 1066px;
  background: radial-gradient(circle, #4789EE 0%, #3574d9 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.32;
  filter: blur(250px);
  transform: rotate(-148.783deg);
  z-index: 1;
}

.blur-bg-6 {
  width: 600px;
  height: 600px;
  position: absolute;
  left: 50%;
  top: 30%;
  background: radial-gradient(circle, #665CED 0%, #4789EE 30%, transparent 60%);
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(300px);
  transform: translate(-50%, -50%) rotate(45deg);
  z-index: 1;
}

.blur-bg-7 {
  width: 800px;
  height: 400px;
  position: absolute;
  left: 20%;
  top: 60%;
  background: radial-gradient(ellipse, #4789EE 0%, #665CED 40%, transparent 70%);
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(200px);
  transform: rotate(-20deg);
  z-index: 1;
}

.blur-bg-8 {
  width: 500px;
  height: 500px;
  position: absolute;
  right: 10%;
  top: 80%;
  background: radial-gradient(circle, #665CED 0%, #4789EE 50%, transparent 80%);
  border-radius: 50%;
  opacity: 0.25;
  filter: blur(180px);
  transform: rotate(60deg);
  z-index: 1;
}

.blur-bg-9 {
  width: 1000px;
  height: 300px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #4789EE 0%, #665CED 50%, #4789EE 100%);
  opacity: 0.1;
  filter: blur(400px);
  z-index: 1;
}

/* Small decorative circles */
.small-circle-1,
.small-circle-2 {
  width: 36px;
  height: 36px;
  background: radial-gradient(circle, #141D30 0%, #0a1020 100%);
  border-radius: 50%;
  filter: blur(3px);
  position: absolute;
  z-index: 2;
}

.small-circle-1 {
  left: 869px;
  top: 1016px;
}

.small-circle-2 {
  left: 1234px;
  top: 934px;
}

/* Header */
.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 84px;
  z-index: 100;
}

.header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Main content */
.main-content {
  position: absolute;
  left: 180px;
  top: 244px;
  width: 1080px;
  display: flex;
  flex-direction: column;
  gap: 100px;
  z-index: 10;
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 571.164px;
}

.logo {
  height: 103px;
  width: auto;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.recruitment-title {
  color: #4789EE;
  font-size: 64px;
  font-weight: 700;
  line-height: 90px;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
}

.arrow-icon {
  position: relative;
  width: 21px;
  height: 21px;
  margin-top: 20px;
}

.arrow-line-1 {
  width: 6px;
  height: 21px;
  background: #4789EE;
  position: absolute;
  left: 3px;
  top: 0;
  transform: rotate(30deg);
}

.arrow-line-2 {
  width: 6px;
  height: 21px;
  background: #4789EE;
  position: absolute;
  left: 0;
  top: 3px;
  transform: rotate(120deg);
}

.buttons-section {
  display: flex;
  gap: 50px;
}

.action-button {
  width: 220px;
  padding: 14px 77px;
  border-radius: 68px;
  background: rgba(2, 71, 138, 0.10);
  border: none;
  color: #FFFFFF;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 140%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: rgba(2, 71, 138, 0.20);
  transform: translateY(-2px);
}

/* Description section */
.description-section {
  position: absolute;
  left: 377px;
  top: 865px;
  width: 686px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 70px;
  text-align: center;
  z-index: 10;
}

.description-title {
  color: #FFFFFF;
  font-size: 56px;
  font-weight: 700;
  line-height: 90px;
  margin: 0;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
}

.description-text {
  color: #FFFFFF;
  font-size: 32px;
  font-weight: 700;
  line-height: 150%;
  margin: 0;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
}

/* Features illustration */
.features-illustration {
  position: absolute;
  left: -86px;
  top: 1357px;
  width: 1763px;
  height: 815px;
  z-index: 5;
}

.curved-line {
  position: absolute;
  width: 100%;
  height: 100%;
}

.feature-point {
  position: absolute;
}

.point-blur {
  width: 36px;
  height: 36px;
  background: var(--dark-primary);
  border-radius: 50%;
  filter: blur(3px);
  position: absolute;
  left: -8px;
  top: -9px;
}

.point-circle {
  width: 20px;
  height: 20px;
  background: var(--dark-sub1);
  border-radius: 50%;
  position: relative;
}

.point-1 {
  left: 177px;
  top: 349px;
}

.point-2 {
  left: 536px;
  top: 551px;
}

.point-3 {
  left: 877px;
  top: 653px;
}

.point-4 {
  left: 1242px;
  top: 571px;
}

.feature-desc {
  position: absolute;
  color: #FFFFFF;
}

.feature-desc h3 {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: #FFFFFF;
}

.feature-desc p {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.6;
  margin: 0;
  color: #FFFFFF;
}

.feature-1 {
  left: 122px;
  top: 459px;
  width: 300px;
}

.feature-2 {
  left: 468px;
  top: 704px;
  width: 300px;
}

.feature-3 {
  left: 811px;
  top: 807px;
  width: 300px;
}

.feature-4 {
  left: 1141px;
  top: 361px;
  width: 300px;
}

.feature-blur-1,
.feature-blur-2 {
  position: absolute;
  border-radius: 50%;
  filter: blur(75px);
  z-index: 2;
}

.feature-blur-1 {
  width: 262px;
  height: 263px;
  background: radial-gradient(circle, #4789EE 0%, #3574d9 50%, transparent 80%);
  opacity: 0.3;
  left: 549px;
  top: 132px;
  transform: rotate(-9.474deg);
}

.feature-blur-2 {
  width: 197px;
  height: 197px;
  background: radial-gradient(circle, #665CED 0%, #5649d8 50%, transparent 80%);
  opacity: 0.5;
  left: 738px;
  top: 224px;
  transform: rotate(-3.462deg);
}

.central-illustration {
  position: absolute;
  left: 568px;
  top: 216px;
  width: 250px;
  height: 250px;
}

.illustration-blur {
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23665CED"/></svg>');
  border-radius: 50%;
  filter: blur(2.5px);
  transform: rotate(-12.015deg);
}

/* Responsive adjustments */
@media (max-width: 1440px) {
  .crew-container {
    width: 100%;
    overflow-x: hidden;
  }
  
  .main-content {
    left: 5%;
    width: 90%;
  }
  
  .description-section {
    left: 10%;
    width: 80%;
  }
  
  .features-illustration {
    left: -5%;
    width: 110%;
  }
}
</style>
