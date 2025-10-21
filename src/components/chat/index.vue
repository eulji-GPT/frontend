<!-- Test comment to force re-compilation -->
<template>
  <div class="main-container">
    <div class="mobile-overlay" v-if="showMobileOverlay" @click="toggleSidebar"></div>
    <div class="chatbot-sidebar-wrapper" :class="{ 'mobile-hidden': !sidebarVisible }" :style="{ width: sidebarWidth + 'px' }">
      <div class="frame">
        <div class="chatbot-logo-header">
          <div class="frame-1" @click="goToHome" style="cursor: pointer;">
            <div class="logo-icon"></div>
            <img :src="eulLogo" alt="EULGPT 로고" class="eulgpt-logo-svg" />
          </div>
          <div class="edit-icon" @click="startNewChat"></div>
        </div>
        <div class="frame-2">
          <div class="chatbot-menu-item">
            <div class="frame-3" @click="goToCrew">
              <div class="group-4">
                <div class="group-5"></div>
                <div class="frame-6"><span class="day">DAY</span></div>
              </div>
              <span class="empty-classroom-check">빈 강의실 확인</span>
            </div>
            <div class="frame-7" @click="goToCrew">
              <div class="group-8"></div>
              <span class="library-study-room-reservation">도서관 ∙ 열람실 자리 예약</span>
            </div>
            <div class="frame-9" @click="goToCrew">
              <div class="group-a"></div>
              <span class="status">학식당 현황</span>
            </div>
            <div class="frame-9-1" @click="goToFortuneMain">
              <div class="group-b"></div>
              <span class="status-fortune">사주 ∙ 운세 챗봇</span>
            </div>
          </div>
          <ChatHistory 
            :chatHistory="chatHistory" 
            :currentChatId="currentChatId" 
            @selectChat="selectChat"
            @startNewChat="startNewChat"
            @deleteChat="deleteChat"
            @updateChatTitle="updateChatTitle"
          />
        </div>
      </div>
      <div class="side-footer" @click="toggleMyPageModal">
        <div class="ellipse">
          <img v-if="userProfileImage" :src="userProfileImage" alt="프로필" class="profile-image" />
        </div>
        <div class="frame-12">
          <div class="notification-container" @click="toggleNotificationDropdown">
            <div class="notification"></div>
            <NotificationDropdown :isVisible="showNotificationDropdown" />
          </div>
          <div class="icon-info" @click="toggleInfoPanel">
            <div class="vector"></div>
            <InfoPanel :isVisible="showInfoPanel" />
          </div>
        </div>
      </div>
      <div 
        class="sidebar-resizer"
        v-if="!isMobile"
        @mousedown="startResize"
        :class="{ 'resizing': isResizing }"
      ></div>
    </div>
    <div class="chat-content-col">
      <div class="mobile-header">
        <button class="mobile-menu-toggle" @click="toggleSidebar">
          <div class="hamburger-icon"></div>
        </button>
        <div class="mobile-logo">
          <span class="eulgpt-mobile">EULGPT</span>
        </div>
      </div>

      <!-- Mode selector - 전체 화면 기준 절대 위치 -->
      <div v-if="currentView === 'chat'" class="mode-selector-container" :style="{ left: (sidebarWidth + 18) + 'px' }">
        <ChatModeSelector
          :currentMode="chatMode"
          :isProUser="isProUser"
          @modeChange="handleModeChange"
        />
      </div>

      <div class="chat-content-col">
        <!-- 일반 채팅 화면 -->
        <div v-if="currentView === 'chat'" class="chat-main-area">
          <div class="rag-initializer-container">
            <RagInitializer />
          </div>
          <div class="chat-messages-container">
            <ChatMessageArea
              :messages="messages"
              @feedback="handleMessageFeedback"
              @regenerate="handleMessageRegenerate"
              @openArtifact="handleOpenArtifact"
            />
          </div>
          <div class="chat-input-area">
            <ChatInput
              :isLoading="isLoading"
              :isStreaming="isStreaming"
              @sendMessage="handleSendMessage"
              @stopResponse="stopResponse"
            />
            <button class="help-button" @click="toggleInfoPanel" title="도움말">
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="11.5" r="0.5" fill="black"/>
                <path d="M4 1C2.34315 1 1 2.34315 1 4H2C2 2.89543 2.89543 2 4 2C5.10457 2 6 2.89543 6 4C6 5.10457 5.10457 6 4 6V9H5V6C6.65685 6 8 4.65685 8 3C8 1.34315 6.65685 0 5 0H4V1Z" fill="black"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 운세 메인 화면 -->
        <FortuneMain 
          v-else-if="currentView === 'fortune-main'"
          @showFortuneResult="showFortuneResult"
        />

        <!-- 운세 채팅 화면 -->
        <FortuneChat 
          v-else-if="currentView === 'fortune-chat'"
          @goBack="goBackToChat"
        />

        <!-- 운세 결과 화면 -->
        <FortuneResult 
          v-else-if="currentView === 'fortune-result' && fortuneResultData"
          :fortuneData="fortuneResultData"
          @goBack="goBackToFortuneMain"
          @retry="retryFortune"
        />
      </div>
    </div>

    <!-- RAG Source Sidebar -->
    <SourceSidebar
      v-if="showSourceSidebar && currentRagSources"
      :sources="currentRagSources"
      @close="handleCloseSidebar"
    />

    <!-- Artifact Panel -->
    <ArtifactPanel
      v-if="showArtifactPanel && currentArtifact"
      :artifact="currentArtifact"
      @close="handleCloseArtifact"
      @update="handleUpdateArtifact"
      @regenerate="handleRegenerateArtifact"
      @improveSelection="handleImproveSelection"
    />

    <!-- My Page Modal -->
    <MyPageModal
      :isVisible="showMyPageModal"
      @close="toggleMyPageModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ChatHistory from './ChatHistory.vue';
