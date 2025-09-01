<template>
  <div class="crew-page">
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
}

.crew-page * {
  background: transparent !important;
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
