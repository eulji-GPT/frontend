<template>
  <div class="chat-messages-area" ref="messagesContainer">
    <div v-for="(msg, idx) in messages" :key="idx" class="message-wrapper">
      <ChatBubble :align="msg.isUser ? 'right' : 'left'" :is-loading="msg.isLoading" :is-streaming="msg.isStreaming">
        {{ msg.text }}
      </ChatBubble>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import ChatBubble from './ChatBubble.vue';
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
