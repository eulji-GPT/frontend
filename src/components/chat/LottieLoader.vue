<template>
  <div ref="lottieContainer" class="lottie-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import lottie from 'lottie-web';

const lottieContainer = ref<HTMLElement | null>(null);
let animationInstance: any = null;

onMounted(() => {
  if (lottieContainer.value) {
    animationInstance = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/icon_interaction.json'
    });
  }
});

onUnmounted(() => {
  if (animationInstance) {
    animationInstance.destroy();
  }
});
</script>

<style scoped>
.lottie-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
