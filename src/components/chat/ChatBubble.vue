<template>
  <div :class="['chat-bubble-wrapper', align]">
    <div :class="['chat-bubble', align, { 'streaming': isStreaming }]">
      <div class="message-content">
        <!-- 파일 미리보기 (사용자 메시지에서만) -->
        <div v-if="images && Array.isArray(images) && images.length > 0 && align === 'right'" class="message-files">
          <div 
            v-for="(file, index) in images" 
            :key="index" 
            class="message-file"
          >
            <img v-if="file.type && file.type.startsWith('image/')" :src="getFilePreview(file)" :alt="file.name || '이미지'" class="message-image" />
            <div v-else class="message-pdf">
              <span class="pdf-icon">📄</span>
              <span class="pdf-name">{{ file.name || '파일' }}</span>
            </div>
          </div>
        </div>
        <div v-if="content && content.trim()">
          <div v-if="useMarkdown" v-html="renderedContent" class="markdown-content"></div>
          <div v-else v-text="content"></div>
        </div>
        <div v-else-if="!content || !content.trim()">
          <slot />
        </div>
        <span v-if="isStreaming" class="streaming-cursor">|</span>
      </div>
    </div>
    
    <!-- 피드백 버튼 (챗봇 메시지에만 표시) -->
    <div v-if="align === 'left' && content && content.trim() && !isStreaming" class="feedback-container">
      <ChatFeedbackButtons
        :content="content"
        :messageId="messageId"
        :isBot="true"
        @feedback="handleFeedback"
        @regenerate="handleRegenerate"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { marked } from 'marked';
import ChatFeedbackButtons from './ChatFeedbackButtons.vue';

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
  },
  images: {
    type: Array,
    default: () => []
  },
  messageId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['feedback', 'regenerate']);

const slots = useSlots();

// 파일 미리보기를 위한 함수
const getFilePreview = (file) => {
  try {
    if (file && file instanceof File) {
      return URL.createObjectURL(file);
    }
    return '';
  } catch (error) {
    console.error('파일 미리보기 생성 실패:', error);
    return '';
  }
};

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

// 피드백 처리 함수
const handleFeedback = (type, messageId) => {
  console.log(`피드백 수신: ${type}`, messageId);
  emit('feedback', type, messageId);
};

// 답변 재생성 처리 함수
const handleRegenerate = (messageId) => {
  console.log('답변 재생성 요청:', messageId);
  emit('regenerate', messageId);
};
</script>

<style scoped>
.chat-bubble-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.chat-bubble-wrapper.right {
  align-items: flex-end;
}

.chat-bubble-wrapper.left {
  align-items: flex-start;
}

.feedback-container {
  width: 100%;
  margin-top: 4px;
}

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
  border: none;
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

/* 파일 미리보기 스타일 */
.message-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.message-file {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-pdf {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
  height: 100%;
  background-color: #f9fafb;
}

.message-pdf .pdf-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.message-pdf .pdf-name {
  font-size: 8px;
  font-family: Pretendard, sans-serif;
  color: #666;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.2;
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