import ChatMessageArea from './ChatMessageArea.vue';
import ChatInput from './ChatInput.vue';
import ChatModeSelector from './ChatModeSelector.vue';
import RagInitializer from './RagInitializer.vue';
import SourceSidebar from './SourceSidebar.vue';
import ArtifactPanel from './ArtifactPanel.vue';
import NotificationDropdown from '../common/NotificationDropdown.vue';
import InfoPanel from '../common/InfoPanel.vue';
import MyPageModal from '../common/MyPageModal.vue';
import FortuneMain from '../fortune/FortuneMain.vue';
import FortuneChat from '../fortune/FortuneChat.vue';
import FortuneResult from '../fortune/FortuneResult.vue';
import { useChat } from '../../composables/useChat';
import type { ChatMode, RagSource, Artifact, ArtifactVersion } from '../../composables/useChat';
import eulLogo from '../../assets/eul_logo.svg';

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_FASTAPI_URL || '/api';
import "./index.css";

const { 
  messages, 
  chatHistory, 
  currentChatId, 
  isLoading, 
  isStreaming,
  chatMode,
  startNewChat, 
  selectChat, 
  deleteChat, 
  handleSend,
  stopResponse,
  updateChatTitle,
  setChatMode
} = useChat();

const handleSendMessage = (message: string, images?: File[]) => {
  const inputValue = { value: message };
  handleSend(inputValue, images);
};

const handleModeChange = (mode: ChatMode) => {
  setChatMode(mode);
};

// 운세 화면 상태 관리
const currentView = ref<'chat' | 'fortune-main' | 'fortune-chat' | 'fortune-result'>('chat');
const fortuneResultData = ref(null);

// 피드백 처리
const handleMessageFeedback = (type: 'good' | 'bad', messageId: string) => {
  console.log(`메시지 피드백 처리: ${type}`, messageId);
  // TODO: 피드백 데이터를 서버에 전송하거나 로컬 저장소에 저장
};

