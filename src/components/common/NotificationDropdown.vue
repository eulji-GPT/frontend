<template>
  <!-- Debug: isVisible = {{ isVisible }} -->
  <div v-if="isVisible" class="notification-dropdown" :style="{ top: dropdownPosition.top, left: dropdownPosition.left }">
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
        dropdownPosition.value = {
          top: `${rect.top - 450}px`, // frame-12 위쪽으로 450px (드롭다운이 더 크므로)
          left: `${rect.left - 150}px`  // frame-12 왼쪽으로 150px
        }
        console.log('notification dropdown position set to:', dropdownPosition.value)
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
  width: 350px;
  max-height: 400px;
  background-color: white;
  border: solid 1px rgb(243, 244, 246);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1500; /* 모달보다 아래에 표시 */
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