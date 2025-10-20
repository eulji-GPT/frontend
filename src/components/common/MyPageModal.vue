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
              <div class="profile-image" @click="triggerImageUpload">
                <div class="avatar-placeholder" v-if="!profileImage">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="15" r="6" fill="#9CA3AF"/>
                    <path d="M8 35c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9CA3AF"/>
                  </svg>
                </div>
                <img v-else :src="profileImage" alt="프로필 이미지" class="profile-uploaded-image" />
                <div class="upload-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                  </svg>
                </div>
              </div>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                @change="handleImageUpload" 
                style="display: none;"
              />
            </div>
            
            <div class="user-info-section">
              <div class="user-info-card">
                <div class="user-info-content">
                  <div class="name-section">
                    <div class="name-info">
                      <div class="label">닉네임</div>
                      <div class="value">{{ userInfo?.nickname || '로딩 중...' }}</div>
                    </div>
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
            <div class="premium-section" :class="{ 'verification-active': showProVerification }">
              <div class="premium-card">
                <div class="premium-content" v-if="!showProVerification && !userInfo?.is_pro">
                  <div class="premium-info">
                    <div class="premium-brand">
                      <div class="brand-group">
                        <span class="eulgpt-text">EULGPT</span>
                        <div class="union-icon"></div>
                      </div>
                    </div>
                    <span class="premium-description">이메일을 인증 시, 더 많은 기능</span>
                  </div>
                  <button class="verify-button" @click="startProVerification">
                    <span class="verify-text">인증</span>
                  </button>
                </div>

                <!-- Pro 인증이 완료된 경우 -->
                <div class="premium-content" v-if="userInfo?.is_pro">
                  <div class="premium-info">
                    <div class="premium-brand">
                      <div class="brand-group">
                        <span class="eulgpt-text">EULGPT</span>
                        <div class="union-icon"></div>
                      </div>
                    </div>
                    <span class="premium-description">✨ Pro 계정 활성화됨</span>
                  </div>
                  <div class="pro-badge">
                    <span class="pro-text">PRO</span>
                  </div>
                </div>

                <!-- 이메일 인증 UI -->
                <div class="pro-verification-form" v-if="showProVerification && !userInfo?.is_pro">
                  <div class="verification-header">
                    <span class="verification-title">을지대 이메일 인증</span>
                    <button class="close-verification" @click="cancelProVerification">✕</button>
                  </div>

                  <div class="email-verification-section">
                    <div class="email-input-row">
                      <input
                        v-model="proEmail"
                        type="email"
                        placeholder="이메일 (@g.eulji.ac.kr)"
                        class="pro-email-input"
                        :disabled="isProVerificationSent"
                      />
                      <button
                        class="send-code-button"
                        @click="handleSendProVerification"
                        :disabled="isProVerificationSent"
                      >
                        <span>{{ isProVerificationSent ? '전송됨' : '인증번호' }}</span>
                      </button>
                    </div>

                    <div v-if="isProVerificationSent" class="verification-code-row">
                      <input
                        v-model="proVerificationCode"
                        type="text"
                        placeholder="인증번호 6자리"
                        class="pro-code-input"
                        maxlength="6"
                      />
                      <span class="timer-text">{{ formattedProTime }}</span>
                    </div>

                    <button
                      class="complete-verification-button"
                      @click="handleCompleteProVerification"
                      :disabled="!isProVerificationSent || !proVerificationCode"
                    >
                      <span>인증 완료</span>
                    </button>
                  </div>
                </div>

                <!-- Premium Logo - 인증 폼이 아닐 때만 표시 -->
                <div class="premium-logo" v-if="!showProVerification">
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import './MyPageModal_settings.css'

defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const API_BASE_URL = import.meta.env.VITE_FASTAPI_URL || '/api'
const activeTab = ref<'mypage' | 'settings'>('mypage')
const selectedTheme = ref<'light' | 'dark' | 'system'>('system')
const profileImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Pro 인증 관련 상태
const showProVerification = ref(false)
const proEmail = ref('')
const proVerificationCode = ref('')
const isProVerificationSent = ref(false)
const proTimeLeft = ref(300) // 5분
let proTimer: ReturnType<typeof setInterval> | null = null