// 답변 재생성 처리
const handleMessageRegenerate = (messageId: string) => {
  console.log('답변 재생성 처리:', messageId);
  
  try {
    // messageId에서 인덱스 추출 (예: "1-1234567890" -> 1)
    const messageIndex = parseInt(messageId.split('-')[0]);
    const currentChat = chatHistory.value.find(c => c.id === currentChatId.value);
    
    if (!currentChat || !currentChat.messages[messageIndex]) {
      console.error('재생성할 메시지를 찾을 수 없습니다.');
      return;
    }
    
    // 해당 메시지가 봇 메시지인지 확인
    if (currentChat.messages[messageIndex].isUser) {
      console.error('사용자 메시지는 재생성할 수 없습니다.');
      return;
    }
    
    // 이전 사용자 메시지 찾기 (재생성할 답변의 바로 전 메시지)
    let userMessage = '';
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (currentChat.messages[i].isUser) {
        userMessage = currentChat.messages[i].text;
        break;
      }
    }
    
    if (!userMessage) {
      console.error('재생성을 위한 사용자 메시지를 찾을 수 없습니다.');
      return;
    }
    
    console.log('🔄 답변 재생성 시작:', userMessage.substring(0, 50) + '...');
    
    // 기존 봇 메시지를 로딩 상태로 변경
    currentChat.messages[messageIndex] = {
      ...currentChat.messages[messageIndex],
      text: '답변을 다시 생성하고 있습니다...',
      isLoading: true,
      isStreaming: false,
      currentStep: '답변 재생성 중...',
      hasError: false
    };
    
    // 기존 메시지 제거 (마지막 봇 응답만)
    currentChat.messages.splice(messageIndex, 1);
    
    // handleSend를 사용하여 재생성
    const inputValue = { value: userMessage };
    handleSend(inputValue);
    
  } catch (error) {
    console.error('답변 재생성 오류:', error);
  }
};

// 아티팩트 열기 처리
const handleOpenArtifact = (messageId: string) => {
  console.log('아티팩트 열기 요청:', messageId);
  showArtifactPanel.value = true;
};

// 디버깅을 위한 messages 로그
console.log('현재 메시지들:', messages.value);

const isMobile = ref(false);
const sidebarVisible = ref(true);
const sidebarWidth = ref(Number(localStorage.getItem('sidebarWidth')) || 270);
const isResizing = ref(false);
const minSidebarWidth = 200;
const maxSidebarWidth = 500;
const showNotificationDropdown = ref(false);
const showInfoPanel = ref(false);
const showMyPageModal = ref(false);
const userProfileImage = ref<string | null>(null);
const isProUser = ref(false);
const showSourceSidebar = ref(true); // RAG 소스 사이드바 표시 여부
const showArtifactPanel = ref(true); // 아티팩트 패널 표시 여부

const showMobileOverlay = computed(() => isMobile.value && sidebarVisible.value);

// 최신 RAG 소스 가져오기 (가장 마지막 봇 메시지의 소스)
const currentRagSources = computed(() => {
  if (chatMode.value !== 'rag') return undefined;

  // 메시지를 역순으로 탐색하여 가장 최근의 RAG 소스 찾기
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const msg = messages.value[i];
    if (!msg.isUser && msg.ragSources && msg.ragSources.length > 0) {
      return msg.ragSources;
    }
  }
  return undefined;
});

// 최신 아티팩트 가져오기 (가장 마지막 봇 메시지의 아티팩트)
const currentArtifact = computed(() => {
  // 메시지를 역순으로 탐색하여 가장 최근의 아티팩트 찾기
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const msg = messages.value[i];
    if (!msg.isUser && msg.artifact) {
      return msg.artifact;
    }
  }
  return undefined;
});

const handleCloseSidebar = () => {
  showSourceSidebar.value = false;
};

const handleCloseArtifact = () => {
  showArtifactPanel.value = false;
};

