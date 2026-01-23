<template>
  <div v-if="showPopup" class="event-popup-overlay" @click="handleClose">
    <div class="event-popup" @click.stop>
      <button class="popup-close-btn" @click="handleClose">×</button>

      <div class="popup-header">
        <div class="popup-icon">🎉</div>
        <h2 class="popup-title">대학 정보 검색 모델<br>3월까지 무료 오픈!</h2>
      </div>

      <div class="popup-body">
        <p class="popup-description">
          을지대학교 공식 자료를 검색하는<br>
          <strong>대학 정보 검색 모델</strong>을<br>
          <span class="highlight">2026년 3월 31일까지</span><br>
          모든 회원에게 무료로 제공합니다!
        </p>

        <div class="popup-features">
          <div class="feature-item">
            <span class="feature-icon">📚</span>
            <span class="feature-text">학사일정 실시간 조회</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📋</span>
            <span class="feature-text">공지사항 및 학칙 검색</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏫</span>
            <span class="feature-text">캠퍼스 정보 안내</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🍽️</span>
            <span class="feature-text">식단표 및 시설 정보</span>
          </div>
        </div>

        <div class="popup-notice">
          <p class="notice-text">
            * 4월 1일부터는 PRO 회원만 이용 가능합니다<br>
            * 지금 바로 대학 정보 검색 모델을 체험해보세요!
          </p>
        </div>
      </div>

      <div class="popup-footer">
        <button class="popup-try-btn" @click="handleTry">
          지금 바로 체험하기
        </button>
        <button class="popup-later-btn" @click="handleClose">
          다음에 할게요
        </button>
      </div>

      <label class="popup-checkbox">
        <input type="checkbox" v-model="dontShowAgain" />
        <span>다시 보지 않기</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'tryRag'): void
}>()

const showPopup = ref(false)
const dontShowAgain = ref(false)

const POPUP_STORAGE_KEY = 'rag-event-popup-dismissed'

onMounted(() => {
  // localStorage에서 팝업 표시 여부 확인
  const dismissed = localStorage.getItem(POPUP_STORAGE_KEY)

  // 이벤트 기간 체크 (3월 31일까지)
  const now = new Date()
  const eventEndDate = new Date('2026-03-31T23:59:59')
  const isEventActive = now <= eventEndDate

  // 팝업 표시: 이벤트 기간 + 이전에 닫지 않은 경우
  if (isEventActive && !dismissed) {
    showPopup.value = true
  }
})

const handleClose = () => {
  if (dontShowAgain.value) {
    localStorage.setItem(POPUP_STORAGE_KEY, 'true')
  }
  showPopup.value = false
  emit('close')
}

const handleTry = () => {
  if (dontShowAgain.value) {
    localStorage.setItem(POPUP_STORAGE_KEY, 'true')
  }
  showPopup.value = false
  emit('tryRag')
}
</script>

<style scoped>
.event-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.event-popup {
  background: white;
  border-radius: 24px;
  padding: 40px 32px 32px;
  max-width: 480px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.popup-close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.popup-header {
  text-align: center;
  margin-bottom: 24px;
}

.popup-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.popup-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
  margin: 0;
}

.popup-body {
  margin-bottom: 24px;
}

.popup-description {
  text-align: center;
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24px;
}

.popup-description strong {
  color: #02478A;
  font-weight: 700;
}

.popup-description .highlight {
  color: #ff6b6b;
  font-weight: 700;
  font-size: 18px;
}

.popup-features {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.feature-item:not(:last-child) {
  border-bottom: 1px solid #e9ecef;
}

.feature-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.feature-text {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.popup-notice {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe9e9 100%);
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #ff6b6b;
}

.notice-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.popup-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.popup-try-btn {
  background: linear-gradient(135deg, #02478A 0%, #0356b3 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(2, 71, 138, 0.3);
}

.popup-try-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(2, 71, 138, 0.4);
}

.popup-later-btn {
  background: #f8f9fa;
  color: #666;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.popup-later-btn:hover {
  background: #e9ecef;
}

.popup-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  user-select: none;
}

.popup-checkbox input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.popup-checkbox:hover {
  color: #666;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .event-popup {
    padding: 32px 24px 24px;
    max-width: 90%;
  }

  .popup-title {
    font-size: 20px;
  }

  .popup-icon {
    font-size: 48px;
  }

  .popup-description {
    font-size: 14px;
  }

  .popup-description .highlight {
    font-size: 16px;
  }
}
</style>
