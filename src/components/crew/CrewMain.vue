<template>
  <div class="crew-main-container">
    <!-- 크루 홈 페이지 -->
    <CrewHome v-if="currentView === 'home'" @navigate="handleNavigation" />
    
    <!-- 크루 모집 페이지 -->
    <CrewRecruitment v-if="currentView === 'recruitment'" @navigate="handleNavigation" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CrewHome from './CrewHome.vue';
import CrewRecruitment from './CrewRecruitment.vue';

/**
 * CrewMain - 크루 관련 페이지들을 관리하는 메인 컴포넌트
 */

type ViewType = 'home' | 'recruitment';

const currentView = ref<ViewType>('home');

const handleNavigation = (view: ViewType) => {
  currentView.value = view;
};
</script>

<style scoped>
.crew-main-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.crew-main-container > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>