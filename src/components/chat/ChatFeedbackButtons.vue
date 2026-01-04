<template>
  <div class="feedback-buttons" v-if="showButtons">
    <button
      class="feedback-btn copy-btn"
      @click="copyToClipboard"
      :title="copySuccess ? '복사됨!' : '복사'"
      :aria-label="copySuccess ? '복사됨' : '응답 복사'"
    >
      <svg v-if="!copySuccess" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    </button>

    <button
      class="feedback-btn good-btn"
      @click="sendFeedback('good')"
      :class="{ active: feedback === 'good' }"
      title="좋아요"
      aria-label="좋아요"
      :aria-pressed="feedback === 'good'"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
    </button>

    <button
      class="feedback-btn bad-btn"
      @click="handleBadFeedback"
      :class="{ active: feedback === 'bad' }"
      title="싫어요 (상세 피드백)"
      aria-label="싫어요 - 상세 피드백 남기기"
      :aria-pressed="feedback === 'bad'"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
      </svg>
    </button>

    <button
      class="feedback-btn bookmark-btn"
      @click="toggleBookmark"
      :class="{ active: isBookmarked }"
      :title="isBookmarked ? '북마크 해제' : '북마크 추가'"
      :aria-label="isBookmarked ? '북마크 해제' : '북마크 추가'"
      :aria-pressed="isBookmarked"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>

    <button
      class="feedback-btn regenerate-btn"
      @click="regenerateAnswer"
      title="다시 생성"
      aria-label="답변 다시 생성"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="23,4 23,10 17,10"></polyline>
        <polyline points="1,20 1,14 7,14"></polyline>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
      </svg>
    </button>

    <button
      v-if="hasArtifact"
      class="feedback-btn artifact-btn"
      @click="openArtifact"
      title="아티팩트 보기"
      aria-label="아티팩트 보기"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  content: string;
  messageId?: string;
  isBot?: boolean;
  hasArtifact?: boolean;
}>();

const emit = defineEmits(['feedback', 'regenerate', 'openArtifact', 'bookmark', 'openDetailedFeedback']);

const feedback = ref<'good' | 'bad' | null>(null);
const copySuccess = ref(false);
const isBookmarked = ref(false);

// 컴포넌트 로드 시 기존 피드백 및 북마크 불러오기
onMounted(() => {
  try {
    // 피드백 불러오기
    const feedbackData = JSON.parse(localStorage.getItem('messageFeedback') || '{}');
    const existingFeedback = feedbackData[props.messageId || ''];
    if (existingFeedback) {
      feedback.value = existingFeedback.type;
    }

    // 북마크 불러오기
    const bookmarks = JSON.parse(localStorage.getItem('messageBookmarks') || '[]');
    isBookmarked.value = bookmarks.includes(props.messageId);
  } catch (error) {
    console.error('피드백/북마크 불러오기 실패:', error);
  }
});

const showButtons = computed(() => {
  return props.isBot && props.content.trim().length > 0;
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.content);
    copySuccess.value = true;
    console.log('📋 텍스트가 클립보드에 복사되었습니다!');
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('복사 실패:', err);
    // 폴백: 텍스트 선택 방식
    fallbackCopyTextToClipboard(props.content);
  }
};

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      copySuccess.value = true;
      console.log('📋 텍스트가 클립보드에 복사되었습니다! (폴백 방식)');
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    }
  } catch (err) {
    console.error('폴백 복사도 실패:', err);
  }
  
  document.body.removeChild(textArea);
};

const sendFeedback = (type: 'good' | 'bad') => {
  feedback.value = type;
  
  // 피드백 데이터를 localStorage에 저장
  try {
    const feedbackData = JSON.parse(localStorage.getItem('messageFeedback') || '{}');
    feedbackData[props.messageId || 'unknown'] = {
      type: type,
      timestamp: new Date().toISOString(),
      content: props.content.substring(0, 100) // 메시지 일부만 저장
    };
    localStorage.setItem('messageFeedback', JSON.stringify(feedbackData));
    console.log(`✅ 피드백 저장됨: ${type}`, props.messageId);
  } catch (error) {
    console.error('피드백 저장 실패:', error);
  }
  
  emit('feedback', type, props.messageId);
  
  // 사용자에게 피드백 감사 메시지 표시
  if (type === 'good') {
    console.log('👍 좋은 피드백을 주셔서 감사합니다!');
  } else {
    console.log('👎 피드백을 주셔서 감사합니다. 더 나은 답변을 위해 노력하겠습니다.');
  }
};

const regenerateAnswer = () => {
  emit('regenerate', props.messageId);
  console.log('답변 재생성 요청:', props.messageId);
};

const openArtifact = () => {
  emit('openArtifact', props.messageId);
  console.log('아티팩트 열기 요청:', props.messageId);
};

// 북마크 토글
const toggleBookmark = () => {
  try {
    const bookmarks = JSON.parse(localStorage.getItem('messageBookmarks') || '[]');
    const messageId = props.messageId || '';

    if (isBookmarked.value) {
      // 북마크 해제
      const index = bookmarks.indexOf(messageId);
      if (index > -1) {
        bookmarks.splice(index, 1);
      }
      isBookmarked.value = false;
      console.log('🔖 북마크 해제:', messageId);
    } else {
      // 북마크 추가
      if (!bookmarks.includes(messageId)) {
        bookmarks.push(messageId);
      }
      isBookmarked.value = true;
      console.log('🔖 북마크 추가:', messageId);
    }

    localStorage.setItem('messageBookmarks', JSON.stringify(bookmarks));
    emit('bookmark', messageId, isBookmarked.value);
  } catch (error) {
    console.error('북마크 저장 실패:', error);
  }
};

// 싫어요 피드백 - 상세 피드백 모달 열기
const handleBadFeedback = () => {
  sendFeedback('bad');
  // 상세 피드백 모달 열기 이벤트 발생
  emit('openDetailedFeedback', props.messageId);
};
</script>

<style scoped>
.feedback-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.feedback-buttons:hover {
  opacity: 1;
}

.feedback-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.feedback-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
}

.copy-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.good-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.good-btn.active {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.bad-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.bad-btn.active {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.regenerate-btn:hover {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.artifact-btn:hover {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.bookmark-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.bookmark-btn.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.feedback-btn svg {
  flex-shrink: 0;
}

/* 접근성: 포커스 스타일 */
.feedback-btn:focus {
  outline: none;
}

.feedback-btn:focus-visible {
  outline: 2px solid #02478A;
  outline-offset: 2px;
}

/* 다크모드 대응 */
@media (prefers-color-scheme: dark) {
  .feedback-btn {
    color: #9ca3af;
  }
  
  .feedback-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f3f4f6;
  }
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .feedback-buttons {
    gap: 6px;
  }
  
  .feedback-btn {
    width: 32px;
    height: 32px;
  }
}
</style>