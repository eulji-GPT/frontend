<template>
  <div class="fortune-main-container">
    <div class="header-section">
      <h1 class="main-title">오늘의 사주 ∙ 운세</h1>
      <div class="divider-section">
        <div class="divider-line"></div>
        <p class="subtitle">행운의 을랑이와 함께 오늘의 운세를 점쳐보세요.</p>
      </div>
    </div>

    <div class="character-section">
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
        <button class="start-button" @click="showBirthdateModal">
          <div class="button-content">
            <span class="button-text">시작하기</span>
          </div>
        </button>
      </div>

      <!-- 단계 2: 카드 선택 화면 -->
      <div v-else-if="currentStep === 'card-selection'" class="card-selection-section">
        <h3 class="section-title">어떤 운세를 보고 싶으신가요?</h3>
        <div class="fortune-types">
          <img 
            src="/src/assets/icons/love-fortune.svg" 
            alt="애정운" 
            class="fortune-card-image"
            :class="{ 'selected': selectedFortune === 'love' }"
            @click="selectFortune('love')"
            @error="handleIconError"
          />
          
          <img 
            src="/src/assets/icons/success-fortune.svg" 
            alt="성공운" 
            class="fortune-card-image"
            :class="{ 'selected': selectedFortune === 'success' }"
            @click="selectFortune('success')"
            @error="handleIconError"
          />
          
          <img 
            src="/src/assets/icons/money-fortune.svg" 
            alt="재물운" 
            class="fortune-card-image"
            :class="{ 'selected': selectedFortune === 'money' }"
            @click="selectFortune('money')"
            @error="handleIconError"
          />
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

      <!-- 단계 3: 로딩 화면은 isLoading 상태로 처리됨 -->
      
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
import { ref } from 'vue';
import BirthdateModal from './BirthdateModal.vue';

interface BirthdateData {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  gender: 'male' | 'female';
  isLunar: boolean;
}

const emit = defineEmits(['showFortuneResult']);

const currentStep = ref<'start' | 'card-selection' | 'loading' | 'result'>('start');
const selectedFortune = ref<string | null>(null);
const isLoading = ref(false);
const showModal = ref(false);
const birthdateData = ref<BirthdateData | null>(null);

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

const showFortuneResult = () => {
  if (selectedFortune.value && birthdateData.value) {
    isLoading.value = true;
    
    // 2-3초 후에 운세 결과 화면으로 이동
    setTimeout(() => {
      isLoading.value = false;
      emit('showFortuneResult', {
        fortune: selectedFortune.value,
        birthdate: birthdateData.value
      });
    }, 3000);
  }
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

.fortune-card-image.selected {
  transform: translateY(-3px) scale(1.05);
  filter: brightness(1.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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
  justify-content: center;
  align-items: center;
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