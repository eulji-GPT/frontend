<template>
  <div class="chat-input-wrapper">
    <div :class="['chat-input-box', className, { 'loading': isLoading }]">
      <!-- 파일 미리보기 -->
      <div v-if="selectedImages.length > 0" class="file-preview-container">
        <div 
          v-for="(file, index) in selectedImages" 
          :key="index" 
          class="file-preview"
        >
          <img v-if="file.type === 'image'" :src="file.preview" :alt="`업로드된 이미지 ${index + 1}`" />
          <div v-else class="pdf-preview">
            <span class="pdf-icon">📄</span>
            <span class="pdf-name">{{ file.file.name }}</span>
          </div>
          <button @click="removeImage(index)" class="remove-file-btn">×</button>
        </div>
      </div>
      <!-- Placeholder Text -->
      <div class="placeholder-text-container">
        <textarea
          ref="textareaRef"
          placeholder="무엇이든 물어보세요."
          v-model="inputValue"
          @keydown="handleKeydown"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @blur="handleBlur"
          @input="autoGrow"
          :disabled="isLoading"
          :aria-label="isLoading ? 'AI 응답 생성 중' : '채팅 메시지 입력'"
          :aria-busy="isLoading"
          aria-multiline="true"
          rows="1"
        ></textarea>
      </div>

      <!-- Button Container -->
      <div class="button-row">
        <button
          class="input-state-button-send"
          @click="isStreaming ? onStop() : onSend()"
          :class="{ 'disabled': isLoading && !isStreaming, 'stop-button': isStreaming, 'can-send': canSend, 'loading': isLoading && !isStreaming }"
          :title="isStreaming ? '답변 중지' : isLoading ? 'AI 처리 중...' : '메시지 전송'"
        >
          <!-- 스트리밍 중단 아이콘 -->
          <div v-if="isStreaming" class="stop-icon">⏹</div>

          <!-- 로딩 중 스피너 -->
          <div v-else-if="isLoading" class="loading-spinner"></div>

          <!-- 일반 전송 아이콘 -->

          <img
            v-else
            :src="canSend ? InputWhiteButtonSend : InputStateButtonSend"
            alt="메시지 전송"
            class="button-icon send-icon"
          />
        </button>
      </div>
    </div>
    <div class="disclaimer-text">
      개인정보 처리방침 | Copyright ⓒ EULGPT. All Rights Reserved
      <span v-if="props.lastIndexedTime" class="last-indexed-text"> | 마지막 업데이트: {{ props.lastIndexedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import InputStateButtonExpand from '../../assets/cc0acd97f17fd3260d7ac3a32e5ec4c9e1920795.svg';
import InputStateButtonSend from '../../assets/ca93ae547828bc0ceff64d80fb5daa58d62c8c7f.svg';
import InputWhiteButtonSend from './icon/white_send.svg?url';

const props = defineProps<{
  isLoading: boolean;
  isStreaming: boolean;
  className?: string;
  lastIndexedTime?: string | null;
}>();

const emit = defineEmits<{
  (e: 'sendMessage', message: string, images?: File[]): void;
  (e: 'stopResponse'): void;
}>();

const inputValue = ref('');
const selectedImages = ref<Array<{ file: File; preview: string; type: 'image' | 'pdf' }>>([]);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);
const isComposing = ref(false);
const isSending = ref(false);

// 포커스 관리 - 외부에서 접근 가능하도록 expose
const focusInput = () => {
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
};

const blurInput = () => {
  if (textareaRef.value) {
    textareaRef.value.blur();
  }
};

// 컴포넌트 외부에서 접근 가능하도록 노출
defineExpose({
  focusInput,
  blurInput,
  textareaRef
});

// 전송 가능 상태 계산
const canSend = computed(() => {
  return (inputValue.value.trim().length > 0 || selectedImages.value.length > 0) && !props.isLoading && !props.isStreaming;
});

// 최대 5줄까지 자동 확장 (line-height 기반 계산)
const MAX_LINES = 5;
const getMaxHeight = () => {
  // 모바일 브레이크포인트에 따른 line-height 계산
  const width = window.innerWidth;
  if (width <= 480) return 20 * MAX_LINES; // 100px (소형 모바일)
  if (width <= 640) return 22 * MAX_LINES; // 110px (모바일)
  return 25 * MAX_LINES; // 125px (데스크톱/태블릿)
};

const autoGrow = () => {
  if (textareaRef.value) {
    const maxHeight = getMaxHeight();

    // 일시적으로 높이를 초기화하여 정확한 scrollHeight 측정
    textareaRef.value.style.height = 'auto';

    // 최대 높이 제한 적용
    const newHeight = Math.min(textareaRef.value.scrollHeight, maxHeight);
    textareaRef.value.style.height = `${newHeight}px`;

    // 최대 높이 초과 시 스크롤 활성화
    textareaRef.value.style.overflowY =
      textareaRef.value.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }
};

// Composition Event 핸들러 (한글 IME 조합 상태 추적)
const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
};

