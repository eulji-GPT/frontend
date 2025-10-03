<template>
  <div class="fortune-view">
    <HeaderSection />
    <FortuneMain />
  </div>
</template>

<script setup lang="ts">
import HeaderSection from '../components/main/HeaderSection.vue';
import FortuneMain from '../components/fortune/FortuneMain.vue';
</script>

<style scoped>
.fortune-view {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}
</style>
