<template>
  <div class="crew-page">
    <div class="background-gradient">
      <div class="ellipse" />
      <div class="ellipse-2" />
    </div>
    <HeaderSection />
    <HeroContainer />
    <InfoContainer />
    <FeaturesContainer />
    <RecruitmentContainer />
    <FAQContainer />
    <FooterContainer />
  </div>
</template>

<script setup lang="ts">
import HeaderSection from '../main/HeaderSection_Desktop21.vue'
import HeroContainer from './HeroContainer.vue'
import InfoContainer from './InfoContainer.vue'
import FeaturesContainer from './FeaturesContainer.vue'
import RecruitmentContainer from './RecruitmentContainer.vue'
import FAQContainer from './FAQContainer.vue'
import FooterContainer from './FooterContainer.vue'
</script>

<style scoped>
.crew-page {
  width: 1440px;
  min-height: 100vh;
  background: var(--dark-primary, #141D30) !important;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0;
  gap: 120px;
  position: relative;
  overflow: hidden;
}

.crew-page > *:not(.background-gradient) {
  background: transparent !important;
}

.background-gradient {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ellipse {
  background: radial-gradient(circle, #4789ee 0%, #4789ee 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(150px);
  height: 600px;
  width: 600px;
  position: absolute;
  right: -300px;
  top: -300px;
  opacity: 0.6;
}

.ellipse-2 {
  background: radial-gradient(circle, var(--darksub-1, #2d4a8a) 0%, var(--darksub-1, #2d4a8a) 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(250px);
  height: 672px;
  width: 672px;
  position: absolute;
  right: -336px;
  top: -336px;
  opacity: 0.7;
  transform: rotate(-9.47deg);
  z-index: 1;
}

@media (max-width: 768px) {
  .crew-page {
    width: 100%;
    max-width: 768px;
    padding: 0 16px;
    gap: 60px;
  }
}
</style>

<style>
/* 전역 스타일로 body와 html 배경색 설정 */
body, html {
  background-color: #141D30 !important;
  margin: 0;
  padding: 0;
}

#app {
  background-color: #141D30 !important;
  min-height: 100vh;
}
</style>
