<template>
  <div class="mode-selector">
    <div class="mode-selector-header">
      <span class="current-mode">{{ getCurrentModeInfo().name }}</span>
      <button class="mode-toggle-btn" @click="toggleSelector" :class="{ active: isOpen }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>
    </div>
    
    <div v-if="isOpen" class="mode-dropdown">
      <div class="mode-list">
        <div 
          v-for="mode in availableModes" 
          :key="mode.key"
          class="mode-item"
          :class="{ active: currentMode === mode.key, 'cot-mode': mode.key === 'cot' }"
          @click="selectMode(mode.key)"
        >
          <div class="mode-icon">{{ mode.icon }}</div>
          <div class="mode-info">
            <div class="mode-name">{{ mode.name }}</div>
            <div class="mode-description">{{ mode.description }}</div>
          </div>
          <div v-if="mode.key === 'cot'" class="cot-badge">5단계</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChatMode } from '../../composables/useChat'

const props = defineProps<{
  currentMode: ChatMode
}>()

const emit = defineEmits<{
  (e: 'modeChange', mode: ChatMode): void
}>()

const isOpen = ref(false)

const availableModes = [
  {
    key: 'general' as ChatMode,
    name: '일반 대화',
    description: '범용 AI 대화',
    icon: '💬'
  },
  {
    key: 'university' as ChatMode,
    name: '대학생 챗봇',
    description: '대학생 전용 어시스턴트',
    icon: '🎓'
  },
  {
    key: 'study' as ChatMode,
    name: '학습 도우미',
    description: '학습을 도와주는 AI 튜터',
    icon: '📚'
  },
  {
    key: 'career' as ChatMode,
    name: '진로 상담',
    description: '진로 상담 전문 AI',
    icon: '💼'
  },
  {
    key: 'cot' as ChatMode,
    name: '단계별 추론',
    description: 'Chain of Thought 방식으로 단계별 사고 과정을 보여줍니다 (베타)',
    icon: '🧠'
  }
]

const getCurrentModeInfo = () => {
  return availableModes.find(mode => mode.key === props.currentMode) || availableModes[0]
}

const toggleSelector = () => {
  isOpen.value = !isOpen.value
}

const selectMode = (mode: ChatMode) => {
  emit('modeChange', mode)
  isOpen.value = false
}

// 외부 클릭 시 드롭다운 닫기
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('.mode-selector')) {
    isOpen.value = false
  }
})
</script>

<style scoped>
.mode-selector {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.mode-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mode-selector-header:hover {
  border-color: #02478a;
  box-shadow: 0 2px 8px rgba(2, 71, 138, 0.1);
}

.current-mode {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  font-family: Pretendard, sans-serif;
}

.mode-toggle-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.mode-toggle-btn.active {
  transform: rotate(180deg);
}

.mode-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mode-list {
  padding: 8px;
}

.mode-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.mode-item:hover {
  background-color: #f3f4f6;
}

.mode-item.active {
  background-color: #f0f6ff;
  border: 1px solid #02478a;
}

.mode-item.cot-mode {
  border-left: 3px solid #10b981;
}

.mode-item.cot-mode.active {
  background: linear-gradient(135deg, #f0f6ff 0%, #f0fdf4 100%);
  border: 1px solid #10b981;
}

.mode-icon {
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mode-info {
  flex: 1;
  min-width: 0;
}

.mode-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  font-family: Pretendard, sans-serif;
}

.mode-description {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  font-family: Pretendard, sans-serif;
  line-height: 1.4;
}

.cot-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  font-family: Pretendard, sans-serif;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .mode-selector {
    max-width: 100%;
  }
  
  .mode-selector-header {
    padding: 10px 14px;
  }
  
  .current-mode {
    font-size: 13px;
  }
  
  .mode-item {
    padding: 10px;
  }
  
  .mode-name {
    font-size: 13px;
  }
  
  .mode-description {
    font-size: 11px;
  }
}
</style>