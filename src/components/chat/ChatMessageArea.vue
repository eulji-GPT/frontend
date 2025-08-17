<template>
  <div class="chat-messages-area" ref="messagesContainer">
    <!-- 떠있는 모드 셀렉터 -->
    <div class="floating-mode-selector">
      <ChatModeSelector 
        :currentMode="currentMode" 
        @modeChange="handleModeChange"
      />
    </div>
    
    <div v-for="(msg, idx) in messages" :key="idx" class="message-wrapper">
      <div v-if="msg.isLoading || msg.currentStep" class="loading-indicator" :class="{ 'error-state': msg.hasError }">
        <div v-if="!msg.hasError" class="loader-container">
          <LottieLoader />
        </div>
        <div v-else class="error-icon">
          ⚠️
        </div>
        <div class="loading-content">
          <div class="status-header">
            <span class="loading-text" :class="{ 'error-text': msg.hasError }">
              {{ msg.hasError ? '오류 발생' : (msg.currentStep || 'Searching...') }}
            </span>
            <div v-if="msg.progressPercent !== undefined && !msg.hasError" class="progress-info">
              <span class="progress-text">{{ msg.progressPercent }}%</span>
              <div v-if="msg.currentStepNumber && msg.totalSteps" class="step-counter">
                ({{ msg.currentStepNumber }}/{{ msg.totalSteps }})
              </div>
            </div>
          </div>
          
          <!-- 프로그레스 바 -->
          <div v-if="msg.progressPercent !== undefined && !msg.hasError" class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: msg.progressPercent + '%' }"
              :class="{
                'progress-analyzing': msg.currentPhase === 'analysis',
                'progress-generating': msg.currentPhase === 'sub_questions_generation',
                'progress-processing': msg.currentPhase === 'processing_step',
                'progress-synthesis': msg.currentPhase === 'synthesis',
                'progress-streaming': msg.currentPhase === 'final_streaming' || msg.currentPhase === 'streaming_answer',
                'progress-completed': msg.currentPhase === 'completed'
              }"
            ></div>
          </div>
          
          <!-- 오류 상태 표시 -->
          <div v-if="msg.hasError" class="error-details">
            <div v-if="msg.errorDetails?.step" class="error-step">
              <span class="error-label">오류 발생 단계:</span>
              <span class="error-value">{{ msg.errorDetails.step }}</span>
            </div>
            <div v-if="msg.errorDetails?.reason" class="error-reason">
              <span class="error-label">상세 정보:</span>
              <span class="error-value">{{ msg.errorDetails.reason }}</span>
            </div>
          </div>
          
          <!-- CoT 단계들 -->
          <div v-if="msg.cotSteps && msg.cotSteps.length > 0 && !msg.hasError" class="cot-steps">
            <div 
              v-for="(step, index) in msg.cotSteps" 
              :key="index"
              class="cot-step"
              :class="{ 
                'completed': msg.currentStepNumber > index + 1,
                'active': msg.currentStepNumber === index + 1,
                'pending': msg.currentStepNumber < index + 1 || !msg.currentStepNumber
              }"
            >
              <div class="step-indicator">
                <span v-if="msg.currentStepNumber > index + 1">✓</span>
                <span v-else-if="msg.currentStepNumber === index + 1">●</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="step-text">{{ step }}</span>
            </div>
          </div>
          
          <!-- 현재 단계 상세 정보 -->
          <div v-if="msg.currentPhase && !msg.hasError" class="phase-info">
            <span class="phase-label">현재 단계:</span>
            <span class="phase-name">
              {{ getPhaseDisplayName(msg.currentPhase) }}
            </span>
          </div>
        </div>
      </div>
      <ChatBubble 
        v-else 
        :align="msg.isUser ? 'right' : 'left'" 
        :is-loading="false" 
        :is-streaming="msg.isStreaming || false"
        :content="msg.text || ''"
        :use-markdown="!msg.isUser"
        :images="msg.images"
        :messageId="`${idx}-${msg.timestamp instanceof Date ? msg.timestamp.getTime() : Date.now()}`"
        @feedback="handleFeedback"
        @regenerate="handleRegenerate"
      />
      <!-- 디버깅용 로그 -->
      <!-- {{ console.log('메시지 렌더링:', idx, msg.isUser ? 'user' : 'bot', msg.text?.substring(0, 20), 'hasError:', msg.hasError, 'isLoading:', msg.isLoading, 'currentStep:', msg.currentStep) }} -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import ChatBubble from './ChatBubble.vue';
import LottieLoader from './LottieLoader.vue';
import ChatModeSelector from './ChatModeSelector.vue';
import type { ChatMessage, ChatMode } from '../../composables/useChat';

const props = defineProps<{
  messages: ChatMessage[];
  currentMode: ChatMode;
}>();

const emit = defineEmits(['feedback', 'regenerate', 'modeChange']);

