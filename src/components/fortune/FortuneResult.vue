<template>
  <div class="fortune-result-container">
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
    
    <div class="result-detail-section">
      <div class="fortune-description">
        <p class="description-text" v-html="fortuneDescription"></p>
      </div>
      <div class="pagination-dots">
        <div class="dot active"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface BirthdateData {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  gender: 'male' | 'female';
  isLunar: boolean;
}

interface FortuneData {
  fortune: string;
  birthdate: BirthdateData;
}

const props = defineProps<{
  fortuneData: FortuneData;
}>();

const emit = defineEmits(['goBack', 'retry']);

const currentDate = computed(() => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[now.getDay()];
  
  return `${month}월 ${day}일 ${weekday}`;
});

const fortuneImage = computed(() => {
  const images = {
    love: '/src/assets/fortune/사주카드_애정운.svg',
    success: '/src/assets/fortune/사주카드_성공운.svg', 
    money: '/src/assets/fortune/사주카드_재물운 2.svg'
  };
  return images[props.fortuneData.fortune as keyof typeof images] || images.love;
});

const fortuneTitle = computed(() => {
  const titles = {
    love: '새로운 인연이 다가오고 있어요.',
    success: '성공의 기회가 눈앞에 있어요.',
    money: '재물운이 상승하고 있어요.'
  };
  return titles[props.fortuneData.fortune as keyof typeof titles];
});

const fortuneDescription = computed(() => {
  const descriptions = {
    love: `오늘은 예상치 못한 설렘이 찾아올 수 있는 날입니다.<br/>
마음 한켠에 스며드는 새로운 이성의 시선이나 고백이 당신을 흔들 수 있습니다.<br/>
하지만 순간적인 매력에만 이끌려 지금 곁에 있는 소중한 사람의 가치를 놓칠 수 있으니,<br/>
조금 더 신중하게 마음을 들여다보세요.<br/>
<br/>
지금의 파트너야말로 당신에게 가장 잘 맞는 사람일 수 있습니다.<br/>
잠시의 설렘보다 오래 쌓아온 믿음과 진심이 더 큰 힘을 발휘한다는 걸 잊지 마세요.`,
    success: `오늘은 당신의 노력이 결실을 맺을 수 있는 특별한 날입니다.<br/>
그동안 준비해온 프로젝트나 계획이 성공으로 이어질 가능성이 높습니다.<br/>
주변 사람들의 조언에 귀를 기울이고, 겸손한 마음으로 임한다면<br/>
예상보다 훨씬 좋은 결과를 얻을 수 있을 것입니다.<br/>
<br/>
오늘 하루는 자신감을 가지고 적극적으로 행동해보세요.<br/>
당신의 진정성과 열정이 많은 사람들에게 인정받는 하루가 될 것입니다.`,
    money: `재물운이 상승하는 기운이 감지됩니다.<br/>
예상치 못한 수입이나 투자 기회가 찾아올 수 있는 날입니다.<br/>
하지만 욕심을 부리기보다는 신중하게 판단하여<br/>
안전하고 확실한 선택을 하는 것이 좋겠습니다.<br/>
<br/>
오늘은 절약보다는 필요한 곳에 합리적인 투자를 하는 것이<br/>
장기적으로 더 큰 이익을 가져다줄 것입니다.`
  };
  return descriptions[props.fortuneData.fortune as keyof typeof descriptions];
});

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMyIiBoZWlnaHQ9IjM0OCIgdmlld0JveD0iMCAwIDIzMiAzNDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMzIiIGhlaWdodD0iMzQ4IiByeD0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI5MiIgeT0iMTUwIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yNCAzNkMzMS4xODMgMzYgMzcgMzAuMTgzIDM3IDIzQzM3IDE1LjgxNyAzMS4xODMgMTAgMjQgMTBDMTYuODE3IDEwIDExIDE1LjgxNyAxMSAyM0MxMSAzMC4xODMgMTYuODE3IDM2IDI0IDM2WiIgZmlsbD0iI0Q5RDlEOSIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjNjM2MzYzIi8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjAiIHI9IjIiIGZpbGw9IiM2MzYzNjMiLz4KPHBhdGggZD0iTTIwIDI4QzIwIDI4IDIyIDMwIDI0IDMwQzI2IDMwIDI4IDI4IDI4IDI4IiBzdHJva2U9IiM2MzYzNjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxMTYiIHk9IjIyMCIgZm9udC1mYW1pbHk9IlByZXRlbmRhcmQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0EzQUYiPuydtOuvuOyngDwvdGV4dD4KPC9zdmc+';
};
</script>

<style scoped>
.fortune-result-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 30px;
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
  gap: 30px;
  width: 303px;
  box-sizing: border-box;
}

.result-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 35px;
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
  gap: 30px;
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
  gap: 45px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
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
  gap: 10px;
  box-sizing: border-box;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgb(229, 231, 235);
  border-radius: 50%;
}

.dot.active {
  background-color: rgb(2, 71, 138);
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
  
  .fortune-result-image {
    width: 200px;
    height: 300px;
  }
  
  .fortune-title {
    font-size: 20px;
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
  .fortune-result-image {
    width: 180px;
    height: 270px;
  }
  
  .fortune-title {
    font-size: 18px;
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