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
          @keydown.enter.exact.prevent="onSend"
          @input="autoGrow"
          :disabled="isLoading"
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
            :src="InputStateButtonSend"
            alt="메시지 전송"
            class="button-icon send-icon"
          />
        </button>
      </div>
    </div>
    <div class="disclaimer-text">
      개인정보 처리방침 | Copyright ⓒ EULGPT. All Rights Reserved
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import InputStateButtonExpand from '../../assets/cc0acd97f17fd3260d7ac3a32e5ec4c9e1920795.svg';
import InputStateButtonSend from '../../assets/ca93ae547828bc0ceff64d80fb5daa58d62c8c7f.svg';

const props = defineProps<{
  isLoading: boolean;
  isStreaming: boolean;
  className?: string;
}>();

const emit = defineEmits<{
  (e: 'sendMessage', message: string, images?: File[]): void;
  (e: 'stopResponse'): void;
}>();

const inputValue = ref('');
const selectedImages = ref<Array<{ file: File; preview: string; type: 'image' | 'pdf' }>>([]);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);

// 전송 가능 상태 계산
const canSend = computed(() => {
  return (inputValue.value.trim().length > 0 || selectedImages.value.length > 0) && !props.isLoading && !props.isStreaming;
});

const autoGrow = () => {
  if (textareaRef.value) {
    // Temporarily shrink to get the correct scrollHeight
    textareaRef.value.style.height = '1px';
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

watch(inputValue, autoGrow);

onMounted(() => {
    // Initial grow check
    autoGrow();
});

const onSend = () => {
  if ((inputValue.value.trim() || selectedImages.value.length > 0) && !props.isLoading && !props.isStreaming) {
    const images = selectedImages.value.map(img => img.file);
    emit('sendMessage', inputValue.value, images.length > 0 ? images : undefined);
    inputValue.value = '';
    selectedImages.value = [];
    // Reset height after sending
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
      }
    });
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

/* Chat Input Box - Figma 디자인 정확히 매칭 */
.chat-input-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 17px;
  max-width: min(770px, 100%);
  width: 100%;
  background-color: #F8FBFF;
  border: 1px solid #F3F4F6;
  border-radius: 15px;
  padding: 16px 10px;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 로딩 중 입력창 스타일 */
.chat-input-box.loading {
  background-color: #f0f4f8;
  border-color: #02478A;
  box-shadow: 0 0 0 2px rgba(2, 71, 138, 0.1);
}

/* Placeholder Text Container */
.placeholder-text-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  max-width: 710px;
  width: 100%;
  padding: 0 4px;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* Textarea Styling */
textarea {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #9CA3AF;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 25px;
  resize: none;
  overflow-y: auto;
  max-height: 150px;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

textarea:focus {
  color: #000000;
  outline: none;
}

textarea::placeholder {
  color: #9CA3AF;
}

textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: rgba(156, 163, 175, 0.05);
}

/* Button Row - justify-between으로 양쪽 끝 배치 */
.button-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
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
  background-color: #F3F4F6;
}

.input-state-button:focus {
  outline: none;
  border: 1px solid #E5E7EB;
}

.input-state-button:active {
  background-color: #E5E7EB;
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
  background-color: #E5E7EB;
  border: 1px solid #E5E7EB;
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
  background-color: #D1D5DB;
}

.input-state-button-send:focus {
  outline: none;
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
  background-color: #02478A;
  border: 1px solid #02478A;
}

.input-state-button-send.can-send .send-icon {
  --fill-0: #FFFFFF;
}

.input-state-button-send.can-send:hover {
  background-color: #013C74;
}

.input-state-button-send.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-state-button-send.loading {
  background-color: #02478A;
  border: 1px solid #02478A;
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
  max-width: 450px;
  color: var(--Gray-300, #9CA3AF);
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin: 18px auto 18px auto;
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
  border: solid 1px rgb(240, 246, 255);
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


/* 반응형 설정 */
@media (max-width: 1024px) {
  .chat-input-box {
    max-width: 500px;
    width: 500px;
  }

  .placeholder-text-container {
    max-width: 460px;
  }
}

@media (max-width: 768px) {
  .chat-input-box {
    max-width: calc(100vw - 32px);
    width: calc(100vw - 32px);
    padding: 14px 10px;
    gap: 14px;
  }

  .placeholder-text-container {
    max-width: calc(100% - 8px);
  }

  .disclaimer-text {
    max-width: calc(100vw - 32px);
    margin: 12px auto;
    font-size: 9px;
    padding: 0 8px;
  }

  .file-preview {
    width: 90px;
    height: 90px;
  }
}

@media (max-width: 480px) {
  .chat-input-box {
    max-width: calc(100vw - 24px);
    width: calc(100vw - 24px);
    padding: 12px 8px;
    gap: 12px;
  }

  .placeholder-text-container {
    padding: 0 2px;
  }

  .input-state-button,
  .input-state-button-send {
    width: 30px;
    height: 30px;
    min-width: 30px;
    min-height: 30px;
    padding: 5px;
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
    line-height: 22px;
  }

  .file-preview {
    width: 80px;
    height: 80px;
  }

  .disclaimer-text {
    font-size: 8px;
    margin: 10px auto;
  }
}

@media (max-width: 320px) {
  .chat-input-box {
    max-width: calc(100vw - 16px);
    width: calc(100vw - 16px);
    padding: 10px 6px;
  }

  .input-state-button,
  .input-state-button-send {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
  }

  .button-icon {
    width: 10px;
    height: 10px;
  }

  .expand-icon {
    width: 10px;
    height: 10px;
  }

  .send-icon {
    width: 9px;
    height: 12px;
  }
}

</style>