<template>
  <div class="mode-selector-header" :class="{ 'cot-active': currentMode === 'cot' }" @click="toggleSelector">
    <div class="header-content">
      <span class="current-mode">{{ getCurrentModeInfo().name }}</span>
      <div class="mode-icon-indicator">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
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
          <div class="mode-header">
            <div class="mode-name">{{ mode.name }}</div>
          </div>
          <div class="mode-description">{{ mode.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ChatMode } from '../../composables/useChat'

const props = defineProps<{
  currentMode: ChatMode
  isProUser: boolean
}>()

const emit = defineEmits<{
  (e: 'modeChange', mode: ChatMode): void
}>()

const isOpen = ref(false)

const availableModes = [
  {
    key: 'unified' as ChatMode,
    name: '통합 모델',
    description: '일반적인 대화와 학습, 진로 상담을 지원합니다\n(대학 정보는 대학 정보 검색 모델을 이용하세요)',
    icon: '🤖'
  },
  {
    key: 'rag' as ChatMode,
    name: '대학 정보 검색 모델',
    description: '을지대학교 공식 자료를 검색하여\n정확한 학사 정보를 제공합니다',
    icon: '🔍'
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
  if (!(e.target as Element).closest('.mode-selector-header')) {
    isOpen.value = false
  }
})
</script>

<style scoped>
.mode-selector-header {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: solid 1px var(--color-card-border);
  border-radius: 15px;
  background-color: var(--color-bg-primary);
  box-sizing: border-box;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: visible;
  min-width: 160px;
  width: auto;
}

.mode-selector-header:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-primary-light);
}

/* CoT 모드 활성화 시 헤더 스타일 */
.mode-selector-header.cot-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  background-size: 400% 400%;
  border: 2px solid transparent;
  background-clip: padding-box;
  animation: premiumHeaderGradient 3s ease infinite, premiumHeaderPulse 2s ease-in-out infinite alternate;
  position: relative;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4), 
              0 0 20px rgba(118, 75, 162, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: visible;
}

.mode-selector-header.cot-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  background-size: 400% 400%;
  animation: premiumHeaderGradient 3s ease infinite;
  z-index: -1;
  border-radius: 6px;
}

.mode-selector-header.cot-active::after {
  content: '✨ PREMIUM ✨';
  position: absolute;
  top: -8px;
  right: -20px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #92400e;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 8px;
  animation: headerSparkle 2s ease-in-out infinite;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.4);
  z-index: 10;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
  white-space: nowrap;
  transform: rotate(-12deg);
}

.mode-selector-header.cot-active .current-mode {
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.mode-selector-header.cot-active .mode-icon-indicator {
  color: white;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.mode-selector-header.cot-active:hover {
  border-color: transparent;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6), 
              0 0 30px rgba(118, 75, 162, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

@keyframes premiumHeaderGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes premiumHeaderPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4), 
                0 0 20px rgba(118, 75, 162, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  100% {
    transform: scale(1.01);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6), 
                0 0 30px rgba(118, 75, 162, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes headerSparkle {
  0%, 100% {
    opacity: 0.8;
    transform: scale(0.9) rotate(-5deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(5deg);
  }
}

.header-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 8px;
  box-sizing: border-box;
  min-width: 120px;
}

.current-mode {
  color: black;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 23px;
  text-align: left;
  white-space: nowrap;
  flex: 1;
  min-width: max-content;
}

.mode-icon-indicator {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mode-icon-indicator svg {
  width: 18px;
  height: 18px;
  object-fit: cover;
}


.mode-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 8px;
  animation: fadeIn 0.2s ease;
  box-sizing: border-box;
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
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 15px;
  box-shadow: 1px 1px 4px 0px rgb(217, 217, 217);
  border: solid 1px rgb(243, 244, 246);
  border-radius: 16px;
  background-color: white;
  box-sizing: border-box;
  padding: 20px 16px;
  width: 320px;
  min-width: 320px;
}

.mode-item {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: 10px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 10px 16px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.mode-item:hover {
  background-color: #f3f4f6;
}

.mode-item:first-child.active {
  background-color: rgb(243, 248, 255);
}

.mode-item:nth-child(3).active {
  background-color: rgb(248, 251, 255);
}

.mode-item.active {
  background-color: transparent;
}

.mode-item.cot-mode {
  position: relative;
  overflow: hidden;
}

.mode-item.cot-mode.active {
  background-color: rgb(243, 248, 255);
  color: black;
}


.mode-item.cot-mode.active .mode-name {
  color: black;
  font-weight: 600;
}

.mode-item.cot-mode.active .mode-description {
  color: rgb(75, 85, 99);
  font-weight: 500;
}



.mode-name {
  color: black;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 23px;
  text-align: left;
  flex: 1;
}

.mode-description {
  color: rgb(75, 85, 99);
  text-overflow: ellipsis;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 14px;
  text-align: left;
  white-space: pre-line;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 42px;
}

.cot-badge {
  background-color: rgb(243, 248, 255);
  color: black;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px 4px;
  border-radius: 10px;
  font-family: Pretendard, sans-serif;
  opacity: 0.8;
  flex-shrink: 0;
}

.mode-item.cot-mode.active .cot-badge {
  background-color: rgb(243, 248, 255);
  color: black;
  font-weight: 500;
  opacity: 0.8;
}


/* 반응형 디자인 */
@media (max-width: 768px) {
  .mode-selector {
    max-width: 100%;
  }

  .mode-selector-header {
    padding: 10px 14px;
    min-width: 140px;
  }

  .header-content {
    min-width: 100px;
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

/* PRO 배지 스타일 */
.pro-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 8px 4px;
  border-radius: 10px;
  font-family: Pretendard, sans-serif;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.event-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 8px 4px;
  border-radius: 10px;
  font-family: Pretendard, sans-serif;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  }
  50% {
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.6);
  }
}

/* 모바일 반응형: 모드 선택 버튼 중앙 정렬 */
@media (max-width: 640px) {
  .mode-selector-header {
    justify-content: center;
    width: 100%;
    max-width: 100%;
  }
}
</style>