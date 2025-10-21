<template>
  <div class="feedback-buttons" v-if="showButtons">
    <button 
      class="feedback-btn copy-btn" 
      @click="copyToClipboard"
      :title="copySuccess ? '복사됨!' : '복사'"
    >
      <svg v-if="!copySuccess" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    </button>
    
    <button 
      class="feedback-btn good-btn" 
      @click="sendFeedback('good')"
      :class="{ active: feedback === 'good' }"
      title="좋아요"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
    </button>
    
    <button 
      class="feedback-btn bad-btn" 
      @click="sendFeedback('bad')"
      :class="{ active: feedback === 'bad' }"
      title="싫어요"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
      </svg>
    </button>
    
    <button 
      class="feedback-btn regenerate-btn" 
      @click="regenerateAnswer"
      title="다시 생성"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23,4 23,10 17,10"></polyline>
        <polyline points="1,20 1,14 7,14"></polyline>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
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
}>();

const emit = defineEmits(['feedback', 'regenerate']);

const feedback = ref<'good' | 'bad' | null>(null);
const copySuccess = ref(false);

// 컴포넌트 로드 시 기존 피드백 불러오기
onMounted(() => {
  try {
    const feedbackData = JSON.parse(localStorage.getItem('messageFeedback') || '{}');
    const existingFeedback = feedbackData[props.messageId || ''];
    if (existingFeedback) {
      feedback.value = existingFeedback.type;
    }
  } catch (error) {
    console.error('피드백 불러오기 실패:', error);
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

.feedback-btn svg {
  flex-shrink: 0;
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