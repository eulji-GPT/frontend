<template>
  <div class="main-container">
    <HeaderSection @scrollToSection="scrollToSection" />
    <main class="main-content">
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Intro Section -->
      <IntroSection />
      <!-- Features Section -->
      <FeaturesSection />
      
      <!-- FAQ Section -->
      <FaqSection />
      
      <!-- News Section -->
      <NewsSection />
    </main>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

import HeaderSection from './components/HeaderSection.vue'
import HeroSection from './components/HeroSection.vue'
import IntroSection from './components/IntroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import FaqSection from './components/FaqSection.vue'
import NewsSection from './components/NewsSection.vue'

// 커스텀 스무스 스크롤 함수 (모든 브라우저에서 작동)
const smoothScrollTo = (target: number, duration: number = 1000) => {
  const start = window.pageYOffset
  const distance = target - start
  let startTime: number | null = null

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    
    // easeInOutCubic easing function
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
  console.log(`스크롤 시도: ${id}`) // 디버깅용
  await nextTick()
  const element = document.getElementById(id)
  if (element) {
    console.log(`요소 찾음: ${id}`) // 디버깅용
    const headerHeight = 100 // 헤더 높이
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const targetPosition = elementPosition - headerHeight
    console.log(`스크롤 위치: ${targetPosition}`) // 디버깅용
    // 커스텀 스무스 스크롤 실행
    smoothScrollTo(targetPosition, 800)
  } else {
    console.log(`요소를 찾을 수 없음: ${id}`) // 디버깅용
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 네비게이션 링크에 호버 효과 추가 */
.nav-list a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
  position: relative;
}

.nav-list a:hover {
  color: #4f46e5;
}

.nav-list a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: #4f46e5;
  transition: width 0.3s ease;
}

.nav-list a:hover::after {
  width: 100%;
}
</style>

<style>
.main-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  border-bottom: 3px solid #a084f3;
}
.faq-accordion {
  border-bottom: 1px solid #f0f0f0;
}
.faq-item {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
  transition: background 0.2s;
}
.faq-item.active {
  background: #f7f9fb;
}
.faq-q {
  color: #25345d;
  font-size: 1.2rem;
  margin-right: 0.7rem;
}
.faq-arrow {
  margin-left: auto;
  font-size: 1.1rem;
  color: #a084f3;
  transition: transform 0.2s;
}
.faq-arrow.open {
  transform: rotate(180deg);
}
.faq-answer {
  background: #f7f9fb;
  color: #4f6edb;
  font-weight: 700;
  padding: 0.8rem 1.2rem 0.8rem 2.2rem;
  font-size: 1.05rem;
  border-top: 1px solid #e0e0f0;
  border-radius: 0 0 0.7rem 0.7rem;
}
.faq-a {
  color: #4f6edb;
  font-size: 1.2rem;
  margin-right: 0.7rem;
}
/* 슬라이드 트랜지션 */
.faq-slide-enter-active, .faq-slide-leave-active {
  transition: height 0.35s cubic-bezier(.4,0,.2,1), padding 0.35s cubic-bezier(.4,0,.2,1), opacity 0.3s;
  overflow: hidden;
}
.faq-slide-enter-from, .faq-slide-leave-to {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}
.faq-slide-enter-to, .faq-slide-leave-from {
  height: 2.5em;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  opacity: 1;
}
.star {
  color: #a084f3;
  font-size: 1rem;
  vertical-align: super;
}

.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  font-size: 1.1rem;
  color: #222;
  font-weight: 500;
  margin: 0;
  padding: 0;
}

.nav-list li {
  cursor: pointer;
}

.auth-links {
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
  color: #222;
  font-weight: 500;
}

.auth-links span {
  cursor: pointer;
  transition: color 0.2s ease;
}

.auth-links span:hover {
  color: #4f46e5;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 3rem;
}

.title-block {
  margin-bottom: 2.5rem;
  text-align: left;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  color: #111;
}

.highlight {
  color: #4f6edb;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #e9eef3;
  border-radius: 2.5rem;
  padding: 1.5rem 2.5rem;
  margin-bottom: 2rem;
  min-width: 400px;
  max-width: 90vw;
  font-size: 3rem;
  font-weight: 800;
  box-shadow: 0 2px 12px 0 rgba(80,80,120,0.06);
}