const handleBlur = () => {
  // 입력창이 focus를 잃으면 조합 상태 강제 리셋
  // ESC 키, 탭 전환 등으로 compositionend가 발생하지 않는 경우 대비
  isComposing.value = false;
};

// 키보드 이벤트 처리 (Shift+Enter: 줄바꿈, Enter: 전송)
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    // Shift+Enter 또는 모바일에서 줄바꿈 키: 줄바꿈 허용
    if (event.shiftKey) {
      return;
    }

    // 한글 IME 조합 중이면 전송하지 않음
    if (event.isComposing === true || isComposing.value) {
      return;
    }

    // Enter만 누르면 전송
    event.preventDefault();
    onSend();
  }
};

watch(inputValue, autoGrow);

onMounted(() => {
    // Initial grow check
    autoGrow();
});

const onSend = () => {
  // 재진입 방지: 이미 전송 중이면 무시
  if (isSending.value) {
    return;
  }

  // 전송 조건 체크 (플래그 설정 전에 먼저 검증)
  if (!(inputValue.value.trim() || selectedImages.value.length > 0)
      || props.isLoading || props.isStreaming) {
    return;
  }

  // 전송 플래그 설정 (조건 통과 후)
  isSending.value = true;

  try {
    const images = selectedImages.value.map(img => img.file);
    emit('sendMessage', inputValue.value, images.length > 0 ? images : undefined);
    inputValue.value = '';
    selectedImages.value = [];

    // Reset height after sending
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
      }
      // 전송 완료 후 플래그 해제
      isSending.value = false;
    });
  } catch (error) {
    // 예외 발생 시에도 플래그 해제
    isSending.value = false;
    throw error;
  }
};

const onStop = () => {
  emit('stopResponse');
};

const triggerImageUpload = () => {
  if (imageInput.value) {
    imageInput.value.click();
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files) {
    Array.from(files).forEach(file => {
      // 파일 크기 체크 (20MB 제한)
      if (file.size > 20 * 1024 * 1024) {
        alert('파일 크기는 20MB를 초과할 수 없습니다.');
        return;
      }
      
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
      
      if (fileType === 'image') {
        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          selectedImages.value.push({
            file: file,
            preview: e.target?.result as string,
            type: 'image'
          });
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // PDF 파일 처리
        selectedImages.value.push({
          file: file,
          preview: '', // PDF는 미리보기 이미지 없음
          type: 'pdf'
        });
      }
    });
  }
  
  // input 초기화
  target.value = '';
};

const removeImage = (index: number) => {
  selectedImages.value.splice(index, 1);
};
</script>

<style scoped>
/* Chat Input Wrapper - 반응형 컨테이너 */
.chat-input-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Chat Input Box - textarea와 버튼이 같은 줄에 배치 */
.chat-input-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: min(770px, 100%);
  width: 100%;
  background-color: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  border-radius: 15px;
  padding: 12px 16px;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 로딩 중 입력창 스타일 */
.chat-input-box.loading {
  background-color: var(--color-input-bg);
  border-color: var(--color-input-focus-border);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.1);
}

/* Placeholder Text Container */
.placeholder-text-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  padding: 0 4px;
  box-sizing: border-box;
}

/* Textarea Styling */
textarea {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-input-placeholder);
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 25px;
  resize: none;
  overflow-y: hidden; /* JavaScript에서 동적으로 제어 */
  max-height: 125px; /* 5줄 = 25px * 5 */
  min-height: 25px; /* 최소 1줄 */
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

textarea:focus {
  color: var(--color-input-text);
  outline: none;
}

textarea::placeholder {
  color: var(--color-input-placeholder);
}

textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: rgba(156, 163, 175, 0.05);
}

/* Button Row - 오른쪽에 전송 버튼만 배치 */
.button-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  position: relative;
}

/* Input State Button - Expand (+) 버튼 */
.input-state-button {
  width: 34px;
  height: 34px;
  min-width: 34px;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-input-border);
  border-radius: 100px;
  cursor: pointer;
  padding: 6px;
  margin: 0;
  box-sizing: border-box;
  flex-shrink: 0;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: background-color 0.2s;
}

.input-state-button:hover {
  background-color: var(--color-bg-secondary);
}

.input-state-button:focus {
  outline: none;
  border: 1px solid var(--color-input-border);
}

/* FR-031: 터치 피드백 */
.input-state-button:active {
  background-color: var(--color-bg-tertiary);
  transform: scale(0.95);
}

/* Send Button - 전송 버튼 */
.input-state-button-send {
  width: 34px;
  height: 34px;
  min-width: 34px;
  min-height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-input-border);
  border-radius: 100px;
  cursor: pointer;
  padding: 6px;
  margin: 0;
  box-sizing: border-box;
  flex-shrink: 0;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.2s;
}

.input-state-button-send:hover {
  background-color: var(--color-button-secondary-hover);
}

/* FR-031: 터치 피드백 */
.input-state-button-send:active {
  background-color: var(--color-text-tertiary);
  transform: scale(0.95);
}

.input-state-button-send:focus {
  outline: none;
}

