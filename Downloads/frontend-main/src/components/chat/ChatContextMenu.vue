<template>
  <div v-if="isVisible" class="chat-context-menu" :style="{ top: position.top, left: position.left }">
    <div class="menu-item" @click="$emit('editTitle')">
      <span class="menu-text">제목 변경</span>
    </div>
    <div class="menu-item" @click="$emit('deleteChat')">
      <span class="menu-text">삭제</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  position: { top: string; left: string }
}

defineProps<Props>()

defineEmits<{
  (e: 'editTitle'): void
  (e: 'deleteChat'): void
}>()
</script>

<style scoped>
.chat-context-menu {
  position: fixed;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 1px 1px 4px 0px rgb(217, 217, 217);
  border: solid 1px rgb(243, 244, 246);
  border-radius: 15px;
  min-height: auto;
  background-color: white;
  box-sizing: border-box;
  padding: 15px;
  z-index: 999999;
}

.menu-item {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  border-radius: 5px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 5px 10px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: rgb(249, 250, 251);
}

.menu-text {
  color: black;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  flex: 1;
}

.menu-item:first-child .menu-text {
  width: 117px;
}

.menu-item:last-child .menu-text {
  width: 109px;
}

.menu-item:last-child {
  justify-content: center;
}
</style>