const handleUpdateArtifact = (updatedArtifact: Artifact) => {
  console.log('아티팩트 업데이트:', updatedArtifact);

  // 가장 최근 아티팩트가 있는 메시지 찾기
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const msg = messages.value[i];
    if (!msg.isUser && msg.artifact) {
      // 아티팩트 업데이트
      msg.artifact = updatedArtifact;

      // 채팅 히스토리 저장
      saveChatHistory();
      console.log('✅ 아티팩트가 업데이트되었습니다.');
      break;
    }
  }
};

const handleRegenerateArtifact = async (artifact: Artifact) => {
  console.log('🔄 아티팩트 재생성 요청');

  // 재생성 요청 메시지 추가
  const regenerateMessage = `"${artifact.title}" 아티팩트를 완전히 새롭게 재작성해주세요. 이전 내용과는 다른 관점이나 추가 정보를 포함하여 더 풍부한 내용으로 작성해주세요.`;

  // 사용자 메시지로 추가 (handleSend 사용)
  const inputValue = { value: regenerateMessage };
  handleSend(inputValue);
};

const handleImproveSelection = async (payload: { selectedText: string; fullContent: string }) => {
  console.log('🤖 텍스트 개선 요청:', payload.selectedText.substring(0, 50));

  // 개선 요청 메시지 생성
  const improveMessage = `다음 텍스트를 개선해주세요:\n\n"${payload.selectedText}"\n\n전체 맥락:\n${payload.fullContent.substring(0, 500)}...`;

  try {
    const response = await fetch(`${import.meta.env.VITE_GEMINI_FASTAPI_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: improveMessage,
        context: [],
        session_id: currentChat.sessionId
      })
    });

    if (!response.ok) {
      throw new Error('AI 개선 요청 실패');
    }

    const data = await response.json();
    const improvedText = data.response;

    console.log('✅ 텍스트 개선 완료');

    // 개선된 텍스트로 아티팩트 업데이트
    for (let i = messages.value.length - 1; i >= 0; i--) {
      const msg = messages.value[i];
      if (!msg.isUser && msg.artifact) {
        const newContent = msg.artifact.content.replace(payload.selectedText, improvedText);

        const newVersion: ArtifactVersion = {
          content: newContent,
          timestamp: Date.now(),
          description: 'AI 부분 개선'
        };

        msg.artifact = {
          ...msg.artifact,
          content: newContent,
          versions: [...(msg.artifact.versions || []), newVersion],
          currentVersion: (msg.artifact.versions?.length || 0)
        };

        saveChatHistory();
        console.log('✅ 개선된 텍스트로 아티팩트 업데이트됨');
        break;
      }
    }
  } catch (error) {
    console.error('텍스트 개선 실패:', error);
    alert('텍스트 개선에 실패했습니다. 다시 시도해주세요.');
  }
};

const checkMobileSize = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    sidebarVisible.value = false;
  } else {
    sidebarVisible.value = true;
  }
};

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

const toggleNotificationDropdown = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log('Notification icon clicked!');
  showNotificationDropdown.value = !showNotificationDropdown.value;
  showInfoPanel.value = false; // 다른 패널 닫기
  console.log('Notification dropdown toggled:', showNotificationDropdown.value);
};

const toggleInfoPanel = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log('Info icon clicked!');
  showInfoPanel.value = !showInfoPanel.value;
  showNotificationDropdown.value = false; // 다른 패널 닫기
  console.log('Info panel toggled:', showInfoPanel.value);
};

const toggleMyPageModal = () => {
  showMyPageModal.value = !showMyPageModal.value;
};

const startResize = (e: MouseEvent) => {
  if (isMobile.value) return;
  
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = sidebarWidth.value;
  
  const handleMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const newWidth = startWidth + deltaX;
    
    if (newWidth >= minSidebarWidth && newWidth <= maxSidebarWidth) {
      sidebarWidth.value = newWidth;
    }
  };
  
  const handleMouseUp = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // 사이드바 크기를 localStorage에 저장
    localStorage.setItem('sidebarWidth', sidebarWidth.value.toString());
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  
  e.preventDefault();
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.notification-container')) {
    showNotificationDropdown.value = false;
  }
  if (!target.closest('.icon-info')) {
    showInfoPanel.value = false;
  }
};

// 사용자 프로필 정보 가져오기
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/member/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.profile_image_url) {
        userProfileImage.value = data.profile_image_url;
      }
      isProUser.value = data.is_pro || false;
    }
  } catch (error) {
    console.error('프로필 정보 로드 오류:', error);
  }
};

onMounted(() => {
  checkMobileSize();
  fetchUserProfile();
  window.addEventListener('resize', checkMobileSize);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileSize);
  document.removeEventListener('click', handleClickOutside);
});

const goToHome = () => {
  router.push('/');
};

const goToCrew = () => {
  router.push('/crew');
};

// Reserved for future use
// const goToDevelopmentStatus = () => {
//   router.push('/development-status');
// };

const goToFortuneMain = () => {
  currentView.value = 'fortune-main';
};

const showFortuneResult = (data: any) => {
  fortuneResultData.value = data;
  currentView.value = 'fortune-result';
};

const goBackToChat = () => {
  currentView.value = 'chat';
};

const goBackToFortuneMain = () => {
  currentView.value = 'fortune-main';
};

const retryFortune = () => {
  currentView.value = 'fortune-main';
};

</script>

<style scoped>
/* Keep only the styles for the main layout */
.main-container {
  display: flex;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  position: relative;
}

.chatbot-sidebar-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 270px;
  height: 100vh;
  background: #ffffff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid #e5e7eb;
  min-width: 200px;
  max-width: 500px;
  border-radius: 20px;
  box-shadow:
    inset 0px 0px 6px 0px rgba(255, 255, 255, 0.15),
    inset 2px 2px 4px 0px rgba(255, 255, 255, 0.96),
    inset -2px -2px 3px 0px rgba(255, 255, 255, 0.7);
}

.chat-content-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* Important for child flex shrinkage */
  height: 100vh;
  padding: 0;
  box-sizing: border-box;
}

/* Other layout styles from the original file can be kept here */
.frame {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex: 1 1 0%;
  min-height: 0;
  position: relative;
  width: 100%;
  padding: 8px 0 0 0;
  z-index: 9;
}
.chatbot-logo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-shrink: 0;
  position: relative;
  width: 100%;
  height: 36px;
  padding: 0 20px 0 20px;
  background: #ffffff;
  /* border-right removed to prevent double lines */
  z-index: 10;
}
.frame-1 {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 15px;
  box-sizing: border-box;
  flex-shrink: 1;
  position: relative;
  min-width: 0;
  z-index: 11;
}

.logo-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: url('./icon/-three.svg') no-repeat center;
  background-size: cover;
  object-fit: cover;
}

.eulgpt-logo-svg {
  height: 36px;
  width: auto;
  object-fit: contain;
}
.edit-icon {
  flex-shrink: 0;
  position: relative;
  width: 22px;
  height: 22px;
  background: url('./icon/write.svg') no-repeat center;
  background-size: cover;
  z-index: 16;
  overflow: hidden;
}
.frame-2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 40px;
  position: relative;
  min-width: 0;
  height: 681px;
  padding: 20px 0 0 0;
  z-index: 17;
}
.chatbot-menu-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 16px;
  position: relative;
  width: 100%;
  padding: 0 20px 0 20px;
  background: transparent;
  z-index: 18;
}

.chatbot-menu-item > div {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 13px;
  position: relative;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
}

.chatbot-menu-item > div:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}
.frame-3 {
  z-index: 19;
}
.group-4 {
  flex-shrink: 0;
  position: relative;
  width: 25px;
  height: 27.004px;
  z-index: 20;
}
.group-5 {
  position: relative;
  width: 14.078px;
  height: 9.751px;
  margin: 0 0 0 5.582px;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-07-31/CcpStAfx5O.png)
    no-repeat center;
  background-size: 100% 100%;
  z-index: 21;
  border-radius: 6.251px;
}
.frame-6 {
  position: relative;
  width: 25px;
  height: 25px;
  margin: -4.751px 0 0 0;
  background: rgba(2, 71, 138, 0.1);
  z-index: 22;
  overflow: visible;
  border-radius: 6.251px;
}
.day {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 25px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: #02478a;
  font-family: Pretendard, var(--default-font-family);
  font-size: 10px;
  font-weight: 700;
  line-height: 25px;
  text-align: center;
  white-space: nowrap;
  z-index: 23;
}
.empty-classroom-check {
  flex-shrink: 0;
  flex-basis: auto;
  position: relative;
  height: 23px;
  color: #000000;
  font-family: Pretendard, var(--default-font-family);
  font-size: 14px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  white-space: nowrap;
  z-index: 24;
}
.frame-7 {
  z-index: 25;
}
.group-8 {
  flex-shrink: 0;
  position: relative;
  width: 25px;
  height: 25px;
  background: url('./icon/도서관.svg') no-repeat center;
  background-size: cover;
  z-index: 26;
}
.library-study-room-reservation {
  flex-shrink: 0;
  flex-basis: auto;
  position: relative;
  height: 23px;
  color: #000000;
  font-family: Pretendard, var(--default-font-family);
  font-size: 14px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  white-space: nowrap;
  z-index: 27;
}
.frame-9 {
  z-index: 28;
}
.frame-9-1 {
  z-index: 30;
}
.group-b {
  flex-shrink: 0;
  position: relative;
  width: 25px;
  height: 25px;
  background: url('./icon/사주.svg') no-repeat center;
  background-size: cover;
  z-index: 31;
}
.status-fortune {
  flex-shrink: 0;
  flex-basis: auto;
  position: relative;
  height: 23px;
  color: #000000;
  font-family: Pretendard, var(--default-font-family);
  font-size: 14px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  white-space: nowrap;
  z-index: 32;
}
.group-a {
  flex-shrink: 0;
  position: relative;
  width: 25px;
  height: 25px;
  background: url('./icon/학식당.svg') no-repeat center;
  background-size: cover;
  z-index: 29;
}
.status {
  flex-shrink: 0;
  flex-basis: auto;
  position: relative;
  height: 23px;
  color: #000000;
  font-family: Pretendard, var(--default-font-family);
  font-size: 14px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  white-space: nowrap;
  z-index: 35;
}
.side-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-shrink: 0;
  position: relative;
  width: 100%;
  height: 59px;
  padding: 20px 10px 20px 20px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  z-index: 42;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.side-footer:hover {
  background: #f9fafb;
}
.ellipse {
  flex-shrink: 0;
  position: relative;
  width: 23px;
  height: 23px;
  background: url('./icon/회색원.svg') no-repeat center;
  background-size: cover;
  z-index: 43;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ellipse .profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.frame-12 {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 15px;
  position: relative;
  width: 80px;
  padding: 10px 10px 10px 10px;
  z-index: 44;
}
.notification {
  flex-shrink: 0;
  position: relative;
  width: 23px;
  height: 24px;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-07-31/iOezR9XJsU.png)
    no-repeat center;
  background-size: cover;
  z-index: 45;
}
.icon-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 4px;
  position: relative;
  width: 22px;
  height: 22px;
  padding: 2px 2px 2px 2px;
  z-index: 46;
  overflow: hidden;
}
.vector {
  flex-shrink: 0;
  position: relative;
  width: 18px;
  height: 18px;
  background: url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-07-31/SMBaVrFnBf.png)
    no-repeat center;
  background-size: cover;
  z-index: 47;
}


/* Mobile overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

/* Mobile header */
.mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.mobile-menu-toggle {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.mobile-menu-toggle:hover {
  background: #f3f4f6;
}

.hamburger-icon {
  width: 20px;
  height: 2px;
  background: #02478a;
  position: relative;
}

.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: #02478a;
  left: 0;
}

.hamburger-icon::before {
  top: -6px;
}

.hamburger-icon::after {
  top: 6px;
}

.mobile-logo .eulgpt-mobile {
  color: #02478a;
  font-family: Poppins, var(--default-font-family);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.4px;
}

/* Mode selector container */
.mode-selector-container {
  position: absolute;
  top: 20px;
  display: flex;
  justify-content: flex-start;
  flex-shrink: 0;
  z-index: 100;
}

.chat-main-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  position: relative;
}

.chat-messages-container {
  flex: 1;
  min-height: 0;
  overflow: visible; /* 오른쪽 말풍선이 잘리지 않도록 변경 */
}

.chat-input-area {
  flex-shrink: 0;
  position: relative;
}

.help-button {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 34px;
  height: 34px;
  min-width: 34px;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 100px;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
  z-index: 101;
  overflow: visible;
}

.help-button:hover {
  background-color: #F3F4F6;
}

.help-button svg {
  width: 10px;
  height: 16px;
  display: block;
}

/* Sidebar resizer */
.sidebar-resizer {
  position: absolute;
  top: 0;
  right: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  z-index: 1001;
  transition: background-color 0.2s ease;
}

.sidebar-resizer:hover {
  background: rgba(59, 130, 246, 0.3);
}

.sidebar-resizer.resizing {
  background: rgba(59, 130, 246, 0.5);
}

.sidebar-resizer::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 2px;
  height: 40px;
  background: #d1d5db;
  border-radius: 1px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.sidebar-resizer:hover::after,
.sidebar-resizer.resizing::after {
  opacity: 1;
}

/* Responsive styles */
@media (max-width: 768px) {
  .main-container {
    position: relative;
  }
  
  .mobile-overlay {
    display: block;
  }
  
  .mobile-header {
    display: flex;
  }
  
  .chatbot-sidebar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px !important;
    min-width: unset !important;
    max-width: unset !important;
    height: 100vh;
    z-index: 1000;
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
  }
  
  .chatbot-sidebar-wrapper.mobile-hidden {
    transform: translateX(-100%);
  }
  
  .sidebar-resizer {
    display: none;
  }
  
  .chat-content-col {
    width: 100%;
    margin-left: 0;
    padding: 0;
  }
}

@media (max-width: 480px) {
  .chatbot-sidebar-wrapper {
    width: 100% !important;
  }
  
  .chatbot-logo-header {
    padding: 0 12px;
    height: auto;
    min-height: 36px;
  }
  
  .eulgpt-logo-svg {
    height: 30px;
  }
  
  .logo-icon {
    width: 20px;
    height: 20px;
  }
  
  .edit-icon {
    width: 20px;
    height: 20px;
  }
  
  .chatbot-menu-item {
    padding: 0 12px;
  }
  
  .mode-selector-container {
    padding: 12px 0 0 16px;
  }
  
  .empty-classroom-check,
  .library-study-room-reservation,
  .status,
  .status-fortune {
    font-size: 13px;
  }
  
  .mobile-logo .eulgpt-mobile {
    font-size: 18px;
  }
  
  .chat-content-col {
    padding: 0;
  }
}

/* Small mobile additional breakpoint */
@media (max-width: 320px) {
  .chatbot-logo-header {
    padding: 0 8px;
  }
  
  .eulgpt-logo-svg {
    height: 26px;
  }
  
  .logo-icon {
    width: 18px;
    height: 18px;
  }
  
  .edit-icon {
    width: 18px;
    height: 18px;
  }
  
  .chat-content-col {
    padding: 0;
  }
}

/* Medium screens */
@media (max-width: 640px) and (min-width: 481px) {
  .chatbot-logo-header {
    padding: 0 16px;
  }
  
  .eulgpt-logo-svg {
    height: 32px;
  }
  
  .logo-icon {
    width: 22px;
    height: 22px;
  }
  
  .chat-content-col {
    padding: 0;
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .chatbot-sidebar-wrapper {
    width: 240px;
  }
  
  .chatbot-logo-header {
    padding: 0 16px;
  }
  
  .chatbot-menu-item {
    padding: 0 16px;
  }
  
  .chat-content-col {
    padding: 0;
  }
}

</style>