const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    // 상위 컨테이너(.chat-main-area)를 찾아서 스크롤
    const chatMainArea = document.querySelector('.chat-main-area');
    if (chatMainArea) {
      chatMainArea.scrollTop = chatMainArea.scrollHeight;
    } else if (messagesContainer.value) {
      // 폴백: 기존 방식
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(() => props.messages, () => {
  scrollToBottom();
}, { deep: true });

const getPhaseDisplayName = (phase: string): string => {
  const phaseNames: Record<string, string> = {
    'initialization': '초기화',
    'analysis': '질문 분석',
    'sub_questions_generation': '하위 질문 생성',
    'sub_questions_ready': '하위 질문 준비 완료',
    'processing_step': '단계별 처리',
    'step_completed': '단계 완료',
    'step_warning': '단계 경고',
    'synthesis': '최종 답변 생성',
    'final_ready': '최종 답변 준비',
    'final_streaming': '최종 답변 출력',
    'streaming_answer': '답변 스트리밍',
    'completed': '완료',
    'finished': '작업 완료',
    'system_error': '시스템 오류',
    'synthesis_error': '답변 생성 오류'
  };
  return phaseNames[phase] || phase;
};

// 피드백 처리
const handleFeedback = (type: 'good' | 'bad', messageId: string) => {
  console.log(`메시지 피드백: ${type}`, messageId);
  emit('feedback', type, messageId);
};

// 답변 재생성 처리
const handleRegenerate = (messageId: string) => {
  console.log('답변 재생성:', messageId);
  emit('regenerate', messageId);
};

// 모드 변경 처리
const handleModeChange = (mode: ChatMode) => {
  emit('modeChange', mode);
};

</script>

<style scoped>
.chat-messages-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%; /* 부모 컨테이너에 맞춤 */
  flex: 1 1 auto; /* Let it grow and shrink */
  overflow-x: hidden; /* 가로 스크롤 방지 */
  overflow-y: auto; /* 세로 스크롤만 이 컨테이너에서 처리 */
  min-height: 0; /* Important for shrinking below its content size */
  position: relative; /* 떠있는 요소의 기준점 */
}

.message-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 12px;
  overflow: visible; /* 스크롤을 상위 컨테이너에 위임 */
}

.loading-indicator {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 16px;
  margin-left: 20px;
  margin-top: -8px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.progress-text {
  font-weight: 600;
  color: #02478a;
}

.step-counter {
  color: #9ca3af;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin: 4px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-analyzing {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-generating {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.progress-processing {
  background: linear-gradient(90deg, #02478a, #1e40af);
}

.progress-synthesis {
  background: linear-gradient(90deg, #7c3aed, #5b21b6);
}

.progress-streaming {
  background: linear-gradient(90deg, #10b981, #059669);
  animation: stream-pulse 1.5s ease-in-out infinite;
}

@keyframes stream-pulse {
  0%, 100% { 
    opacity: 1;
    transform: scaleY(1);
  }
  50% { 
    opacity: 0.8;
    transform: scaleY(1.1);
  }
}

.progress-completed {
  background: linear-gradient(90deg, #10b981, #059669);
}

.phase-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
}

.phase-label {
  font-weight: 500;
}

.phase-name {
  color: #02478a;
  font-weight: 600;
}

/* 오류 상태 스타일 */
.loading-indicator.error-state {
  border-left: 4px solid #dc2626;
  background: rgba(220, 38, 38, 0.05);
}

.loader-container {
  display: flex;
  align-items: center;
}

.error-icon {
  font-size: 24px;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.error-text {
  color: #dc2626 !important;
  font-weight: 600;
}

.error-details {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
}

.error-step,
.error-reason {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.error-step:last-child,
.error-reason:last-child {
  margin-bottom: 0;
}

.error-label {
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
}

.error-value {
  font-size: 13px;
  color: #7f1d1d;
  background: rgba(220, 38, 38, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.loading-text {
  color: #02478a;
  font-size: 14px;
  font-weight: 600;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.cot-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.cot-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cot-step.completed {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.cot-step.active {
  background: rgba(2, 71, 138, 0.1);
  border: 1px solid rgba(2, 71, 138, 0.3);
  animation: pulse 2s infinite;
}

.cot-step.pending {
  background: rgba(156, 163, 175, 0.05);
  border: 1px solid rgba(156, 163, 175, 0.1);
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.02);
    opacity: 0.9;
  }
}

.step-indicator {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  flex-shrink: 0;
}

.cot-step.completed .step-indicator {
  background: #10b981;
  color: white;
}

.cot-step.active .step-indicator {
  background: #02478a;
  color: white;
}

.cot-step.pending .step-indicator {
  background: #e5e7eb;
  color: #9ca3af;
}

.step-text {
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.cot-step.completed .step-text {
  color: #059669;
}

.cot-step.active .step-text {
  color: #02478a;
  font-weight: 600;
}

.cot-step.pending .step-text {
  color: #9ca3af;
}

.message-wrapper :deep(.chat-bubble-wrapper) {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.message-wrapper :deep(.chat-bubble.right) {
  align-self: flex-end;
}

.message-wrapper :deep(.chat-bubble.left) {
  align-self: flex-start;
}

.message-wrapper :deep(.chat-bubble-wrapper .chat-bubble.right) {
  align-self: flex-end;
}

.message-wrapper :deep(.chat-bubble-wrapper .chat-bubble.left) {
  align-self: flex-start;
}

/* 떠있는 모드 셀렉터 스타일 */
.floating-mode-selector {
  position: sticky;
  top: 16px; /* 스크롤 시 상단에서 16px 위치에 고정 */
  left: 20px; /* chat-bubble.left와 동일한 좌측 패딩 */
  z-index: 1000;
  max-width: 200px;
  min-width: 150px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(229, 231, 235, 0.8);
  margin-bottom: 16px; /* 다른 메시지와의 간격 */
}

/* 스크롤바 스타일링은 상위 컨테이너에서 처리 */

@media (max-width: 1200px) {
  .chat-messages-area {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .chat-messages-area {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .chat-messages-area {
    width: 100%;
  }
  
  .floating-mode-selector {
    top: 12px; /* 모바일에서 약간 줄인 상단 여백 */
    max-width: 180px;
    min-width: 140px;
  }
}
</style>
