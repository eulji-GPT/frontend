<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleConfirm">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="warning-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h2 class="modal-title">다크모드 베타 안내</h2>

        <p class="modal-message">
          다크모드는 현재 베타 버전입니다.<br>
          일부 기능에서 UI 오류가 발생할 수 있습니다.
        </p>

        <button class="confirm-button" @click="handleConfirm">
          인지하였습니다
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: var(--color-modal-bg);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  width: 420px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.warning-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.modal-title {
  font-family: 'Pretendard', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-message {
  font-family: 'Pretendard', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.confirm-button {
  width: 100%;
  padding: 14px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Pretendard', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.confirm-button:hover {
  background: #013a6f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(2, 71, 138, 0.3);
}

.confirm-button:active {
  transform: translateY(0);
}

/* 모바일 반응형 */
@media (max-width: 480px) {
  .modal-container {
    width: 90vw;
    padding: 24px;
  }

  .warning-icon {
    width: 56px;
    height: 56px;
  }

  .warning-icon svg {
    width: 40px;
    height: 40px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-message {
    font-size: 14px;
  }
}
</style>
