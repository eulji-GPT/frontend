<template>
  <div class="fortune-result-container">
    <div class="result-header">
      <button class="back-button" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m12 19-7-7 7-7"/>
          <path d="m19 12-7 7-7-7"/>
        </svg>
      </button>
      <h1 class="result-title">{{ fortuneTypeNames[fortuneData.fortune] }} 운세 결과</h1>
    </div>

    <div class="user-info-section">
      <div class="user-info-card">
        <h3 class="info-title">사주 정보</h3>
        <div class="info-details">
          <div class="info-item">
            <span class="info-label">생년월일:</span>
            <span class="info-value">
              {{ birthdateData.year }}년 {{ birthdateData.month }}월 {{ birthdateData.day }}일
              {{ birthdateData.isLunar ? '(음력)' : '(양력)' }}
            </span>
          </div>
          <div v-if="birthdateData.hour !== undefined" class="info-item">
            <span class="info-label">출생시간:</span>
            <span class="info-value">
              {{ String(birthdateData.hour).padStart(2, '0') }}:{{ String(birthdateData.minute || 0).padStart(2, '0') }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">성별:</span>
            <span class="info-value">{{ birthdateData.gender === 'male' ? '남성' : '여성' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="fortune-result-section">
      <div class="fortune-card-large">
        <div class="card-header">
          <img 
            :src="`/src/assets/icons/${fortuneData.fortune}-fortune.svg`" 
            :alt="fortuneTypeNames[fortuneData.fortune]" 
            class="fortune-icon-large"
            @error="handleIconError"
          />
          <h2 class="fortune-type-title">{{ fortuneTypeNames[fortuneData.fortune] }}운</h2>
        </div>
        
        <div class="fortune-content">
          <div class="fortune-score">
            <div class="score-circle">
              <div class="score-number">{{ fortuneScore }}</div>
              <div class="score-label">점</div>
            </div>
            <div class="score-description">{{ getScoreDescription(fortuneScore) }}</div>
          </div>

          <div class="fortune-details">
            <h4 class="details-title">오늘의 {{ fortuneTypeNames[fortuneData.fortune] }}운</h4>
            <p class="fortune-text">{{ fortuneText }}</p>
          </div>

          <div class="fortune-advice">
            <h4 class="advice-title">💡 조언</h4>
            <p class="advice-text">{{ fortuneAdvice }}</p>
          </div>

          <div class="lucky-items">
            <h4 class="lucky-title">🍀 행운 아이템</h4>
            <div class="lucky-list">
              <span v-for="item in luckyItems" :key="item" class="lucky-item">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="share-button" @click="shareResult">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16,6 12,2 8,6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        공유하기
      </button>
      <button class="retry-button" @click="retryFortune">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M3 21v-5h5"/>
        </svg>
        다시 보기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

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

const fortuneTypeNames: Record<string, string> = {
  love: '애정',
  success: '성공',
  money: '재물'
};

const birthdateData = computed(() => props.fortuneData.birthdate);
const fortuneScore = ref(0);
const fortuneText = ref('');
const fortuneAdvice = ref('');
const luckyItems = ref<string[]>([]);

const generateFortuneResult = () => {
  const fortunes = {
    love: {
      scores: [72, 85, 91, 67, 88],
      texts: [
        "오늘은 특별한 인연을 만날 수 있는 날입니다. 새로운 만남에 열린 마음을 가져보세요. 기존 연인과는 깊은 대화를 나누며 서로를 더욱 이해할 수 있는 시간이 될 것입니다.",
        "사랑하는 사람과의 관계에서 작은 갈등이 있을 수 있지만, 진솔한 대화로 해결될 것입니다. 상대방의 입장을 이해하려 노력하면 더욱 단단한 사랑을 키울 수 있어요.",
        "연애운이 최고조에 달한 날입니다! 고백이나 프러포즈를 계획하고 있다면 오늘이 절호의 기회. 솔로라면 운명적인 만남이 기다리고 있을지도 모릅니다."
      ],
      advices: [
        "상대방에게 감사한 마음을 표현해보세요. 작은 선물이나 메시지가 큰 감동을 줄 수 있습니다.",
        "혼자만의 시간도 소중히 여기세요. 자신을 사랑하는 사람이 진정한 사랑을 받을 수 있습니다.",
        "과거의 상처에 얽매이지 말고 새로운 시작을 위한 마음의 준비를 하세요."
      ],
      luckyItems: [
        ['핑크색 액세서리', '장미', '하트 모양 소품'],
        ['향수', '편지', '달콤한 디저트'],
        ['빨간색 옷', '커플링', '로맨틱한 음악']
      ]
    },
    success: {
      scores: [79, 92, 84, 76, 89],
      texts: [
        "새로운 프로젝트나 도전에 대한 기회가 찾아올 것입니다. 평소 관심 있던 분야에 과감히 도전해보세요. 당신의 열정과 노력이 좋은 결과로 이어질 것입니다.",
        "직장에서 인정받을 수 있는 일이 생길 것입니다. 팀워크를 중시하고 동료들과의 협력을 통해 더 큰 성취를 이룰 수 있어요.",
        "창의적인 아이디어가 샘솟는 날입니다. 평소 생각해둔 계획을 실행에 옮기기 좋은 시기입니다. 주변의 조언도 적극적으로 들어보세요."
      ],
      advices: [
        "목표를 구체적으로 설정하고 단계별 계획을 세워보세요. 작은 성취들이 모여 큰 성공이 됩니다.",
        "새로운 기술이나 지식을 배우는 것을 두려워하지 마세요. 끊임없는 자기계발이 성공의 열쇠입니다.",
        "실패를 두려워하지 말고 과감히 도전하세요. 실패 또한 성공으로 가는 소중한 경험입니다."
      ],
      luckyItems: [
        ['금색 펜', '명함', '비즈니스 서적'],
        ['파란색 넥타이', '노트북', '플래너'],
        ['식물', '성공 관련 책', '메모장']
      ]
    },
    money: {
      scores: [81, 74, 88, 93, 86],
      texts: [
        "금전 관리에 신중을 기하는 것이 좋습니다. 계획적인 소비와 저축으로 안정적인 재정 상태를 유지할 수 있어요. 투자보다는 보존에 집중하세요.",
        "의외의 수입이나 보너스가 생길 가능성이 높습니다. 하지만 갑작스런 큰 지출도 예상되니 미리 대비해두세요.",
        "재물운이 매우 좋은 날입니다! 투자나 사업 기회가 찾아올 수 있어요. 하지만 신중한 검토 후 결정하는 것이 중요합니다."
      ],
      advices: [
        "가계부를 작성하며 지출 내역을 체크해보세요. 불필요한 지출을 줄이면 저축액을 늘릴 수 있습니다.",
        "재테크에 대한 공부를 시작해보세요. 올바른 지식이 재물 증식의 첫걸음입니다.",
        "돈만큼 중요한 것은 건강과 인간관계입니다. 균형있는 삶을 위해 노력하세요."
      ],
      luckyItems: [
        ['금색 지갑', '동전', '황금색 액세서리'],
        ['초록색 식물', '저축통', '재테크 서적'],
        ['보석', '골드바', '럭키 코인']
      ]
    }
  };

  const fortuneType = props.fortuneData.fortune as keyof typeof fortunes;
  const fortuneData = fortunes[fortuneType];
  
  const randomIndex = Math.floor(Math.random() * fortuneData.scores.length);
  
  fortuneScore.value = fortuneData.scores[randomIndex];
  fortuneText.value = fortuneData.texts[randomIndex];
  fortuneAdvice.value = fortuneData.advices[randomIndex];
  luckyItems.value = fortuneData.luckyItems[randomIndex];
};

const getScoreDescription = (score: number): string => {
  if (score >= 90) return '매우 좋음';
  if (score >= 80) return '좋음';
  if (score >= 70) return '보통';
  if (score >= 60) return '주의';
  return '나쁨';
};

const goBack = () => {
  emit('goBack');
};

const shareResult = () => {
  const text = `오늘의 ${fortuneTypeNames[props.fortuneData.fortune]}운: ${fortuneScore.value}점\n${fortuneText.value}`;
  if (navigator.share) {
    navigator.share({
      title: '을GPT 운세 결과',
      text: text
    });
  } else {
    navigator.clipboard.writeText(text);
    alert('결과가 클립보드에 복사되었습니다!');
  }
};

const retryFortune = () => {
  emit('retry');
};

const handleIconError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzUiIGN5PSIzNSIgcj0iMzUiIGZpbGw9IiNGRkY4RkYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0Nzg5RUUiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Ik0xMiAyYTMgMyAwIDAgMSAzIDN2NmEzIDMgMCAwIDEtNiAwVjVhMyAzIDAgMCAxIDMtMyI+PC9wYXRoPgo8cGF0aCBkPSJtMTIgMTggMy4wOS0uMDlBMS44NCAxLjg0IDAgMCAwIDE3IDE2VjlhNSA1IDAgMSAwLTEwIDB2N2ExLjg0IDEuODQgMCAwIDAgMS45MSAxLjkxTDEyIDE4eiI+PC9wYXRoPgo8L3N2Zz4KPC9zdmc+';
};

onMounted(() => {
  generateFortuneResult();
});
</script>

<style scoped>
.fortune-result-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  box-sizing: border-box;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.back-button {
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #e5e7eb;
  transform: translateX(-2px);
}

.result-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-family: Pretendard, sans-serif;
}

.user-info-section {
  max-width: 800px;
  margin: 0 auto 32px auto;
}

.user-info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  font-family: Pretendard, sans-serif;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  gap: 12px;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  min-width: 80px;
}

