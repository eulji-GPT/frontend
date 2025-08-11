<template>
  <div class="frame-10">
    <div class="chat-list-link">
      <span class="conversation-list">대화 리스트</span>
    </div>
    <div class="frame-11">
      <div v-if="chatHistory.length === 0" class="chat-list-container">
        <span class="start-chat">지금 바로 대화를 시작해보세요</span>
      </div>
      <div v-else class="chat-list-container-history">
        <div v-for="chat in chatHistory" :key="chat.id" @click="$emit('selectChat', chat.id)" class="chat-history-item" :class="{ active: currentChatId === chat.id }">
          <span>{{ chat.title }}</span>
          <button @click.stop="$emit('deleteChat', chat.id)" class="delete-chat-button">x</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatSession } from '../../composables/useChat';

defineProps<{
  chatHistory: ChatSession[];
  currentChatId: string | null;
}>();

defineEmits<{
  (e: 'startNewChat'): void;
  (e: 'selectChat', id: string): void;
  (e: 'deleteChat', id: string): void;
}>();
</script>

<style scoped>
/* Styles from index.vue that are relevant to the chat history list */
.frame-10 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 10px;
  position: relative;
  width: 100%;
  height: 532px;
  padding: 0 20px 0 20px;
  z-index: 36;
}
.chat-list-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100%;
}



.chat-list-container-history {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  overflow-y: auto;
}

.chat-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid transparent;
}

.chat-history-item:hover {
  background-color: #f3f4f6;
}

.chat-history-item.active {
  border-color: #02478a;
  background-color: #f0f6ff;
}

.delete-chat-button {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  visibility: hidden;
}

.chat-history-item:hover .delete-chat-button {
  visibility: visible;
}
.frame-11 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 5px;
  position: relative;
  width: 216px;
  z-index: 39;
}
.chat-list-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 4px;
  position: relative;
  width: 216px;
  padding: 10px 15px 10px 15px;
  z-index: 40;
}
.start-chat {
  flex-shrink: 0;
  flex-basis: auto;
  position: relative;
  height: 17px;
  color: #9ca3af;
  font-family: Pretendard, var(--default-font-family);
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 41;
  overflow: hidden;
  max-width: 168px;
  max-height: 17px;
}
</style>
