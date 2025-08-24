<template>
  <div class="crew-page">
    <!-- Desktop21 - Hero Section -->
    <Desktop21 />
  </div>
</template>

<script>
import Desktop21 from './Desktop21.vue'

export default {
  name: 'CrewIndexPage',
  components: {
    Desktop21
  },
  mounted() {
    console.log('Crew index page mounted successfully')
  }
}
</script>

<style scoped>
.crew-page {
  width: 100vw;
  min-height: 100vh;
  background: #141d30;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* 각 섹션이 자연스럽게 이어지도록 */
.crew-page > * {
  width: 100%;
  margin: 0;
  flex-shrink: 0;
  /* 디버깅용 테두리 - 각 컴포넌트가 보이도록 */
  border: 2px solid red;
  min-height: 200px;
}
</style>