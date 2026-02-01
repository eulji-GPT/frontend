<template>
  <div class="dialog-overlay" @click.self="$emit('cancel')">
    <div class="dialog-content">
      <div class="dialog-icon" :style="{ backgroundColor: iconBgColor }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" :stroke="confirmColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h3 class="dialog-title">{{ title }}</h3>
      <p class="dialog-message">{{ message }}</p>
      <div class="dialog-actions">
        <button class="cancel-btn" @click="$emit('cancel')">취소</button>
        <button
          class="confirm-btn"
          :style="{ backgroundColor: confirmColor }"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  message: string
  confirmText?: string
  confirmColor?: string
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const iconBgColor = computed(() => {
  const color = props.confirmColor || '#ef4444'
  return `${color}15`
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 16px;
}

.dialog-content {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 50%;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.dialog-message {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f3f4f6;
  border: none;
  color: #6b7280;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.confirm-btn {
  border: none;
  color: #ffffff;
}

.confirm-btn:hover {
  opacity: 0.9;
}
</style>
