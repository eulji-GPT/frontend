<template>
  <div>
    <div :class="['chat-input-box', className]">
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
      <div class="input-content">
        <div class="text-container">
          <div class="textarea-wrapper">
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
        </div>
        <div class="button-container">
          <div class="input-state-button" @click="triggerImageUpload" title="이미지 업로드">
            <img :src="InputStateButtonImport" alt="파일 업로드" class="button-icon" />
            <input 
              ref="imageInput" 
              type="file" 
              accept="image/*,.pdf" 
              @change="handleFileUpload" 
              style="display: none" 
              multiple
            />
          </div>
          <div 
            class="input-state-button-send" 
            @click="isStreaming ? onStop() : onSend()"
            :class="{ 'disabled': isLoading && !isStreaming, 'stop-button': isStreaming, 'can-send': canSend }"
            :title="isStreaming ? '답변 중지' : '메시지 전송'"
          >
            <div v-if="isStreaming" class="stop-icon">⏹</div>
            <img 
              v-else 
              :src="canSend ? InputStateButtonCanSend : InputStateButtonSend" 
              alt="메시지 전송" 
              class="button-icon" 
            />
          </div>
        </div>
      </div>
    </div>
    <div class="disclaimer-text">
      EULGPT도 실수할 수 있어요. EULGPT도 함께 배워 나갈게요.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import InputStateButtonImport from '../../assets/chat/InputStateButton_import.svg';
import InputStateButtonSend from '../../assets/chat/InputStateButton_send.svg';
import InputStateButtonCanSend from '../../assets/chat/InputStateButton_cansend.svg';

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
.chat-input-box {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 17px;
  border: solid 1px rgb(243, 244, 246);
  border-radius: 15px;
  align-self: stretch;
  width: 770px;
  background-color: rgb(248, 251, 255);
  box-sizing: border-box;
  padding: 16px 10px;
  flex-shrink: 0;
  position: relative;
}

.input-content {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.text-container {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 4px;
  box-sizing: border-box;
  padding: 0px 4px;
}

.textarea-wrapper {
  flex: 1;
  min-width: 0;
}

textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: left;
  resize: none;
  overflow-y: auto;
  max-height: 150px;
  box-sizing: border-box;
}

textarea:focus {
  color: black;
}

textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.input-state-button {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  border: 1px solid rgb(229, 231, 235);
  border-radius: 100px;
  padding: 6px;
  box-sizing: border-box;
}

.input-state-button-send {
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 100px;
  border: 1px solid rgb(229, 231, 235);
  background: rgb(229, 231, 235);
  cursor: pointer;
  padding: 6px;
  box-sizing: border-box;
}

.button-icon {
  width: 22px;
  height: 22px;
  object-fit: cover;
}

.input-state-button:hover {
  background-color: rgb(243, 244, 246);
}

.input-state-button-send:hover {
  background: rgb(209, 213, 219);
}

.input-state-button-send.can-send {
  border: 1px solid rgb(2, 71, 138);
  background: rgb(2, 71, 138);
}

.input-state-button-send.can-send:hover {
  background: rgb(1, 60, 116);
}

.input-state-button-send.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-state-button-send.stop-button {
  border: 1px solid var(--Black, #000);
  background: var(--Black, #000);
}

.input-state-button-send.stop-button:hover {
  background: #374151;
}

.stop-icon {
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disclaimer-text {
  width: 278px;
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
    padding: 0 16px;
    gap: 14px;
  }
  
  .frame-3 {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .chat-input-box {
    max-width: calc(100vw - 32px);
    width: calc(100vw - 32px);
    padding: 0 16px;
    border-radius: 12px;
  }
  
  .disclaimer-text {
    width: auto;
    max-width: 100%;
    margin: 12px auto;
    font-size: 9px;
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
    padding: 0 14px;
    gap: 12px;
    border-radius: 10px;
  }
  
  .input-state-button,
  .input-state-button-send {
    width: 30px;
    height: 30px;
  }
  
  .button-icon {
    width: 18px;
    height: 18px;
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
    padding: 0 12px;
  }
  
  .frame-3 {
    gap: 6px;
  }
  
  .input-state-button,
  .input-state-button-send {
    width: 28px;
    height: 28px;
  }
  
  .button-icon {
    width: 16px;
    height: 16px;
  }
}

</style>