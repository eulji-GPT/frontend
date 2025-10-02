<template>
  <div class="fortune-main-container" :class="{ 'result-view': currentStep === 'result' }">
    <div v-if="currentStep !== 'result'" class="header-section">
      <h1 class="main-title">{{ headerTitle }}</h1>
      <div class="divider-section">
        <div class="divider-line"></div>
        <p class="subtitle">{{ headerSubtitle }}</p>
      </div>
    </div>

    <div v-if="currentStep !== 'result'" class="character-section">
      <div class="blur-effects">
        <div class="blur-circle-1"></div>
        <div class="blur-circle-2"></div>
      </div>
      <img 
        :src="isLoading ? '/src/assets/fortune-character_eye_off.svg' : '/src/assets/fortune-character.svg'" 
        alt="을랑이 캐릭터" 
        class="character-image"
        @error="handleImageError"
      />
    </div>

    <div class="fortune-content">
      <!-- 단계 1: 시작 화면 -->
      <div v-if="currentStep === 'start'" class="start-section">
        <div class="fortune-types">
          <img 
            src="/src/assets/fortune/love-fortune.svg" 
            alt="애정운" 
            class="fortune-card-image"
            @error="handleIconError"
          />
          
          <img 
            src="/src/assets/fortune/success-fortune.svg" 
            alt="성공운" 
            class="fortune-card-image"
            @error="handleIconError"
          />
          
          <img 
            src="/src/assets/fortune/money-fortune.svg" 
            alt="재물운" 
            class="fortune-card-image"
            @error="handleIconError"
          />
        </div>
        
        <button class="start-button" @click="showBirthdateModal">
          <div class="button-content">
            <span class="button-text">시작하기</span>
          </div>
        </button>
      </div>

      <!-- 단계 2: 카드 선택 화면 -->
      <div v-else-if="currentStep === 'card-selection'" class="card-selection-section">
        <div class="fortune-types mystical-cards">
          <div class="fortune-card-container" :class="{ 'selected': selectedFortune === 'love' }">
            <img 
              src="/src/assets/fortune/love-fortune.svg" 
              alt="애정운" 
              class="fortune-card-image mystical-card"
              :class="{ 'selected': selectedFortune === 'love' }"
              @click="selectFortune('love')"
              @error="handleIconError"
            />
            <div class="mystical-glow love-glow"></div>
            <div class="sparkles">
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
            </div>
          </div>
          
          <div class="fortune-card-container" :class="{ 'selected': selectedFortune === 'success' }">
            <img 
              src="/src/assets/fortune/success-fortune.svg" 
              alt="성공운" 
              class="fortune-card-image mystical-card"
              :class="{ 'selected': selectedFortune === 'success' }"
              @click="selectFortune('success')"
              @error="handleIconError"
            />
            <div class="mystical-glow success-glow"></div>
            <div class="sparkles">
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
            </div>
          </div>
          
          <div class="fortune-card-container" :class="{ 'selected': selectedFortune === 'money' }">
            <img 
              src="/src/assets/fortune/money-fortune.svg" 
              alt="재물운" 
              class="fortune-card-image mystical-card"
              :class="{ 'selected': selectedFortune === 'money' }"
              @click="selectFortune('money')"
              @error="handleIconError"
            />
            <div class="mystical-glow money-glow"></div>
            <div class="sparkles">
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
            </div>
          </div>
        </div>
        
        <button 
          v-if="selectedFortune"
          class="next-button"
          @click="showFortuneResult"
        >
          <div class="button-content">
            <span class="button-text">다음</span>
          </div>
        </button>
      </div>

      <!-- 단계 3: 운세 결과 화면 -->
      <div v-else-if="currentStep === 'result'" class="result-section">
        <FortuneResult
          :fortuneData="fortuneResultData"
          @goBack="goBackToSelection"
          @retry="retryFortune"
        />
      </div>

      <!-- 단계 4: 로딩 화면은 isLoading 상태로 처리됨 -->
      
    </div>

    <!-- 생년월일 입력 모달 -->
    <BirthdateModal
      :isVisible="showModal"
      @close="closeBirthdateModal"
      @submit="handleBirthdateSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BirthdateModal from './BirthdateModal.vue';
import FortuneResult from './FortuneResult.vue';
import { fortuneAPI } from '../../services/api';

