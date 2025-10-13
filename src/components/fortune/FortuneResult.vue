<template>
  <div class="fortune-result-container">
    <!-- 헤더 섹션 슬라이더 -->
    <div class="header-container">
      <div class="header-slider" :style="{ transform: `translateX(-${(currentPage - 1) * 50}%)` }">
        <!-- 1페이지: 기본 운세 헤더 -->
        <div class="header-content">
          <div class="result-header-section">
            <div class="result-content">
              <div class="date-badge">
                <span class="date-text">{{ currentDate }}</span>
              </div>
              <div class="result-main">
                <img 
                  :src="fortuneImage" 
                  :alt="fortuneTitle"
                  class="fortune-result-image"
                  @error="handleImageError"
                />
                <h2 class="fortune-title">{{ fortuneTitle }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- 2페이지: 공유용 헤더 -->
        <div class="header-content">
          <div class="result-header-section">
            <div class="share-card">
              <div class="share-card-content">
                <h3 class="share-title">{{ fortuneTitle }}</h3>
                <img
                  :src="fortuneImage"
                  :alt="fortuneTitle"
                  class="share-fortune-image"
                  @error="handleImageError"
                />
              </div>
              <div class="brand-section">
                <img :src="eulLogo" alt="EULGPT" class="brand-logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    <!-- 하단 콘텐츠 슬라이더 -->
    <div class="result-detail-section">
      <div class="content-container">
        <div class="content-slider" :style="{ transform: `translateX(-${(currentPage - 1) * 50}%)` }">
          <!-- 1페이지: 운세 설명 -->
          <div class="content-page">
            <div class="fortune-description">
              <p class="description-text" v-html="fortuneDescription"></p>
            </div>
          </div>

          <!-- 2페이지: 공유 버튼 -->
          <div class="content-page">
            <div class="action-buttons">
              <button class="save-button" @click="saveImage">
                <span class="button-text">저장하기</span>
              </button>
              <button class="share-button" @click="shareToSNS">
                <span class="button-text">SNS 공유</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 하단 고정 Pagination -->
  <div class="bottom-fixed-pagination">
    <div class="pagination-dots">
      <div class="pagination-icon" @click="goToPreviousPage">&lt;</div>
      <div class="page-number" :class="{ active: currentPage === 1 }" @click="goToPage(1)">1</div>
      <div class="page-number" :class="{ active: currentPage === 2 }" @click="goToPage(2)">2</div>
      <div class="pagination-icon" @click="goToNextPage">&gt;</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import eulLogo from '@/assets/eul_logo.svg';
import loveFortuneCard from '@/assets/fortune/사주카드_애정운.svg';
import successFortuneCard from '@/assets/fortune/사주카드_성공운.svg';
import moneyFortuneCard from '@/assets/fortune/사주카드_재물운 2.svg';

interface BirthdateData {
  name?: string;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  gender: 'male' | 'female';
  isLunar: boolean;
}

interface FortuneData {
  fortune: string | null;
  birthdate: BirthdateData | null;
  result?: string;
  title?: string;
  description?: string;
  error?: string;
}

const props = defineProps<{
  fortuneData: FortuneData | null;
}>();

const emit = defineEmits(['goBack', 'retry']);

const currentPage = ref(1);
const displayedText = ref('');
const isStreaming = ref(false);
const lastStreamedText = ref(''); // 마지막으로 스트리밍한 텍스트 추적
let streamingInterval: ReturnType<typeof setInterval> | null = null;

const goToPage = (page: number) => {
  if (page >= 1 && page <= 2) {
    currentPage.value = page;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < 2) {
    currentPage.value++;
  }
};

const saveImage = async () => {
  try {
    // 운세 카드 이미지 다운로드
    const response = await fetch(fortuneImage.value);
    const blob = await response.blob();

    // 파일명 생성 (날짜 + 운세 타입)
    const date = new Date().toISOString().split('T')[0];
    const fortuneType = props.fortuneData?.fortune || 'fortune';
    const filename = `운세카드_${fortuneType}_${date}.png`;
    
    // 다운로드 실행
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('이미지가 저장되었습니다.');
  } catch (error) {
    console.error('이미지 저장 중 오류가 발생했습니다:', error);
    alert('이미지 저장 중 오류가 발생했습니다.');
  }
};

const shareToSNS = async () => {
  try {
    // Web Share API 지원 확인
    if (navigator.share) {
      await navigator.share({
        title: '오늘의 운세',
        text: fortuneTitle.value,
        url: window.location.href
      });
      console.log('SNS 공유가 완료되었습니다.');
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      const shareText = `${fortuneTitle.value}\n\n오늘의 운세를 확인해보세요!\n${window.location.href}`;
      await navigator.clipboard.writeText(shareText);
      alert('공유 링크가 클립보드에 복사되었습니다!');
      console.log('클립보드에 복사되었습니다.');
    }
  } catch (error) {
    console.error('공유 중 오류가 발생했습니다:', error);
    // 대체 방법: 클립보드에 URL 복사
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('공유 링크가 클립보드에 복사되었습니다!');
    } catch (clipboardError) {
      console.error('클립보드 복사도 실패했습니다:', clipboardError);
      alert('공유 기능을 사용할 수 없습니다.');
    }
  }
};