.search-eulgpt {
  color: #4f6edb;
  margin-right: 1rem;
}

.gpt {
  color: #25345d;
}

.search-icon {
  color: #25345d;
  font-size: 2.2rem;
  margin-left: 1.5rem;
  font-weight: 700;
  transform: rotate(45deg);
}

.start-btn {
  background: #232834;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 2rem;
  padding: 0.7rem 3rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.section {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 3rem auto;
  padding: 2.5rem 1.5rem 0 1.5rem;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-in-out;
}

.intro-section {
  border: 2px dotted #a084f3;
  border-radius: 1rem;
  margin-top: 3rem;
  background: #fff;
  position: relative;
}

.intro-header {
  color: #4f6edb;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.intro-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
}

.intro-text {
  flex: 2;
}

.intro-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  line-height: 1.5;
}

.intro-desc {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #f7f9fb;
  border-radius: 1rem;
  padding: 1.2rem 1.5rem;
  font-size: 1rem;
  margin-top: 1.2rem;
  color: #222;
}

.intro-icon {
  font-size: 2.2rem;
  color: #4f6edb;
  margin-top: 0.2rem;
}

.intro-e {
  flex: 1;
  font-size: 7rem;
  font-weight: 900;
  color: #4f6edb;
  text-align: right;
  line-height: 1;
  margin-top: 0.5rem;
  margin-right: 1.5rem;
  position: relative;
}

.intro-e sup {
  color: #a084f3;
  font-size: 2.5rem;
  vertical-align: super;
  margin-left: 0.2rem;
}

.features-section {
  background: #f7f9fb;
  border-radius: 1.5rem;
  padding-bottom: 2.5rem;
}

.features-header {
  color: #4f6edb;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
}

.features-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 2.2rem;
}

.features-content {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
}

.feature-main {
  background: #4f6edb;
  color: #fff;
  border-radius: 1.5rem;
  padding: 2.2rem 2rem;
  flex: 1 1 320px;
  min-width: 280px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 2px 12px 0 rgba(80,80,120,0.06);
}

.feature-main-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-main-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
}

.feature-main-desc {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 2 1 400px;
  min-width: 220px;
}

.feature-item {
  background: #fff;
  border-radius: 1.2rem;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 2px 12px 0 rgba(80,80,120,0.06);
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
}

.feature-icon {
  font-size: 2rem;
  color: #4f6edb;
  margin-top: 0.2rem;
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.feature-desc {
  font-size: 0.98rem;
  color: #222;
}

.faq-section {
  border: 2px dotted #a084f3;
  border-radius: 1rem;
  background: #fff;
  margin-top: 2.5rem;
  padding-bottom: 2rem;
}

.faq-header {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  border-bottom: 2px dotted #a084f3;
  padding-bottom: 0.5rem;
}

.faq-list {
  margin-top: 1.2rem;
}

.faq-item {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
}

.faq-q {
  color: #25345d;
  font-size: 1.2rem;
  margin-right: 0.7rem;
}

.faq-answer {
  background: #f7f9fb;
  color: #4f6edb;
  font-weight: 700;
}

.faq-a {
  color: #4f6edb;
  font-size: 1.2rem;
  margin-right: 0.7rem;
}

.news-section {
  border-top: 3px solid #a084f3;
  padding-top: 2.5rem;
  margin-bottom: 4rem;
}

.news-header {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
}

.news-list {
  margin-top: 1.2rem;
}

.news-item {
  padding: 1.1rem 1.2rem;
  border-bottom: 1px solid #f0f0f0;
}

.news-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.news-date {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.news-desc {
  color: #4f6edb;
  font-size: 1rem;
  margin-top: 0.2rem;
}

@media (max-width: 900px) {
  .features-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .intro-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .intro-e {
    text-align: left;
    margin-right: 0;
    font-size: 4.5rem;
  }
  
  .nav-list {
    gap: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .main-title {
    font-size: 2rem;
  }
  
  .search-bar {
    font-size: 2rem;
    min-width: 220px;
    padding: 1rem 1.2rem;
  }
  
  .main-content {
    padding-top: 1rem;
  }
  
  .nav-list {
    display: none; /* 모바일에서는 햄버거 메뉴로 변경 고려 */
  }
}
</style>