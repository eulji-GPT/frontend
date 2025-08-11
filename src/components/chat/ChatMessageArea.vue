<template>
  <div class="chat-messages-area" ref="messagesContainer">
    <div v-for="(msg, idx) in messages" :key="idx" class="message-wrapper">
      <div v-if="msg.isLoading" class="loading-indicator">
        <LottieLoader />
        <span class="loading-text">Searching...</span>
      </div>
      <ChatBubble v-else :align="msg.isUser ? 'right' : 'left'" :is-loading="false" :is-streaming="msg.isStreaming">
        {{ msg.text }}
      </ChatBubble>
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
  max-width: 770px;
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
  align-items: center;
  gap: 8px;
  padding: 16px;
  margin-left: 20px;
}

.loading-text {
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
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

@media (max-width: 1024px) {
  .chat-messages-area {
    width: 90vw;
    max-width: 98vw;
  }
}
</style>