const currentDate = computed(() => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[now.getDay()];
  
  return `${month}월 ${day}일 ${weekday}`;
});

const fortuneImage = computed(() => {
  if (!props.fortuneData) return loveFortuneCard;

  const images = {
    love: loveFortuneCard,
    success: successFortuneCard,
    money: moneyFortuneCard
  };
  return images[props.fortuneData.fortune as keyof typeof images] || images.love;
});

const fortuneTitle = computed(() => {
  console.log('[FortuneResult DEBUG] fortuneData:', props.fortuneData);

  if (!props.fortuneData) return '운세를 불러오는 중입니다...';

  // Error case
  if (props.fortuneData.error) {
    return '운세 조회 실패';
  }

  // Use title field if available
  if (props.fortuneData.title) {
    console.log('[FortuneResult DEBUG] Model generated title:', props.fortuneData.title);
    return props.fortuneData.title;
  }

  // Title is being generated or not available
  console.log('[FortuneResult DEBUG] Title is being generated');
  return '모델이 운세 예측중...';
});

// Text animation for streaming effect
const startStreaming = (text: string) => {
  // Skip if already streamed this text
  if (text === lastStreamedText.value) {
    console.log('[FortuneResult DEBUG] Same text - skipping streaming');
    return;
  }

  // Stop if already streaming
  if (streamingInterval) {
    clearInterval(streamingInterval);
    streamingInterval = null;
  }

  console.log('[FortuneResult DEBUG] Starting streaming:', text.substring(0, 50) + '...');
  lastStreamedText.value = text; // Save current text
  displayedText.value = '';
  isStreaming.value = true;

  let currentIndex = 0;
  const speed = 30; // Display speed per character (ms)

  streamingInterval = setInterval(() => {
    if (currentIndex < text.length) {
      displayedText.value += text[currentIndex];
      currentIndex++;
    } else {
      if (streamingInterval) {
        clearInterval(streamingInterval);
        streamingInterval = null;
      }
      isStreaming.value = false;
      console.log('[FortuneResult DEBUG] Streaming completed');
    }
  }, speed);
};

// fortuneData 변경 감지
watch(() => props.fortuneData?.description || props.fortuneData?.result, (newText) => {
  if (newText && !props.fortuneData?.error) {
    startStreaming(newText);
  }
}, { immediate: true });

const fortuneDescription = computed(() => {
  if (!props.fortuneData) return '운세를 불러오는 중입니다...';

  // Error case
  if (props.fortuneData.error) {
    console.log('[FortuneResult DEBUG] Error:', props.fortuneData.error);
    return props.fortuneData.error.replace(/\n/g, '<br/>');
  }

  // Use displayedText if streaming or completed
  if (displayedText.value) {
    return displayedText.value.replace(/\n/g, '<br/>');
  }

  console.log('[FortuneResult DEBUG] No data - loading');
  return '모델이 운세 예측중...';
});

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMyIiBoZWlnaHQ9IjM0OCIgdmlld0JveD0iMCAwIDIzMiAzNDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMzIiIGhlaWdodD0iMzQ4IiByeD0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI5MiIgeT0iMTUwIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yNCAzNkMzMS4xODMgMzYgMzcgMzAuMTgzIDM3IDIzQzM3IDE1LjgxNyAzMS4xODMgMTAgMjQgMTBDMTYuODE3IDEwIDExIDE1LjgxNyAxMSAyM0MxMSAzMC4xODMgMTYuODE3IDM2IDI0IDM2WiIgZmlsbD0iI0Q5RDlEOSIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjNjM2MzYzIi8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjAiIHI9IjIiIGZpbGw9IiM2MzYzNjMiLz4KPHBhdGggZD0iTTIwIDI4QzIwIDI4IDIyIDMwIDI0IDMwQzI2IDMwIDI4IDI4IDI4IDI4IiBzdHJva2U9IiM2MzYzNjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxMTYiIHk9IjIyMCIgZm9udC1mYW1pbHk9IlByZXRlbmRhcmQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0EzQUYiPuydtOuvuOyngDwvdGV4dD4KPC9zdmc+';
};

// 컴포넌트 unmount 시 interval 정리
onUnmounted(() => {
  if (streamingInterval) {
    clearInterval(streamingInterval);
    streamingInterval = null;
  }
});
</script>

