<template>
  <div class="chat-messages-area" ref="messagesContainer">
    <div v-for="(msg, idx) in messages" :key="idx" class="message-wrapper">
      <div v-if="msg.isLoading || msg.currentStep" class="loading-indicator">
        <LottieLoader />
        <div class="loading-content">
          <span class="loading-text">{{ msg.currentStep || 'Searching...' }}</span>
          <div v-if="msg.cotSteps && msg.cotSteps.length > 0" class="cot-steps">
            <div 
              v-for="(step, index) in msg.cotSteps" 
              :key="index"
              class="cot-step"
              :class="{ 
                'completed': msg.currentStep && msg.cotSteps.indexOf(msg.currentStep) > index,
                'active': msg.currentStep === step,
                'pending': msg.cotSteps.indexOf(msg.currentStep) < index
              }"
            >
              <div class="step-indicator">
                <span v-if="msg.currentStep && msg.cotSteps.indexOf(msg.currentStep) > index">✓</span>
                <span v-else-if="msg.currentStep === step">●</span>
                <span v-else>○</span>
              </div>
              <span class="step-text">{{ step }}</span>
            </div>
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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import ChatBubble from './ChatBubble.vue';
import LottieLoader from './LottieLoader.vue';
import type { ChatMessage } from '../../composables/useChat';

const props = defineProps<{
  messages: ChatMessage[];
}>();

const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(() => props.messages, () => {
  scrollToBottom();
}, { deep: true });

</script>

<style scoped>
.chat-messages-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px; /* 770px에서 1000px로 확장 */
  flex: 1 1 auto; /* Let it grow and shrink */
  overflow-y: auto; /* It must scroll its own content */
  min-height: 0; /* Important for shrinking below its content size */
}

.message-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 12px;
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

.message-wrapper :deep(.chat-bubble.right) {
  align-self: flex-end;
}

.message-wrapper :deep(.chat-bubble.left) {
  align-self: flex-start;
}


.chat-messages-area::-webkit-scrollbar {
  width: 6px;
}

.chat-messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-messages-area::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 1200px) {
  .chat-messages-area {
    max-width: 90vw;
  }
}

@media (max-width: 1024px) {
  .chat-messages-area {
    max-width: 95vw;
  }
}

@media (max-width: 768px) {
  .chat-messages-area {
    max-width: 98vw;
  }
}
</style>
