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
const smoothScrollTo = (target: number, duration: number = 1000) => {
  const start = window.pageYOffset
  const distance = target - start
  let startTime: number | null = null
  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1
    window.scrollTo(0, start + distance * ease)
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
</style>
