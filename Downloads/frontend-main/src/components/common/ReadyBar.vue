<template>
  <div class="ready-bar">
    <div class="ready-content">
      <div class="ready-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L19 7L17.74 13.26L22 14L16.74 16.74L17 21L12 19L7 21L7.26 16.74L2 14L6.26 13.26L5 7L10.91 8.26L12 2Z" fill="#4F46E5"/>
        </svg>
      </div>
      <h1 class="ready-title">{{ serviceTitle }} 준비 중</h1>
      <p class="ready-description">
        {{ serviceTitle }} 서비스를 준비하고 있습니다.<br>
        곧 더 나은 서비스로 찾아뵙겠습니다.
      </p>
      <router-link to="/" class="back-button">
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const serviceTitle = computed(() => {
  const service = route.params.service as string
  
  const serviceMap: Record<string, string> = {
    'cafeteria': '학식',
    'library': '도서관',
    'studyroom': '스터디룸',
    'reservation': '예약',
    'default': '서비스'
  }
  
  return serviceMap[service] || serviceMap.default
})
</script>

<style scoped>
.ready-bar {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.ready-content {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.ready-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.ready-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.ready-description {
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.back-button {
  display: inline-block;
  background: #4f46e5;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background: #4338ca;
}

@media (max-width: 640px) {
  .ready-content {
    padding: 2rem 1.5rem;
  }
  
  .ready-title {
    font-size: 1.5rem;
  }
  
  .ready-description {
    font-size: 1rem;
  }
}
</style>
