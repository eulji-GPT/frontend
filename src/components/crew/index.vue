<template>
  <div class="crew-page">
    <Crew />
    <CrewRecruitment />
    <CrewFooter />
  </div>
</template>

<script setup lang="ts">
import Crew from './crew.vue'
import CrewRecruitment from './CrewRecruitment.vue'
import CrewFooter from './CrewFooter.vue'
</script>

<style scoped>
.crew-page {
  width: 100%;
  min-height: 100vh;
}
</style>
