<template>
  <div>
    <div :class="['chat-input-box', className]">
      <!-- 이미지 미리보기 -->
      <div v-if="selectedImages.length > 0" class="image-preview-container">
        <div 
          v-for="(image, index) in selectedImages" 
          :key="index" 
          class="image-preview"
        >
          <img :src="image.preview" :alt="`업로드된 이미지 ${index + 1}`" />
          <button @click="removeImage(index)" class="remove-image-btn">×</button>
        </div>
      </div>
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
      <div class="frame-3">
        <div class="input-state-button" @click="triggerImageUpload" title="이미지 업로드">
          <div class="vector-17"></div>
          <input 
            ref="imageInput" 
            type="file" 
            accept="image/*" 
            @change="handleImageUpload" 
            style="display: none" 
            multiple
          />
        </div>
        <div 
          class="input-state-button-18" 
          @click="isStreaming ? onStop() : onSend()"
          :class="{ 'disabled': isLoading && !isStreaming, 'stop-button': isStreaming }"
          :title="isStreaming ? '답변 중지' : '메시지 전송'"
        >
          <div v-if="isStreaming" class="stop-icon">⏹</div>
          <div v-else class="vector-19"></div>
        </div>
      </div>
    </div>
    <div class="disclaimer-text">
      EULGPT도 실수할 수 있어요. EULGPT도 함께 배워 나갈게요.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';

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
const selectedImages = ref<Array<{ file: File; preview: string }>>([]);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);

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

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  
  if (files) {
    Array.from(files).forEach(file => {
      // 파일 크기 체크 (20MB 제한)
      if (file.size > 20 * 1024 * 1024) {
        alert('이미지 파일 크기는 20MB를 초과할 수 없습니다.');
        return;
      }
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedImages.value.push({
          file: file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
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
  align-items: stretch;
  background-color: #f8fbff;
  border: 1px solid;
  border-color: #f3f4f6;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  overflow: hidden;
  padding: 0 20px;
  position: relative;
  max-width: 550px;
  width: 550px;
  box-sizing: border-box;
}

.textarea-wrapper {
  flex: 1;
  min-width: 0; /* Prevent overflow */
}

textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #222;
  font-family: Pretendard, var(--default-font-family);
  resize: none;
  overflow-y: auto; /* Allow scrollbar when needed */
  max-height: 150px; /* Set a max height */
  line-height: 25px;
  box-sizing: border-box; /* Better height calculation */
}

textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.frame-3 {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  position: relative;
  width: 100%;
}

.input-state-button {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f8fbff; /* Primary/100 */
  border-radius: 8px;
}

.input-state-button-18 {
  display: flex;
  width: 34px;
  height: 34px;
  padding: 6px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 100px;
  border: 1px solid var(--Gray-200, #E5E7EB);
  background: var(--Gray-600, #1F2937);
  cursor: pointer;
}

.input-state-button-18:hover {
  background: var(--Gray-700, #374151);
}

.input-state-button-18.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-state-button-18.stop-button {
  border-radius: 100px;
  border: 1px solid var(--Black, #000);
  background: var(--Black, #000);
}

.input-state-button-18.stop-button:hover {
  background: #374151;
}

.stop-icon {
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vector-17, .vector-19 {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1); /* 흰색으로 변경 */
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

.image-preview-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 8px 0;
}

.image-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dc2626;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.remove-image-btn:hover {
  background: #b91c1c;
}

.input-state-button {
  cursor: pointer;
  transition: background-color 0.2s;
}

.input-state-button:hover {
  background-color: #e5e7eb;
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
  
  .image-preview {
    width: 60px;
    height: 60px;
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
  .input-state-button-18 {
    width: 30px;
    height: 30px;
  }
  
  .vector-17, .vector-19 {
    width: 16px;
    height: 16px;
  }
  
  textarea {
    font-size: 14px;
    line-height: 22px;
  }
  
  .image-preview {
    width: 50px;
    height: 50px;
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
  .input-state-button-18 {
    width: 28px;
    height: 28px;
  }
  
  .vector-17, .vector-19 {
    width: 14px;
    height: 14px;
  }
}

</style>