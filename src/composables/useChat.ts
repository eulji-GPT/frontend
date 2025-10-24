import { ref, onMounted, nextTick } from 'vue';
import { isAuthenticated, getAuthHeaders, apiRequest } from '../utils/auth';

export interface RagSource {
  title: string;
  content: string;
  domain: string;
  category?: string;
  score?: number;
}

export interface ArtifactVersion {
  content: string;
  timestamp: number;
  description?: string;
}

export interface Artifact {
  title: string;
  content: string;
  type: string;
  versions?: ArtifactVersion[];
  currentVersion?: number;
}

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
  ragSources?: RagSource[];
  artifact?: Artifact | null;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  sessionId?: string; // 백엔드 세션 ID
}

export type ChatMode = 'unified' | 'cot' | 'rag';

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const chatHistory = ref<ChatSession[]>([]);
  const currentChatId = ref<string | null>(null);
  const isLoading = ref(false);
  const isStreaming = ref(false);
  const chatMode = ref<ChatMode>('unified');
  let currentController: AbortController | null = null;
  
  // RAG 시스템 상태
  const ragStatus = ref({
    initialized: false,
    isInitializing: false,
    error: null as string | null,
    systemInfo: null as any
  });

  // 메시지 업데이트를 위한 헬퍼 함수 (Vue 반응성 보장)
  const updateMessage = (chatId: string, messageIndex: number, updates: Partial<ChatMessage>) => {
    const chat = chatHistory.value.find(c => c.id === chatId);
    if (!chat || !chat.messages[messageIndex]) return;

    // 기존 메시지를 직접 업데이트
    Object.assign(chat.messages[messageIndex], updates);

    // 현재 활성 채팅인 경우 messages ref를 강제로 업데이트하여 Vue 반응성 트리거
    if (currentChatId.value === chatId) {
      messages.value = [...chat.messages];
    }
  };

  const FASTAPI_BASE_URL = import.meta.env.VITE_GEMINI_FASTAPI_URL || '/gemini-api'; // 환경 변수 또는 프록시 경로 사용
  const BACKEND_BASE_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000'; // 백엔드 API URL
  const getAPIUrl = (mode: ChatMode): string => {
    const endpoints = {
      unified: '/chat',  // 통합 챗봇 (Function Calling 기반)
      cot: '/cot',       // Chain of Thought
      rag: '/rag/query'  // RAG 시스템
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

  // 긴 답변을 아티팩트로 변환할지 판단하는 함수
  const shouldConvertToArtifact = (text: string): boolean => {
    // 조건 1: 3000자 이상
    if (text.length < 3000) return false;

    // 조건 2: 여러 섹션 포함 (## 또는 ### 또는 숫자. 로 시작하는 제목이 3개 이상)
    const sectionPatterns = [
      /^#{1,3}\s+/gm,  // 마크다운 제목
      /^\d+\.\s+/gm,    // 숫자로 시작하는 항목
      /^[IⅡⅢ]+\.\s+/gm  // 로마 숫자로 시작하는 항목
    ];

    let sectionCount = 0;
    for (const pattern of sectionPatterns) {
      const matches = text.match(pattern);
      if (matches) sectionCount += matches.length;
    }

    return sectionCount >= 3;
  };

  // 아티팩트 제목 추출 함수
  const extractArtifactTitle = (text: string): string => {
    // 첫 번째 제목을 찾기
    const titlePatterns = [
      /^#\s+(.+)$/m,      // # 제목
      /^##\s+(.+)$/m,     // ## 제목
      /^(.+)\n={3,}$/m,   // 밑줄 제목
      /^(\d+\.\s+.+)$/m   // 1. 제목
    ];

    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().substring(0, 50); // 최대 50자
      }
    }

    // 제목을 찾지 못하면 첫 100자 사용
    return text.substring(0, 100).replace(/\n/g, ' ') + '...';
  };

  // AI 인삿말 제거하여 순수 보고서만 추출하는 함수
  const extractReportContent = (text: string): string => {
    // AI 인삿말 패턴들 (보고서 작성 전에 나오는 인사/확인 멘트)
    const greetingPatterns = [
      /^안녕하세요[!,.\s]*.{0,100}?(?=\n|$)/i,
      /^네[!,.\s]*.{0,100}?(?=\n|$)/i,
      /^알겠습니다[!,.\s]*.{0,100}?(?=\n|$)/i,
      /^좋습니다[!,.\s]*.{0,100}?(?=\n|$)/i,
      /^물론입니다[!,.\s]*.{0,100}?(?=\n|$)/i,
      /^(작성|정리|분석|설명).{0,50}?드리겠습니다[!,.\s]*/i,
      /^(보고서|레포트|자료).{0,50}?작성.{0,50}?(?=\n|$)/i,
      /^.{0,50}?대해.{0,30}?(설명|정리|분석|작성).{0,30}?(?=\n|$)/i
    ];

    let cleanedText = text;

    // 각 패턴을 순서대로 제거
    for (const pattern of greetingPatterns) {
      cleanedText = cleanedText.replace(pattern, '');
    }

    // 시작 부분의 공백 및 개행 제거
    cleanedText = cleanedText.trim();

    // 첫 번째 마크다운 제목(# 또는 ##)이 나오기 전까지의 내용 제거
    // 보고서는 보통 제목으로 시작하므로
    const firstHeadingMatch = cleanedText.match(/^(.*?)(^#+ .+$)/ms);
    if (firstHeadingMatch && firstHeadingMatch[1].length < 200) {
      // 제목 전 내용이 200자 미만이면 인삿말로 간주하고 제거
      cleanedText = firstHeadingMatch[2] + cleanedText.substring(firstHeadingMatch[0].length);
    }

    return cleanedText.trim();
  };

  // 상세한 답변이 필요한 질문인지 감지하는 함수
  const requiresDetailedResponse = (message: string): boolean => {
    const detailedIndicators = [
      /설명해.*주세요|설명.*해줘|설명해|설명.*드려/i,     // explain
      /분석.*주세요|분석.*해줘|분석해|분석.*드려/i,       // analyze
      /알려.*주세요|알려.*줘|알려주|알려.*드려/i,         // tell me
      /작성.*주세요|작성.*해줘|작성해|작성.*드려/i,       // write
      /정리.*주세요|정리.*해줘|정리해|정리.*드려/i,       // summarize/organize
      /비교.*주세요|비교.*해줘|비교해|비교.*드려/i,       // compare
      /검토.*주세요|검토.*해줘|검토해|검토.*드려/i,       // review
      /평가.*주세요|평가.*해줘|평가해|평가.*드려/i,       // evaluate
      /조사.*주세요|조사.*해줘|조사해|조사.*드려/i,       // research
      /연구.*주세요|연구.*해줘|연구해/i,                  // research
      /보고서/i,                                          // report
      /논문/i,                                            // thesis
      /레포트/i,                                          // report (english)
      /자세히|상세히|자세하게|상세하게/i,                 // in detail
      /전체적|전반적/i,                                   // comprehensive
      /체계적|구조적/i,                                   // systematic/structured
      /종합적/i,                                          // comprehensive
      /요약.*주세요|요약.*해줘|요약해|요약.*드려/i,       // summarize
      /리스트.*주세요|리스트.*해줘|목록.*주세요/i,       // list
      /단계별|순서대로/i,                                 // step by step
      /방법.*알려|방법.*설명|방법.*정리/i,               // methods
      /차이.*설명|차이.*알려|차이점|차이가/i,            // differences
      /장단점|장점.*단점|pros.*cons/i,                   // pros and cons
      /특징.*설명|특징.*알려|특징.*정리/i,               // characteristics
      /과정.*설명|과정.*알려|과정.*정리/i,               // process
      /원리.*설명|원리.*알려|원리.*정리/i,               // principles
      /개념.*설명|개념.*알려|개념.*정리/i,               // concepts
      /이론.*설명|이론.*알려|이론.*정리/i,               // theory
      /역사.*설명|역사.*알려|역사.*정리/i,               // history
      /배경.*설명|배경.*알려|배경.*정리/i,               // background
      /구조.*설명|구조.*알려|구조.*정리/i,               // structure
      /시스템.*설명|시스템.*알려|시스템.*정리/i,         // system
      /어떻게|어떤|무엇|왜|언제|누가/i,                   // what/how/why/when/who question words
    ];

    // 조건 완화: 15자 이상이거나, 또는 특정 키워드 포함 시 보고서 모드
    // "~에 대해", "관련", "대한" 등의 표현도 체크
    const hasKeyPhrase = /에\s*대해|에\s*관해|관련|대한/i.test(message);

    return (message.length >= 15 && detailedIndicators.some(pattern => pattern.test(message)))
           || (message.length >= 30 && hasKeyPhrase);
  };

  // 메시지 전처리: 상세 답변이 필요한 경우 보고서 스타일 지침 추가
  const prepareMessageForAI = (message: string, mode: ChatMode): string => {
    // CoT, RAG 모드는 이미 특화된 프롬프트가 있으므로 건너뜀
    if (mode === 'cot' || mode === 'rag') {
      return message;
    }

    // 상세 답변이 필요한 질문인 경우 간결한 구조화 지침 추가
    if (requiresDetailedResponse(message)) {
      const reportStyleInstruction = `마크다운 제목(# ## ###)을 사용하여 체계적으로 답변하세요. 질문: ${message}`;

      console.log("📋 [STRUCTURED MODE] 구조화된 답변 요청");
      console.log("🔍 [STRUCTURED MODE] 원본 질문:", message);
      return reportStyleInstruction;
    }

    console.log("💬 [NORMAL MODE] 일반 답변 모드");
    return message;
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

  async function loadChatHistory() {
    // 로그인된 사용자인 경우 백엔드에서 로드
    if (isAuthenticated()) {
      try {
        console.log('📥 백엔드에서 채팅 히스토리 로드 중...');
        const response = await apiRequest(`${BACKEND_BASE_URL}/chat/history`, {
          method: 'GET'
        });

        if (response.ok) {
          const histories = await response.json();
          console.log('✅ 채팅 히스토리 로드 완료:', histories.length, '개');

          // 백엔드 데이터를 프론트엔드 형식으로 변환
          chatHistory.value = histories.map((h: any) => ({
            id: String(h.id), // 백엔드 integer ID를 string으로 변환
            title: h.title,
            messages: [], // 메시지는 개별 히스토리 조회 시 로드
            sessionId: String(h.id)
          }));
          return;
        }
      } catch (error) {
        console.error('❌ 채팅 히스토리 로드 실패:', error);
        // 에러 발생 시 로컬스토리지로 fallback
      }
    }

    // 비로그인 사용자 또는 백엔드 로드 실패 시 로컬스토리지에서 로드
    const history = localStorage.getItem('chatHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
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
    // 로그인된 사용자인 경우 백엔드에 채팅 히스토리 생성
    if (isAuthenticated()) {
      try {
        console.log('📝 백엔드에 새 채팅 히스토리 생성 중...');
        const response = await apiRequest(`${BACKEND_BASE_URL}/chat/history`, {
          method: 'POST',
          body: JSON.stringify({ title: '새 대화' })
        });

        if (response.ok) {
          const chatHistoryData = await response.json();
          console.log('✅ 채팅 히스토리 생성 완료:', chatHistoryData);

          const backendSessionId = await createBackendSession();

          const newChat: ChatSession = {
            id: String(chatHistoryData.id),
            title: chatHistoryData.title,
            messages: [],
            sessionId: backendSessionId || undefined
          };
          chatHistory.value.unshift(newChat);
          currentChatId.value = newChat.id;
          messages.value = newChat.messages;
          return;
        }
      } catch (error) {
        console.error('❌ 채팅 히스토리 생성 실패:', error);
        // 에러 발생 시 로컬 방식으로 fallback
      }
    }

    // 비로그인 사용자 또는 백엔드 생성 실패 시 로컬 방식
    currentChatId.value = `chat-${Date.now()}`;
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

  async function selectChat(id: string) {
    const chat = chatHistory.value.find(c => c.id === id);
    if (chat) {
      currentChatId.value = id;

      // 로그인된 사용자이고 메시지가 아직 로드되지 않은 경우 백엔드에서 로드
      if (isAuthenticated() && chat.messages.length === 0) {
        try {
          console.log(`📥 채팅 메시지 로드 중... (ID: ${id})`);
          const response = await apiRequest(`${BACKEND_BASE_URL}/chat/history/${id}`, {
            method: 'GET'
          });

          if (response.ok) {
            const chatDetail = await response.json();
            console.log('✅ 채팅 메시지 로드 완료:', chatDetail.messages.length, '개');

            // 백엔드 메시지를 프론트엔드 형식으로 변환
            chat.messages = chatDetail.messages.map((msg: any) => ({
              text: msg.message,
              isUser: msg.is_user,
              timestamp: new Date(),
              isLoading: false,
              isStreaming: false,
              hasError: false
            }));
          }
        } catch (error) {
          console.error('❌ 채팅 메시지 로드 실패:', error);
        }
      }

      messages.value = chat.messages;
    }
  }

  async function deleteChat(id: string) {
    // 로그인된 사용자인 경우 백엔드에서 삭제
    if (isAuthenticated()) {
      try {
        console.log(`🗑️ 채팅 히스토리 삭제 중... (ID: ${id})`);
        const response = await apiRequest(`${BACKEND_BASE_URL}/chat/history/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log('✅ 채팅 히스토리 삭제 완료');
        }
      } catch (error) {
        console.error('❌ 채팅 히스토리 삭제 실패:', error);
        // 에러가 나도 로컬에서는 삭제 진행
      }
    }

    // 로컬 상태에서 삭제
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
        // 스트리밍 응답 처리
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim() || !line.startsWith('data: ')) continue;

              try {
                const jsonStr = line.slice(6);
                const data = JSON.parse(jsonStr);

                if (data.type === 'chunk') {
                  fullText += data.content;
                } else if (data.type === 'done') {
                  // 스트리밍 완료
                  break;
                }
              } catch (parseError) {
                console.warn('제목 생성 JSON 파싱 실패:', line, parseError);
              }
            }
          }
        }

        if (fullText.trim()) {
          // 인용부호 제거, 최대 30자로 제한
          return fullText.trim().replace(/['"]/g, '').substring(0, 30);
        }
      }
    } catch (error) {
      console.error('제목 생성 실패:', error);
    }

    // AI 요약 실패 시 기본값 반환: 메시지의 첫 20자 사용
    return message.substring(0, 20) + (message.length > 20 ? '...' : '');
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
                    // 스트리밍 청크를 실시간으로 누적
                    const chunk = data.final_answer_chunk;

                    if (chunk && chunk.length > 0) {
                      const currentMessage = currentChat.messages[messageIndex];
                      const beforeLength = currentMessage.text.length;

                      // 직접 메시지 객체를 수정하여 Vue 반응성 보장
                      currentMessage.text = currentMessage.text + chunk;
                      currentMessage.isStreaming = true;
                      currentMessage.currentStep = "최종 답변 출력 중...";

                      // 강제로 messages ref 업데이트하여 Vue 반응성 보장
                      messages.value = [...currentChat.messages];

                      console.log(`📝 [STREAMING] 청크 누적:`, {
                        chunk_length: chunk.length,
                        before: beforeLength,
                        after: currentMessage.text.length,
                        is_last: data.is_last_chunk
                      });

                      // 스크롤
                      nextTick(() => scrollToBottom());
                    }

                    // 마지막 청크인 경우
                    if (data.is_last_chunk) {
                      console.log(`✅ [STREAMING] 마지막 청크 처리 완료`);
                    }
                  }
                  else if (data.type === 'final_answer_complete' && currentChat.messages[messageIndex]) {
                    // 최종 답변 스트리밍 완료
                    const finalText = currentChat.messages[messageIndex].text;

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

                    // AI 메시지를 노션에 저장
                    await saveMessageToNotion(currentChat.id, false, finalText);

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
    console.log("📤 원본 메시지:", message);

    // 메시지 전처리: 상세 답변이 필요한 경우 보고서 스타일 지침 추가
    const preparedMessage = prepareMessageForAI(message, chatMode.value);
    if (preparedMessage !== message) {
      console.log("📝 ✅ 보고서 스타일 지침 추가됨 - AI에게 전문 보고서 형식으로 답변하도록 지시");
      console.log("📋 전처리된 메시지 길이:", preparedMessage.length, "자");
    } else {
      console.log("💬 일반 모드로 전송");
    }

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
            ? { question: preparedMessage, context: null, session_id: currentChat.sessionId }
            : chatMode.value === 'study'
            ? { question: preparedMessage, subject: null, session_id: currentChat.sessionId }
            : chatMode.value === 'career'
            ? { question: preparedMessage, major: null, session_id: currentChat.sessionId }
            : { message: preparedMessage, context: null, session_id: currentChat.sessionId }
        )
      });

      console.log("📥 응답 상태:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP 오류 응답:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 스트리밍 응답 처리
      if (currentChat.messages[messageIndex]) {
        const existingMessage = currentChat.messages[messageIndex];
        existingMessage.text = '';
        existingMessage.isLoading = false;
        existingMessage.isStreaming = true;
        existingMessage.currentStep = undefined;
        existingMessage.hasError = false;
      }

      isStreaming.value = true;

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponseText = '';

      if (!reader) {
        throw new Error("응답 스트림을 읽을 수 없습니다.");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;

          try {
            const jsonStr = line.slice(6);
            const data = JSON.parse(jsonStr);

            if (data.type === 'start') {
              // 세션 ID 저장
              if (data.session_id && !currentChat.sessionId) {
                currentChat.sessionId = data.session_id;
                console.log("✅ 새 세션 ID 저장됨:", data.session_id);
              }
            } else if (data.type === 'chunk') {
              // 실시간 스트리밍 청크 추가
              fullResponseText += data.content;
              if (currentChat.messages[messageIndex]) {
                // Vue 반응성을 보장하기 위해 직접 할당
                const msg = currentChat.messages[messageIndex];
                msg.text = fullResponseText;
                // 강제로 messages ref 업데이트
                messages.value = [...currentChat.messages];
              }
              setTimeout(() => scrollToBottom(), 10);
            } else if (data.type === 'done') {
              console.log("✅ 스트리밍 완료");
            } else if (data.type === 'error') {
              throw new Error(data.error);
            }
          } catch (parseError) {
            console.warn("JSON 파싱 실패:", line, parseError);
          }
        }
      }

      // 스트리밍 완료 후 처리
      if (currentChat.messages[messageIndex]) {
        const responseText = fullResponseText;

        // 긴 답변 체크: 아티팩트로 변환할지 판단
        if (shouldConvertToArtifact(responseText)) {
          // 아티팩트로 변환
          const artifactTitle = extractArtifactTitle(responseText);

          // AI 인삿말 제거하고 순수 보고서 내용만 추출
          const reportContent = extractReportContent(responseText);

          const initialVersion: ArtifactVersion = {
            content: reportContent,  // 인삿말 제거된 순수 보고서 내용
            timestamp: Date.now(),
            description: '초기 생성'
          };

          // 보고서 스타일 아티팩트임을 명확히 표시
          const wordCount = Math.floor(reportContent.length / 2);
          const artifactMessage = `📄 체계적인 보고서를 아티팩트로 생성하였습니다.\n\n**${artifactTitle}**\n\n오른쪽 패널에서 전문 보고서 형식의 상세 내용을 확인하실 수 있습니다. (약 ${wordCount.toLocaleString()}자)`;
          currentChat.messages[messageIndex].text = artifactMessage;
          currentChat.messages[messageIndex].artifact = {
            title: artifactTitle,
            content: reportContent,  // 인삿말 제거된 순수 보고서 내용
            type: 'document',
            versions: [initialVersion],
            currentVersion: 0
          };
          currentChat.messages[messageIndex].isLoading = false;
          currentChat.messages[messageIndex].isStreaming = false;
          currentChat.messages[messageIndex].currentStep = undefined;

          // AI 메시지를 노션에 저장 (아티팩트 전체 내용 저장)
          await saveMessageToNotion(currentChat.id, false, reportContent);

          isStreaming.value = false;
          saveChatHistory();
          console.log('📄 보고서 스타일 아티팩트 생성:', artifactTitle, `(${wordCount}자, 인삿말 제거됨)`);
        } else {
          // 일반 답변 완료
          currentChat.messages[messageIndex].isStreaming = false;
          currentChat.messages[messageIndex].currentStep = undefined;

          // AI 메시지를 노션에 저장
          await saveMessageToNotion(currentChat.id, false, responseText);

          isStreaming.value = false;
          saveChatHistory();
        }
      } else {
        // 에러 처리
        if (currentChat.messages[messageIndex]) {
          currentChat.messages[messageIndex].text = '응답을 받지 못했습니다. 다시 시도해주세요.';
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

  async function callFastAPIRagChat(message: string, messageIndex: number) {
    const apiUrl = getAPIUrl(chatMode.value);
    console.log("🚀 RAG FastAPI 호출 시작:", apiUrl);
    console.log("📤 전송 질문:", message);
    
    // 새로운 AbortController 생성
    currentController = new AbortController();
    
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);
    if (!currentChat) {
      console.error("❌ 현재 채팅을 찾을 수 없습니다.");
      return;
    }

    try {
      console.log("🔄 RAG fetch 요청 시작...");
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: currentController.signal,
        body: JSON.stringify({
          question: message,
          prompt_type: "auto",
          top_k: 8,
          show_debug: true
        })
      });

      console.log("📥 RAG 응답 상태:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ RAG HTTP 오류 응답:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ RAG FastAPI 응답 데이터:", data);
      
      if (data.answer) {
        if (currentChat.messages[messageIndex]) {
          currentChat.messages[messageIndex].text = data.answer;
          currentChat.messages[messageIndex].isLoading = false;
          currentChat.messages[messageIndex].isStreaming = false;
          currentChat.messages[messageIndex].currentStep = undefined;
          currentChat.messages[messageIndex].hasError = false;

          // RAG 소스 정보 추가 (임시 목 데이터 - 향후 백엔드에서 실제 데이터로 교체)
          const mockSources: RagSource[] = [];
          for (let i = 0; i < Math.min(data.search_results_count || 5, 6); i++) {
            mockSources.push({
              title: `을지대학교 관련 정보 ${i + 1}`,
              content: `을지대학교에 대한 상세 정보와 관련 자료를 포함하고 있습니다. 해당 문서는 학교 공식 웹사이트 및 관련 자료에서 추출되었습니다.`,
              domain: `eulji.ac.kr`,
              category: '대학 정보',
              score: 0.95 - (i * 0.1)
            });
          }
          currentChat.messages[messageIndex].ragSources = mockSources;

          // RAG 디버그 정보 표시 (옵셔널)
          if (data.debug_info && data.debug_info.length > 0) {
            console.log("🔍 RAG 디버그 정보:", data.debug_info);
          }

          // RAG 메타데이터 표시 (처리시간, 검색된 문서 수 등)
          console.log(`📊 RAG 성능: ${data.processing_time?.toFixed(2)}초, 검색문서: ${data.search_results_count}개, 프롬프트: ${data.prompt_type_used}`);

          // AI 메시지를 노션에 저장
          await saveMessageToNotion(currentChat.id, false, data.answer);
        }
      } else {
        throw new Error('RAG 응답에서 답변을 찾을 수 없습니다.');
      }

      isStreaming.value = false;
    } catch (error: any) {
      console.error("❌ RAG FastAPI 호출 오류:", error);
      
      let errorMessage = '을지대 정보검색에 문제가 발생했습니다.';
      
      if (error.name === 'AbortError') {
        console.log("✋ 을지대 정보검색이 중단되었습니다.");
        return;
      } else {
        if (error.message.includes('503')) {
          errorMessage = '을지대 정보검색 시스템이 초기화되지 않았습니다. 위의 초기화 버튼을 눌러주세요.';
        } else if (error.message.includes('404')) {
          errorMessage = '관련 정보를 찾을 수 없습니다. 다른 질문을 해보세요.';
        } else if (error.message.includes('500')) {
          errorMessage = '을지대 정보검색 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = '을지대 정보검색 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }
      
      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex].text = errorMessage;
        currentChat.messages[messageIndex].isLoading = false;
        currentChat.messages[messageIndex].isStreaming = false;
        currentChat.messages[messageIndex].currentStep = undefined;
        currentChat.messages[messageIndex].hasError = true;
      }
      
      isStreaming.value = false;
    } finally {
      currentController = null;
    }
  }

  async function callFastAPIChatWithImages(message: string, images: File[], messageIndex: number) {
    console.log("🚀 이미지 포함 FastAPI 호출 시작:", message, "이미지 수:", images.length);

    // 메시지 전처리: 상세 답변이 필요한 경우 보고서 스타일 지침 추가
    const preparedMessage = prepareMessageForAI(message, chatMode.value);
    if (preparedMessage !== message) {
      console.log("📝 ✅ 이미지 분석용 보고서 스타일 지침 추가됨");
      console.log("📋 전처리된 메시지 길이:", preparedMessage.length, "자");
    } else {
      console.log("💬 일반 모드로 전송");
    }

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
      formData.append('message', preparedMessage);
      
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

            // AI 메시지를 노션에 저장
            saveMessageToNotion(currentChat.id, false, responseText);

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

  // 노션에 메시지 저장 함수
  async function saveMessageToNotion(chatHistoryId: string, isUser: boolean, message: string) {
    if (!isAuthenticated()) return;

    try {
      await apiRequest(`${BACKEND_BASE_URL}/chat/history/${chatHistoryId}/message`, {
        method: 'POST',
        body: JSON.stringify({
          is_user: isUser,
          message: message
        })
      });
      console.log('✅ 메시지 노션에 저장 완료:', isUser ? '사용자' : 'AI', message.substring(0, 50));
    } catch (error) {
      console.error('❌ 메시지 노션 저장 실패:', error);
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

    // 사용자 메시지를 노션에 즉시 저장
    await saveMessageToNotion(currentChat.id, true, userMessageText);

    inputValue.value = '';
    // scrollToBottom will be called from the component

    isLoading.value = true;

    const loadingMessageIndex = currentChat.messages.length;
    const modeMessages = {
      general: "일반 대화 처리 중...",
      university: "대학생 전용 정보 검색 중...",
      study: "학습 도우미 분석 중...",
      career: "진로 상담 정보 수집 중...",
      cot: "단계별 추론 시작...",
      rag: "을지대학교 정보 검색 중..."
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
      } else if (chatMode.value === 'rag') {
        // RAG 모드: 초기화 상태 확인 및 필요시 자동 초기화
        if (!ragStatus.value.initialized && !ragStatus.value.isInitializing) {
          console.log('🔄 RAG 미초기화 감지 - 자동 초기화 시작');

          // 사용자에게 초기화 중임을 알림
          if (currentChat.messages[loadingMessageIndex]) {
            currentChat.messages[loadingMessageIndex].text = '을지대 정보검색 시스템을 초기화하고 있습니다...\n최초 실행 시 몇 분이 소요될 수 있습니다.';
            currentChat.messages[loadingMessageIndex].currentStep = 'RAG 시스템 초기화 중...';
          }

          const initSuccess = await initializeRag();

          if (!initSuccess) {
            throw new Error('RAG 시스템 초기화에 실패했습니다.\n\n현재 RAG 시스템이 올바르게 구성되지 않았습니다.\n관리자에게 문의하거나 다른 채팅 모드를 사용해주세요.');
          }

          console.log('✅ RAG 자동 초기화 완료');
        }

        await callFastAPIRagChat(userMessageText, loadingMessageIndex);
      } else {
        await callFastAPIChat(userMessageText, loadingMessageIndex);
      }
      
      // 첫 번째 메시지인 경우 AI로 제목 생성
      if (isFirstMessage) {
        try {
          const aiTitle = await generateChatTitle(userMessageText);
          currentChat.title = aiTitle;

          // 로그인된 사용자인 경우 백엔드에도 업데이트
          if (isAuthenticated() && currentChat.id) {
            await updateChatTitle(currentChat.id, aiTitle);
          }

          console.log('🏷️ AI가 생성한 대화 제목:', aiTitle);
        } catch (error) {
          console.error('제목 생성 실패, 기본 제목 사용:', error);
          currentChat.title = userMessageText.substring(0, 20);

          // 로그인된 사용자인 경우 기본 제목도 백엔드에 업데이트
          if (isAuthenticated() && currentChat.id) {
            await updateChatTitle(currentChat.id, currentChat.title);
          }
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
      cot: { name: '단계별 추론', description: 'Chain of Thought 방식' },
      rag: { name: '을지대 정보검색', description: '을지대학교 공식 자료 기반 정보 검색' }
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

  async function updateChatTitle(chatId: string, newTitle: string) {
    const chat = chatHistory.value.find(c => c.id === chatId);
    if (!chat) return;

    // 로그인된 사용자인 경우 백엔드에 업데이트
    if (isAuthenticated()) {
      try {
        console.log(`📝 채팅 제목 수정 중... (ID: ${chatId})`);
        const response = await apiRequest(`${BACKEND_BASE_URL}/chat/history/${chatId}`, {
          method: 'PUT',
          body: JSON.stringify({ title: newTitle })
        });

        if (response.ok) {
          console.log('✅ 채팅 제목 수정 완료');
        }
      } catch (error) {
        console.error('❌ 채팅 제목 수정 실패:', error);
        // 에러가 나도 로컬에서는 수정 진행
      }
    }

    // 로컬 상태 업데이트
    chat.title = newTitle;
    saveChatHistory();
    console.log('📝 대화 제목 수정:', newTitle);
  }

  // RAG 시스템 상태 확인
  async function checkRagStatus() {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/rag/status`);
      if (response.ok) {
        const data = await response.json();
        ragStatus.value.initialized = data.initialized;
        ragStatus.value.systemInfo = data;
        ragStatus.value.error = null;
        console.log("🔍 RAG 상태 확인:", data);
        return data;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error("❌ RAG 상태 확인 실패:", error);
      ragStatus.value.error = error.message;
      ragStatus.value.initialized = false;
      return null;
    }
  }

  // RAG 시스템 초기화
  async function initializeRag() {
    ragStatus.value.isInitializing = true;
    ragStatus.value.error = null;
    
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/rag/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ RAG 초기화 성공:", data);
        ragStatus.value.initialized = true;
        ragStatus.value.error = null;
        await checkRagStatus(); // 상태 업데이트
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error("❌ RAG 초기화 실패:", error);
      ragStatus.value.error = error.message;
      ragStatus.value.initialized = false;
      return false;
    } finally {
      ragStatus.value.isInitializing = false;
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
    // RAG 시스템 관련
    ragStatus,
    checkRagStatus,
    initializeRag,
  };
}
