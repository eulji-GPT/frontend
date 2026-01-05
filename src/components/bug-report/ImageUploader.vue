<template>
  <div>
    <!-- File Input (Hidden) -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Upload Area -->
    <div
      v-if="!previewUrl"
      class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#02478A] transition cursor-pointer"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-[#02478A] bg-blue-50': isDragging }"
    >
      <div class="space-y-2">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="text-sm text-gray-600">
          <span class="font-semibold text-[#02478A]">클릭하여 파일 선택</span>
          또는 드래그 앤 드롭
        </div>
        <p class="text-xs text-gray-500">PNG, JPG, GIF (최대 5MB)</p>
      </div>
    </div>

    <!-- Preview -->
    <div v-else class="relative">
      <img
        :src="previewUrl"
        alt="Screenshot preview"
        class="w-full rounded-xl border border-gray-300 max-h-96 object-contain"
      />
      <button
        type="button"
        @click="removeFile"
        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="mt-2 text-sm text-gray-600">
        {{ fileName }} ({{ fileSizeFormatted }})
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
  (e: 'file-removed'): void
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>('');
const error = ref<string>('');
const isDragging = ref(false);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileName = computed(() => selectedFile.value?.name || '');
const fileSizeFormatted = computed(() => {
  if (!selectedFile.value) return '';
  const size = selectedFile.value.size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateFile = (file: File): boolean => {
  error.value = '';

  // 파일 크기 확인
  if (file.size > MAX_FILE_SIZE) {
    error.value = '이미지는 5MB 이하만 가능합니다.';
    return false;
  }

  // 파일 형식 확인
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    error.value = '이미지 파일만 업로드 가능합니다. (PNG, JPG, GIF)';
    return false;
  }

  return true;
};

const processFile = (file: File) => {
  if (!validateFile(file)) {
    return;
  }

  selectedFile.value = file;

  // 미리보기 URL 생성
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  emit('file-selected', file);
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    processFile(file);
  }
};

const removeFile = () => {
  selectedFile.value = null;
  previewUrl.value = '';
  error.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('file-removed');
};
</script>
