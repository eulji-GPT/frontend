import { ref, onMounted } from 'vue';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
  images?: File[];
  currentStep?: string;
  cotSteps?: string[];
  currentPhase?: string;
  progressPercent?: number;
  totalSteps?: number;
  currentStepNumber?: number;
  hasError?: boolean;
  errorDetails?: {
    step?: string;
    reason?: string;
    phase?: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  sessionId?: string; // 백엔드 세션 ID
}

export type ChatMode = 'general' | 'university' | 'study' | 'career' | 'cot';

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const chatHistory = ref<ChatSession[]>([]);
  const currentChatId = ref<string | null>(null);
  const isLoading = ref(false);
  const isStreaming = ref(false);
  const chatMode = ref<ChatMode>('general');
  let currentController: AbortController | null = null;

  // 메시지 업데이트를 위한 헬퍼 함수 (Vue 반응성 보장)
  const updateMessage = (chatId: string, messageIndex: number, updates: Partial<ChatMessage>) => {
    const chat = chatHistory.value.find(c => c.id === chatId);
    if (!chat || !chat.messages[messageIndex]) return;
    
    const updatedMessage = {
      ...chat.messages[messageIndex],
      ...updates
    };
    
    const newMessages = [...chat.messages];
    newMessages[messageIndex] = updatedMessage;
    chat.messages = newMessages;
    
    // 현재 활성 채팅인 경우 messages ref도 업데이트
    if (currentChatId.value === chatId) {
      messages.value = newMessages;
    }
  };

  const FASTAPI_BASE_URL = '/gemini-api'; // 프록시를 통해 Gemini FastAPI로 라우팅
  const getAPIUrl = (mode: ChatMode): string => {
    const endpoints = {
      general: '/chat',
      university: '/university',
      study: '/study',
      career: '/career',
      cot: '/cot'
    };
    return `${FASTAPI_BASE_URL}${endpoints[mode]}`;
  };

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    setTimeout(() => {
      const chatMainArea = document.querySelector('.chat-main-area');
      if (chatMainArea) {
        chatMainArea.scrollTop = chatMainArea.scrollHeight;
      }
    }, 100);
  };
  const FASTAPI_HEALTH_URL = `${FASTAPI_BASE_URL}/health`;

  onMounted(async () => {
    loadChatHistory();
    
    // FastAPI 서버 상태 확인
    await checkServerStatus();
    
    if (chatHistory.value.length > 0) {
      selectChat(chatHistory.value[0].id);
    } else {
      startNewChat();
    }
  });

  function loadChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      // timestamp를 Date 객체로 복원
      chatHistory.value = parsedHistory.map((chat: ChatSession) => ({
        ...chat,
        messages: chat.messages.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          hasError: msg.hasError || false,
          isLoading: msg.isLoading || false,
          isStreaming: msg.isStreaming || false
        }))
      }));
    }
  }

  function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.value));
  }

  // 백엔드에서 새 세션 생성
  async function createBackendSession(): Promise<string | null> {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const data = await response.json();
        return data.session_id;
      }
    } catch (error) {
      console.error('백엔드 세션 생성 실패:', error);
    }
    return null;
  }

  async function startNewChat() {
    currentChatId.value = `chat-${Date.now()}`;
    
    // 백엔드 세션 생성
    const backendSessionId = await createBackendSession();
    
    const newChat: ChatSession = {
      id: currentChatId.value,
      title: '새 대화',
      messages: [],
      sessionId: backendSessionId || undefined
    };
    chatHistory.value.unshift(newChat);
    messages.value = newChat.messages;
    
    if (backendSessionId) {
      console.log('새 백엔드 세션 생성됨:', backendSessionId);
    }
  }

  function selectChat(id: string) {
    const chat = chatHistory.value.find(c => c.id === id);
    if (chat) {
      currentChatId.value = id;
      messages.value = chat.messages;
    }
  }

  function deleteChat(id: string) {
    const index = chatHistory.value.findIndex(c => c.id === id);
    if (index !== -1) {
      chatHistory.value.splice(index, 1);
      saveChatHistory();
      if (currentChatId.value === id) {
        if (chatHistory.value.length > 0) {
          selectChat(chatHistory.value[0].id);
        } else {
          startNewChat();
        }
      }
    }
  }

  async function checkServerStatus() {
    const maxRetries = 3;
    const retryDelay = 2000; // 2초
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔍 FastAPI 서버 상태 확인 중... (시도 ${attempt}/${maxRetries})`, FASTAPI_HEALTH_URL);
        const response = await fetch(FASTAPI_HEALTH_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ FastAPI 서버 연결 성공:', data);
          return; // 성공하면 함수 종료
        } else {
          console.warn(`⚠️ FastAPI 서버 상태 비정상 (시도 ${attempt}/${maxRetries}):`, response.status);
        }
      } catch (error) {
        console.error(`❌ FastAPI 서버 연결 실패 (시도 ${attempt}/${maxRetries}):`, error);
        
        if (attempt < maxRetries) {
          console.log(`🔄 ${retryDelay/1000}초 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.log('🛠️ FastAPI 서버가 아직 시작되지 않았을 수 있습니다. 잠시 후 다시 시도해보세요.');
        }
      }
    }
  }

  async function generateChatTitle(message: string): Promise<string> {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `다음 메시지를 5-8단어로 간단히 요약해주세요. 한국어로 답변하고, 요약 제목만 응답하세요: "${message}"`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.response) {
          return data.response.trim().replace(/['"]/g, '').substring(0, 30);
        }
      }
    } catch (error) {
      console.error('제목 생성 실패:', error);
    }
    
    // AI 요약 실패 시 기본값 반환
    return message.substring(0, 20);
  }

  async function callFastAPICotChat(message: string, messageIndex: number) {
    const apiUrl = getAPIUrl('cot');
    console.log("🧠 CoT FastAPI 스트리밍 호출 시작:", apiUrl);
    console.log("📤 CoT 전송 메시지:", message);
    
    // 새로운 AbortController 생성
    currentController = new AbortController();
    
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);
    if (!currentChat) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: currentController.signal,
        body: JSON.stringify({ 
          question: message, 
          context: null,
          session_id: currentChat.sessionId
        })
      });

      console.log("📥 CoT 스트리밍 응답 상태:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ CoT HTTP 오류 응답:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      if (currentChat.messages[messageIndex]) {
        updateMessage(currentChat.id, messageIndex, {
          text: '',
          isLoading: false,
          isStreaming: true,
          currentStep: "CoT 추론 시작...",
          cotSteps: [],
          currentPhase: 'initialization',
          progressPercent: 0,
          totalSteps: 0,
          currentStepNumber: 0
        });
      }
      
      isStreaming.value = true;

      // 스트리밍 응답 처리
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // 완전한 라인들을 찾기 위해 버퍼 처리
          let lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 마지막 불완전한 라인은 버퍼에 보관

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6).trim(); // 'data: ' 제거 및 공백 제거
                if (jsonStr) {
                  const data = JSON.parse(jsonStr);
                  console.log('🔄 [DEBUG] 스트리밍 데이터 수신:', {
                    type: data.type,
                    phase: data.phase,
                    step: data.step,
                    chunk_index: data.chunk_index,
                    chunk_length: data.final_answer_chunk?.length,
                    chunk_preview: data.final_answer_chunk?.substring(0, 20),
                    is_last: data.is_last_chunk,
                    current_streaming_state: isStreaming.value,
                    message_streaming_state: currentChat.messages[messageIndex]?.isStreaming
                  });
                  
                  if (data.type === 'start' && currentChat.messages[messageIndex]) {
                    updateMessage(currentChat.id, messageIndex, {
                      currentStep: data.step,
                      currentPhase: data.phase,
                      progressPercent: 0
                    });
                  }
                  else if (data.type === 'status' && currentChat.messages[messageIndex]) {
                    const updates: Partial<ChatMessage> = {
                      currentStep: data.step,
                      currentPhase: data.phase
                    };
                    if (data.progress_percent !== undefined) {
                      updates.progressPercent = data.progress_percent;
                    }
                    if (data.current_step !== undefined) {
                      updates.currentStepNumber = data.current_step;
                    }
                    if (data.total_steps !== undefined) {
                      updates.totalSteps = data.total_steps;
                    }
                    updateMessage(currentChat.id, messageIndex, updates);
                  }
                  else if (data.type === 'sub_questions' && currentChat.messages[messageIndex]) {
                    updateMessage(currentChat.id, messageIndex, {
                      cotSteps: data.sub_questions,
                      totalSteps: data.total_steps,
                      currentPhase: data.phase
                    });
                  }
                  else if (data.type === 'step_completed' && currentChat.messages[messageIndex]) {
                    // 단계별 답변을 누적해서 표시
                    accumulatedText += `\n\n**${data.step_answer.question}**\n${data.step_answer.answer}`;
                    updateMessage(currentChat.id, messageIndex, {
                      text: accumulatedText,
                      currentStepNumber: data.step_number,
                      progressPercent: data.progress_percent,
                      currentPhase: data.phase
                    });
                    console.log(`🔄 단계 ${data.step_number} 완료, 누적 텍스트 길이: ${accumulatedText.length}`);
                    
                    // 단계 완료 시 자동 스크롤
                    scrollToBottom();
                  }
                  else if (data.type === 'warning' && currentChat.messages[messageIndex]) {
                    updateMessage(currentChat.id, messageIndex, {
                      currentStep: data.step,
                      currentPhase: data.phase
                    });
                    // 경고 정보 저장 (오류는 아니지만 알림 목적)
                    if (data.warning_details) {
                      console.warn('CoT 단계 경고:', data.warning_details);
                    }
                  }
                  else if (data.type === 'final_streaming_start' && currentChat.messages[messageIndex]) {
                    // 최종 답변 스트리밍 시작 - 기존 텍스트 초기화
                    console.log(`🔄 최종 답변 스트리밍 시작 - 기존 단계별 답변 텍스트 초기화`);
                    updateMessage(currentChat.id, messageIndex, {
                      text: '',
                      currentStep: "최종 답변 출력 중...",
                      currentPhase: data.phase,
                      progressPercent: 100,
                      isStreaming: true
                    });
                    isStreaming.value = true; // 전역 스트리밍 상태 활성화
                  }
                  else if (data.type === 'final_answer_chunk' && currentChat.messages[messageIndex]) {
                    // 스트리밍 청크를 실시간으로 누적 (디바운싱 적용)
                    const chunk = data.final_answer_chunk;
                    console.log(`📝 [STREAMING] 최종 답변 청크 수신:`, {
                      chunk_index: data.chunk_index,
                      chunk_length: chunk?.length || 0,
                      chunk_preview: chunk?.substring(0, 30) || '(empty)',
                      is_last: data.is_last_chunk,
                      current_text_length: currentChat.messages[messageIndex].text.length
                    });
                    
                    // 청크를 누적하여 텍스트 업데이트 (Vue 반응성 보장)
                    if (chunk) {
                      const beforeLength = currentChat.messages[messageIndex].text.length;
                      
                      // Vue 반응성을 보장하는 방식으로 청크 업데이트
                      const currentText = currentChat.messages[messageIndex].text;
                      updateMessage(currentChat.id, messageIndex, {
                        text: currentText + chunk,
                        isStreaming: true,
                        currentStep: "최종 답변 출력 중..."
                      });
                      
                      const afterLength = currentText.length + chunk.length;
                      
                      console.log(`📄 [STREAMING] 텍스트 누적 성공:`, {
                        before: beforeLength,
                        added: chunk.length,
                        after: afterLength,
                        preview: (currentText + chunk).substring(Math.max(0, afterLength - 50)),
                        full_text_length: afterLength
                      });
                      
                      // 디바운싱된 스크롤 (50ms마다 한 번만)
                      setTimeout(() => {
                        scrollToBottom();
                      }, 50);
                    }
                    
                    // 마지막 청크인 경우
                    if (data.is_last_chunk) {
                      console.log(`✅ [STREAMING] 마지막 청크 처리 완료, 스트리밍 종료 준비`);
                    }
                  }
                  else if (data.type === 'final_answer_complete' && currentChat.messages[messageIndex]) {
                    // 최종 답변 스트리밍 완료
                    updateMessage(currentChat.id, messageIndex, {
                      isStreaming: false,
                      currentStep: undefined,
                      cotSteps: undefined,
                      currentPhase: undefined,
                      progressPercent: undefined,
                      totalSteps: undefined,
                      currentStepNumber: undefined
                    });
                    
                    isStreaming.value = false;
                    
                    console.log(`🏁 [STREAMING] CoT 스트리밍 완료:`, {
                      final_text_length: currentChat.messages[messageIndex].text.length,
                      is_streaming: currentChat.messages[messageIndex].isStreaming
                    });
                    
                    // 최종 스크롤
                    setTimeout(() => {
                      scrollToBottom();
                      saveChatHistory();
                    }, 100);
                  }
                  else if (data.type === 'error') {
                    // 오류 발생 시 즉시 스트리밍 중단하고 오류 메시지 표시
                    console.error('CoT 처리 오류:', data.error_details || data.error);
                    
                    if (currentChat.messages[messageIndex]) {
                      currentChat.messages[messageIndex].isStreaming = false;
                      currentChat.messages[messageIndex].hasError = true;
                      currentChat.messages[messageIndex].currentStep = undefined;
                      currentChat.messages[messageIndex].cotSteps = undefined;
                      currentChat.messages[messageIndex].currentPhase = data.phase || 'error';
                      currentChat.messages[messageIndex].progressPercent = undefined;
                      currentChat.messages[messageIndex].totalSteps = undefined;
                      currentChat.messages[messageIndex].currentStepNumber = undefined;
                      currentChat.messages[messageIndex].errorDetails = data.error_details;
                      
                      // 사용자 친화적인 오류 메시지 설정
                      let friendlyErrorMessage = '';
                      if (data.phase === 'sub_questions_error') {
                        friendlyErrorMessage = '🚫 질문을 분석하는 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.';
                      } else if (data.phase === 'step_critical_error') {
                        friendlyErrorMessage = '🚫 단계별 처리 중 치명적인 오류가 발생했습니다.\n질문을 다시 입력해주세요.';
                      } else if (data.phase === 'synthesis_error') {
                        friendlyErrorMessage = '🚫 최종 답변을 생성하는 중 오류가 발생했습니다.\n다시 시도해주세요.';
                      } else {
                        friendlyErrorMessage = '🚫 처리 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.';
                      }
                      
                      if (data.error_details?.reason) {
                        friendlyErrorMessage += `\n\n세부 정보: ${data.error_details.reason}`;
                      }
                      
                      currentChat.messages[messageIndex].text = friendlyErrorMessage;
                    }
                    
                    isStreaming.value = false;
                    saveChatHistory();
                    return; // 오류 발생 시 더 이상 처리하지 않음
                  }
                  else if (data.type === 'done') {
                    console.log("✅ CoT 스트리밍 완료");
                    break;
                  }
                }
              } catch (parseError) {
                console.warn("JSON 파싱 오류:", parseError, "라인:", line);
              }
            }
          }
        }
      }

    } catch (error: any) {
      let errorMessage = '죄송합니다. CoT 추론 중 오류가 발생했습니다.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'CoT 추론이 취소되었습니다.';
        console.log('⏹️ CoT 요청이 취소되었습니다');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'CoT 서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        console.error('🔌 CoT 서버 연결 실패');
      } else {
        console.error('❌ CoT 스트리밍 오류:', error.message);
        
        // 오류 발생시 일반 모드로 폴백
        console.log('🔄 CoT 실패로 인한 일반 모드 폴백 시작...');
        
        if (currentChat.messages[messageIndex]) {
          currentChat.messages[messageIndex].text = '🔄 CoT 모드에서 오류가 발생했습니다. 일반 모드로 자동 전환합니다...';
          currentChat.messages[messageIndex].currentStep = '일반 모드로 전환 중...';
        }
        
        try {
          const originalMode = chatMode.value;
          chatMode.value = 'general';
          await callFastAPIChat(message, messageIndex);
          chatMode.value = originalMode;
          return;
        } catch (fallbackError) {
          console.error('❌ 일반 모드 폴백도 실패:', fallbackError);
          errorMessage = '🚫 CoT와 일반 모드 모두 실패했습니다. 잠시 후 다시 시도해주세요.';
        }
      }

      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex] = {
          text: errorMessage,
          isUser: false,
          timestamp: new Date(),
          isLoading: false,
          isStreaming: false,
          currentStep: undefined,
          cotSteps: undefined
        };
      }
      
      isStreaming.value = false;
    } finally {
      currentController = null;
    }
  }

  async function callFastAPIChat(message: string, messageIndex: number) {
    const apiUrl = getAPIUrl(chatMode.value);
    console.log("🚀 FastAPI 호출 시작:", apiUrl, "(모드:", chatMode.value, ")");
    console.log("📤 전송 메시지:", message);
    
    // 새로운 AbortController 생성
    currentController = new AbortController();
    
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);
    if (!currentChat) {
      console.error("❌ 현재 채팅을 찾을 수 없습니다.");
      return;
    }

    try {
      console.log("🔄 fetch 요청 시작...");
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: currentController.signal, // AbortController 신호 추가
        body: JSON.stringify(
          chatMode.value === 'cot' 
            ? { question: message, context: null, session_id: currentChat.sessionId }
            : chatMode.value === 'study'
            ? { question: message, subject: null, session_id: currentChat.sessionId }
            : chatMode.value === 'career'
            ? { question: message, major: null, session_id: currentChat.sessionId }
            : { message: message, context: null, session_id: currentChat.sessionId }
        )
      });

      console.log("📥 응답 상태:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP 오류 응답:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ FastAPI 응답 데이터:", data);
      console.log("📊 응답 데이터 구조:", {
        success: data.success,
        hasResponse: !!data.response,
        responseLength: data.response ? data.response.length : 0,
        responseType: typeof data.response,
        error: data.error
      });
      
      if (currentChat.messages[messageIndex]) {
        const existingMessage = currentChat.messages[messageIndex];
        // 객체 속성만 변경하여 불필요한 리렌더링 방지
        existingMessage.text = '';
        existingMessage.isLoading = false;
        existingMessage.isStreaming = true;
        existingMessage.currentStep = undefined;
        existingMessage.hasError = false;
      }
      
      isStreaming.value = true; // 스트리밍 상태 시작

      // 응답을 타이핑 효과로 표시 (최적화된 버전)
      // 백엔드에서 받은 세션 ID 저장
      if (data.session_id && !currentChat.sessionId) {
        currentChat.sessionId = data.session_id;
        console.log("새 세션 ID 저장됨:", data.session_id);
      }

      if (data.success && data.response && data.response.trim()) {
        const responseText = data.response;
        let currentIndex = 0;
        let lastUpdateTime = 0;
        const UPDATE_INTERVAL = 150; // 150ms마다 업데이트로 부드럽게
        
        // 한글과 영어를 자연스럽게 처리하기 위한 청크 단위 계산
        const getNextChunkIndex = (text: string, currentIndex: number) => {
          if (currentIndex >= text.length) return text.length;
          
          const char = text[currentIndex];
          
          // 한글의 경우 음절 단위로, 영어의 경우 문자 단위로
          if (char.match(/[가-힣]/)) {
            return Math.min(currentIndex + 2, text.length); // 한글은 2글자씩
          } else if (char.match(/[a-zA-Z]/)) {
            // 영어 단어는 공백이나 구두점까지 함께
            let nextIndex = currentIndex + 1;
            while (nextIndex < text.length && text[nextIndex].match(/[a-zA-Z]/)) {
              nextIndex++;
            }
            return Math.min(nextIndex, currentIndex + 4); // 최대 4글자씩
          } else {
            return currentIndex + 1; // 숫자, 기호 등은 1글자씩
          }
        };
        
        const typeWriter = () => {
          // 중지된 경우 타이핑 중단
          if (!isStreaming.value || !currentChat.messages[messageIndex]) {
            if (currentChat.messages[messageIndex]) {
              currentChat.messages[messageIndex].isStreaming = false;
              currentChat.messages[messageIndex].currentStep = undefined;
              saveChatHistory();
            }
            return;
          }
          
          const now = Date.now();
          
          if (currentIndex < responseText.length) {
            // 다음 청크 인덱스 계산
            const nextIndex = getNextChunkIndex(responseText, currentIndex);
            
            // 텍스트 직접 업데이트 (객체 재생성 없이)
            currentChat.messages[messageIndex].text = responseText.substring(0, nextIndex);
            
            currentIndex = nextIndex;
            
            // 디바운싱된 스크롤
            if (now - lastUpdateTime > UPDATE_INTERVAL) {
              setTimeout(() => {
                scrollToBottom();
              }, 20);
              lastUpdateTime = now;
            }
            
            setTimeout(typeWriter, 80); // 80ms 간격으로 부드럽게
          } else {
            // 타이핑 완료
            currentChat.messages[messageIndex].isStreaming = false;
            currentChat.messages[messageIndex].currentStep = undefined;
            isStreaming.value = false;
            saveChatHistory();
          }
        };
        
        typeWriter();
      } else {
        if (currentChat.messages[messageIndex]) {
          let errorMessage = '응답을 받지 못했습니다.';
          if (data.error) {
            errorMessage = data.error;
          } else if (!data.success) {
            errorMessage = 'API 호출이 실패했습니다.';
          } else if (!data.response) {
            errorMessage = '빈 응답을 받았습니다. 다시 시도해주세요.';
          } else if (!data.response.trim()) {
            errorMessage = '공백 응답을 받았습니다. 다시 시도해주세요.';
          }
          
          // 직접 속성 업데이트
          currentChat.messages[messageIndex].text = errorMessage;
          currentChat.messages[messageIndex].isStreaming = false;
          currentChat.messages[messageIndex].currentStep = undefined;
          currentChat.messages[messageIndex].hasError = true;
          isStreaming.value = false;
          saveChatHistory();
        }
      }

    } catch (error) {
      console.error('❌ FastAPI 호출 오류:', error);
      
      let errorMessage = '죄송합니다. 오류가 발생했습니다.';
      
      // 사용자가 중지한 경우
      if ((error as Error).name === 'AbortError') {
        errorMessage = '답변이 중지되었습니다.';
        console.log('⏹️ 사용자가 답변을 중지했습니다.');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        console.error('🔌 서버 연결 실패: FastAPI 서버가 실행되지 않았을 수 있습니다.');
      } else if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorMessage = '일시적인 연결 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('500')) {
          errorMessage = '서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = '연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }
      
      if (currentChat.messages[messageIndex]) {
        // 직접 속성 업데이트로 불필요한 리렌더링 방지
        currentChat.messages[messageIndex].text = errorMessage;
        currentChat.messages[messageIndex].isLoading = false;
        currentChat.messages[messageIndex].isStreaming = false;
        currentChat.messages[messageIndex].currentStep = undefined;
        currentChat.messages[messageIndex].hasError = true;
      }
      
      isStreaming.value = false;
    } finally {
      currentController = null; // controller 초기화
    }
  }

  async function callFastAPIChatWithImages(message: string, images: File[], messageIndex: number) {
    console.log("🚀 이미지 포함 FastAPI 호출 시작:", message, "이미지 수:", images.length);
    
    // 새로운 AbortController 생성
    currentController = new AbortController();
    
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);
    if (!currentChat) {
      console.error("❌ 현재 채팅을 찾을 수 없습니다.");
      return;
    }

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('message', message);
      
      // 이미지들을 FormData에 추가
      images.forEach((image, _) => {
        formData.append('images', image);
      });

      const response = await fetch(`${FASTAPI_BASE_URL}/chat-with-images`, {
        method: 'POST',
        signal: currentController.signal,
        body: formData
      });

      console.log("📥 이미지 응답 상태:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP 오류 응답:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ 이미지 FastAPI 응답 데이터:", data);
      
      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex] = {
          ...currentChat.messages[messageIndex],
          text: '',
          isLoading: false,
          isStreaming: true,
          currentStep: undefined
        };
      }
      
      isStreaming.value = true;

      // 응답을 타이핑 효과로 표시 (이미지 채팅)
      if (data.success && data.response && data.response.trim()) {
        const responseText = data.response.trim();
        let currentIndex = 0;
        
        const typeWriter = () => {
          if (!isStreaming.value) {
            if (currentChat.messages[messageIndex]) {
              currentChat.messages[messageIndex].isStreaming = false;
              saveChatHistory();
            }
            return;
          }
          
          if (currentIndex < responseText.length && currentChat.messages[messageIndex]) {
            currentChat.messages[messageIndex].text = responseText.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeWriter, 20);
          } else if (currentChat.messages[messageIndex]) {
            currentChat.messages[messageIndex].isStreaming = false;
            isStreaming.value = false;
            saveChatHistory();
          }
        };
        
        typeWriter();
      } else {
        if (currentChat.messages[messageIndex]) {
          currentChat.messages[messageIndex].text = data.error || '이미지 분석 응답을 받지 못했습니다.';
          currentChat.messages[messageIndex].isStreaming = false;
          isStreaming.value = false;
          saveChatHistory();
        }
      }

    } catch (error) {
      console.error('❌ 이미지 FastAPI 호출 오류:', error);
      
      let errorMessage = '죄송합니다. 오류가 발생했습니다.';
      
      if ((error as Error).name === 'AbortError') {
        errorMessage = '답변이 중지되었습니다.';
        console.log('⏹️ 사용자가 답변을 중지했습니다.');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        console.error('🔌 서버 연결 실패: FastAPI 서버가 실행되지 않았을 수 있습니다.');
      } else if (error instanceof Error) {
        if (error.message.includes('413')) {
          errorMessage = '이미지 파일이 너무 큽니다. 20MB 이하의 파일을 업로드해주세요.';
        } else if (error.message.includes('500')) {
          errorMessage = '이미지 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = '이미지 처리에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }
      
      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex].text = errorMessage;
        currentChat.messages[messageIndex].isLoading = false;
        currentChat.messages[messageIndex].isStreaming = false;
      }
      
      isStreaming.value = false;
    } finally {
      currentController = null;
    }
  }

  async function handleSend(inputValue: { value: string }, images?: File[]) {
    if ((!inputValue.value.trim() && !images?.length) || isLoading.value) return;

    const userMessageText = inputValue.value.trim();
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);

    if (!currentChat) return;

    const isFirstMessage = currentChat.messages.length === 0;

    currentChat.messages.push({
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
      images: images,
      isLoading: false,
      isStreaming: false,
      hasError: false
    });

    inputValue.value = '';
    // scrollToBottom will be called from the component

    isLoading.value = true;

    const loadingMessageIndex = currentChat.messages.length;
    const modeMessages = {
      general: "일반 대화 처리 중...",
      university: "대학생 전용 정보 검색 중...",
      study: "학습 도우미 분석 중...",
      career: "진로 상담 정보 수집 중...",
      cot: "단계별 추론 시작..."
    };

    currentChat.messages.push({
      text: modeMessages[chatMode.value] || "답변을 생성하고 있습니다...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
      isStreaming: false,
      hasError: false,
      currentStep: modeMessages[chatMode.value] || "답변을 생성하고 있습니다...",
    });

    try {
      if (images && images.length > 0) {
        await callFastAPIChatWithImages(userMessageText, images, loadingMessageIndex);
      } else if (chatMode.value === 'cot') {
        await callFastAPICotChat(userMessageText, loadingMessageIndex);
      } else {
        await callFastAPIChat(userMessageText, loadingMessageIndex);
      }
      
      // 첫 번째 메시지인 경우 AI로 제목 생성
      if (isFirstMessage) {
        try {
          const aiTitle = await generateChatTitle(userMessageText);
          currentChat.title = aiTitle;
          console.log('🏷️ AI가 생성한 대화 제목:', aiTitle);
        } catch (error) {
          console.error('제목 생성 실패, 기본 제목 사용:', error);
          currentChat.title = userMessageText.substring(0, 20);
        }
      }
    } catch (error) {
      console.error('FastAPI 통신 오류:', error);
      if (currentChat.messages[loadingMessageIndex]) {
        currentChat.messages[loadingMessageIndex] = {
          text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
          isUser: false,
          timestamp: new Date(),
          isLoading: false,
          isStreaming: false,
          hasError: true
        };
      }
    } finally {
      isLoading.value = false;
      saveChatHistory();
      // scrollToBottom will be called from the component
    }
  }

  function setChatMode(mode: ChatMode) {
    chatMode.value = mode;
    console.log("🤖 채팅 모드 변경:", mode);
  }

  function getChatModeInfo() {
    const modeInfo = {
      general: { name: '일반 채팅', description: '범용 AI 대화' },
      university: { name: '대학생 챗봇', description: '대학생 전용 어시스턴트' },
      study: { name: '학습 도우미', description: '학습을 도와주는 AI 튜터' },
      career: { name: '진로 상담', description: '진로 상담 전문 AI' },
      cot: { name: '단계별 추론', description: 'Chain of Thought 방식' }
    };
    return modeInfo[chatMode.value];
  }

  function stopResponse() {
    if (currentController) {
      currentController.abort(); // API 요청 중단
    }
    isStreaming.value = false; // 스트리밍 중단
    console.log('⏹️ 답변 중지됨');
  }

  function updateChatTitle(chatId: string, newTitle: string) {
    const chat = chatHistory.value.find(c => c.id === chatId);
    if (chat) {
      chat.title = newTitle;
      saveChatHistory();
      console.log('📝 대화 제목 수정:', newTitle);
    }
  }

  return {
    messages,
    chatHistory,
    currentChatId,
    isLoading,
    isStreaming,
    chatMode,
    loadChatHistory,
    saveChatHistory,
    startNewChat,
    selectChat,
    deleteChat,
    handleSend,
    setChatMode,
    getChatModeInfo,
    stopResponse,
    updateChatTitle,
  };
}
