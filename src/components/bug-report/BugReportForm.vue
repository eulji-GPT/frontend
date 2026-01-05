<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <div>
      <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
        버그 제목 <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        required
        minlength="5"
        maxlength="100"
        placeholder="예: 채팅 응답이 중간에 멈춤"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#02478A] focus:border-transparent transition"
        :class="{ 'border-red-500': errors.title }"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
    </div>

    <!-- Category -->
    <div>
      <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">
        버그 카테고리 <span class="text-red-500">*</span>
      </label>
      <select
        id="category"
        v-model="formData.category"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#02478A] focus:border-transparent transition"
        :class="{ 'border-red-500': errors.category }"
      >
        <option value="" disabled>카테고리를 선택하세요</option>
        <option value="ui">UI 버그 (디자인, 레이아웃)</option>
        <option value="function">기능 버그 (동작 오류)</option>
        <option value="performance">성능 이슈 (느림, 멈춤)</option>
      </select>
      <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
        버그 설명 <span class="text-red-500">*</span>
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        required
        minlength="10"
        maxlength="2000"
        rows="5"
        placeholder="버그가 어떻게 발생했는지 자세히 설명해주세요"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#02478A] focus:border-transparent transition resize-none"
        :class="{ 'border-red-500': errors.description }"
      />
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
      <p class="mt-1 text-sm text-gray-500">{{ formData.description.length }} / 2000자</p>
    </div>

    <!-- Reproduction Steps -->
    <div>
      <label for="reproduction_steps" class="block text-sm font-semibold text-gray-700 mb-2">
        재현 단계 <span class="text-red-500">*</span>
      </label>
      <textarea
        id="reproduction_steps"
        v-model="formData.reproduction_steps"
        required
        minlength="10"
        maxlength="1000"
        rows="4"
        placeholder="1. 로그인 후 채팅 페이지 접속&#10;2. 긴 질문 입력&#10;3. 응답 중간에 멈춤"
        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#02478A] focus:border-transparent transition resize-none"
        :class="{ 'border-red-500': errors.reproduction_steps }"
      />
      <p v-if="errors.reproduction_steps" class="mt-1 text-sm text-red-600">{{ errors.reproduction_steps }}</p>
      <p class="mt-1 text-sm text-gray-500">{{ formData.reproduction_steps.length }} / 1000자</p>
    </div>

    <!-- Screenshot Upload -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        스크린샷 (선택)
      </label>
      <ImageUploader
        @file-selected="handleFileSelected"
        @file-removed="handleFileRemoved"
      />
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end space-x-4">
      <button
        type="button"
        @click="resetForm"
        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
      >
        초기화
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-8 py-3 bg-[#02478A] text-white rounded-xl hover:bg-[#033a6f] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? '제출 중...' : '제보하기' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import ImageUploader from './ImageUploader.vue';
import { bugReportAPI } from '@/services/api';

const emit = defineEmits<{
  (e: 'submit-success', message: string): void
}>();

interface BugReportFormData {
  title: string;
  description: string;
  reproduction_steps: string;
  category: string;
}

const formData = reactive<BugReportFormData>({
  title: '',
  description: '',
  reproduction_steps: '',
  category: '',
});

const selectedFile = ref<File | null>(null);
const isSubmitting = ref(false);
const errors = reactive({
  title: '',
  description: '',
  reproduction_steps: '',
  category: '',
});

const handleFileSelected = (file: File) => {
  selectedFile.value = file;
};

const handleFileRemoved = () => {
  selectedFile.value = null;
};

const validateForm = (): boolean => {
  // Reset errors
  errors.title = '';
  errors.description = '';
  errors.reproduction_steps = '';
  errors.category = '';

  let isValid = true;

  if (formData.title.trim().length < 5) {
    errors.title = '제목은 최소 5자 이상이어야 합니다.';
    isValid = false;
  }

  if (formData.description.trim().length < 10) {
    errors.description = '설명은 최소 10자 이상이어야 합니다.';
    isValid = false;
  }

  if (formData.reproduction_steps.trim().length < 10) {
    errors.reproduction_steps = '재현 단계는 최소 10자 이상이어야 합니다.';
    isValid = false;
  }

  if (!formData.category) {
    errors.category = '카테고리를 선택해주세요.';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // FormData 생성 (multipart/form-data)
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('reproduction_steps', formData.reproduction_steps);
    formDataToSend.append('category', formData.category);

    if (selectedFile.value) {
      formDataToSend.append('screenshot', selectedFile.value);
    }

    // API 호출
    const response = await bugReportAPI.createBugReport(formDataToSend);

    // 성공
    emit('submit-success', response.message);
    resetForm();
  } catch (error: any) {
    console.error('Bug report submission error:', error);
    const errorMessage = error.response?.data?.detail || '제출 실패. 다시 시도해주세요.';
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.title = '';
  formData.description = '';
  formData.reproduction_steps = '';
  formData.category = '';
  selectedFile.value = null;
};
</script>
