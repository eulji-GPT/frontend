<template>
  <div class="box">
    <div class="group">
      <div class="overlap">
        <div class="bg-image-2"></div>
        <div class="gradient-circle left-top"></div>
        <div class="gradient-circle-2 right-bottom"></div>
        <div class="overlap-wrapper">
          <div class="overlap-group">
            <div class="div">
              <!-- 웨이브 라인들 -->
              <svg class="vector" xmlns="http://www.w3.org/2000/svg" width="1440" height="316" viewBox="0 0 1440 316" fill="none">
                <path d="M-66.7722 62.1867C6.57928 8.34717 196.186 -32.4752 341.055 43.4351C522.141 138.323 632.892 397.005 964.461 288.576C1280.61 185.191 1573.94 205.89 1663.59 307.853" stroke="white" stroke-width="1.5"/>
              </svg>
              
              <svg class="vector-2" xmlns="http://www.w3.org/2000/svg" width="1440" height="339" viewBox="0 0 1440 339" fill="none">
                <path d="M-74.7714 61.8022C12.9854 10.5136 187.187 -33.8598 332.056 42.0505C513.142 136.938 644.819 422.822 964.461 313.191C1279.09 205.278 1573.94 228.505 1663.59 330.468" stroke="white" stroke-width="1.5" opacity="0.3"/>
              </svg>

              <!-- 블러 도트들 -->
              <div class="ellipse" />
              <div class="ellipse-2" />
              <div class="ellipse-3" />
              <div class="ellipse-4" />
              <div class="ellipse-5" />
              <div class="ellipse-6" />

              <svg class="vector-3" xmlns="http://www.w3.org/2000/svg" width="1440" height="358" viewBox="0 0 1440 358" fill="none">
                <path d="M-66.7737 61.3651C24.4823 1.51402 187.186 -29.2969 332.055 46.6134C513.141 141.501 647.889 442.504 964.46 333.754C1279.04 225.687 1573.94 249.067 1663.59 351.03" stroke="white" stroke-width="1.5" opacity="0.15"/>
              </svg>

              <div class="ellipse-7" />
              <div class="ellipse-8" />

              <div class="frame">
                <div class="text-wrapper">챗봇 시스템</div>
                <p class="p">
                  EULGPT AI 챗봇학교생활
                  <br />
                  정보, 일정, 공지사항까지
                  <br />
                  질문 하나면 확인할 수 있어요.
                </p>
              </div>

              <div class="frame-2">
                <div class="text-wrapper">빈 강의실 확인</div>
                <p class="p">
                  빈 강의실, 어디 있는지 한눈에!
                  <br />
                  수업 없는 시간대의 강의실을
                  <br />
                  확인하고 바로 이용해보세요.
                </p>
              </div>

              <div class="frame-3">
                <div class="text-wrapper">
                  열람실 • 도서관&nbsp;&nbsp;예약
                </div>
                <p class="p">
                  좌석 예약도 스마트하게!
                  <br />
                  열람실 좌석 현황과 예약까지
                  <br />
                  클릭 한 번으로&nbsp;&nbsp;해결해요.
                </p>
              </div>
            </div>

            <div class="frame-4">
              <div class="text-wrapper">학식당 혼잡도</div>
              <p class="text-wrapper-2">
                오늘의 학식, 기다리지 마세요.
                <br />
                메뉴 확인은 기본
                <br />
                혼잡도 그래프로 줄까지 예측!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.box {
  height: 815px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
}

.box .group {
  height: 815px;
  position: relative;
  width: 100%;
}

.box .overlap {
  height: 959px;
  position: relative;
  top: 0px;
  overflow: visible;
}

.bg-image-2 {
  width: 249.978px;
  height: 249.978px;
  left: 50%;
  position: absolute;
  top: 0;
  transform: translateX(-50%) rotate(-12.015deg);
  flex-shrink: 0;
  aspect-ratio: 1/1;
  background: url('@/components/crew/img/aa 2.png') transparent 50% / cover no-repeat;
  z-index: 2;
}

