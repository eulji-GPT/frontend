<!-- ChatApp.vue -->
<template>
  <div class="flex h-screen font-sans">
    <!-- 좌측 사이드바 -->
    <aside class="w-1/5 bg-white border-r p-4 flex flex-col justify-between">
      <!-- 로고 및 메뉴 -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl font-bold text-blue-800">EULGPT *</h1>
          <button class="text-gray-500 hover:text-black">
            <i class="fas fa-edit"></i>
          </button>
        </div>

        <!-- 메뉴 목록 -->
        <ul class="space-y-3 text-sm text-gray-700">
          <li>빈 강의실 확인</li>
          <li>도서관/열람실 자리 예약</li>
          <li>학식</li>
        </ul>

        <!-- 대화 리스트 -->
        <div class="mt-8">
          <h2 class="text-xs font-semibold text-gray-500 mb-2">대화 리스트</h2>
          <ul class="space-y-2">
            <li class="bg-gray-200 px-3 py-2 rounded cursor-pointer">입력된 대화를 작성해줘</li>
            <li class="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">입력된 대화</li>
            <li class="hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">입력된 대화</li>
          </ul>
        </div>
      </div>

      <!-- 하단 아이콘 -->
      <div class="flex items-center justify-between text-gray-400 text-sm">
        <span class="flex items-center space-x-2">
          <i class="fas fa-bell"></i>
          <i class="fas fa-info-circle"></i>
        </span>
        <span class="text-xs text-gray-400">ⓘ</span>
      </div>
    </aside>

    <!-- 우측 채팅창 -->
    <main class="w-4/5 bg-white flex flex-col justify-between">
      <!-- 채팅 출력 영역 -->
      <div class="flex-1 overflow-y-auto p-8">
        <!-- 대화 내용이 여기에 나타남 -->
      </div>

      <!-- 입력창 -->
      <div class="border-t bg-gray-50 p-4">
        <div class="flex items-center bg-white border rounded px-3 py-2">
          <input
            type="text"
            placeholder="무엇이든 물어보세요."
            class="flex-1 outline-none text-sm"
          />
          <button class="ml-3 text-gray-500 hover:text-black">
            <i class="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>

      <!-- 저작권 표시 -->
      <footer class="text-center text-gray-300 text-xs py-2">
        개인정보처리방침 | Copyright ⓒ EULGPT. All Rights Reserved
      </footer>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ChatApp',
};
</script>

<style scoped>
/* 아이콘용 폰트어썸 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
