<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
    <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">Lottie 아이콘 미리보기</h1>
    <div ref="lottieContainer" style="width: 300px; height: 300px;"></div>
    <p style="margin-top: 2rem; color: #666;">/public/icon_interaction.json 파일을 사용합니다.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import lottie from 'lottie-web'

const lottieContainer = ref<HTMLElement>()

onMounted(async () => {
  if (lottieContainer.value) {
    try {
      const animationData = await fetch('/icon_interaction.json').then(res => res.json())
      
      lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
      })
    } catch (error) {
      console.error('Lottie 애니메이션을 불러올 수 없습니다:', error)
    }
  }
})
</script>

<style scoped>
</style>