<style scoped>
.fortune-result-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 532px;
  margin: 0 auto;
  padding: 20px;
}

.result-header-section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 303px;
  box-sizing: border-box;
}

.result-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.date-badge {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  border-radius: 20px;
  background-color: rgb(240, 246, 255);
  box-sizing: border-box;
  padding: 6px 20px;
}

.date-text {
  color: black;
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: left;
}

.result-main {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.fortune-result-image {
  width: 232px;
  height: 348px;
  object-fit: cover;
  border-radius: 12px;
}

.fortune-title {
  color: rgb(31, 41, 55);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  align-self: stretch;
  flex-shrink: 0;
  margin: 0;
}

.result-detail-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 0;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
  margin-top: 20px;
}

.fortune-description {
  overflow: hidden;
  background-color: rgb(240, 246, 255);
  border-radius: 20px;
  position: relative;
  align-self: stretch;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 30px 25px;
  box-sizing: border-box;
  min-height: 207px;
}

.description-text {
  color: rgb(31, 41, 55);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  margin: 0;
  width: 100%;
  max-width: 468px;
}

.pagination-dots {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
}

.pagination-icon {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  color: rgb(75, 85, 99);
  font-family: Pretendard, sans-serif;
  font-weight: 600;
}

.page-number {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  width: 35px;
  height: 35px;
  background-color: white;
  box-sizing: border-box;
  padding: 10px;
  color: rgb(75, 85, 99);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 110%;
  text-align: left;
  cursor: pointer;
}

.page-number.active {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 6px;
  width: 35px;
  height: 35px;
  background-color: white;
  box-sizing: border-box;
  padding: 10px;
  color: rgb(2, 71, 138);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 110%;
  text-align: left;
}

.share-save-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 55px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.share-card {
  display: flex;
  padding: 0;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  border-radius: 20px;
  background-color: transparent;
  box-sizing: border-box;
}

.share-card-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.share-title {
  color: rgb(31, 41, 55);
  text-overflow: ellipsis;
  font-size: 28px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  align-self: stretch;
  flex-shrink: 0;
  margin: 0;
}

.share-fortune-image {
  width: 232px;
  height: 348px;
  object-fit: cover;
  border-radius: 12px;
}

.brand-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.brand-logo {
  width: 131px;
  height: 46px;
  object-fit: contain;
}

.action-buttons {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.save-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 4px 10px 0px rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  width: 181px;
  height: 47px;
  background-color: rgb(240, 246, 255);
  box-sizing: border-box;
  padding: 13px 20px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.save-button:hover {
  background-color: rgb(226, 239, 254);
}

.save-button .button-text {
  color: rgb(2, 71, 138);
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.share-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 4px 10px 0px rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  width: 181px;
  height: 47px;
  background-color: rgb(2, 71, 138);
  box-sizing: border-box;
  padding: 13px 20px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.share-button:hover {
  background-color: rgb(1, 56, 110);
}

.share-button .button-text {
  color: white;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}


/* 헤더 슬라이더 스타일 */
.header-container {
  width: 100%;
  max-width: 532px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

.header-slider {
  display: flex;
  width: 200%;
  align-items: flex-start;
}

.header-content {
  width: 50%;
  min-width: 50%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.header-content:first-child {
  min-height: 490px;
}

.header-content:last-child {
  min-height: 490px;
}

.header-content .result-header-section {
  width: 100%;
  max-width: 303px;
}

/* 콘텐츠 슬라이더 스타일 */
.content-container {
  width: 100%;
  max-width: 532px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

.content-slider {
  display: flex;
  width: 200%;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.content-page {
  width: 50%;
  min-width: 50%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
}

/* Fixed bottom pagination */
.bottom-fixed-pagination {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-radius: 25px;
  border: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 1000;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .fortune-result-container {
    max-width: 100%;
    padding: 20px;
  }

  .result-header-section {
    width: 100%;
    max-width: 303px;
  }

  .fortune-result-image,
  .share-fortune-image {
    width: 200px;
    height: 300px;
  }

  .fortune-title {
    font-size: 20px;
  }

  .share-title {
    font-size: 24px;
  }

  .fortune-description {
    min-height: 180px;
    padding: 20px 15px;
  }

  .description-text {
    font-size: 13px;
    line-height: 21px;
  }
}

@media (max-width: 480px) {
  .fortune-result-image,
  .share-fortune-image {
    width: 180px;
    height: 270px;
  }

  .fortune-title {
    font-size: 18px;
  }

  .share-title {
    font-size: 22px;
  }

  .description-text {
    font-size: 12px;
    line-height: 20px;
  }

  .fortune-description {
    padding: 15px 12px;
  }
}
</style>