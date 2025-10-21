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
        <div v-if="displayContent && displayContent.trim()">
          <div v-if="useMarkdown" v-html="streamingRenderedContent" class="markdown-content"></div>
          <div v-else v-text="displayContent"></div>
        </div>
        <div v-else-if="!displayContent || !displayContent.trim()">
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

// marked 설정 (최신 버전에 맞게)
marked.use({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
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

// 스트리밍 상태에서 실시간 업데이트를 위한 computed
const displayContent = computed(() => {
  return props.content || '';
});

// 렌더링된 마크다운 콘텐츠 (스트리밍 실시간 반영)
const streamingRenderedContent = computed(() => {
  const content = displayContent.value;
  if (content && props.useMarkdown) {
    try {
      const result = marked(content);
      return typeof result === 'string' ? result.trim() : result;
    } catch (error) {
      console.error('마크다운 변환 오류:', error);
      return content;
    }
  }
  return content;
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
  width: fit-content;
  max-width: calc(100% - 20px); /* 오른쪽 여유 공간 확보 */
  overflow: visible;
}

.chat-bubble-wrapper.right {
  align-items: flex-end;
  margin-right: 10px; /* 오른쪽 말풍선 꼬리를 위한 여유 공간 */
}

.chat-bubble-wrapper.left {
  align-items: flex-start;
  margin-left: 0;
}

.feedback-container {
  width: 100%;
  margin-top: 4px;
}

.chat-bubble {
  display: inline-block;
  max-width: 70%; /* 화면 너비의 70%로 제한 */
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid var(--Gray-100, #F3F4F6);
  background: var(--Primary-300, #F0F6FF);
  font-size: 16px;
  color: #222;
  word-break: break-word;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin: 8px 0;
  line-height: 1.5;
  position: relative;
  transition: all 0.3s ease;
  transform: translateY(0);
  opacity: 1;
  animation: bubbleAppear 0.4s ease-out;
  box-sizing: border-box; /* 패딩을 포함한 크기 계산 */
  overflow: visible; /* 스크롤을 상위 컨테이너에 위임 */
}

@keyframes bubbleAppear {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chat-bubble.right {
  /* 유저 메시지 - 우측 정렬 */
  display: inline-flex;
  max-width: 550px;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--Gray-100, #F3F4F6);
  background: var(--Primary-300, #F0F6FF);
  color: #222;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  font-weight: 500;
}

.chat-bubble.right:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 246, 255, 0.4);
}

/* 유저 메시지 말풍선 꼬리 */
.chat-bubble.right::after {
  content: '';
  position: absolute;
  top: 15px;
  right: -8px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left-color: var(--Primary-300, #F0F6FF);
  border-right: 0;
  border-top: 0;
  margin-top: -4px;
  margin-right: -8px;
}

.chat-bubble.left {
  /* 챗봇 메시지 - 좌측 정렬 */
  display: block;
  width: 100%;
  max-width: 100%;
  padding: 16px 20px;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
}

/* 챗봇 메시지 말풍선 꼬리 - 제거됨 */
.chat-bubble.left::after {
  display: none;
}

/* 스트리밍 커서 애니메이션 - 개선된 버전 */
.streaming-cursor {
  display: inline-block;
  margin-left: 2px;
  color: #2563eb; /* 더 눈에 띄는 파란색 */
  font-weight: bold;
  font-size: 1.1em;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

/* 스트리밍 상태 스타일링 */
.streaming-text {
  position: relative;
}

.streaming-content {
  transition: all 0.1s ease;
}

/* 디버그 스트리밍 정보 스타일링 */
.debug-streaming {
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 8px;
  padding: 8px;
  margin-top: 8px;
  font-family: monospace;
  line-height: 1.4;
}

/* 마크다운 스타일링 */
:deep(.markdown-content) {
  line-height: 1.4;
  white-space: pre-line; /* 개행 문자를 실제 개행으로 처리 */
}

:deep(.markdown-content h1),
:deep(.markdown-content h2),
:deep(.markdown-content h3),
:deep(.markdown-content h4),
:deep(.markdown-content h5),
:deep(.markdown-content h6) {
  margin: 0.2em 0 0.1em 0;
  font-weight: 700;
  line-height: 1.1;
  color: #02478a;
}

/* 대제목 - 가장 크고 눈에 띄게 */
:deep(.markdown-content h1) { 
  font-size: 1.8em !important;
  font-weight: 800 !important;
  color: #02478a !important;
  border-bottom: 2px solid #02478a !important;
  padding-bottom: 0.1em !important;
  margin: 0.3em 0 0.15em 0 !important;
  display: block !important;
}

/* 중제목 - 뚜렷하게 구분 */
:deep(.markdown-content h2) { 
  font-size: 1.5em !important;
  font-weight: 700 !important;
  color: #1e40af !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding-bottom: 0.05em !important;
  margin: 0.25em 0 0.1em 0 !important;
  display: block !important;
}

/* 소제목 - 적당한 크기로 */
:deep(.markdown-content h3) { 
  font-size: 1.25em !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
  margin: 0.2em 0 0.05em 0 !important;
  display: block !important;
}

/* 세부 제목들 */
:deep(.markdown-content h4) { 
  font-size: 1.1em !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin: 0.15em 0 0.05em 0 !important;
  display: block !important;
}

:deep(.markdown-content h5) { 
  font-size: 1.05em !important;
  font-weight: 600 !important;
  color: #4b5563 !important;
  margin: 0.1em 0 0.03em 0 !important;
  display: block !important;
}

:deep(.markdown-content h6) { 
  font-size: 1em !important;
  font-weight: 600 !important;
  color: #6b7280 !important;
  margin: 0.08em 0 0.02em 0 !important;
  display: block !important;
}

:deep(.markdown-content p) {
  margin: 0.1em 0;
}

:deep(.markdown-content strong) {
  font-weight: 700;
  color: #02478a;
}

:deep(.markdown-content em) {
  font-style: italic;
  color: #1e40af;
  background: rgba(30, 64, 175, 0.05);
  padding: 0.1em 0.2em;
  border-radius: 2px;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 0.1em 0;
  padding-left: 1em;
}

:deep(.markdown-content ul) {
  list-style-type: none;
}

:deep(.markdown-content ul li) {
  position: relative;
  margin: 0.05em 0;
  padding-left: 1em;
}

:deep(.markdown-content ul li::before) {
  content: '▶';
  position: absolute;
  left: 0;
  color: #02478a;
  font-weight: bold;
}

:deep(.markdown-content ol li) {
  margin: 0.05em 0;
  padding-left: 0.2em;
}

:deep(.markdown-content ol) {
  counter-reset: item;
}

:deep(.markdown-content ol li) {
  display: block;
  position: relative;
}

:deep(.markdown-content ol li::before) {
  content: counter(item) ".";
  counter-increment: item;
  position: absolute;
  left: -1.5em;
  color: #02478a;
  font-weight: bold;
  background: #f0f6ff;
  padding: 2px 6px;
  border-radius: 50%;
  font-size: 0.9em;
  min-width: 1.2em;
  text-align: center;
}

:deep(.markdown-content blockquote) {
  border-left: 4px solid #02478a;
  background: linear-gradient(135deg, #f0f6ff 0%, #f8fafc 100%);
  margin: 0.2em 0;
  padding: 0.3em 0.8em;
  font-style: normal;
  border-radius: 0 6px 6px 0;
  box-shadow: 0 1px 3px rgba(2, 71, 138, 0.1);
  position: relative;
}

:deep(.markdown-content blockquote::before) {
  content: '💡';
  position: absolute;
  left: -2px;
  top: -2px;
  background: #02478a;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
}

:deep(.markdown-content blockquote p) {
  margin: 0;
  font-weight: 500;
  color: #1e40af;
}

:deep(.markdown-content code) {
  background: #f1f5f9;
  color: #0f172a;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
}

:deep(.markdown-content pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.5em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.2em 0;
}

:deep(.markdown-content pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: 0.85em;
}

:deep(.markdown-content hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.3em 0;
  background: linear-gradient(to right, #02478a, #e5e7eb, #02478a);
  height: 1px;
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
  line-clamp: 2;
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