interface BirthdateData {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  gender: 'male' | 'female';
  isLunar: boolean;
  name?: string;
}

interface FortuneData {
  fortune: string | null;
  birthdate: BirthdateData | null;
  result?: string;
  title?: string;
  description?: string;
  error?: string;
}

const emit = defineEmits(['showFortuneResult']);

const currentStep = ref<'start' | 'card-selection' | 'loading' | 'result'>('start');
const selectedFortune = ref<string | null>(null);
const isLoading = ref(false);
const showModal = ref(false);
const birthdateData = ref<BirthdateData | null>(null);
const fortuneResultData = ref<FortuneData | null>(null);

const headerTitle = computed(() => {
  return currentStep.value === 'card-selection' 
    ? '가장 궁금한 운세를 골라주세요' 
    : '오늘의 사주 ∙ 운세';
});

const headerSubtitle = computed(() => {
  return currentStep.value === 'card-selection'
    ? '행운의 을랑이가 문제별로 다른 메시지를 준비했어요.'
    : '행운의 을랑이와 함께 오늘의 운세를 점쳐보세요.';
});

const selectFortune = (type: string) => {
  selectedFortune.value = type;
};

const showBirthdateModal = () => {
  showModal.value = true;
};

const closeBirthdateModal = () => {
  showModal.value = false;
};

const handleBirthdateSubmit = (data: BirthdateData) => {
  birthdateData.value = data;
  showModal.value = false;
  currentStep.value = 'card-selection';
};

const formatBirthdate = (data: BirthdateData): string => {
  const year = data.year.toString();
  const month = data.month.toString().padStart(2, '0');
  const day = data.day.toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

const getTimeSlot = (hour?: number): string => {
  if (!hour) return '모름';

  const timeSlots = [
    { start: 23, end: 1, name: '자' },
    { start: 1, end: 3, name: '축' },
    { start: 3, end: 5, name: '인' },
    { start: 5, end: 7, name: '묘' },
    { start: 7, end: 9, name: '진' },
    { start: 9, end: 11, name: '사' },
    { start: 11, end: 13, name: '오' },
    { start: 13, end: 15, name: '미' },
    { start: 15, end: 17, name: '신' },
    { start: 17, end: 19, name: '유' },
    { start: 19, end: 21, name: '술' },
    { start: 21, end: 23, name: '해' },
  ];

  for (const slot of timeSlots) {
    if (slot.start === 23) {
      if (hour >= slot.start || hour < slot.end) return slot.name;
    } else {
      if (hour >= slot.start && hour < slot.end) return slot.name;
    }
  }

  return '모름';
};

const showFortuneResult = async () => {
  if (!selectedFortune.value || !birthdateData.value) return;

  isLoading.value = true;

  try {
    const fortuneTypeMap: { [key: string]: string } = {
      'love': 'love',
      'success': 'success',
      'money': 'wealth'
    };

    const requestData = {
      name: birthdateData.value.name || '사용자',
      birth_date: formatBirthdate(birthdateData.value),
      gender: birthdateData.value.gender === 'male' ? '남자' : '여자',
      birth_slot: getTimeSlot(birthdateData.value.hour),
      fortune_type: fortuneTypeMap[selectedFortune.value],
    };

    console.log('[운세 API 요청]', requestData);

    // 일반 API 호출 (스트리밍 제거)
    const endpoint = fortuneTypeMap[selectedFortune.value];
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'}/fortune/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error('운세 조회 실패');
    }

    const data = await response.json();
    console.log('[운세 API 응답]', data);

    // 운세 타입별 제목 매핑
    const titleMap: { [key: string]: string } = {
      'love': '오늘의 애정운',
      'success': '오늘의 성공운',
      'money': '오늘의 재물운'
    };

    // 결과 데이터 설정
    fortuneResultData.value = {
      fortune: selectedFortune.value,
      birthdate: birthdateData.value,
      title: data.title || titleMap[selectedFortune.value] || '오늘의 운세',
      description: data.description || data.result || '',
      result: data.result || data.description || '',
    };

    // 결과 화면으로 전환
    currentStep.value = 'result';
    isLoading.value = false;

  } catch (error) {
    console.error('운세 조회 실패:', error);
    fortuneResultData.value = {
      fortune: selectedFortune.value,
      birthdate: birthdateData.value,
      error: '운세 조회 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
    currentStep.value = 'result';
    isLoading.value = false;
  }
};

const goBackToSelection = () => {
  currentStep.value = 'card-selection';
};

const retryFortune = () => {
  selectedFortune.value = null;
  birthdateData.value = null;
  currentStep.value = 'start';
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg3IiBoZWlnaHQ9IjI1OSIgdmlld0JveD0iMCAwIDE4NyAyNTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODciIGhlaWdodD0iMjU5IiByeD0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI3MCIgeT0iMTAwIiB3aWR0aD0iNDciIGhlaWdodD0iNTkiIHZpZXdCb3g9IjAgMCA0NyA1OSIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMy41IDQ3QzMzLjE2NSA0NyA0MSAzOS4xNjUgNDEgMjkuNUM0MSAxOS44MzUgMzMuMTY1IDEyIDIzLjUgMTJDMTMuODM1IDEyIDYgMTkuODM1IDYgMjkuNUM2IDM5LjE2NSAxMy44MzUgNDcgMjMuNSA0NyIgZmlsbD0iI0Q5RDlEOSIvPgo8Y2lyY2xlIGN4PSIxOCIgY3k9IjI1IiByPSIyIiBmaWxsPSIjNjM2MzYzIi8+CjxjaXJjbGUgY3g9IjI5IiBjeT0iMjUiIHI9IjIiIGZpbGw9IiM2MzYzNjMiLz4KPHBhdGggZD0iTTE4IDM1QzE4IDM1IDIwLjUgMzggMjMuNSAzOEMyNi41IDM4IDI5IDM1IDI5IDM1IiBzdHJva2U9IiM2MzYzNjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo8dGV4dCB4PSI5MyIgeT0iMTM1IiBmb250LWZhbWlseT0iUHJldGVuZGFyZCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiI+7J2E66+47KeAPC90ZXh0Pgo8L3N2Zz4K';
};

const handleIconError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzUiIGN5PSIzNSIgcj0iMzUiIGZpbGw9IiNGRkY4RkYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0Nzg5RUUiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Ik0xMiAyYTMgMyAwIDAgMSAzIDN2NmEzIDMgMCAwIDEtNiAwVjVhMyAzIDAgMCAxIDMtMyI+PC9wYXRoPgo8cGF0aCBkPSJtMTIgMTggMy4wOS0uMDlBMS44NCAxLjg0IDAgMCAwIDE3IDE2VjlhNSA1IDAgMSAwLTEwIDB2N2ExLjg0IDEuODQgMCAwIDAgMS45MSAxLjkxTDEyIDE4eiI+PC9wYXRoPgo8L3N2Zz4KPC9zdmc+';
};
</script>