/* FR-035: 키보드 포커스 표시 */
.input-state-button-send:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Button Icon */
.button-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  pointer-events: none;
  display: block;
}

/* Expand Icon (+ 버튼) - 검은색 */
.expand-icon {
  --stroke-0: #000000;
  width: 14px;
  height: 14px;
}

/* Send Icon (↑ 버튼) - 기본 회색 */
.send-icon {
  --fill-0: #9CA3AF;
  width: 13px;
  height: 16px;
}

/* Send Button States */
.input-state-button-send.can-send {
  background-color: #1F2937;
  border: 1px solid #1F2937;
}

.input-state-button-send.can-send .send-icon {
  --fill-0: #FFFFFF;
}

.input-state-button-send.can-send:hover {
  background-color: var(--color-button-primary-hover);
}

.input-state-button-send.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-state-button-send.loading {
  background-color: var(--color-button-primary-bg);
  border: 1px solid var(--color-button-primary-bg);
  cursor: wait;
  animation: pulse-button 1.5s ease-in-out infinite;
}

@keyframes pulse-button {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 로딩 스피너 스타일 */
.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.input-state-button-send.stop-button {
  background-color: #000000;
  border: 1px solid #000000;
}

.input-state-button-send.stop-button .send-icon {
  --fill-0: #FFFFFF;
}

.input-state-button-send.stop-button:hover {
  background-color: #374151;
}

.stop-icon {
  font-size: 14px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disclaimer-text {
  max-width: 600px;
  color: var(--color-text-tertiary);
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin: 18px auto 18px auto;
}

.last-indexed-text {
  color: var(--color-text-tertiary);
  opacity: 0.8;
}

.file-preview-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.file-preview {
  width: 110px;
  height: 110px;
  overflow: hidden;
  border: solid 1px var(--color-primary-light);
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  height: 100%;
}

.pdf-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.pdf-name {
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  color: #666;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.remove-file-btn {
  width: 23px;
  height: 23px;
  object-fit: cover;
  position: absolute;
  right: 8px;
  top: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-file-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}


/* ===========================================
   반응형 설정 (PRD Breakpoints)
   - Mobile: ~640px
   - Tablet: 641-1024px
   - Desktop: 1025px+
   =========================================== */

/* 태블릿 (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .chat-input-box {
    /* max-width: 500px; */
    width : 90%;
  }

  .placeholder-text-container {
    max-width: 460px;
  }
}

/* 모바일 (640px 이하) */
@media (max-width: 640px) {
  .chat-input-box {
    max-width: calc(100vw - 24px);
    width: calc(100vw - 24px);
    padding: 14px 10px;
    gap: 14px;
    border-radius: 12px;
  }

  .placeholder-text-container {
    max-width: calc(100% - 8px);
  }

  .disclaimer-text {
    max-width: calc(100vw - 24px);
    margin: 12px auto;
    font-size: 9px;
    padding: 0 8px;
  }

  .file-preview {
    width: 80px;
    height: 80px;
    border-radius: 12px;
  }

  textarea {
    font-size: 15px;
    line-height: 22px;
    max-height: 110px; /* 5줄 = 22px * 5 */
    min-height: 22px;
  }

  /* 터치 친화적 버튼 크기 (FR-029: 최소 44px) */
  .input-state-button,
  .input-state-button-send {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    padding: 10px;
  }

  .button-icon {
    width: 14px;
    height: 14px;
  }

  .send-icon {
    width: 13px;
    height: 16px;
  }
}

/* 초소형 모바일 (480px 이하) */
@media (max-width: 480px) {
  .chat-input-box {
    max-width: calc(100vw - 20px);
    width: calc(100vw - 20px);
    padding: 12px 8px;
    gap: 12px;
  }

  .placeholder-text-container {
    padding: 0 2px;
  }

  .input-state-button,
  .input-state-button-send {
    width: 38px;
    height: 38px;
    min-width: 38px;
    min-height: 38px;
    padding: 6px;
  }

  .button-icon {
    width: 12px;
    height: 12px;
  }

  .expand-icon {
    width: 12px;
    height: 12px;
  }

  .send-icon {
    width: 11px;
    height: 14px;
  }

  textarea {
    font-size: 14px;
    line-height: 20px;
    max-height: 100px; /* 5줄 = 20px * 5 */
    min-height: 20px;
  }

  .file-preview {
    width: 70px;
    height: 70px;
  }

  .disclaimer-text {
    font-size: 8px;
    margin: 10px auto;
  }
}

/* 극소형 모바일 (320px 이하) */
@media (max-width: 320px) {
  .chat-input-box {
    max-width: calc(100vw - 16px);
    width: calc(100vw - 16px);
    padding: 10px 6px;
  }

  /* FR-029: 초소형 모바일에서도 최소 44px 유지 */
  .input-state-button,
  .input-state-button-send {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
  }

  .button-icon {
    width: 12px;
    height: 12px;
  }

  .expand-icon {
    width: 12px;
    height: 12px;
  }

  .send-icon {
    width: 11px;
    height: 14px;
  }

  .file-preview {
    width: 60px;
    height: 60px;
  }
}

</style>