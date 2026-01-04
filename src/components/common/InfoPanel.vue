<template>
  <!-- Debug: InfoPanel isVisible = {{ isVisible }} -->
  <div v-if="isVisible" class="info-panel" :style="{ top: panelPosition.top, left: panelPosition.left, maxHeight: panelMaxHeight }">
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
const panelMaxHeight = ref('auto')

const updatePosition = () => {
  if (props.isVisible) {
    nextTick(() => {
      const frame12Element = document.querySelector('.frame-12')
      if (frame12Element) {
        const rect = frame12Element.getBoundingClientRect()
        const panel = { width: 250, height: 110 } // 패널 크기 추정 (여유있게)

        // 기본 위치 계산 - 아이콘 바로 위에 표시
        let top = rect.top - panel.height - 10
        let left = rect.left + 10

        // Viewport 경계 체크
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const padding = 10 // 여백

        // 상단 경계 체크
        if (top < padding) {
          top = padding
        }

        // 좌측 경계 체크
        if (left < padding) {
          left = padding
        }

        // 우측 경계 체크
        if (left + panel.width > viewportWidth - padding) {
          left = viewportWidth - panel.width - padding
        }

        // 하단 경계 체크
        if (top + panel.height > viewportHeight - padding) {
          top = viewportHeight - panel.height - padding
        }

        // 최종 경계 체크 (절대적 안전장치)
        top = Math.max(padding, Math.min(top, viewportHeight - panel.height - padding))
        left = Math.max(padding, Math.min(left, viewportWidth - panel.width - padding))

        panelPosition.value = {
          top: `${top}px`,
          left: `${left}px`
        }
        console.log('InfoPanel position updated:', panelPosition.value)
        console.log('Frame-12 rect:', rect)
        console.log('Final bounds check - top:', top, 'left:', left)
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
  z-index: 100000; /* 최상위 레이어 */
  min-width: 200px;
  width: auto;
  max-width: 300px;
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
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  flex: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}
</style>