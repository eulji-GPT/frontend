<template>
  <div class="box" ref="featuresBox">
    <div class="group">
      <div class="overlap">
        <div class="bg-image-2 floating-image" ref="centerImage"></div>
        <div class="gradient-circle left-top animated-gradient"></div>
        <div class="gradient-circle-2 right-bottom animated-gradient"></div>
        <div class="overlap-wrapper">
          <div class="overlap-group">
            <div class="div">
              <!-- 웨이브 라인들 -->
              <svg class="vector animated-path" xmlns="http://www.w3.org/2000/svg" width="1440" height="316" viewBox="0 0 1440 316" fill="none">
                <path class="wave-path" d="M-66.7722 62.1867C6.57928 8.34717 196.186 -32.4752 341.055 43.4351C522.141 138.323 632.892 397.005 964.461 288.576C1280.61 185.191 1573.94 205.89 1663.59 307.853" stroke="white" stroke-width="1.5" stroke-dasharray="10 5"/>
              </svg>
              
              <svg class="vector-2 animated-path" xmlns="http://www.w3.org/2000/svg" width="1440" height="339" viewBox="0 0 1440 339" fill="none">
                <path class="wave-path-2" d="M-74.7714 61.8022C12.9854 10.5136 187.187 -33.8598 332.056 42.0505C513.142 136.938 644.819 422.822 964.461 313.191C1279.09 205.278 1573.94 228.505 1663.59 330.468" stroke="white" stroke-width="1.5" opacity="0.3" stroke-dasharray="15 10"/>
              </svg>

              <!-- 블러 도트들 -->
              <div class="ellipse pulse-dot" />
              <div class="ellipse-2 pulse-dot" />
              <div class="ellipse-3 glowing-dot" />
              <div class="ellipse-4 glowing-dot" />
              <div class="ellipse-5 pulse-dot" />
              <div class="ellipse-6 glowing-dot" />

              <svg class="vector-3 animated-path" xmlns="http://www.w3.org/2000/svg" width="1440" height="358" viewBox="0 0 1440 358" fill="none">
                <path class="wave-path-3" d="M-66.7737 61.3651C24.4823 1.51402 187.186 -29.2969 332.055 46.6134C513.141 141.501 647.889 442.504 964.46 333.754C1279.04 225.687 1573.94 249.067 1663.59 351.03" stroke="white" stroke-width="1.5" opacity="0.15" stroke-dasharray="20 15"/>
              </svg>

              <div class="ellipse-7 pulse-dot" />
              <div class="ellipse-8 glowing-dot" />

              <div class="frame feature-card" ref="card1">
                <div class="text-wrapper">챗봇 시스템</div>
                <p class="p">
                  EULGPT AI 챗봇학교생활
                  <br />
                  정보, 일정, 공지사항까지
                  <br />
                  질문 하나면 확인할 수 있어요.
                </p>
                <div class="card-glow"></div>
              </div>

              <div class="frame-2 feature-card" ref="card2">
                <div class="text-wrapper">빈 강의실 확인</div>
                <p class="p">
                  빈 강의실, 어디 있는지 한눈에!
                  <br />
                  수업 없는 시간대의 강의실을
                  <br />
                  확인하고 바로 이용해보세요.
                </p>
                <div class="card-glow"></div>
              </div>

              <div class="frame-3 feature-card" ref="card3">
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
                <div class="card-glow"></div>
              </div>

              <div class="frame-4 feature-card" ref="card4">
                <div class="text-wrapper">학식당 혼잡도</div>
                <p class="text-wrapper-2">
                  오늘의 학식, 기다리지 마세요.
                  <br />
                  메뉴 확인은 기본
                  <br />
                  혼잡도 그래프로 줄까지 예측!
                </p>
                <div class="card-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const featuresBox = ref<HTMLElement>()
const centerImage = ref<HTMLElement>()
const card1 = ref<HTMLElement>()
const card2 = ref<HTMLElement>()
const card3 = ref<HTMLElement>()
const card4 = ref<HTMLElement>()

const setupCardAnimations = () => {
  const cardRefs = [
    { ref: card1.value, name: 'card1' },
    { ref: card2.value, name: 'card2' },
    { ref: card3.value, name: 'card3' },
    { ref: card4.value, name: 'card4' }
  ]
  
  cardRefs.forEach(({ ref: card, name }) => {
    console.log(`Setting up ${name}:`, !!card)
    if (!card) {
      console.warn(`${name} not found!`)
      return
    }
    
    // 기본 스타일 설정
    card.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    card.style.cursor = 'pointer'
    
    card.addEventListener('mouseenter', () => {
      console.log(`${name} mouseenter`)
      card.style.transform = 'translateY(-10px) scale(1.05)'
      card.style.boxShadow = '0 20px 40px rgba(71, 137, 238, 0.3)'
      
      const glow = card.querySelector('.card-glow') as HTMLElement
      if (glow) {
        glow.style.opacity = '1'
      }
    })
    
    card.addEventListener('mouseleave', () => {
      console.log(`${name} mouseleave`)
      card.style.transform = 'translateY(0) scale(1)'
      card.style.boxShadow = '0 10px 25px rgba(71, 137, 238, 0.1)'
      
      const glow = card.querySelector('.card-glow') as HTMLElement
      if (glow) {
        glow.style.opacity = '0'
      }
    })
  })
}