<style scoped>
.fortune-main-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: visible;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fortune-main-container.result-view {
  padding-top: 0;
  padding-bottom: 120px;
}

.header-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  width: 659px;
  height: 79px;
  margin-bottom: 55px;
}

.main-title {
  color: rgb(31, 41, 55);
  font-size: 32px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  margin: 0;
}

.divider-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.divider-line {
  width: 301px;
  height: 1px;
  background-color: rgb(156, 163, 175);
}

.subtitle {
  color: rgb(107, 114, 128);
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  text-align: left;
  margin: 0;
}

.character-section {
  position: relative;
  width: 400px;
  height: 320px;
  margin-bottom: 48px;
}

.blur-effects {
  position: absolute;
  width: 100%;
  height: 100%;
}

.blur-circle-1 {
  width: 200px;
  height: 200px;
  background-color: rgb(71, 137, 238);
  border-radius: 50%;
  position: absolute;
  left: 9px;
  top: 53px;
  opacity: 0.3;
  filter: blur(132.51px);
}

.blur-circle-2 {
  width: 143px;
  height: 142px;
  background-color: rgb(102, 92, 237);
  border-radius: 50%;
  position: absolute;
  left: 160px;
  top: 22px;
  opacity: 0.5;
  filter: blur(176.68px);
  transform: rotate(-3deg);
}

.character-image {
  width: 300px;
  height: 280px;
  object-fit: fill;
  object-position: center;
  position: absolute;
  left: 50px;
  top: -20px;
  z-index: 10;
}

.fortune-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  width: 532px;
}

