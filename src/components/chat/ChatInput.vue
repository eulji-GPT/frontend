<template>
  <div>
    <div :class="['common-chatinputbox', className]">
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
        <div class="input-state-button"><div class="vector-17"></div></div>
        <div 
          class="input-state-button-18" 
          @click="onSend"
          :class="{ 'disabled': isLoading }"
        >
          <div class="vector-19"></div>
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
  className?: string;
}>();

const emit = defineEmits<{
  (e: 'sendMessage', message: string): void;
}>();

const inputValue = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

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
  if (inputValue.value.trim() && !props.isLoading) {
    emit('sendMessage', inputValue.value);
    inputValue.value = '';
    // Reset height after sending
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
      }
    });
  }
};
</script>

<style scoped>
.common-chatinputbox {
  align-items: stretch;
  background-color: #f8fbff; /* Assuming --primary-100 is this */
  border: 1px solid;
  border-color: #f3f4f6; /* Assuming --gray-100 is this */
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  overflow: hidden;
  padding: 16px 10px;
  position: relative;
  width: 770px;
  min-width: 0;
  flex-shrink: 0; /* Prevent shrinking */
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

.vector-17, .vector-19 {
  width: 20px;
  height: 20px;
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

</style>