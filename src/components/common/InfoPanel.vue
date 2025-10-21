<template>
  <!-- Debug: InfoPanel isVisible = {{ isVisible }} -->
  <div v-if="isVisible" class="info-panel" :style="{ top: panelPosition.top, left: panelPosition.left }">
    <div class="info-item">
      <span class="info-text">자주 묻는 질문</span>
    </div>
    <div class="info-item">
      <span class="info-text">가이드</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()
const panelPosition = ref({ top: '50px', left: '50px' })

const updatePosition = () => {
  if (props.isVisible) {
    nextTick(() => {
      const frame12Element = document.querySelector('.frame-12')
      if (frame12Element) {
        const rect = frame12Element.getBoundingClientRect()
        panelPosition.value = {
          top: `${rect.top - 130}px`, // frame-12 위쪽으로 130px
          left: `${rect.left + 10}px`  // frame-12 왼쪽에서 약간 오른쪽으로
        }
        console.log('InfoPanel position updated:', panelPosition.value)
        console.log('Frame-12 rect:', rect)
      }
    })
  }
}

watch(() => props.isVisible, updatePosition)
</script>

<style scoped>
.info-panel {
  position: fixed;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 10px;
  box-shadow: 1px 1px 4px 0px rgb(217, 217, 217);
  border: solid 1px rgb(243, 244, 246);
  border-radius: 15px;
  background-color: white;
  box-sizing: border-box;
  padding: 15px;
  z-index: 2000; /* 다른 요소들 위에 표시 */
  width: 200px;
}

.info-item {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  border-radius: 5px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 5px 10px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: white;
}

.info-item:hover {
  background-color: rgb(240, 246, 255);
}

.info-text {
  color: black;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  flex: 1;
}
</style>