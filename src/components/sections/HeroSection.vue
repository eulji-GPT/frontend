<template>
  <div class="hero-section">
    <div class="title-block">
      <h1 class="main-title">학교생활의<br><span class="highlight">모든 순간</span>에<br>답하다</h1>
    </div>
    <img class="hero-image" :src="heroImg" alt="EULGPT 메인 이미지" />
    <div class="hero-btn-wrapper">
      <button class="start-btn">시작하기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import heroImg from '../../assets/Group-48097225.svg'
</script>


<style scoped>
.hero-section {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 3rem auto;
  padding: 2.5rem 1.5rem 0 1.5rem;
  background: #fff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-in-out;
}
.title-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.main-title {
  text-align: left;
  letter-spacing: 0.14em;
  line-height: 1.7;
}
.hero-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: 2.5rem 0 0 0;
  display: block;
  object-fit: contain;
}
.hero-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}
.start-btn {
  margin-top: 0;
}
</style>
