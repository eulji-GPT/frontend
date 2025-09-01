<template>
  <div class="fortune-chat-container">
    <div class="fortune-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 19-7-7 7-7"/>
            <path d="m19 12-7 7-7-7"/>
          </svg>
        </button>
        <h1 class="fortune-title">사주 ∙ 운세 챗봇</h1>
      </div>
    </div>

    <div class="fortune-content">
      <div class="welcome-section">
        <div class="fortune-icon">🔮</div>
        <h2>안녕하세요! 사주 운세 상담사입니다</h2>
        <p>생년월일과 시간을 알려주시면 정확한 사주풀이를 해드립니다.</p>
      </div>

      <div class="chat-area">
        <div class="messages-container" ref="messagesContainer">
          <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
            <div v-if="message.isUser" class="user-message">
              <div class="message-bubble user-bubble">
                {{ message.text }}
              </div>
            </div>
            <div v-else class="bot-message">
              <div class="message-bubble bot-bubble">
                {{ message.text }}
              </div>
            </div>
          </div>
          <div v-if="isLoading" class="bot-message">
            <div class="message-bubble bot-bubble loading">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="input-section">
          <div class="quick-questions">
            <button 
              v-for="question in quickQuestions" 
              :key="question"
              class="quick-question-btn"
              @click="sendQuickQuestion(question)"
            >
              {{ question }}
            </button>
          </div>
          
          <div class="input-container">
            <input
              v-model="userInput"
              type="text"
              placeholder="생년월일과 시간을 입력해주세요 (예: 1990년 5월 15일 오전 10시)"
              class="message-input"
              @keypress.enter="sendMessage"
            />
            <button 
              class="send-button" 
              @click="sendMessage"
              :disabled="!userInput.trim()"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m22 2-7 20-4-9-9-4z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

const emit = defineEmits(['goBack']);

const messages = ref<Message[]>([
  {
    text: "안녕하세요! 사주 운세 상담을 시작하겠습니다. 정확한 사주풀이를 위해 다음 정보를 알려주세요:\n\n1️⃣ 생년월일 (양력/음력 구분)\n2️⃣ 출생 시간 (가능하면 정확한 시간)\n3️⃣ 성별\n4️⃣ 출생지역\n\n예시: 1990년 5월 15일 양력, 오전 10시 30분, 남성, 서울",
    isUser: false,
    timestamp: Date.now()
  }
]);

const userInput = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const quickQuestions = ref([
  '오늘의 운세',
  '연애운 보기',
  '금전운 보기',
  '직업운 보기',
  '건강운 보기'
]);

const goBack = () => {
  emit('goBack');
};

const sendQuickQuestion = (question: string) => {
  userInput.value = question;
  sendMessage();
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  const userMessage: Message = {
    text: userInput.value,
    isUser: true,
    timestamp: Date.now()
  };

  messages.value.push(userMessage);
  userInput.value = '';
  
  isLoading.value = true;
  await scrollToBottom();

  // 간단한 응답 시뮬레이션
  setTimeout(() => {
    const botResponse = generateFortuneResponse();
    messages.value.push({
      text: botResponse,
      isUser: false,
      timestamp: Date.now()
    });
    isLoading.value = false;
    scrollToBottom();
  }, 2000);
};

const generateFortuneResponse = (): string => {
  const responses = [
    "입력해주신 정보를 바탕으로 사주를 분석해보겠습니다...\n\n🌟 오늘의 전체운: 길한 날입니다. 새로운 시작에 좋은 기운이 흐르고 있어요.\n\n💕 연애운: 기존 관계에서는 안정적인 흐름을, 새로운 만남에서는 좋은 인연의 가능성이 보입니다.\n\n💰 금전운: 투자보다는 저축에 집중하세요. 의외의 수입이 생길 수 있습니다.\n\n⚖️ 직업운: 협업 프로젝트에서 좋은 결과를 얻을 수 있어요. 상사와의 관계도 원만합니다.",
    
    "사주 분석 결과를 알려드리겠습니다.\n\n🎯 현재 대운의 특징:\n- 학업/직장에서 발전의 기회가 많은 시기\n- 인간관계에서 도움 받을 일이 생김\n- 건강 관리에 주의가 필요\n\n📅 이번 달 주의사항:\n- 금전 관리를 신중하게\n- 새로운 계획은 다음 달에\n- 가족과의 시간을 늘려보세요",
    
    "운세 상담 결과입니다.\n\n✨ 타고난 성격의 장점:\n- 책임감이 강하고 신뢰할 만함\n- 창의적 사고와 실행력을 겸비\n- 어려움을 극복하는 의지력이 강함\n\n🔮 앞으로의 조언:\n- 너무 완벽을 추구하지 마세요\n- 주변 사람들과의 소통을 늘리세요\n- 새로운 취미나 관심사를 찾아보세요"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.fortune-chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.fortune-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #f3f4f6;
}

.fortune-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.fortune-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
}

.welcome-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.fortune-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.welcome-section h2 {
  color: #1f2937;
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.welcome-section p {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.user-message {
  display: flex;
  justify-content: flex-end;
}

.bot-message {
  display: flex;
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.user-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.bot-bubble {
  background: #f3f4f6;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.bot-bubble.loading {
  background: #f9fafb;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.input-section {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: rgba(249, 250, 251, 0.95);
}

.quick-questions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.quick-question-btn {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #667eea;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-question-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #667eea;
}

.send-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 스크롤바 스타일 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .fortune-content {
    padding: 0 16px;
  }
  
  .welcome-section {
    padding: 24px;
    margin: 16px 0;
  }
  
  .fortune-title {
    font-size: 1.25rem;
  }
  
  .message-bubble {
    max-width: 90%;
  }
  
  .quick-questions {
    gap: 6px;
  }
  
  .quick-question-btn {
    font-size: 11px;
    padding: 6px 12px;
  }
}
</style>