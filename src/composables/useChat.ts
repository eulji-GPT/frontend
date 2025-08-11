import { ref, nextTick, onMounted } from 'vue';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const chatHistory = ref<ChatSession[]>([]);
  const currentChatId = ref<string | null>(null);
  const isLoading = ref(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent';

  onMounted(() => {
    loadChatHistory();
    if (chatHistory.value.length > 0) {
      selectChat(chatHistory.value[0].id);
    } else {
      startNewChat();
    }
  });

  function loadChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
      chatHistory.value = JSON.parse(history);
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

  async function callGeminiStreamAPI(message: string, messageIndex: number) {
    console.log("API Key:", GEMINI_API_KEY);
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);
    if (!currentChat) return;

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

      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex] = {
          ...currentChat.messages[messageIndex],
          text: '',
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
                  if (currentChat.messages[messageIndex]) {
                    currentChat.messages[messageIndex].text = accumulatedText;
                  }
                  // scrollToBottom(); // This will be handled by the component
                }
              }
            } catch (parseError) {
              // JSON 파싱 실패는 무시
            }
          }
        }
      }

      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex].text = gotResponse ? accumulatedText : '응답을 받지 못했습니다.';
        currentChat.messages[messageIndex].isStreaming = false;
        saveChatHistory();
      }

    } catch (error) {
      console.error('Gemini 스트리밍 API 호출 오류:', error);
      if (currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex].text = '죄송합니다. 현재 응답을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.';
        currentChat.messages[messageIndex].isLoading = false;
        currentChat.messages[messageIndex].isStreaming = false;
      }
    }
  }

  async function handleSend(inputValue: ref<string>) {
    if (!inputValue.value.trim() || isLoading.value) return;

    const userMessageText = inputValue.value.trim();
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);

    if (!currentChat) return;

    if (currentChat.messages.length === 0) {
        currentChat.title = userMessageText.substring(0, 20);
    }

    currentChat.messages.push({
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
    });

    inputValue.value = '';
    // scrollToBottom will be called from the component

    isLoading.value = true;

    const loadingMessageIndex = currentChat.messages.length;
    currentChat.messages.push({
      text: "답변을 생성하고 있습니다...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    });

    try {
      await callGeminiStreamAPI(userMessageText, loadingMessageIndex);
    } catch (error) {
      console.error('스트리밍 오류:', error);
      if (currentChat.messages[loadingMessageIndex]) {
        currentChat.messages[loadingMessageIndex] = {
          text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
          isUser: false,
          timestamp: new Date(),
        };
      }
    } finally {
      isLoading.value = false;
      saveChatHistory();
      // scrollToBottom will be called from the component
    }
  }

  return {
    messages,
    chatHistory,
    currentChatId,
    isLoading,
    loadChatHistory,
    saveChatHistory,
    startNewChat,
    selectChat,
    deleteChat,
    handleSend,
  };
}
