<template>
  <div class="source-sidebar" v-if="sources && sources.length > 0">
    <div class="sidebar-header">
      <p class="sidebar-title">검색 결과</p>
      <button class="close-button" @click="$emit('close')" aria-label="닫기">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="sources-container">
      <div
        v-for="(source, index) in sources"
        :key="index"
        class="source-card"
      >
        <div class="source-title">{{ source.title }}</div>
        <div class="source-content">{{ source.content }}</div>
        <div class="source-domain-badge">
          <div class="domain-indicator"></div>
          <span class="domain-text">{{ source.domain }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RagSource } from '../../composables/useChat';

defineProps<{
  sources?: RagSource[];
}>();

defineEmits(['close']);
</script>

<style scoped>
.source-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 370px;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  padding: 15px 20px;
  flex-shrink: 0;
  overflow-y: auto;
  box-sizing: border-box;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  flex-shrink: 0;
}

.sidebar-title {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 25px;
  color: #000000;
  margin: 0;
}

.close-button {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #6b7280;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #000000;
}

.sources-container {
  display: flex;
  flex-direction: column;
  gap: 35px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.source-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #ffffff;
  flex-shrink: 0;
}

.source-title {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 23px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-content {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 23px;
  color: #000000;
  max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
}

.source-domain-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: #f3f4f6;
  border-radius: 20px;
  align-self: flex-start;
  flex-shrink: 0;
}

.domain-indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at center, #3b82f6 0%, #2563eb 100%);
  flex-shrink: 0;
}

.domain-text {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  color: #6b7280;
  white-space: nowrap;
}

/* 스크롤바 스타일링 */
.sources-container::-webkit-scrollbar {
  width: 6px;
}

.sources-container::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 3px;
}

.sources-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.sources-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .source-sidebar {
    display: none;
  }
}
</style>
