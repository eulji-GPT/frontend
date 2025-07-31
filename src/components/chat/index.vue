<template>
  <div class="main-container">
    <div class="chatbot-sidebar-wrapper">
      <div class="frame">
        <div class="chatbot-logo-header">
          <div class="frame-1">
            <div class="common-icon"></div>
            <div class="group">
              <span class="eulgpt">EULGPT </span>
              <div class="union"></div>
            </div>
          </div>
          <div class="edit-icon"></div>
        </div>
        <div class="frame-2">
          <div class="chatbot-menu-item">
            <div class="frame-3">
              <div class="group-4">
                <div class="group-5"></div>
                <div class="frame-6"><span class="day">DAY</span></div>
              </div>
              <span class="empty-classroom-check">빈 강의실 확인</span>
            </div>
            <div class="frame-7">
              <div class="group-8"></div>
              <span class="library-study-room-reservation"
                >도서관 ∙ 열람실 자리 예약</span
              >
            </div>
            <div class="frame-9">
              <div class="group-a">
                <div class="group-d"></div>
              </div>
              <span class="status">학식당 현황</span>
            </div>
          </div>
          <div class="frame-10">
            <div class="chat-list-link">
              <span class="conversation-list">대화 리스트</span>
            </div>
            <div class="frame-11">
              <div class="chat-list-container">
                <span class="start-chat">지금 바로 대화를 시작해보세요</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="side-footer">
        <div class="ellipse"></div>
        <div class="frame-12">
          <div class="notification"></div>
          <div class="icon-info"><div class="vector"></div></div>
        </div>
      </div>
    </div>
    <div class="chat-content-col">
      <!-- 메시지 표시 영역 -->
      <div class="chat-messages-area">
        <div v-for="(msg, idx) in messages" :key="idx" class="message-wrapper">
          <ChatBubble :align="msg.isUser ? 'right' : 'left'">
            {{ msg.text }}
          </ChatBubble>
        </div>
      </div>
      
      <!-- 하단 입력 영역 -->
      <div class="frame-13">
        <div class="frame-14">
          <div style="display: flex; width: 100%; flex-direction: row; align-items: flex-end;">
            <div class="ask-anything">
              <input
                type="text"
                placeholder="무엇이든 물어보세요."
                v-model="inputValue"
                @keyup.enter="handleSend"
                @input="console.log('입력 변경:', $event.target.value)"
                :disabled="isLoading"
                style="width: 100%; border: none; outline: none; background: transparent; font-size: 16px; color: #222;"
              />
            </div>
            <div class="frame-16">
              <div class="input-state-button"><div class="vector-17"></div></div>
              <div 
                class="input-state-button-18" 
                @click="() => { console.log('버튼 클릭 처리 시작'); handleSend(); }"
                :class="{ 'disabled': isLoading }"
              >
                <div class="vector-19"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="frame-1a">
          <span class="privacy-policy">개인정보 처리방침</span
          ><span class="vertical-line">|</span
          ><span class="copyright-text"
            >Copyright ⓒ EULGPT. All Rights Reserved
          </span>
        </div>
      </div>
    </div>
    <div class="input-button-22"><div class="button-group"></div></div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import ChatBubble from './ChatBubble.vue';
import "./index.css";

const inputValue = ref("");
const messages = ref([]);
const messagesContainer = ref(null);
const isLoading = ref(false);

// Gemini API 설정 - 스트리밍 지원
const GEMINI_API_KEY = '//////'; // 실제 API 키로 교체하세요
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent';

// 스트리밍 Gemini API 호출 함수
async function callGeminiStreamAPI(message, messageIndex) {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';

    // 로딩 상태를 일반 메시지로 변경
    if (messages.value[messageIndex]) {
      messages.value[messageIndex] = {
        text: '',
        isUser: false,
        timestamp: new Date(),
        isLoading: false,
        isStreaming: true
      };
    }


    let gotResponse = false;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const jsonStr = trimmed.slice(6);
            const data = JSON.parse(jsonStr);
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
              const newText = data.candidates[0].content.parts[0].text || '';
              if (newText) {
                gotResponse = true;
                accumulatedText += newText;
                if (messages.value[messageIndex]) {
                  messages.value[messageIndex] = {
                    text: accumulatedText,
                    isUser: false,
                    timestamp: new Date(),
                    isLoading: false,
                    isStreaming: true
                  };
                }
                scrollToBottom();
              }
            }
          } catch (parseError) {
            // JSON 파싱 실패는 무시
          }
        }
      }
    }

    // 스트리밍 완료
    if (messages.value[messageIndex]) {
      messages.value[messageIndex] = {
        text: gotResponse ? accumulatedText : '응답을 받지 못했습니다.',
        isUser: false,
        timestamp: new Date(),
        isLoading: false,
        isStreaming: false
      };
    }

  } catch (error) {
    console.error('Gemini 스트리밍 API 호출 오류:', error);
    if (messages.value[messageIndex]) {
      messages.value[messageIndex] = {
        text: '죄송합니다. 현재 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
        isLoading: false,
        isStreaming: false
      };
    }
  }
}

async function handleSend() {
  if (!inputValue.value.trim() || isLoading.value) return;
  
  // userMessage를 함수 시작 부분에서 선언
  const userMessage = inputValue.value.trim();
  
  // 유저 메시지 추가
  messages.value.push({
    text: userMessage,
    isUser: true,
    timestamp: new Date()
  });
  
  // 입력 필드 초기화
  inputValue.value = "";
  scrollToBottom();
  
  // 로딩 상태 활성화
  isLoading.value = true;
  
  // 로딩 메시지 추가 - 인덱스를 먼저 계산
  const loadingMessageIndex = messages.value.length;
  messages.value.push({
    text: "답변을 생성하고 있습니다...",
    isUser: false,
    timestamp: new Date(),
    isLoading: true,
    isStreaming: false
  });
  
  scrollToBottom();
  
  try {
    // 스트리밍 API 호출
    await callGeminiStreamAPI(userMessage, loadingMessageIndex);
  } catch (error) {
    console.error('스트리밍 오류:', error);
    if (messages.value[loadingMessageIndex]) {
      messages.value[loadingMessageIndex] = {
        text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
        isUser: false,
        timestamp: new Date(),
        isLoading: false,
        isStreaming: false
      };
    }
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
}

// 스크롤 함수
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}
</script>

<style scoped>
.chat-messages-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 770px; /* frame-14와 같은 최대 너비 */
  flex: 1;
  padding: 20px 10px;
  overflow-y: auto;
  gap: 8px;
  margin: 0 auto; /* 중앙 정렬 */
  scroll-behavior: smooth; /* 부드러운 스크롤 */
}

.message-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* ChatBubble의 정렬을 위한 추가 스타일 */
.message-wrapper :deep(.chat-bubble.right) {
  align-self: flex-end;
}

.message-wrapper :deep(.chat-bubble.left) {
  align-self: flex-start;
}

/* 기존 .user-message 스타일 비활성화 */
.user-message {
  display: none;
}

/* 로딩 상태 스타일 */
.input-state-button-18.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 자연스러운 스크롤바 스타일 */
.chat-messages-area::-webkit-scrollbar {
  width: 6px;
}

.chat-messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-messages-area::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .chat-messages-area {
    width: 90vw;
    max-width: 98vw;
  }
}
</style>