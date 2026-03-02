<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-3">버그 제보</h1>
        <p class="text-gray-600 text-lg">
          발견하신 버그를 알려주세요. 더 나은 서비스를 만들겠습니다.
        </p>
      </div>

      <!-- Bug Report Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <BugReportForm @submit-success="handleSubmitSuccess" />
      </div>

      <!-- Info Box -->
      <div class="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 class="font-semibold text-blue-900 mb-2">📝 제보 시 유의사항</h3>
        <ul class="text-blue-800 text-sm space-y-1">
          <li>• 버그를 최대한 상세히 설명해주세요</li>
          <li>• 재현 단계를 구체적으로 작성하면 빠르게 해결할 수 있습니다</li>
          <li>• 스크린샷이 있으면 문제 파악에 큰 도움이 됩니다</li>
        </ul>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification
      :message="toastMessage"
      :show="showToast"
      @hide="showToast = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BugReportForm from '@/components/bug-report/BugReportForm.vue';
import ToastNotification from '@/components/common/ToastNotification.vue';

const router = useRouter();
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error' | 'info'>('success');

const handleSubmitSuccess = (message: string) => {
  toastMessage.value = message;
  toastType.value = 'success';
  showToast.value = true;

  // 3초 후 토스트 자동 닫기
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};
</script>

<style scoped>
/* 애니메이션 추가 (선택) */
.bg-gradient-to-br {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
