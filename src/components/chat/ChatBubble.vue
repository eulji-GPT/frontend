<template>
  <div :class="['chat-bubble', align, { 'streaming': isStreaming }]">
    <div class="message-content">
      <slot />
      <span v-if="isStreaming" class="streaming-cursor">|</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  align: {
    type: String,
    default: 'right',
  },
  isStreaming: {
    type: Boolean,
    default: false,
  }
});
</script>

<style scoped>
.chat-bubble {
  display: inline-flex;
  max-width: 550px;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--Gray-100, #F3F4F6);
  background: var(--Primary-300, #F0F6FF);
  font-size: 16px;
  color: #222;
  word-break: break-all;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin: 8px 0;
}

.right {
  /* 유저 메시지 - 우측 정렬 */
  background: var(--Primary-300, #F0F6FF);
  border: 1px solid var(--Gray-100, #F3F4F6);
}

.left {
  /* 챗봇 메시지 - 좌측 정렬 */
  background: #fff;
  border: 1px solid #e5e7eb;
}

/* 스트리밍 커서 애니메이션 */
.streaming-cursor {
  display: inline-block;
  margin-left: 2px;
  color: #9ca3af;
  font-weight: bold;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>

/* CSS 변수 정의 */
:root {
  --Gray-100: #F3F4F6;
  --Primary-300: #F0F6FF;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .chat-bubble {
    max-width: 85%;
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .chat-bubble {
    max-width: 90%;
    padding: 6px 12px;
    font-size: 13px;
  }
}
