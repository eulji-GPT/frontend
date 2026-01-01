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

        <!-- CoT 단계별 번호 표시 -->
        <div v-if="parsedCotContent && parsedCotContent.length > 0" class="cot-content">
          <div v-for="step in parsedCotContent" :key="step.number" class="cot-step-block">
            <div class="cot-step-number">
              <span class="step-circle">{{ step.number }}</span>
            </div>
            <div class="cot-step-text">
              <div class="cot-question">{{ step.question }}</div>
              <div v-html="marked.parse(step.answer)" class="cot-answer markdown-content"></div>
            </div>
          </div>
        </div>

        <!-- 일반 콘텐츠 -->
        <div v-else-if="displayContent && displayContent.trim()">
          <div v-if="useMarkdown" v-html="streamingRenderedContent" class="markdown-content"></div>
          <div v-else v-text="displayContent"></div>
        </div>
        <div v-else-if="!displayContent || !displayContent.trim()">
          <slot />
        </div>
        <div v-if="isStreaming" class="loading-indicator">
          <LottieLoader />
          <span class="loading-text">Searching...</span>
        </div>
      </div>

      <!-- 아티팩트 생성 알림 카드 (챗봇 메시지에 아티팩트가 있을 때) -->
      <div v-if="hasArtifact && align === 'left' && !isStreaming" class="artifact-notification-card" @click="handleOpenArtifact">
        <div class="artifact-icon-wrapper">
          <svg class="artifact-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
        </div>
        <div class="artifact-notification-content">
          <div class="artifact-notification-title">📄 상세 보고서가 생성되었습니다</div>
          <div class="artifact-notification-subtitle">클릭하여 전체 내용 보기</div>
        </div>
        <div class="artifact-notification-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <!-- 피드백 버튼 (챗봇 메시지에만 표시) -->
    <div v-if="align === 'left' && content && content.trim() && !isStreaming" class="feedback-container">
      <ChatFeedbackButtons
        :content="content"
        :messageId="messageId"
        :isBot="true"
        :hasArtifact="hasArtifact"
        @feedback="handleFeedback"
        @regenerate="handleRegenerate"
        @openArtifact="handleOpenArtifact"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots, onMounted, onUpdated, nextTick } from 'vue';
import { marked } from 'marked';
import ChatFeedbackButtons from './ChatFeedbackButtons.vue';
import LottieLoader from './LottieLoader.vue';

// marked 설정 강화 - 테이블, GFM, 코드 하이라이팅 지원
marked.use({
  breaks: false,  // 개행을 <br>로 변환하지 않음
  gfm: true,
  headerIds: false,
  mangle: false,
  pedantic: false,
  tables: true,
  smartLists: true,
  smartypants: false
});

// 코드 블록 렌더러 커스터마이징 - 복사 버튼 추가
const renderer = new marked.Renderer();

renderer.code = function(token) {
  // marked.js 4.x+에서는 token 객체로 전달됨
  const code = token.text || token;
  const lang = token.lang || '';

  // code가 문자열이 아닌 경우 문자열로 변환
  const codeString = typeof code === 'string' ? code : String(code || '');
  const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
  const escapedCode = codeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return `
    <div class="code-block-wrapper">
      <div class="code-header">
        <span class="code-language">${lang || 'text'}</span>
        <button class="code-copy-btn" onclick="
          const code = this.closest('.code-block-wrapper').querySelector('code').textContent;
          navigator.clipboard.writeText(code).then(() => {
            this.textContent = '✓ 복사됨';
            setTimeout(() => this.textContent = '복사', 2000);
          });
        ">복사</button>
      </div>
      <pre><code id="${codeId}" class="language-${lang || 'text'}">${escapedCode}</code></pre>
    </div>
  `;
};

marked.use({ renderer });


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
  },
  cotSteps: {
    type: Array,
    default: () => []
  },
  showCotNumbers: {
    type: Boolean,
    default: false
  },
  hasArtifact: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['feedback', 'regenerate', 'openArtifact']);

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
    // 마크다운 변환 전에 연속 개행 정규화
    const normalizedContent = normalizeLineBreaks(props.content);
    const result = props.useMarkdown ? marked.parse(normalizedContent) : normalizedContent;
    // 마크다운 렌더링 결과에서 끝부분의 공백과 개행 제거
    return typeof result === 'string' ? result.trim() : result;
  }
  // slot 내용 처리 (기본 폴백)
  const slotContent = slots.default?.()?.[0]?.children || '';
  const textContent = slotContent.toString();
  const normalizedSlot = normalizeLineBreaks(textContent);
  const result = props.useMarkdown ? marked.parse(normalizedSlot) : normalizedSlot;
  return typeof result === 'string' ? result.trim() : result;
});