.gradient-circle.left-top {
  width: 262.8px;
  height: 263.574px;
  left: calc(50% - 100px);
  position: absolute;
  top: -50px;
  transform: rotate(2.53deg);
  flex-shrink: 0;
  border-radius: 263.574px;
  opacity: 0.3;
  background: var(--dark-sub1, #4789EE);
  filter: blur(75px);
  z-index: 1;
}

.gradient-circle-2.right-bottom {
  width: 196.971px;
  height: 196.995px;
  left: calc(50% + 100px);
  position: absolute;
  top: 50px;
  transform: rotate(-3.464deg);
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--dark-sub2, #665CED);
  opacity: 0.5;
  filter: blur(100px);
  z-index: 1;
}

.box .overlap-wrapper {
  height: 635px;
  position: absolute;
  top: 324px;
  width: 100%;
}

.box .overlap-group {
  height: 625px;
  position: relative;
  top: 10px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}


.box .div {
  height: 522px;
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 1440px;
  overflow: visible;
  z-index: 3;
}

.box .vector {
  height: 314px;
  position: absolute;
  top: 21px;
  width: 100%;
  max-width: 1440px;
}

.box .vector-2 {
  height: 357px;
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 1440px;
}

.box .ellipse {
  background-color: rgba(71, 137, 238, 0.5) !important;
  background: rgba(71, 137, 238, 0.5) !important;
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 869px;
  position: absolute;
  top: 309px;
  width: 36px;
  z-index: 500;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .ellipse-2 {
  background-color: rgba(71, 137, 238, 0.5) !important;
  background: rgba(71, 137, 238, 0.5) !important;
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 1234px;
  position: absolute;
  top: 227px;
  width: 36px;
  z-index: 500;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .ellipse-3 {
  aspect-ratio: 1;
  background-color: #4789EE !important;
  background: #4789EE !important;
  border-radius: 10px;
  height: 20px;
  left: 877px;
  position: absolute;
  top: 317px;
  width: 20px;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(71, 137, 238, 0.8);
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .ellipse-4 {
  aspect-ratio: 1;
  background-color: #4789EE !important;
  background: #4789EE !important;
  border-radius: 10px;
  height: 20px;
  left: 1242px;
  position: absolute;
  top: 235px;
  width: 20px;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(71, 137, 238, 0.8);
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .ellipse-5 {
  background-color: rgba(71, 137, 238, 0.6) !important;
  background: rgba(71, 137, 238, 0.6) !important;
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 169px;
  position: absolute;
  top: 5px;
  width: 36px;
  z-index: 500;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .ellipse-6 {
  aspect-ratio: 1;
  background-color: #4789EE !important;
  background: #4789EE !important;
  border-radius: 10px;
  height: 20px;
  left: 177px;
  position: absolute;
  top: 13px;
  width: 20px;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(71, 137, 238, 0.8);
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .vector-3 {
  height: 338px;
  position: absolute;
  top: 10px;
  width: 100%;
  max-width: 1440px;
}

.box .ellipse-7 {
  background-color: rgba(71, 137, 238, 0.5) !important;
  background: rgba(71, 137, 238, 0.5) !important;
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 528px;
  position: absolute;
  top: 207px;
  width: 36px;
  z-index: 500;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .ellipse-8 {
  aspect-ratio: 1;
  background-color: #4789EE !important;
  background: #4789EE !important;
  border-radius: 10px;
  height: 20px;
  left: 536px;
  position: absolute;
  top: 215px;
  width: 20px;
  z-index: 1000;
  box-shadow: 0 0 15px rgba(71, 137, 238, 0.8);
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.box .frame {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 15px;
  left: 51px;
  position: absolute;
  top: 108px;
  width: 272px;
}

.box .text-wrapper {
  align-self: stretch;
  color: white;
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  margin-top: -1px;
  position: relative;
  text-align: center;
}

.box .p {
  align-self: stretch;
  color: white;
  font-family: 'Pretendard', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  position: relative;
  text-align: center;
}

.box .frame-2 {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  left: 410px;
  position: absolute;
  top: 353px;
  width: 272px;
}

.box .frame-3 {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 15px;
  left: 1109px;
  position: absolute;
  top: 10px;
  width: 285px;
}

.box .frame-4 {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  left: 744px;
  position: absolute;
  top: 456px;
  width: 285px;
}

.box .text-wrapper-2 {
  color: white;
  font-family: 'Pretendard', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  margin-left: -0.02px;
  margin-right: -0.02px;
  position: relative;
  text-align: center;
  width: 285px;
}

@media (max-width: 768px) {
  .box {
    height: auto;
    width: 100%;
    padding: 20px;
  }
  
  .box .group {
    position: static;
    height: auto;
    width: 100%;
  }
  
  .box .overlap {
    height: auto;
    top: 0;
  }
  
  .box .img {
    display: none;
  }
  
  .box .overlap-wrapper {
    position: static;
    height: auto;
    width: 100%;
  }
  
  .box .overlap-group {
    position: static;
    height: auto;
    width: 100%;
    left: 0;
    top: 0;
  }
  
  .box .div {
    position: static;
    height: auto;
    width: 100%;
  }
  
  .box .vector,
  .box .vector-2,
  .box .vector-3 {
    display: none;
  }
  
  .box .ellipse,
  .box .ellipse-2,
  .box .ellipse-3,
  .box .ellipse-4,
  .box .ellipse-5,
  .box .ellipse-6,
  .box .ellipse-7,
  .box .ellipse-8 {
    display: none;
  }
  
  .box .frame,
  .box .frame-2,
  .box .frame-3,
  .box .frame-4 {
    position: static;
    width: 100%;
    max-width: 320px;
    margin: 0 auto 40px;
    left: auto;
    top: auto;
    align-items: center !important;
  }
  
  .box .text-wrapper {
    font-size: 20px;
  }
  
  .box .p,
  .box .text-wrapper-2 {
    font-size: 16px;
    line-height: 28px;
    width: auto;
  }
}
</style>