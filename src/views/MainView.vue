<template>
  <div class="main-container">
    <HeaderSection @scrollToSection="scrollToSection" />
    <main class="main-content">
      <HeroSection />
      <IntroSection />
      <FeaturesSection />
      <FaqSection />
      <NewsSection />
    </main>
    <CommonFooter />
  </div>
</template>

<script setup lang="ts">
import HeaderSection from '../components/main/HeaderSection.vue'
import HeroSection from '../components/main/HeroSection.vue'
import IntroSection from '../components/main/IntroSection.vue'
import FeaturesSection from '../components/main/FeaturesSection.vue'
import FaqSection from '../components/main/FaqSection.vue'
import NewsSection from '../components/main/NewsSection.vue'
import CommonFooter from '../components/common/CommonFooter.vue'
import { nextTick } from 'vue'

const HEADER_HEIGHT = 100
const smoothScrollTo = (target: number, duration: number = 800) => {
  const start = window.pageYOffset
  const distance = target - start
  let startTime: number | null = null
  
  const easeOutQuart = (t: number): number => 1 - (--t) * t * t * t
  
  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const easedProgress = easeOutQuart(progress)
    
    window.scrollTo(0, start + distance * easedProgress)
    
    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }
  
  requestAnimationFrame(animation)
}
const scrollToSection = async (id: string) => {
  await nextTick()
  const element = document.getElementById(id)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const targetPosition = elementPosition - HEADER_HEIGHT
    smoothScrollTo(targetPosition, 800)
  }
}
</script>

<style>
@import url('/src/assets/pretendard.css');

.main-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 전역 반응형 설정 */
@media (max-width: 1440px) {
  .main-container {
    max-width: 100vw;
  }
}

@media (max-width: 1024px) {
  .main-container {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .main-container {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .main-container {
    font-size: 12px;
  }
}

/* 스크롤 스무스 처리 제거 (JavaScript로 처리) */

/* 모바일에서 가로 스크롤 방지 */
body {
  overflow-x: hidden;
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  .main-container {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
</style>
