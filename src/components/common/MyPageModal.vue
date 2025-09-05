<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-layout">
        <!-- Left Navigation -->
        <div class="modal-nav">
          <div class="nav-header">
            <h2 class="nav-title">마이페이지</h2>
          </div>
          
          <div class="nav-menu">
            <div 
              class="nav-item" 
              :class="{ active: activeTab === 'mypage' }"
              @click="activeTab = 'mypage'"
            >
              <span>내정보</span>
            </div>
            <div 
              class="nav-item"
              :class="{ active: activeTab === 'settings' }"
              @click="activeTab = 'settings'"
            >
              <span>설정</span>
            </div>
          </div>
        </div>
        
        <!-- Right Content -->
        <div class="modal-content">
          <!-- 마이페이지 / 내정보 -->
          <div v-if="activeTab === 'mypage'" class="content-section">
            <div class="profile-section">
              <div class="profile-image">
                <div class="avatar-placeholder">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="15" r="6" fill="#9CA3AF"/>
                    <path d="M8 35c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9CA3AF"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="user-info-section">
              <div class="user-info-card">
                <div class="user-info-content">
                  <div class="name-section">
                    <div class="name-info">
                      <div class="label">이름</div>
                      <div class="value">최가을</div>
                    </div>
                    <button class="edit-button">
                      <span class="button-text">수정</span>
                    </button>
                  </div>
                  <div class="reservation-section">
                    <div class="section-title">예약</div>
                    <div class="reservation-items">
                      <div class="reservation-item">
                        <span class="item-text">빈강의실 확인</span>
                        <button class="view-button">
                          <span class="button-text">조회</span>
                        </button>
                      </div>
                      <div class="reservation-item">
                        <span class="item-text">도서관 • 열람실 확인</span>
                        <button class="view-button">
                          <span class="button-text">조회</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="kakao-section">
                <span class="kakao-text">카카오 계정과 연동하기</span>
                <button class="connect-button">
                  <span class="button-text">연동</span>
                </button>
              </div>
            </div>
            <div class="premium-section">
              <div class="premium-card">
                <div class="premium-content">
                  <div class="premium-info">
                    <div class="premium-brand">
                      <div class="brand-group">
                        <span class="eulgpt-text">EULGPT</span>
                        <div class="union-icon"></div>
                      </div>
                    </div>
                    <span class="premium-description">이메일을 인증 시, 더 많은 기능</span>
                  </div>
                  <button class="verify-button">
                    <span class="verify-text">인증</span>
                  </button>
                </div>
                <div class="premium-logo">
                  <div class="logo-group">
                    <span class="eulgpt-large">EULGPT</span>
                    <div class="union-large"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 설정 -->
          <div v-else-if="activeTab === 'settings'" class="settings-section">
            <!-- 화면 테마 -->
            <div class="settings-group">
              <div class="settings-title">화면 테마</div>
              <div class="theme-buttons">
                <button class="theme-button" :class="{ active: selectedTheme === 'light' }" @click="setTheme('light')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                  <span>라이트</span>
                </button>
                <button class="theme-button" :class="{ active: selectedTheme === 'dark' }" @click="setTheme('dark')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79z"/>
                  </svg>
                  <span>다크</span>
                </button>
                <button class="theme-button" :class="{ active: selectedTheme === 'system' }" @click="setTheme('system')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <span>시스템</span>
                </button>
              </div>
            </div>
            
            <!-- 전체 데이터 삭제 -->
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-title">전체 데이터 삭제</div>
                <div class="settings-description">기존 대화를 모두 삭제합니다.</div>
              </div>
              <button class="delete-button">
                <span>삭제</span>
              </button>
            </div>
            
            <!-- 고객 지원 -->
            <div class="settings-row">
              <div class="settings-info wide">
                <div class="settings-title">고객 지원</div>
                <div class="settings-links">
                  <span class="link">새로운 소식</span>
                  <span class="separator">|</span>
                  <span class="link">자주 묻는 질문</span>
                  <span class="separator">|</span>
                  <span class="link">가이드</span>
                </div>
              </div>
            </div>
            
            <!-- 서비스 정보 -->
            <div class="settings-row">
              <div class="settings-info wide">
                <div class="settings-title">서비스 정보</div>
                <div class="settings-links">
                  <span class="link">개인정보 처리 방침</span>
                  <span class="separator">|</span>
                  <span class="link">서비스 이용약관</span>
                  <span class="separator">|</span>
                  <span class="link">서비스 이용정책</span>
                  <span class="separator">|</span>
                  <span class="link">AI 개인정보 처리 안내</span>
                </div>
              </div>
            </div>
            
            <!-- 서비스 탈퇴 -->
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-title">서비스 탈퇴</div>
                <div class="settings-description">서비스 탈퇴 시, 더 이상 해당 계정으로 서비스를 사용할 수 없습니다.</div>
              </div>
              <button class="delete-button">
                <span>탈퇴</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import './MyPageModal_settings.css'

defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeTab = ref<'mypage' | 'settings'>('mypage')
const selectedTheme = ref<'light' | 'dark' | 'system'>('system')

const setTheme = (theme: 'light' | 'dark' | 'system') => {
  selectedTheme.value = theme
  console.log('테마 변경:', theme)
  // TODO: 실제 테마 변경 로직 구현
}

const handleOverlayClick = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  width: 900px;
  height: 600px;
}

.modal-layout {
  display: flex;
  height: 100%;
}

.modal-nav {
  width: 200px;
  background: #f9fafb;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right: 1px solid #e5e7eb;
}

.nav-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.nav-title {
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  text-align: center;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  color: #6b7280;
}

