<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="logo-section">
            <span class="logo-text">EULGPT</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <div class="content-header">
          <h1 class="content-title">{{ modalTitle }}</h1>
          <p class="content-description">{{ modalDescription }}</p>
        </div>
        
        <div class="content-body">
          <pre class="terms-text">{{ termsContent }}</pre>
        </div>
      </div>

      <!-- Close Button -->
      <button class="close-button" @click="closeModal">
        <span class="close-text">닫기</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  isVisible: boolean;
  termsType: 'serviceTerms' | 'privacyConsent' | '';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const termsContent = ref('');
const modalTitle = ref('');
const modalDescription = ref('');

const closeModal = () => {
  emit('close');
};

const loadTermsContent = async (type: string) => {
  if (!type) return;

  let fileName = '';
  let title = '';
  let description = '';

  switch (type) {
    case 'serviceTerms':
      fileName = 'integrated_terms.txt';
      title = 'EULGPT 서비스 이용약관';
      description = '서비스 이용과 관련된 약관 내용입니다.';
      break;
    case 'privacyConsent':
      fileName = 'integrated_privacy_consent.txt';
      title = '개인정보 처리 및 데이터 활용 동의';
      description = '개인정보 처리 및 데이터 활용에 대한 동의 내용입니다.';
      break;
    default:
      return;
  }

  modalTitle.value = title;
  modalDescription.value = description;

  try {
    const response = await fetch(`/legal/${fileName}`);
    if (response.ok) {
      termsContent.value = await response.text();
    } else {
      termsContent.value = '약관 내용을 불러올 수 없습니다.';
    }
  } catch (error) {
    console.error('약관 로딩 오류:', error);
    termsContent.value = '약관 내용을 불러오는 중 오류가 발생했습니다.';
  }
};

// Watch for prop changes
watch(() => props.termsType, (newType) => {
  if (newType && props.isVisible) {
    loadTermsContent(newType);
  }
}, { immediate: true });

watch(() => props.isVisible, (newVisible) => {
  if (newVisible && props.termsType) {
    loadTermsContent(props.termsType);
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  max-height: 90vh;
  width: 90%;
  max-width: 1200px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 84px;
  background-color: white;
  padding: 10px 50px;
  border-bottom: 1px solid rgb(229, 231, 235);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 63px;
}

.logo-section {
  height: 45px;
  display: flex;
  align-items: center;
}

.logo-text {
  color: rgb(2, 71, 138);
  font-size: 30px;
  font-family: Poppins, sans-serif;
  font-weight: 700;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  padding: 40px 50px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
}

.content-title {
  color: black;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  margin: 0;
}

.content-description {
  color: rgb(156, 163, 175);
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 23px;
  margin: 0;
}

.content-body {
  flex: 1;
  overflow-y: auto;
}

.terms-text {
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  color: rgb(55, 65, 81);
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 20px;
  background-color: rgb(249, 250, 251);
  border-radius: 8px;
  border: 1px solid rgb(229, 231, 235);
}

.close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: rgb(2, 71, 138);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.close-button:hover {
  background-color: rgb(1, 60, 118);
}

.close-text {
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    min-height: 85vh;
    max-height: 95vh;
  }
  
  .modal-header {
    height: 60px;
    padding: 10px 20px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .content-title {
    font-size: 20px;
  }
  
  .content-description {
    font-size: 16px;
  }
  
  .terms-text {
    font-size: 13px;
    line-height: 20px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 98%;
    min-height: 90vh;
    max-height: 98vh;
  }
  
  .modal-header {
    height: 50px;
    padding: 10px 15px;
  }
  
  .logo-section {
    height: 35px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .modal-content {
    padding: 15px;
    gap: 15px;
  }
  
  .content-title {
    font-size: 18px;
  }
  
  .content-description {
    font-size: 14px;
  }
  
  .terms-text {
    font-size: 12px;
    line-height: 18px;
    padding: 12px;
  }
  
  .close-button {
    height: 50px;
  }
  
  .close-text {
    font-size: 16px;
  }
}
</style>