.info-value {
  color: #1f2937;
}

.fortune-result-section {
  max-width: 800px;
  margin: 0 auto 32px auto;
}

.fortune-card-large {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.fortune-icon-large {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.fortune-type-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  font-family: Pretendard, sans-serif;
}

.fortune-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.fortune-score {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.score-circle {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-number {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 1.2rem;
  font-weight: 500;
}

.score-description {
  font-size: 1.2rem;
  font-weight: 600;
}

.fortune-details,
.fortune-advice,
.lucky-items {
  padding: 20px 0;
}

.details-title,
.advice-title,
.lucky-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  font-family: Pretendard, sans-serif;
}

.fortune-text,
.advice-text {
  color: #4b5563;
  line-height: 1.6;
  font-size: 1rem;
}

.lucky-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lucky-item {
  background: #f0f6ff;
  color: #1e40af;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.share-button,
.retry-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-button {
  background: #10b981;
  color: white;
}

.share-button:hover {
  background: #059669;
  transform: translateY(-1px);
}

.retry-button {
  background: #6b7280;
  color: white;
}

.retry-button:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .fortune-result-container {
    padding: 16px;
  }
  
  .result-title {
    font-size: 1.4rem;
  }
  
  .fortune-card-large {
    padding: 24px;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .fortune-score {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .score-number {
    font-size: 2.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .info-item {
    flex-direction: column;
    gap: 4px;
  }
  
  .info-label {
    min-width: auto;
    font-size: 0.9rem;
  }
}
</style>