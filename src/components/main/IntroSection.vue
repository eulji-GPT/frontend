<template>
  <section id="intro" class="section intro-section full-width-bg" style="background: var(--Primary-200, #F3F8FF);">
    <!-- 내용 없음 -->
  </section>
</template>

<script setup lang="ts">
// 별도 로직 없음
</script>

<style scoped>
.full-width-bg {
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  position: static;
  left: 0;
  right: 0;
  transform: none;
  box-sizing: border-box;
  padding: 0 !important;
  margin: 0 !important;
  background: var(--Primary-200, #F3F8FF) !important;
}

.intro-section {
  min-height: 100vh;
  width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