.fortune-types {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 50px;
  width: 100%;
}

.fortune-card-image {
  width: 144px;
  height: 163px;
  object-fit: fill;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  border-radius: 0;
  background: transparent;
}

.fortune-card-image:hover {
  transform: translateY(-2px) scale(1.02);
  filter: brightness(1.1);
}

/* 신비한 애니메이션을 위한 카드 컨테이너 */
.fortune-card-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mystical-cards .fortune-card-container {
  animation: mysticalFloat 3s ease-in-out infinite;
}

.mystical-cards .fortune-card-container:nth-child(2) {
  animation-delay: -1s;
}

.mystical-cards .fortune-card-container:nth-child(3) {
  animation-delay: -2s;
}

/* 신비한 글로우 효과 */
.mystical-glow {
  position: absolute;
  width: 160px;
  height: 180px;
  border-radius: 15px;
  opacity: 0.6;
  filter: blur(20px);
  animation: mysticalPulse 2s ease-in-out infinite alternate;
  z-index: -1;
  top: -8px;
  left: -8px;
}

.love-glow {
  background: radial-gradient(circle, rgba(255, 105, 180, 0.4) 0%, rgba(255, 182, 193, 0.2) 50%, transparent 70%);
}

.success-glow {
  background: radial-gradient(circle, rgba(50, 205, 50, 0.4) 0%, rgba(144, 238, 144, 0.2) 50%, transparent 70%);
}

.money-glow {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 228, 181, 0.2) 50%, transparent 70%);
}

/* 반짝이는 스파클 효과 */
.sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, white, transparent);
  border-radius: 50%;
  animation: sparkleAnimation 2s linear infinite;
}

.sparkle-1 {
  top: 15%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 70%;
  right: 15%;
  animation-delay: 0.7s;
}

.sparkle-3 {
  top: 40%;
  left: 80%;
  animation-delay: 1.4s;
}

/* 키프레임 애니메이션 */
@keyframes mysticalFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes mysticalPulse {
  0% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  100% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes sparkleAnimation {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* 기존 카드 스타일 업데이트 */
.mystical-card {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.mystical-card:hover {
  transform: translateY(-5px) scale(1.03);
  filter: brightness(1.15) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}

.fortune-card-image.selected {
  transform: translateY(-8px) scale(1.08);
  filter: brightness(1.3) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4));
}

.fortune-card-container.selected .mystical-glow {
  opacity: 1;
  animation: selectedGlow 1.5s ease-in-out infinite alternate;
}

@keyframes selectedGlow {
  0% {
    opacity: 0.8;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.start-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  width: 222px;
  height: 50px;
  background-color: rgb(2, 71, 138);
  padding: 13px 60px;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-button:hover:not(:disabled) {
  background-color: rgb(1, 56, 110);
  transform: translateY(-1px);
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.3);
}

.start-button.disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.start-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.start-button:disabled:hover {
  background-color: #94a3b8;
  transform: none;
  box-shadow: none;
}

.button-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.button-text {
  color: rgb(248, 251, 255);
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: center;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 32px;
  font-family: Pretendard, sans-serif;
}

.card-selection-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.next-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  width: 222px;
  height: 50px;
  background-color: rgb(2, 71, 138);
  padding: 13px 60px;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
}

.next-button:hover {
  background-color: rgb(1, 56, 110);
  transform: translateY(-1px);
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.3);
}

.start-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.result-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .fortune-main-container {
    padding: 20px;
  }
  
  .header-section {
    width: 100%;
    max-width: 659px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .character-section {
    width: 280px;
    height: 230px;
    margin-bottom: 30px;
  }
  
  .character-image {
    width: 150px;
    height: 200px;
    left: 65px;
  }
  
  .fortune-content {
    width: 100%;
    max-width: 532px;
    gap: 30px;
  }
  
  .fortune-types {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .fortune-card-image {
    width: 120px;
    height: 140px;
  }
  
  .start-button {
    width: 200px;
    height: 45px;
    padding: 10px 50px;
  }
  
  .button-text {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .header-section {
    text-align: center;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .divider-line {
    width: 100%;
  }
  
  .fortune-types {
    flex-direction: column;
    gap: 15px;
  }
  
  .fortune-card-image {
    width: 140px;
    height: 150px;
  }
}
</style>