const animateImageOnScroll = () => {
  let ticking = false
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateImagePosition)
      ticking = true
    }
  }
  
  const updateImagePosition = () => {
    if (!centerImage.value || !featuresBox.value) {
      ticking = false
      return
    }
    
    const containerRect = featuresBox.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // 컨테이너가 뷰포트에 있는지 확인
    if (containerRect.bottom < 0 || containerRect.top > windowHeight) {
      ticking = false
      return
    }
    
    // 컨테이너 내에서의 스크롤 진행도 계산 (0 ~ 1)
    const progress = Math.max(0, Math.min(1, 
      (windowHeight - containerRect.top) / (windowHeight + containerRect.height)
    ))
    
    // 스크롤 아래로 내릴 때 오른쪽으로 움직이도록 수정
    const rotationOffset = progress * 60 // 스크롤할수록 60도 회전
    const translateY = progress * 120 // 스크롤할수록 120px 아래로 이동  
    const translateX = progress * 30 // 스크롤할수록 30px 오른쪽으로 이동
    const scale = 1 + progress * 0.3 // 스크롤할수록 1.3배 확대
    
    centerImage.value.style.transform = `translateX(${-50 + translateX}%) rotate(${-12.015 + rotationOffset}deg) translateY(${translateY}px) scale(${scale})`
    
    ticking = false
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
}

onMounted(() => {
  nextTick(() => {
    console.log('Setting up animations...')
    setupCardAnimations()
    animateImageOnScroll()
    
    // 카드들이 제대로 찾아졌는지 확인
    console.log('Cards found:', {
      card1: !!card1.value,
      card2: !!card2.value, 
      card3: !!card3.value,
      card4: !!card4.value
    })
  })
})
</script>

<style scoped>
.box {
  height: 1200px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  will-change: transform;
  overflow: visible;
}

.box .group {
  height: 1200px;
  position: relative;
  width: 100%;
}

.box .overlap {
  height: 1200px;
  position: relative;
  top: 0px;
  overflow: visible;
  min-height: 100vh;
}

.floating-image {
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
  transition: transform 0.1s ease-out;
  filter: drop-shadow(0 20px 40px rgba(71, 137, 238, 0.2));
}

.animated-gradient {
  animation: gradientPulse 4s ease-in-out infinite;
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
  animation-delay: 0s;
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
  animation-delay: 2s;
}

.box .overlap-wrapper {
  height: 800px;
  position: absolute;
  top: 324px;
  width: 100%;
  overflow: visible;
}

.box .overlap-group {
  height: 800px;
  position: relative;
  top: 10px;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  overflow: visible;
}


.box .div {
  height: 600px;
  position: relative;
  top: 0;
  width: 100%;
  max-width: 1440px;
  overflow: visible;
  z-index: 3;
  min-height: 600px;
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
  z-index: 10;
  background: transparent !important;
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
  top: 320px;
  width: 272px;
  z-index: 10;
  background: transparent !important;
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
  z-index: 10;
  background: transparent !important;
}

.box .frame-4 {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  left: 744px;
  position: absolute;
  top: 420px;
  width: 285px;
  z-index: 10;
  pointer-events: auto;
  background: transparent !important;
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

/* Feature Cards Enhanced Styling */
.feature-card {
  position: relative;
  background: transparent !important;
  backdrop-filter: blur(20px);
  border: none;
  border-radius: 20px;
  padding: 20px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  overflow: visible;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(71, 137, 238, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

/* Animated SVG Paths */
.animated-path .wave-path {
  stroke-dashoffset: 100;
  animation: waveDraw 6s ease-in-out infinite;
}

.animated-path .wave-path-2 {
  stroke-dashoffset: 150;
  animation: waveDraw 8s ease-in-out infinite;
  animation-delay: 2s;
}

.animated-path .wave-path-3 {
  stroke-dashoffset: 200;
  animation: waveDraw 10s ease-in-out infinite;
  animation-delay: 4s;
}

/* Pulse and Glow Effects for Dots */
.pulse-dot {
  animation: pulseDot 2s ease-in-out infinite;
}

.glowing-dot {
  animation: glowDot 3s ease-in-out infinite;
}

/* Keyframe Animations */
@keyframes gradientPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes waveDraw {
  0% {
    stroke-dashoffset: 100;
    opacity: 0.1;
  }
  50% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -100;
    opacity: 0.1;
  }
}

@keyframes pulseDot {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes glowDot {
  0%, 100% {
    box-shadow: 0 0 15px rgba(71, 137, 238, 0.8);
  }
  50% {
    box-shadow: 0 0 30px rgba(71, 137, 238, 1), 0 0 40px rgba(71, 137, 238, 0.5);
  }
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
  
  .animated-gradient,
  .pulse-dot,
  .glowing-dot {
    animation: none;
  }
}
</style>