// Pro 타이머 포맷
const formattedProTime = computed(() => {
  const minutes = Math.floor(proTimeLeft.value / 60)
  const seconds = proTimeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 사용자 정보
const userInfo = ref<{
  id: number
  name: string
  email: string
  nickname: string
  phone_number?: string
  oauth_provider?: string
  is_pro: boolean
  verified_email?: string
  profile_image_url?: string
} | null>(null)

// 사용자 정보 불러오기
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.error('액세스 토큰이 없습니다.')
      return
    }

    const response = await fetch(`${API_BASE_URL}/member/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다.')
    }

    const data = await response.json()
    userInfo.value = data

    // 카카오 프로필 이미지가 있으면 설정
    if (data.profile_image_url) {
      profileImage.value = data.profile_image_url
    }

    console.log('사용자 정보:', data)
  } catch (error) {
    console.error('사용자 정보 로드 오류:', error)
  }
}

onMounted(() => {
  fetchUserInfo()
})

const setTheme = (theme: 'light' | 'dark' | 'system') => {
  selectedTheme.value = theme
  console.log('테마 변경:', theme)
  // TODO: 실제 테마 변경 로직 구현
}

const triggerImageUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }
    
    // 이미지 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string
      console.log('프로필 이미지 업로드 완료')
      // TODO: 서버에 이미지 업로드 로직 구현
    }
    reader.readAsDataURL(file)
  }
}

// Pro 인증 시작
const startProVerification = () => {
  showProVerification.value = true
  proEmail.value = ''
  proVerificationCode.value = ''
  isProVerificationSent.value = false
}

// Pro 인증 취소
const cancelProVerification = () => {
  showProVerification.value = false
  proEmail.value = ''
  proVerificationCode.value = ''
  isProVerificationSent.value = false
  if (proTimer) {
    clearInterval(proTimer)
    proTimer = null
  }
}

// Pro 인증번호 타이머 시작
const startProTimer = () => {
  proTimer = setInterval(() => {
    if (proTimeLeft.value > 0) {
      proTimeLeft.value--
    } else {
      clearInterval(proTimer!)
      proTimer = null
      isProVerificationSent.value = false
      alert('인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.')
    }
  }, 1000)
}

// Pro 인증번호 발송
const handleSendProVerification = async () => {
  if (!proEmail.value) {
    alert('이메일 주소를 입력해주세요.')
    return
  }

  // 을지대 이메일 확인
  if (!proEmail.value.endsWith('@g.eulji.ac.kr')) {
    alert('을지대학교 이메일(@g.eulji.ac.kr)만 인증 가능합니다.')
    return
  }

  try {
    // 기존 타이머가 있으면 정리
    if (proTimer) {
      clearInterval(proTimer)
    }

    console.log('Pro 인증번호 발송 요청:', proEmail.value)

    const response = await fetch(`${API_BASE_URL}/member/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: proEmail.value }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '인증번호 전송에 실패했습니다.')
    }

    const result = await response.json()
    console.log('Pro 인증번호 전송 성공:', result)

    if (result.email_sent) {
      isProVerificationSent.value = true
      proTimeLeft.value = 300
      startProTimer()
      alert('인증번호가 이메일로 전송되었습니다. 5분 내에 입력해주세요.')
    } else {
      throw new Error('이메일 전송 상태를 확인할 수 없습니다.')
    }
  } catch (error) {
    console.error('Pro 인증번호 전송 오류:', error)
    const errorMessage = error instanceof Error ? error.message : '인증번호 전송에 실패했습니다.'
    alert(errorMessage)
  }
}

// Pro 인증 완료
const handleCompleteProVerification = async () => {
  if (!proVerificationCode.value) {
    alert('인증번호를 입력해주세요.')
    return
  }

  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('로그인이 필요합니다.')
      return
    }

    console.log('Pro 인증 확인 중:', { email: proEmail.value, code: proVerificationCode.value })

    const response = await fetch(`${API_BASE_URL}/member/verify-pro?email=${encodeURIComponent(proEmail.value)}&code=${proVerificationCode.value}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Pro 인증에 실패했습니다.')
    }

    const result = await response.json()
    console.log('Pro 인증 성공:', result)

    // 타이머 정리
    if (proTimer) {
      clearInterval(proTimer)
      proTimer = null
    }

    alert('🎉 Pro 계정이 활성화되었습니다!')

    // 사용자 정보 다시 불러오기
    await fetchUserInfo()

    // Pro 인증 UI 닫기
    showProVerification.value = false
  } catch (error) {
    console.error('Pro 인증 오류:', error)
    const errorMessage = error instanceof Error ? error.message : 'Pro 인증에 실패했습니다.'
    alert(errorMessage)
  }
}

const handleOverlayClick = () => {
  emit('close')
}

// 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  if (proTimer) {
    clearInterval(proTimer)
  }
})
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
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.profile-image:hover {
  transform: scale(1.05);
}

.profile-image:hover .upload-overlay {
  opacity: 1;
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

.profile-uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
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
  justify-content: flex-start;
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
  transition: min-height 0.3s ease;
}

.premium-section.verification-active {
  min-height: 220px;
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

/* Pro 배지 스타일 */
.pro-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 8px;
  padding: 6px 12px;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.pro-text {
  color: white;
  font-size: 12px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Pro 인증 폼 스타일 */
.pro-verification-form {
  width: calc(100% - 32px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  position: relative;
  margin: 16px;
  z-index: 10;
}

.verification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.verification-title {
  color: white;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
}

.close-verification {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-verification:hover {
  color: white;
}

.email-verification-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.email-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pro-email-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  outline: none;
  transition: all 0.2s ease;
}

.pro-email-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.pro-email-input:focus {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.pro-email-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-code-button {
  padding: 10px 16px;
  background: white;
  color: rgb(20, 29, 48);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.send-code-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.send-code-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.verification-code-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
}

.pro-code-input {
  flex: 1;
  border: none;
  background: transparent;
  color: white;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  outline: none;
}

.pro-code-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.timer-text {
  color: #fbbf24;
  font-size: 13px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  white-space: nowrap;
}

.complete-verification-button {
  padding: 12px 16px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.complete-verification-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.4);
}

.complete-verification-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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