// 스트리밍 상태에서 실시간 업데이트를 위한 computed
const displayContent = computed(() => {
  return props.content || '';
});

// CoT 단계별 content 파싱
const parsedCotContent = computed(() => {
  if (!props.showCotNumbers || !props.content) return null;

  // content를 줄바꿈으로 분리
  const lines = props.content.split('\n\n');
  const steps = [];
  let stepNumber = 1;

  for (const line of lines) {
    // **질문** 형태를 찾아서 단계로 인식
    if (line.trim().startsWith('**') && line.includes('**')) {
      const parts = line.split('\n');
      if (parts.length >= 2) {
        const question = parts[0].replace(/\*\*/g, '').trim();
        const answer = parts.slice(1).join('\n').trim();
        steps.push({
          number: stepNumber++,
          question,
          answer
        });
      }
    }
  }

  return steps.length > 0 ? steps : null;
});

// 연속된 개행을 정규화하는 함수
const normalizeLineBreaks = (text: string): string => {
  if (!text) return text;

  // 3개 이상 연속 개행을 2개로 줄임
  let normalized = text.replace(/\n{3,}/g, '\n\n');

  // 목록 항목 사이의 과도한 빈 줄 제거 (숫자 목록)
  normalized = normalized.replace(/(\d+\.\s+[^\n]+)\n{2,}(?=\d+\.)/g, '$1\n');

  // 불릿 목록 사이의 과도한 빈 줄 제거
  normalized = normalized.replace(/([-*]\s+[^\n]+)\n{2,}(?=[-*]\s)/g, '$1\n');

  // 제목 다음의 과도한 빈 줄 제거 (최대 1개만 유지)
  normalized = normalized.replace(/(#{1,6}\s+[^\n]+)\n{3,}/g, '$1\n\n');

  // 제목 바로 다음에 오는 내용 앞의 빈 줄 최소화
  normalized = normalized.replace(/(#{1,6}\s+[^\n]+)\n{2,}(?=\d+\.)/g, '$1\n');
  normalized = normalized.replace(/(#{1,6}\s+[^\n]+)\n{2,}(?=[-*]\s)/g, '$1\n');

  // 목록 항목 뒤 제목 앞의 빈 줄 정규화
  normalized = normalized.replace(/(\d+\.\s+[^\n]+)\n{2,}(?=#{1,6}\s)/g, '$1\n\n');
  normalized = normalized.replace(/([-*]\s+[^\n]+)\n{2,}(?=#{1,6}\s)/g, '$1\n\n');

  // 연속된 빈 줄 최종 정리 (2개로 제한)
  normalized = normalized.replace(/\n{3,}/g, '\n\n');

  return normalized;
};

// 렌더링된 마크다운 콘텐츠 (스트리밍 실시간 반영)
const streamingRenderedContent = computed(() => {
  const content = displayContent.value;
  if (content && props.useMarkdown) {
    try {
      // 마크다운 변환 전에 연속 개행 정규화
      const normalizedContent = normalizeLineBreaks(content);
      const result = marked.parse(normalizedContent);
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

// 아티팩트 열기 처리 함수
const handleOpenArtifact = () => {
  console.log('아티팩트 열기 요청:', props.messageId);
  emit('openArtifact', props.messageId);
};

// 테이블에 복사 버튼 추가하는 함수
const addTableCopyButtons = () => {
  nextTick(() => {
    const tables = document.querySelectorAll('.markdown-content table:not(.table-enhanced)');
    tables.forEach(table => {
      // 이미 처리된 테이블은 건너뛰기
      table.classList.add('table-enhanced');

      // 테이블을 래퍼로 감싸기
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';

      // 헤더 생성
      const header = document.createElement('div');
      header.className = 'table-header';
      header.innerHTML = `
        <span class="table-title">표</span>
        <button class="table-copy-btn">복사</button>
      `;

      // 복사 버튼 클릭 이벤트
      const copyBtn = header.querySelector('.table-copy-btn');
      copyBtn.addEventListener('click', () => {
        const rows = Array.from(table.querySelectorAll('tr'));
        const text = rows.map(row => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          return cells.map(cell => cell.textContent.trim()).join('\t');
        }).join('\n');

        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = '✓ 복사됨';
          setTimeout(() => copyBtn.textContent = '복사', 2000);
        });
      });

      // 테이블을 래퍼로 감싸기
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(header);
      wrapper.appendChild(table);
    });
  });
};

// 컴포넌트 마운트 및 업데이트 시 테이블 복사 버튼 추가
onMounted(() => {
  addTableCopyButtons();
});

onUpdated(() => {
  addTableCopyButtons();
});
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
  margin-top: 10px;
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
  max-width: 770px;
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

/* Lottie 로딩 애니메이션 - 스트리밍 중 */
.loading-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
}

:deep(.lottie-container) {
  display: inline-block;
  width: 24px !important;
  height: 24px !important;
  vertical-align: middle;
}

.loading-text {
  color: #02478a;
  font-size: 14px;
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 기존 스트리밍 커서 애니메이션 (폴백용) */
.streaming-cursor {
  display: inline-block;
  margin-left: 2px;
  color: #2563eb;
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
  line-height: 1.5;
  white-space: normal;
}

:deep(.markdown-content h1),
:deep(.markdown-content h2),
:deep(.markdown-content h3),
:deep(.markdown-content h4),
:deep(.markdown-content h5),
:deep(.markdown-content h6) {
  margin: 12px 0 4px 0;
  font-weight: 700;
  line-height: 1.3;
  color: #02478a;
}

/* 대제목 - 가장 크고 눈에 띄게 */
:deep(.markdown-content h1) {
  font-size: 2em !important;
  font-weight: 800 !important;
  color: #02478a !important;
  margin: 16px 0 8px 0 !important;
  display: block !important;
}

/* 중제목 - 뚜렷하게 구분 */
:deep(.markdown-content h2) {
  font-size: 1.6em !important;
  font-weight: 700 !important;
  color: #0c4a6e !important;
  margin: 14px 0 6px 0 !important;
  display: block !important;
}

/* 소제목 - 적당한 크기로 */
:deep(.markdown-content h3) {
  font-size: 1.3em !important;
  font-weight: 700 !important;
  color: #1e40af !important;
  margin: 12px 0 4px 0 !important;
  display: block !important;
}

/* 세부 제목들 */
:deep(.markdown-content h4) {
  font-size: 1.15em !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin: 10px 0 3px 0 !important;
  display: block !important;
}

:deep(.markdown-content h5) {
  font-size: 1.05em !important;
  font-weight: 600 !important;
  color: #4b5563 !important;
  margin: 8px 0 2px 0 !important;
  display: block !important;
}

:deep(.markdown-content h6) {
  font-size: 1em !important;
  font-weight: 600 !important;
  color: #6b7280 !important;
  margin: 6px 0 2px 0 !important;
  display: block !important;
}

/* 제목 바로 다음에 오는 목록/단락의 상단 마진 제거 */
:deep(.markdown-content h1 + p),
:deep(.markdown-content h2 + p),
:deep(.markdown-content h3 + p),
:deep(.markdown-content h4 + p),
:deep(.markdown-content h1 + ul),
:deep(.markdown-content h2 + ul),
:deep(.markdown-content h3 + ul),
:deep(.markdown-content h4 + ul),
:deep(.markdown-content h1 + ol),
:deep(.markdown-content h2 + ol),
:deep(.markdown-content h3 + ol),
:deep(.markdown-content h4 + ol) {
  margin-top: 2px !important;
}

:deep(.markdown-content p) {
  margin: 4px 0;
}

/* 빈 단락 숨김 */
:deep(.markdown-content p:empty) {
  display: none;
  margin: 0;
  padding: 0;
  height: 0;
}

/* 공백만 있는 단락 (렌더링 후 빈 것처럼 보이는 것들) */
:deep(.markdown-content p:has(> br:only-child)) {
  display: none;
  margin: 0;
}

:deep(.markdown-content br) {
  display: none;
}

:deep(.markdown-content strong) {
  font-weight: 700;
  color: #02478a;
}

:deep(.markdown-content em) {
  font-style: italic;
  color: #1e40af;
  background: rgba(30, 64, 175, 0.05);
  padding: 1px 3px;
  border-radius: 2px;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 4px 0 4px 0;
  padding-left: 1.2em;
}

/* 연속된 목록 사이 간격 줄이기 */
:deep(.markdown-content ul + ul),
:deep(.markdown-content ol + ol),
:deep(.markdown-content ul + ol),
:deep(.markdown-content ol + ul) {
  margin-top: 2px;
}

:deep(.markdown-content ul) {
  list-style-type: none;
}

:deep(.markdown-content ul li) {
  position: relative;
  margin: 2px 0;
  padding-left: 1em;
}

:deep(.markdown-content ul li::before) {
  content: '▶';
  position: absolute;
  left: 0;
  color: #02478a;
  font-weight: bold;
}

:deep(.markdown-content ol) {
  counter-reset: item;
  padding-left: 2em;
}

:deep(.markdown-content ol li) {
  display: block;
  position: relative;
  margin: 4px 0;
  padding-left: 0.5em;
}

:deep(.markdown-content ol li::before) {
  content: counter(item) ".";
  counter-increment: item;
  position: absolute;
  left: -1.8em;
  color: #02478a;
  font-weight: bold;
  background: #f0f6ff;
  padding: 2px 6px;
  border-radius: 50%;
  font-size: 0.9em;
  min-width: 1.2em;
  text-align: center;
}

/* 중첩된 순서 있는 목록 스타일 */
:deep(.markdown-content ol ol) {
  counter-reset: subitem;
  margin-top: 4px;
  padding-left: 2.5em;
}

:deep(.markdown-content ol ol li::before) {
  content: counter(item) "." counter(subitem);
  counter-increment: subitem;
  left: -2.5em;
  background: #e0f2fe;
  font-size: 0.85em;
}

/* 3단계 중첩 목록 */
:deep(.markdown-content ol ol ol) {
  counter-reset: subsubitem;
  padding-left: 2.5em;
}

:deep(.markdown-content ol ol ol li::before) {
  content: counter(item) "." counter(subitem) "." counter(subsubitem);
  counter-increment: subsubitem;
  left: -3em;
  background: #dbeafe;
  font-size: 0.8em;
}

:deep(.markdown-content blockquote) {
  border-left: 4px solid #02478a;
  background: linear-gradient(135deg, #f0f6ff 0%, #f8fafc 100%);
  margin: 6px 0;
  padding: 8px 12px;
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
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
}

:deep(.markdown-content pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 6px 0;
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
  margin: 8px 0;
  background: linear-gradient(to right, #02478a, #e5e7eb, #02478a);
  height: 1px;
}

/* 코드 블록 래퍼 스타일 */
:deep(.code-block-wrapper) {
  margin: 10px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #334155;
}

:deep(.code-header) {
  background: #0f172a;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #334155;
}

:deep(.code-language) {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
}

:deep(.code-copy-btn) {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: Pretendard, sans-serif;
}

:deep(.code-copy-btn:hover) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

:deep(.code-copy-btn:active) {
  transform: translateY(0);
  box-shadow: none;
}

:deep(.code-block-wrapper pre) {
  margin: 0;
  background: #1e293b;
  padding: 12px;
  overflow-x: auto;
}

:deep(.code-block-wrapper pre code) {
  background: none;
  color: #e2e8f0;
  padding: 0;
  font-size: 0.85em;
  line-height: 1.6;
}

/* 테이블 래퍼 스타일 (복사 버튼 포함) */
:deep(.table-wrapper) {
  margin: 12px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

:deep(.table-header) {
  background: #f8fafc;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.table-title) {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
}

:deep(.table-copy-btn) {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: Pretendard, sans-serif;
}

:deep(.table-copy-btn:hover) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

:deep(.table-copy-btn:active) {
  transform: translateY(0);
  box-shadow: none;
}

/* 테이블 스타일 */
:deep(.table-wrapper table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.9em;
  border: none;
}

:deep(.table-wrapper table thead) {
  background: #f8fafc;
}

:deep(.table-wrapper table th) {
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 2px solid #cbd5e1;
}

:deep(.table-wrapper table td) {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  color: #334155;
}

:deep(.table-wrapper table tbody tr:last-child td) {
  border-bottom: none;
}

:deep(.table-wrapper table tbody tr:hover) {
  background: #f8fafc;
}

/* 기존 마크다운 테이블 스타일 (폴백용) */
:deep(.markdown-content table:not(.table-wrapper table)) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 0.9em;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

/* CoT 단계별 번호 스타일 */
.cot-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cot-step-block {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.cot-step-number {
  flex-shrink: 0;
}

.step-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  font-weight: 700;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
}

.cot-step-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cot-question {
  font-weight: 700;
  font-size: 16px;
  color: #02478a;
  line-height: 1.4;
}

.cot-answer {
  color: #222;
  line-height: 1.6;
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

/* 아티팩트 알림 카드 스타일 */
.artifact-notification-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  margin-top: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  animation: artifactSlideIn 0.5s ease-out, artifactPulse 2s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.artifact-notification-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.artifact-notification-card:hover::before {
  left: 100%;
}

.artifact-notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
}

.artifact-notification-card:active {
  transform: translateY(0);
}

@keyframes artifactSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes artifactPulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
  50% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
}

.artifact-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.artifact-icon {
  color: white;
  animation: artifactIconBounce 1s ease-in-out infinite;
}

@keyframes artifactIconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.artifact-notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.artifact-notification-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.3;
}

.artifact-notification-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.artifact-notification-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.artifact-notification-card:hover .artifact-notification-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .artifact-notification-card {
    padding: 14px 16px;
    gap: 12px;
  }

  .artifact-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .artifact-icon {
    width: 24px;
    height: 24px;
  }

  .artifact-notification-title {
    font-size: 14px;
  }

  .artifact-notification-subtitle {
    font-size: 12px;
  }
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
