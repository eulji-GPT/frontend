<template>
  <div :class="['chat-bubble', align, { 'streaming': isStreaming }]">
    <div class="message-content">
      <div v-if="content && useMarkdown" v-html="renderedContent" class="markdown-content"></div>
      <div v-else-if="content" v-text="content"></div>
      <div v-else>
        <slot />
      </div>
      <span v-if="isStreaming" class="streaming-cursor">|</span>
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { marked } from 'marked';

// marked 옵션 설정
marked.setOptions({
  breaks: true,        // 개행을 <br>로 변환
  gfm: true,          // GitHub Flavored Markdown 사용
  headerIds: false,   // 헤더 ID 생성 안함
  mangle: false       // 헤더 텍스트 변형 안함
});

const props = defineProps({
  align: {
    type: String,
    default: 'right',
  },
  isStreaming: {
    type: Boolean,
    default: false,
  },
  useMarkdown: {
    type: Boolean,
    default: true,
  },
  content: {
    type: String,
    default: '',
  }
});

const slots = useSlots();

// 마크다운 렌더링
const renderedContent = computed(() => {
  if (props.content) {
    const result = props.useMarkdown ? marked(props.content) : props.content;
    // 마크다운 렌더링 결과에서 끝부분의 공백과 개행 제거
    return typeof result === 'string' ? result.trim() : result;
  }
  // slot 내용 처리 (기본 폴백)
  const slotContent = slots.default?.()?.[0]?.children || '';
  const textContent = slotContent.toString();
  const result = props.useMarkdown ? marked(textContent) : textContent;
  return typeof result === 'string' ? result.trim() : result;
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

/* 마크다운 스타일링 */
.markdown-content {
  line-height: 1.6;
  white-space: pre-line; /* 개행 문자를 실제 개행으로 처리 */
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin: 0.8em 0 0.4em 0;
  font-weight: 600;
  line-height: 1.4;
}

.markdown-content h1 { font-size: 1.5em; }
.markdown-content h2 { font-size: 1.3em; }
.markdown-content h3 { font-size: 1.1em; }

.markdown-content p {
  margin: 0.5em 0;
}

.markdown-content strong {
  font-weight: 700;
  color: #1f2937;
}

.markdown-content em {
  font-style: italic;
  color: #4b5563;
}

.markdown-content ul,
.markdown-content ol {
  margin: 0.5em 0;
  padding-left: 1.2em;
}

.markdown-content li {
  margin: 0.2em 0;
}

.markdown-content blockquote {
  border-left: 4px solid #02478a;
  background: #f8fafc;
  margin: 0.5em 0;
  padding: 0.5em 1em;
  font-style: italic;
}

.markdown-content code {
  background: #f1f5f9;
  color: #0f172a;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
}

.markdown-content pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.8em 0;
}

.markdown-content pre code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: 0.85em;
}

.markdown-content hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5em 0;
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
