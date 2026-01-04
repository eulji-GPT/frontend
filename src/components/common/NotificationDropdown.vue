<template>
  <!-- Debug: isVisible = {{ isVisible }} -->
  <div v-if="isVisible" class="notification-dropdown" :style="{ top: dropdownPosition.top, left: dropdownPosition.left, maxHeight: dropdownMaxHeight }">
    <div class="notification-header">
      <span class="notification-title">새로운 소식</span>
      <span class="view-all">전체보기</span>
    </div>
    <div class="notification-list">
      <div 
        v-for="(item, index) in notifications" 
        :key="index"
        class="notification-item"
      >
        <div class="notification-content">
          <div class="notification-icon">•</div>
          <span class="notification-text">{{ item.title }}</span>
        </div>
        <div class="notification-date">
          <span class="date-text">{{ item.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

const notifications = ref<Array<{title: string, date: string, desc: string}>>([])
const dropdownPosition = ref({ top: '50px', left: '50px' })
const dropdownMaxHeight = ref('400px')

const loadNotifications = async () => {
  try {
    const response = await fetch('/news.json')
    notifications.value = await response.json()
    console.log('Notifications loaded:', notifications.value)
  } catch (error) {
    console.error('Error loading notifications:', error)
  }
}

const updatePosition = () => {
  console.log('updatePosition called, isVisible:', props.isVisible)
  if (props.isVisible) {
    nextTick(() => {
      const frame12Element = document.querySelector('.frame-12')
      console.log('frame-12 found:', frame12Element)
      if (frame12Element) {
        const rect = frame12Element.getBoundingClientRect()
        console.log('frame-12 rect:', rect)
        const panel = { width: 380, height: 400 } // 드롭다운 크기

        // 기본 위치 계산 - 아이콘 바로 위에 표시
        let top = rect.top - panel.height - 10
        let left = rect.left - 150

        // Viewport 경계 체크
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const padding = 10 // 여백

        // 상단 경계 체크 (최우선)
        if (top < padding) {
          // 화면 상단에 딱 붙임
          top = padding
        }

        // 최종 안전 체크: 음수 위치 방지
        top = Math.max(top, padding)

        // 좌측 경계 체크
        if (left < padding) {
          left = padding
        }

        // 우측 경계 체크
        if (left + panel.width > viewportWidth - padding) {
          left = viewportWidth - panel.width - padding
        }

        // 하단 경계 체크 (max-height 동적 조정)
        const availableHeight = viewportHeight - top - padding
        if (availableHeight < panel.height) {
          // 공간이 부족하면 위치 재조정 또는 높이 제한
          if (rect.top + rect.height + padding + panel.height < viewportHeight) {
            // 아래쪽에 공간이 있으면 frame-12 아래로 배치
            top = rect.top + rect.height + padding
          } else {
            // 아래도 부족하면 상단으로 최대한 올림
            top = padding
          }
        }

        // 최종 경계 체크 (절대적 안전장치)
        top = Math.max(padding, Math.min(top, viewportHeight - padding))
        left = Math.max(padding, Math.min(left, viewportWidth - panel.width - padding))

        // 동적 max-height 계산: 뷰포트 하단까지 가용 공간
        const availableSpace = viewportHeight - top - padding
        const dynamicMaxHeight = Math.min(panel.height, availableSpace)

        dropdownPosition.value = {
          top: `${top}px`,
          left: `${left}px`
        }
        dropdownMaxHeight.value = `${dynamicMaxHeight}px`

        console.log('notification dropdown position set to:', dropdownPosition.value)
        console.log('Dynamic max-height:', dropdownMaxHeight.value)
        console.log('Final bounds check - top:', top, 'left:', left)
      }
    })
  }
}

watch(() => props.isVisible, updatePosition)

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notification-dropdown {
  position: fixed;
  width: 380px;
  /* max-height는 동적으로 설정됨 (inline style) */
  background-color: white;
  box-sizing: border-box;
  border: solid 1px rgb(243, 244, 246);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100000; /* 최상위 레이어 */
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.notification-title {
  color: black;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
}

.view-all {
  color: rgb(2, 71, 138);
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 23px;
  cursor: pointer;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: rgb(249, 250, 251);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notification-icon {
  width: 8px;
  height: 8px;
  color: rgb(2, 71, 138);
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-text {
  color: black;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 1.4;
  flex: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.notification-date {
  display: flex;
  justify-content: flex-end;
  padding-left: 18px;
}

.date-text {
  color: rgb(156, 163, 175);
  font-size: 12px;
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  line-height: 1.2;
}
</style>