<template>
  <div class="not-found-page">
    <HeaderSection />

    <div class="not-found-content">
      <div class="error-container">
        <div class="error-code">404</div>
        <h1 class="error-title">페이지를 찾을 수 없습니다</h1>
        <p class="error-description">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.<br />
          주소를 다시 확인해주세요.
        </p>
        <div class="error-actions">
          <button class="home-button" @click="goHome">
            홈으로 돌아가기
          </button>
          <button class="back-button" @click="goBack">
            이전 페이지
          </button>
        </div>
      </div>
    </div>

    <CommonFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeaderSection from '@/components/main/HeaderSection.vue'
import CommonFooter from '@/components/common/CommonFooter.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.not-found-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.error-container {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  color: #02478A;
  line-height: 1;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #02478A, #4789ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  font-family: 'Pretendard', sans-serif;
}

.error-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 32px 0;
  font-family: 'Pretendard', sans-serif;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.home-button {
  padding: 14px 32px;
  background-color: #02478A;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.home-button:hover {
  background-color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(2, 71, 138, 0.3);
}

.back-button {
  padding: 14px 32px;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 22px;
  }

  .error-description {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
  }

  .home-button,
  .back-button {
    width: 100%;
  }
}
</style>
