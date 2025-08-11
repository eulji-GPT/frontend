<!-- Test comment to force re-compilation -->
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
          <div class="edit-icon" @click="startNewChat"></div>
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
              <span class="library-study-room-reservation">도서관 ∙ 열람실 자리 예약</span>
            </div>
            <div class="frame-9">
              <div class="group-a"></div>
              <span class="status">학식당 현황</span>
            </div>
          </div>
          <ChatHistory 
            :chatHistory="chatHistory" 
            :currentChatId="currentChatId" 
            @selectChat="selectChat"
            @startNewChat="startNewChat"
            @deleteChat="deleteChat"
          />
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
      <ChatMessageArea :messages="messages" />
      <ChatInput :isLoading="isLoading" @sendMessage="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChatHistory from './ChatHistory.vue';
import ChatMessageArea from './ChatMessageArea.vue';
import ChatInput from './ChatInput.vue';
import { useChat } from '../../composables/useChat';
import "./index.css";

const { 
  messages, 
  chatHistory, 
  currentChatId, 
  isLoading, 
  startNewChat, 
  selectChat, 
  deleteChat, 
  handleSend 
} = useChat();

const handleSendMessage = (message: string) => {
  const inputValue = ref(message);
  handleSend(inputValue);
};

</script>

<style scoped>
/* Keep only the styles for the main layout */
.main-container {
  display: flex;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.chatbot-sidebar-wrapper {
  display: flex;
  flex-direction: column;
  width: 270px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

.chat-content-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* Important for child flex shrinkage */
  height: 100vh;
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
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 49px;
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
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 15px;
  position: relative;
  width: 145px;
  z-index: 11;
}
.common-icon {
  flex-shrink: 0;
  position: relative;
  width: 24px;
  height: 24px;
  background: url('./icon/-three.svg') no-repeat center;
  background-size: cover;
  z-index: 12;
  overflow: hidden;
}
.group {
  flex-shrink: 0;
  position: relative;
  width: 106px;
  height: 36.3px;
  z-index: 13;
}
.eulgpt {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  height: 36.3px;
  top: 0;
  left: 0;
  color: #02478a;
  font-family: Poppins, var(--default-font-family);
  font-size: 24.023174285888672px;
  font-weight: 700;
  line-height: 36.035px;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 0.48px;
  z-index: 14;
}
.union {
  position: absolute;
  width: 10.39px;
  height: 10.391px;
  top: 1.603px;
  left: 95.61px;
  background: url('./icon/Union.svg') no-repeat center;
  background-size: cover;
  z-index: 15;
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
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 16px;
  position: relative;
  width: 100%;
  padding: 0 20px 0 20px;
  background: #ffffff;
  z-index: 18;
}
.frame-3 {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 10px;
  position: relative;
  width: 115px;
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
  height: 22.003px;
  margin: -4.751px 0 0 0;
  background: rgba(2, 71, 138, 0.1);
  z-index: 22;
  overflow: hidden;
  border-radius: 6.251px;
}
.day {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  height: 54px;
  top: -16.5px;
  left: 3.75px;
  color: #02478a;
  font-family: Pretendard, var(--default-font-family);
  font-size: 36px;
  font-weight: 700;
  line-height: 54px;
  text-align: left;
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
  display: flex;
  align-items: center;
  align-self: stretch;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 10px;
  position: relative;
  min-width: 0;
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
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 10px;
  position: relative;
  width: 99px;
  z-index: 28;
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

</style>
