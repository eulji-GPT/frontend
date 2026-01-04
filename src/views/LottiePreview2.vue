<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
    <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">Lottie 아이콘 미리보기</h1>
    <Lottie v-if="animationData" :animationData="animationData" :loop="true" style="width: 300px; height: 300px;" />
    <div v-else style="color: #aaa;">로딩 중...</div>
    <p style="margin-top: 2rem; color: #666;">/public/icon_interaction.json 파일을 사용합니다.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Lottie from 'lottie-react'

const animationData = ref<any>(null)
onMounted(async () => {
  const res = await fetch('/icon_interaction.json')
  animationData.value = await res.json()
})
</script>

<style scoped>
</style>
