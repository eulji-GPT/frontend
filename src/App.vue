<template>
  <div class="main-container">
    <header class="header">
      <nav class="nav">
        <div class="logo-text" style="padding:0; background:none;">
          <img :src="eulLogo" alt="EULGPT 로고" style="height:48px; width:auto; display:block;" />
        </div>
        <ul class="nav-list">
          <li><a href="#intro" @click.prevent="scrollToSection('intro')">서비스 소개</a></li>
          <li><a href="#features" @click.prevent="scrollToSection('features')">유용한 기능</a></li>
          <li><a href="#faq" @click.prevent="scrollToSection('faq')">자주 묻는 질문</a></li>
          <li><a href="#news" @click.prevent="scrollToSection('news')">새로운 소식</a></li>
        </ul>
        <div class="auth-links">
          <span>로그인</span>
          <span>회원가입</span>
        </div>
      </nav>
    </header>
    <main class="main-content">
      <!-- Hero Section -->
      <div class="title-block">
        <h1 class="main-title">학교생활의<br><span class="highlight">모든 순간</span>에<br>답하다</h1>
      </div>
      <div class="search-bar">
        <img :src="eulLogo" alt="EULGPT 로고" style="height: 2.5em; width: auto; margin-right: 1.2rem; vertical-align: middle;" />
        <span class="search-eulgpt">EUL<span class="gpt">GPT</span></span>
        <span class="search-icon">✚</span>
      </div>
      <button class="start-btn">시작하기</button>
      
      <!-- Intro Section -->
      <section id="intro" class="section intro-section">
        <div class="intro-header">궁금한 건 뭐든지, 을GPT와 함께 물어보세요.</div>
        <div class="intro-content">
          <div class="intro-text">
            <div class="intro-title">
              당신의 대학 생활이 을GPT와 연결될 때,<br>
              더 빠르고 정확한 정보와 함께<br>
              캠퍼스 생활이 쉬워집니다.
            </div>
            <div class="intro-desc">
              <span class="intro-icon">✚</span>
              <span>
                수업, 학식, 빈 강의실, 학교 정보까지<br>
                궁금했던 점들을 같이 대화해볼까요?<br>
                을지대학교 전용 AI 챗봇<br>
                <b>을GPT</b>가 도와드릴게요.
              </span>
            </div>
          </div>
          <div class="intro-e">E<sup>*</sup></div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section id="features" class="section features-section">
        <div class="features-header">유용한 기능</div>
        <div class="features-title">캠퍼스 생활의 모든 순간, 을GPT로 더 똑똑하고 간편하게</div>
        <div class="features-content">
          <div class="feature-main">
            <div class="feature-main-icon">💬</div>
            <div class="feature-main-title">실시간 응답 서비스</div>
            <div class="feature-main-desc">학교생활에 필요한 질문, 정보 검색, 일정 확인까지<br>자연스러운 대화형 챗봇의 답변으로 빠르게 찾아보세요.<br>복잡한 메뉴와 시트 조회보다, 언제든 궁금한 걸 물어보세요.</div>
          </div>
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">🕑</div>
              <div class="feature-title">빈 강의실 확인</div>
              <div class="feature-desc">지금 비어있는 강의실을 바로 확인하고 예약해 보세요.</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🍽️</div>
              <div class="feature-title">학식</div>
              <div class="feature-desc">실시간 학식 대기 시간<br>공유도, 그래프도 제공합니다.</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📚</div>
              <div class="feature-title">도서관/열람실 자리 예약</div>
              <div class="feature-desc">원하는 좌석을 미리 확인하고,<br>빠르게 예약하세요.</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- FAQ Section -->
      <section id="faq" class="section faq-section">
        <div class="faq-header">자주 묻는 질문</div>
        <div class="faq-list">
          <div class="faq-item"><span class="faq-q">Q.</span> 을지피티가 뭔가요?</div>
          <div class="faq-item"><span class="faq-q">Q.</span> 을지피티가 뭔가요?</div>
          <div class="faq-item"><span class="faq-q">Q.</span> 을지피티가 뭔가요?</div>
          <div class="faq-item faq-answer"><span class="faq-a">A.</span> 을지피티는 을지대학교 AI 대화형 서비스 입니다.</div>
          <div class="faq-item"><span class="faq-q">Q.</span> 을지피티가 뭔가요?</div>
          <div class="faq-item"><span class="faq-q">Q.</span> 을지피티가 뭔가요?</div>
        </div>
      </section>
      
      <!-- News Section -->
      <section id="news" class="section news-section">
        <div class="news-header">새로운 소식</div>
        <div class="news-list">
          <div class="news-item">
            <div class="news-title">을지피티 새로운 기능 안내</div>
            <div class="news-date">2025.07.15</div>
            <div class="news-desc">새롭게 출시한 을지피티를 통해서 학교생활에 대한 정보나 지식을 얻을 수 있습니다.</div>
          </div>
          <div class="news-item">
            <div class="news-title">을지피티 새로운 기능 안내</div>
            <div class="news-date">2025.07.15</div>
          </div>
          <div class="news-item">
            <div class="news-title">을지피티 새로운 기능 안내</div>
            <div class="news-date">2025.07.15</div>
          </div>
          <div class="news-item">
            <div class="news-title">을지피티 새로운 기능 안내</div>
            <div class="news-date">2025.07.15</div>
          </div>
          <div class="news-item">
            <div class="news-title">을지피티 새로운 기능 안내</div>
            <div class="news-date">2025.07.15</div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

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

import eulLogo from './assets/eul_logo.png'
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

<style scoped>
.main-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  border-bottom: 3px solid #a084f3;
  padding: 0.5rem 0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: #4f46e5;
  letter-spacing: 1px;
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