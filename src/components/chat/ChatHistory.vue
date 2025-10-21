<template>
  <div class="frame-10">
    <div class="chat-list-link">
      <span class="conversation-list">대화 리스트</span>
      <button @click="$emit('startNewChat')" class="new-chat-button">새 대화</button>
    </div>
    <div class="frame-11">
      <div v-if="chatHistory.length === 0" class="chat-list-container">
        <span class="start-chat">지금 바로 대화를 시작해보세요</span>
      </div>
      <div v-else class="chat-list-container-history">
        <div v-for="chat in chatHistory" :key="chat.id" @click="$emit('selectChat', chat.id)" @dblclick="startEditing(chat.id)" @contextmenu="showContextMenu($event, chat.id)" class="chat-history-item" :class="{ active: currentChatId === chat.id }">
          <input 
            v-if="editingChatId === chat.id"
            v-model="editingTitle"
            @blur="finishEditing"
            @keydown.enter="finishEditing"
            @keydown.escape="cancelEditing"
            @click.stop
            ref="editInput"
            class="title-edit-input"
            maxlength="50"
          />
          <span v-else class="chat-title">{{ chat.title }}</span>
          <button @click.stop="showDeleteModalForChat(chat.id)" class="delete-chat-button">x</button>
        </div>
      </div>
    </div>
    <ChatContextMenu 
      :isVisible="contextMenuVisible" 
      :position="contextMenuPosition"
      @editTitle="handleEditTitle"
      @deleteChat="showDeleteModal"
    />
    <CommonDeleteModal 
      :isVisible="deleteModalVisible" 
      @cancel="hideDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import type { ChatSession } from '../../composables/useChat';
import ChatContextMenu from './ChatContextMenu.vue';
import CommonDeleteModal from '../common/CommonDeleteModal.vue';

const props = defineProps<{
  chatHistory: ChatSession[];
  currentChatId: string | null;
}>();

const emit = defineEmits<{
  (e: 'startNewChat'): void;
  (e: 'selectChat', id: string): void;
  (e: 'deleteChat', id: string): void;
  (e: 'updateChatTitle', id: string, newTitle: string): void;
}>();

const editingChatId = ref<string | null>(null);
const editingTitle = ref<string>('');
const editInput = ref<HTMLInputElement[]>([]);
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ top: '0px', left: '0px' });
const contextMenuChatId = ref<string | null>(null);
const deleteModalVisible = ref(false);

const startEditing = (chatId: string) => {
  const chat = props.chatHistory.find(c => c.id === chatId);
  if (chat) {
    editingChatId.value = chatId;
    editingTitle.value = chat.title;
    nextTick(() => {
      const input = editInput.value[0];
      if (input) {
        input.focus();
        input.select();
      }
    });
  }
};

const finishEditing = () => {
  if (editingChatId.value && editingTitle.value.trim()) {
    emit('updateChatTitle', editingChatId.value, editingTitle.value.trim());
  }
  editingChatId.value = null;
  editingTitle.value = '';
};

const cancelEditing = () => {
  editingChatId.value = null;
  editingTitle.value = '';
};

const showContextMenu = (event: MouseEvent, chatId: string) => {
  event.preventDefault();
  contextMenuChatId.value = chatId;
  contextMenuPosition.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`
  };
  contextMenuVisible.value = true;
};

const hideContextMenu = () => {
  contextMenuVisible.value = false;
  contextMenuChatId.value = null;
};

const handleEditTitle = () => {
  if (contextMenuChatId.value) {
    startEditing(contextMenuChatId.value);
  }
  hideContextMenu();
};

const showDeleteModal = () => {
  deleteModalVisible.value = true;
  hideContextMenu();
};

const hideDeleteModal = () => {
  deleteModalVisible.value = false;
};

const showDeleteModalForChat = (chatId: string) => {
  contextMenuChatId.value = chatId;
  deleteModalVisible.value = true;
};

const confirmDelete = () => {
  if (contextMenuChatId.value) {
    emit('deleteChat', contextMenuChatId.value);
  }
  hideDeleteModal();
  contextMenuChatId.value = null;
};

onMounted(() => {
  document.addEventListener('click', hideContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu);
});
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
  padding: 0 20px;
  z-index: 36;
}
.chat-list-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  width: 100%;
  flex-shrink: 0;
  overflow: visible;
  gap: 8px;
}

.conversation-list {
  font-size: 14px;
  font-weight: 600;
  line-height: 23px;
  color: #6B7280;
  font-family: Pretendard, var(--default-font-family);
}

.new-chat-button {
  background-color: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  font-family: Pretendard, var(--default-font-family);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.new-chat-button:hover {
  background-color: #E5E7EB;
  transform: translateY(-1px);
}



.chat-list-container-history {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  overflow-y: hidden;
}

.chat-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
  position: relative;
}

.chat-history-item:hover {
  background-color: #f3f4f6;
}

.chat-history-item.active {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 4px;
  border-radius: 10px;
  width: 216px;
  height: 37px;
  background-color: rgb(240, 246, 255);
  box-sizing: border-box;
  padding: 10px 15px;
}

.chat-title {
  color: black;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
}

.delete-chat-button {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  visibility: hidden;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 16px;
  line-height: 1;
  position: absolute;
  right: 15px;
}

.chat-history-item:hover .delete-chat-button {
  visibility: visible;
}

.title-edit-input {
  background: white;
  border: 1px solid #02478a;
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 14px;
  font-family: Pretendard, var(--default-font-family);
  width: 100%;
  outline: none;
}
.frame-11 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 5px;
  position: relative;
  width: 100%;
  z-index: 39;
}
.chat-list-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 4px;
  position: relative;
  width: 100%;
  padding: 10px 15px;
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
  width: 100%;
  max-height: 17px;
}

/* Responsive styles for small sidebars */
@media (max-width: 1200px) {
  .frame-10 {
    padding: 0 16px;
  }
  
  .chat-history-item {
    padding: 6px 10px;
  }
  
  .chat-title {
    font-size: 13px;
  }
  
  .conversation-list {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .frame-10 {
    padding: 0 12px;
  }
  
  .chat-history-item {
    padding: 8px 12px;
  }
}
</style>
