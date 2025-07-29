<template>
  <div class="hero-section">
    <div class="title-block">
      <div class="main-title-row" style="display: flex; align-items: center; gap: 31px;">
        <div class="main-title-frame">
          <h1 class="main-title">
            학교생활의<br />
            <span class="gradient-title">모든 순간에 답하다</span>
          </h1>
        </div>
        <div class="main-title-extra-frame">
          <!-- 여기에 원하는 내용을 추가하세요 -->
        </div>
      </div>
    </div>
    <img class="hero-image" :src="heroImg" alt="EULGPT 메인 이미지" />
    <div class="hero-btn-wrapper">
      <button class="start-btn" @click="goToChatApp">시작하기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import heroImg from '../../assets/Group-48097225.svg'
import { useRouter } from 'vue-router'

const router = useRouter()


function goToChatApp() {
  router.push('/chat')
}
</script>

<style scoped>

.main-title-row {
  display: flex;
  align-items: center;
  gap: 31px;
  width: px;
}

.hero-section {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 160px 0 104px 180px;
  background: linear-gradient(180deg, #FFF 60.58%, #F3F8FF 100%);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-in-out;
}

.title-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 2.5rem 0 0 -180px;
  align-items: flex-start;
}

.main-title {
  max-width: 671px;
  color: var(--Black, #000);
  font-family: 'Pretendard', sans-serif;
  font-size: 4rem; /* 64px */
  font-style: normal;
  font-weight: 700;
  line-height: 90px;
  text-align: left;
  letter-spacing: 0.14em;
  margin: 0;
}

.gradient-title {
  background: var(--Gradiant-200, linear-gradient(254deg, #17315F 5.17%, #02478A 45.43%, #0A6ECF 80.95%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  display: inline;
}

.hero-image {
  text-decoration: none;
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: 2.5rem 0 0 -180px;
  display: block;
  object-fit: contain;
}

.hero-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 120px;
}

.start-btn {
  display: flex;
  width: 180px;
  height: 50px;
  padding: 13px 60px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 30px;
  background: var(--Black, #000);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.start-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .title-block {
    align-items: center;
  }
  .main-title-frame {
    padding: 0.5rem 2rem;
  }
  .main-title {
    font-size: 2.5rem; /* 40px */
    line-height: 1.4;
    letter-spacing: 0.05em;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem; /* 32px */
    letter-spacing: 0.02em;
  }
}
</style>