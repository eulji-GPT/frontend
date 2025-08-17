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

  const FASTAPI_BASE_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000';
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

  function startNewChat() {
    currentChatId.value = `chat-${Date.now()}`;
    const newChat: ChatSession = {
      id: currentChatId.value,
      title: '새 대화',
      messages: [],
    };
    chatHistory.value.unshift(newChat);
    messages.value = newChat.messages;
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
    try {
      console.log('🔍 FastAPI 서버 상태 확인 중...', FASTAPI_HEALTH_URL);
      const response = await fetch(FASTAPI_HEALTH_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ FastAPI 서버 연결 성공:', data);
      } else {
        console.warn('⚠️ FastAPI 서버 상태 비정상:', response.status);
      }
    } catch (error) {
      console.error('❌ FastAPI 서버 연결 실패:', error);
      console.log('🛠️ FastAPI 서버를 실행해주세요: cd C:/github/AI-RAG/fastapi_ && python main.py');
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
        body: JSON.stringify({ question: message, context: null })
      });

      console.log("📥 CoT 스트리밍 응답 상태:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ CoT HTTP 오류 응답:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex] = {
          ...currentChat.messages[messageIndex],
          text: '',
          isLoading: false,
          isStreaming: true,
          currentStep: "CoT 추론 시작...",
          cotSteps: [],
          currentPhase: 'initialization',
          progressPercent: 0,
          totalSteps: 0,
          currentStepNumber: 0
        };
      }
      
      isStreaming.value = true;

      // 스트리밍 응답 처리
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6); // 'data: ' 제거
                if (jsonStr.trim()) {
                  const data = JSON.parse(jsonStr);
                  
                  if (data.type === 'start' && currentChat.messages[messageIndex]) {
                    currentChat.messages[messageIndex].currentStep = data.step;
                    currentChat.messages[messageIndex].currentPhase = data.phase;
                    currentChat.messages[messageIndex].progressPercent = 0;
                  }
                  else if (data.type === 'status' && currentChat.messages[messageIndex]) {
                    currentChat.messages[messageIndex].currentStep = data.step;
                    currentChat.messages[messageIndex].currentPhase = data.phase;
                    if (data.progress_percent !== undefined) {
                      currentChat.messages[messageIndex].progressPercent = data.progress_percent;
                    }
                    if (data.current_step !== undefined) {
                      currentChat.messages[messageIndex].currentStepNumber = data.current_step;
                    }
                    if (data.total_steps !== undefined) {
                      currentChat.messages[messageIndex].totalSteps = data.total_steps;
                    }
                  }
                  else if (data.type === 'sub_questions' && currentChat.messages[messageIndex]) {
                    currentChat.messages[messageIndex].cotSteps = data.sub_questions;
                    currentChat.messages[messageIndex].totalSteps = data.total_steps;
                    currentChat.messages[messageIndex].currentPhase = data.phase;
                  }
                  else if (data.type === 'step_completed' && currentChat.messages[messageIndex]) {
                    // 단계별 답변을 누적해서 표시
                    accumulatedText += `\n\n**${data.step_answer.question}**\n${data.step_answer.answer}`;
                    currentChat.messages[messageIndex].text = accumulatedText;
                    currentChat.messages[messageIndex].currentStepNumber = data.step_number;
                    currentChat.messages[messageIndex].progressPercent = data.progress_percent;
                    currentChat.messages[messageIndex].currentPhase = data.phase;
                    console.log(`🔄 단계 ${data.step_number} 완료, 누적 텍스트 길이: ${accumulatedText.length}`);
                  }
                  else if (data.type === 'warning' && currentChat.messages[messageIndex]) {
                    currentChat.messages[messageIndex].currentStep = data.step;
                    currentChat.messages[messageIndex].currentPhase = data.phase;
                    // 경고 정보 저장 (오류는 아니지만 알림 목적)
                    if (data.warning_details) {
                      console.warn('CoT 단계 경고:', data.warning_details);
                    }
                  }
                  else if (data.type === 'final_answer_chunk' && currentChat.messages[messageIndex]) {
                    // 스트리밍 청크를 실시간으로 누적
                    console.log(`📝 최종 답변 청크 ${data.chunk_index + 1} 수신:`, data.final_answer_chunk);
                    
                    currentChat.messages[messageIndex].currentStep = "최종 답변 출력 중...";
                    currentChat.messages[messageIndex].currentPhase = data.phase;
                    currentChat.messages[messageIndex].progressPercent = 100;
                    
                    // 첫 번째 청크인 경우 기존 텍스트 초기화 (단계별 답변 제거)
                    if (data.chunk_index === 0) {
                      console.log(`🔄 최종 답변 시작 - 기존 단계별 답변 텍스트 초기화`);
                      currentChat.messages[messageIndex].text = data.final_answer_chunk;
                    } else {
                      // 후속 청크들은 누적
                      currentChat.messages[messageIndex].text += data.final_answer_chunk;
                    }
                    
                    console.log(`📄 현재 누적된 텍스트: "${currentChat.messages[messageIndex].text}"`);
                    
                    // 마지막 청크인 경우 로그 출력
                    if (data.is_last_chunk) {
                      console.log(`✅ 마지막 청크 처리 완료, complete 신호 대기 중`);
                    }
                  }
                  else if (data.type === 'final_answer_complete' && currentChat.messages[messageIndex]) {
                    // 최종 답변 스트리밍 완료
                    currentChat.messages[messageIndex].isStreaming = false;
                    currentChat.messages[messageIndex].currentStep = undefined;
                    currentChat.messages[messageIndex].cotSteps = undefined;
                    currentChat.messages[messageIndex].currentPhase = undefined;
                    currentChat.messages[messageIndex].progressPercent = undefined;
                    currentChat.messages[messageIndex].totalSteps = undefined;
                    currentChat.messages[messageIndex].currentStepNumber = undefined;
                    isStreaming.value = false;
                    saveChatHistory();
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
            ? { question: message, context: null }
            : chatMode.value === 'study'
            ? { question: message, subject: null }
            : chatMode.value === 'career'
            ? { question: message, major: null }
            : { message: message, context: null }
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
        currentChat.messages[messageIndex] = {
          ...existingMessage,
          text: '',
          isLoading: false,
          isStreaming: true,
          currentStep: undefined,
          hasError: false
        };
      }
      
      isStreaming.value = true; // 스트리밍 상태 시작

      // 응답을 타이핑 효과로 표시
      if (data.success && data.response && data.response.trim()) {
        const responseText = data.response;
        let currentIndex = 0;
        
        const typeWriter = () => {
          // 중지된 경우 타이핑 중단
          if (!isStreaming.value) {
            if (currentChat.messages[messageIndex]) {
              currentChat.messages[messageIndex].isStreaming = false;
              currentChat.messages[messageIndex].currentStep = undefined;
              saveChatHistory();
            }
            return;
          }
          
          if (currentIndex < responseText.length && currentChat.messages[messageIndex]) {
            currentChat.messages[messageIndex].text = responseText.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeWriter, 20); // 20ms 간격으로 한 글자씩 표시
          } else if (currentChat.messages[messageIndex]) {
            currentChat.messages[messageIndex].isStreaming = false;
            currentChat.messages[messageIndex].currentStep = undefined;
            isStreaming.value = false; // 스트리밍 완료
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
          
          currentChat.messages[messageIndex].text = errorMessage;
          currentChat.messages[messageIndex].isStreaming = false;
          currentChat.messages[messageIndex].currentStep = undefined;
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
        currentChat.messages[messageIndex].text = errorMessage;
        currentChat.messages[messageIndex].isLoading = false;
        currentChat.messages[messageIndex].isStreaming = false;
        currentChat.messages[messageIndex].currentStep = undefined;
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