.nav-item:hover {
  background: #e5e7eb;
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

.modal-content {
  flex: 1;
  padding: 20px 30px;
  overflow-y: auto;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.profile-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 10px 0;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  border-radius: 50%;
}

.avatar-placeholder svg {
  width: 40px;
  height: 40px;
}

.content-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
  min-height: 0;
  overflow-y: auto;
}

.user-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.user-info-card {
  width: 100%;
  max-width: 500px;
  min-height: 201px;
  overflow: hidden;
  background-color: rgb(249, 250, 251);
  border: solid 1px rgb(243, 244, 246);
  border-radius: 15px;
  position: relative;
  margin: 0 auto;
}

.user-info-content {
  width: 100%;
  height: auto;
  position: static;
  padding: 16px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.name-section {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  width: 100%;
  min-height: 60px;
  box-sizing: border-box;
  flex-shrink: 0;
  padding: 15px 17px;
}

.name-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 5px;
  min-width: 80px;
  box-sizing: border-box;
}

.label {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 15px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.value {
  color: rgb(31, 41, 55);
  font-size: 15px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  white-space: nowrap;
  overflow: visible;
}

.edit-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 12px;
  width: 70px;
  height: 32px;
  background-color: rgb(243, 244, 246);
  box-sizing: border-box;
  padding: 0px 12px;
  cursor: pointer;
  white-space: nowrap;

}

.button-text {
  color: rgb(107, 114, 128);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 23px;
  text-align: center;
}

.divider {
  width: 431px;
  height: 0px;
  border-top: solid 1px rgb(243, 244, 246);
  position: absolute;
  left: 0px;
  top: 63px;
}

.reservation-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 8px;
  width: 100%;
  min-height: auto;
  box-sizing: border-box;
  position: static;
  padding: 12px 17px;
}

.section-title {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 15px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
}

.reservation-items {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
  margin-top: 8px;
}

.reservation-item {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.item-text {
  color: rgb(31, 41, 55);
  text-overflow: ellipsis;
  font-size: 15px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  width: 160px;
  min-height: 27px;
}

.view-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 12px;
  width: 70px;
  height: 32px;
  background-color: rgb(243, 244, 246);
  box-sizing: border-box;
  padding: 0px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.kakao-section {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  padding: 0 16px;
}

.kakao-text {
  color: black;
  text-overflow: ellipsis;
  font-size: 15px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
}

.connect-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 12px;
  width: 70px;
  height: 32px;
  background-color: white;
  box-sizing: border-box;
  padding: 0px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.premium-section {
  width: 100%;
  max-width: 500px;
  min-height: 65px;
  overflow: hidden;
  background-color: rgb(20, 29, 48);
  border-radius: 25px;
  position: relative;
  margin: 0 auto;
  flex-shrink: 0;
}

.premium-card {
  width: 100%;
  height: 100%;
  position: relative;
}

.premium-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 56px;
  width: 397px;
  height: 35px;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 199px);
  top: calc(50% - 17px);
}

.premium-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 15px;
  box-sizing: border-box;
}

.premium-brand {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  box-sizing: border-box;
}

.brand-group {
  width: 102px;
  height: 35px;
  position: relative;
}

.eulgpt-text {
  color: white;
  text-overflow: ellipsis;
  font-size: 23px;
  font-family: Poppins, sans-serif;
  font-weight: 700;
  text-align: left;
  width: 105px;
  position: absolute;
  left: 0px;
  top: 0px;
}

.union-icon {
  width: 8px;
  height: 8px;
  background: white;
  position: absolute;
  left: 92px;
  top: 4px;
  transform: rotate(-15deg);
  transform-origin: top left;
  border-radius: 1px;
}

.premium-description {
  color: white;
  text-overflow: ellipsis;
  font-size: 15px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
}

.verify-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border-radius: 12px;
  width: 70px;
  height: 32px;
  background-color: white;
  box-sizing: border-box;
  padding: 0px 12px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.verify-text {
  color: black;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 23px;
  text-align: center;
}

.premium-logo {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 17px;
  width: 210px;
  height: 72px;
  box-sizing: border-box;
  position: absolute;
  left: 0px;
  top: calc(50% + 22px - 36px);
}

.logo-group {
  width: 210px;
  height: 72px;
  position: relative;
}

.eulgpt-large {
  color: rgba(255, 255, 255, 0.1);
  text-overflow: ellipsis;
  font-size: 48px;
  font-family: Poppins, sans-serif;
  font-weight: 700;
  text-align: left;
  width: 200px;
  position: absolute;
  left: 0px;
  top: 0px;
}

.union-large {
  width: 17px;
  height: 17px;
  background: rgba(255, 255, 255, 0.1);
  position: absolute;
  left: 189px;
  top: 7px;
  transform: rotate(-15deg);
  transform-origin: top left;
  border-radius: 2px;
}

/* 반응형 */
@media (max-width: 768px) {
  .modal-container {
    max-width: 95vw;
    margin: 20px;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .user-info-card {
    width: 100%;
    max-width: 400px;
  }
  
  .premium-section {
    width: 100%;
    max-width: 400px;
  }
  
  .kakao-section {
    gap: 20px;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 16px;
    gap: 16px;
  }
  
  .user-info-card {
    max-width: 350px;
    height: auto;
    min-height: 180px;
  }
  
  .premium-section {
    max-width: 350px;
    height: 60px;
  }
  
  .name-section, 
  .reservation-section {
    position: static;
    width: 100%;
    padding: 16px;
  }
  
  .divider {
    position: static;
    width: 100%;
    margin: 10px 0;
  }
}
</style>