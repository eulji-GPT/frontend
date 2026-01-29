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
                        <button class="view-button" @click="handleClassroomCheck">
                          <span class="button-text">조회</span>
                        </button>
                      </div>
                      <div class="reservation-item">
                        <span class="item-text">도서관 • 열람실 확인</span>
                        <button class="view-button" @click="handleLibraryCheck">
                          <span class="button-text">조회</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="kakao-section">
                <span class="kakao-text">카카오 계정과 연동하기</span>
                <button
                  v-if="!isKakaoLinked"
                  class="connect-button"
                  @click="handleKakaoLink"
                  :disabled="isLinkingKakao"
                >
                  <span class="button-text">{{ isLinkingKakao ? '연동 중...' : '연동' }}</span>
                </button>
                <span v-else class="linked-badge">연동됨 ✓</span>
              </div>
            </div>
          </div>

          <!-- 설정 -->
          <div v-else-if="activeTab === 'settings'" class="settings-section">
            <!-- 화면 테마 -->
            <!-- <div class="settings-group">
              <div class="settings-title">화면 테마</div>
              <div class="theme-buttons">
                <button class="theme-button" :class="{ active: selectedTheme === 'light' }" @click="handleThemeChange('light')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                  <span>라이트</span>
                </button>
                <button class="theme-button" :class="{ active: selectedTheme === 'dark' }" @click="handleThemeChange('dark')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79z"/>
                  </svg>
                  <span>다크</span>
                </button>
                <button class="theme-button" :class="{ active: selectedTheme === 'system' }" @click="handleThemeChange('system')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <span>시스템</span>
                </button>
              </div>
            </div> -->

            <!-- 전체 데이터 삭제 -->
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-title">전체 데이터 삭제</div>
                <div class="settings-description">기존 대화를 모두 삭제합니다.</div>
              </div>
              <button class="delete-button" @click="handleDeleteAllData">
                <span>삭제</span>
              </button>
            </div>

            <!-- 고객 지원 -->
            <div class="settings-row">
              <div class="settings-info wide">
                <div class="settings-title">고객 지원</div>
                <div class="settings-links">
                  <span class="link" @click="handleBugReport">버그 신고</span>
                  <span class="separator">|</span>
                  <span class="link" @click="handleNewsLink">새로운 소식</span>
                  <span class="separator">|</span>
                  <span class="link" @click="handleFaqLink">자주 묻는 질문</span>
                  <span class="separator">|</span>
                  <span class="link" @click="handleGuideLink">가이드</span>
                </div>
              </div>
            </div>

            <!-- 서비스 정보 -->
            <div class="settings-row">
              <div class="settings-info wide">
                <div class="settings-title">서비스 정보</div>
                <div class="settings-links">
                  <span class="link" @click="handlePrivacyPolicy">개인정보 처리 방침</span>
                  <span class="separator">|</span>
                  <span class="link" @click="handleTermsOfService">서비스 이용약관</span>
                  <span class="separator">|</span>
                  <span class="link" @click="handleServicePolicy">서비스 이용정책</span>
                  <span class="separator">|</span>
                  <span class="link" @click="handleAIPrivacyPolicy">AI 개인정보 처리 안내</span>
                </div>
              </div>
            </div>

            <!-- 서비스 탈퇴 -->
            <div class="settings-row">
              <div class="settings-info">
                <div class="settings-title">서비스 탈퇴</div>
                <div class="settings-description">서비스 탈퇴 시, 더 이상 해당 계정으로 서비스를 사용할 수 없습니다.</div>
              </div>
              <button class="delete-button" @click="handleDeleteAccount">
                <span>탈퇴</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 전체 데이터 삭제 확인 모달 -->
    <CommonDeleteModal
      :is-visible="showDeleteDataModal"
      title="전체 데이터 삭제"
      message="모든 채팅 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      @confirm="confirmDeleteAllData"
      @cancel="cancelDeleteData"
    />

    <!-- 서비스 탈퇴 확인 모달 -->
    <CommonDeleteModal
      :is-visible="showDeleteAccountModal"
      title="서비스 탈퇴"
      message="정말로 서비스를 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다."
      @confirm="confirmDeleteAccount"
      @cancel="cancelDeleteAccount"
    />

    <!-- 다크모드 베타 경고 모달 -->
    <DarkModeBetaWarning
      :is-visible="showDarkModeWarning"
      @confirm="confirmDarkMode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import './MyPageModal_settings.css'
import { getApiBaseUrl } from '../../utils/ports-config'
import { chatAPI, memberAPI } from '../../services/api'
import { useTheme } from '../../composables/useTheme'
import CommonDeleteModal from './CommonDeleteModal.vue'
import DarkModeBetaWarning from './DarkModeBetaWarning.vue'

defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const API_BASE_URL = getApiBaseUrl()
const router = useRouter()
const { currentTheme, setTheme: setThemeMode } = useTheme()
const activeTab = ref<'mypage' | 'settings'>('mypage')
const selectedTheme = currentTheme
const profileImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 삭제 모달 상태
const showDeleteDataModal = ref(false)
const showDeleteAccountModal = ref(false)

// 다크모드 베타 경고 상태
const showDarkModeWarning = ref(false)
const pendingTheme = ref<'light' | 'dark' | 'system' | null>(null)

// Pro 인증 관련 상태
const showProVerification = ref(false)
const proEmail = ref('')
const proVerificationCode = ref('')
const isProVerificationSent = ref(false)
const proTimeLeft = ref(300) // 5분
let proTimer: ReturnType<typeof setInterval> | null = null

// 카카오 연동 관련 상태
const isLinkingKakao = ref(false)
const isKakaoLinked = computed(() => userInfo.value?.oauth_provider === 'kakao')

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
    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.error('액세스 토큰이 없습니다.')
      return
    }

    // 개발 환경에서 Pro 계정 토큰인지 체크
    if (import.meta.env.DEV && token.startsWith('dev-pro-token-')) {
      console.log('🔓 개발 환경 Pro 계정 정보 로드 (MyPage)')
      const devProfile = localStorage.getItem('dev_user_profile')
      if (devProfile) {
        const data = JSON.parse(devProfile)
        userInfo.value = data

        // 프로필 이미지가 있으면 설정
        if (data.profile_image_url) {
          profileImage.value = data.profile_image_url
        }

        console.log('Dev environment user info:', data)
      }
      return
    }

    const response = await fetch(`${API_BASE_URL}/member/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user information')
    }

    const data = await response.json()
    userInfo.value = data

    // 카카오 프로필 이미지가 있으면 설정
    if (data.profile_image_url) {
      profileImage.value = data.profile_image_url
    }

    console.log('User info:', data)
  } catch (error) {
    console.error('User info load error:', error)
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
    const token = localStorage.getItem('accessToken')
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

// === 새로운 기능 핸들러 함수들 ===

// 빈강의실 확인
const handleClassroomCheck = () => {
  emit('close')
  router.push('/ready/classroom')
}

// 도서관·열람실 확인
const handleLibraryCheck = () => {
  emit('close')
  router.push('/ready/library')
}

// 테마 변경
const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
  // 다크모드 또는 시스템 모드로 전환 시 항상 경고 표시
  if (theme === 'dark' || theme === 'system') {
    pendingTheme.value = theme
    showDarkModeWarning.value = true
  } else {
    // 라이트 모드로 전환하는 경우 바로 적용
    setThemeMode(theme)
  }
}

// 다크모드 베타 경고 확인
const confirmDarkMode = () => {
  // 보류 중이던 테마 적용
  if (pendingTheme.value) {
    setThemeMode(pendingTheme.value)
  }

  // 상태 초기화
  showDarkModeWarning.value = false
  pendingTheme.value = null
}

// 전체 데이터 삭제
const handleDeleteAllData = () => {
  showDeleteDataModal.value = true
}

const confirmDeleteAllData = async () => {
  try {
    await chatAPI.deleteAllChats()
    // localStorage에서도 채팅 관련 데이터 삭제
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('chat_') || key.startsWith('session_'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))

    showDeleteDataModal.value = false
    alert('모든 채팅 기록이 삭제되었습니다.')
  } catch (error) {
    console.error('전체 데이터 삭제 실패:', error)
    alert('데이터 삭제 중 오류가 발생했습니다.')
  }
}

const cancelDeleteData = () => {
  showDeleteDataModal.value = false
}

// 고객 지원 링크
const handleBugReport = () => {
  emit('close')
  router.push('/bug-report')
}

const handleNewsLink = async () => {
  emit('close')
  await router.push('/')
  await nextTick()
  const newsSection = document.querySelector('#news')
  if (newsSection) {
    newsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleFaqLink = async () => {
  emit('close')
  await router.push('/')
  await nextTick()
  const faqSection = document.querySelector('#faq')
  if (faqSection) {
    faqSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleGuideLink = async () => {
  emit('close')
  await router.push('/')
  await nextTick()
  const introSection = document.querySelector('#intro')
  if (introSection) {
    introSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 서비스 정보 링크
const handlePrivacyPolicy = () => {
  emit('close')
  router.push('/privacy-policy')
}

const handleTermsOfService = () => {
  emit('close')
  router.push('/terms-of-service')
}

const handleServicePolicy = () => {
  // 서비스 이용정책은 이용약관과 동일하게 처리
  emit('close')
  router.push('/terms-of-service')
}

const handleAIPrivacyPolicy = () => {
  // AI 개인정보 처리 안내는 개인정보 처리방침과 동일하게 처리
  emit('close')
  router.push('/privacy-policy')
}

// 서비스 탈퇴
const handleDeleteAccount = () => {
  showDeleteAccountModal.value = true
}

const confirmDeleteAccount = async () => {
  try {
    await memberAPI.deleteAccount()

    // localStorage 전체 정리
    localStorage.clear()

    showDeleteAccountModal.value = false
    emit('close')

    alert('회원 탈퇴가 완료되었습니다. 그동안 서비스를 이용해 주셔서 감사합니다.')
    router.push('/login')
  } catch (error) {
    console.error('회원 탈퇴 실패:', error)
    alert('회원 탈퇴 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  }
}

const cancelDeleteAccount = () => {
  showDeleteAccountModal.value = false
}

const handleOverlayClick = () => {
  emit('close')
}

// 카카오 계정 연동
const handleKakaoLink = async () => {
  try {
    isLinkingKakao.value = true

    const token = localStorage.getItem('accessToken')
    if (!token) {
      alert('로그인이 필요합니다.')
      return
    }

    // 카카오 연동 URL 요청
    const response = await fetch(`${API_BASE_URL}/member/kakao/link`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '카카오 연동 요청에 실패했습니다.')
    }

    const data = await response.json()

    // 카카오 인증 페이지로 이동 (팝업 또는 리다이렉트)
    // 현재 페이지 URL을 저장하여 콜백 후 돌아올 수 있게 함
    localStorage.setItem('kakao_link_return_url', window.location.href)
    window.location.href = data.auth_url

  } catch (error) {
    console.error('카카오 연동 오류:', error)
    const errorMessage = error instanceof Error ? error.message : '카카오 연동에 실패했습니다.'
    alert(errorMessage)
  } finally {
    isLinkingKakao.value = false
  }
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
  background: var(--color-modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* 마이페이지 모달을 플로팅 버튼 위에 표시 */
  backdrop-filter: blur(4px);
}

.modal-container {
  background: var(--color-modal-bg);
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
  background: var(--color-bg-secondary);
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right: 1px solid var(--color-card-border);
}

.nav-header {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-card-border);
}

.nav-title {
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  color: var(--color-text-primary);
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
  color: var(--color-text-secondary);
}

.nav-item:hover {
  background: var(--color-sidebar-item-hover);
}

.nav-item.active {
  background: var(--color-primary);
  color: var(--color-button-primary-text);
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
  background: var(--color-bg-secondary);
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
  background-color: var(--color-card-bg);
  border: solid 1px var(--color-card-border);
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
  color: var(--color-text-tertiary);
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
  color: var(--color-text-primary);
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
  border: solid 1px var(--color-card-border);
  border-radius: 12px;
  width: 70px;
  height: 32px;
  background-color: var(--color-button-secondary-bg);
  box-sizing: border-box;
  padding: 0px 12px;
  cursor: pointer;
  white-space: nowrap;

}

.button-text {
  color: var(--color-text-secondary);
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
  color: var(--color-text-tertiary);
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
  color: var(--color-text-primary);
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
  border: solid 1px var(--color-card-border);
  border-radius: 12px;
  width: 70px;
  height: 32px;
  background-color: var(--color-button-secondary-bg);
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
  color: var(--color-text-primary);
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
  border: solid 1px var(--color-card-border);
  border-radius: 12px;
  width: 70px;
  height: 32px;
  background-color: var(--color-card-bg);
  box-sizing: border-box;
  padding: 0px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.connect-button:hover:not(:disabled) {
  background-color: #FEE500;
  border-color: #FEE500;
}

.connect-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.linked-badge {
  color: #22c55e;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  padding: 6px 12px;
  background-color: rgba(34, 197, 94, 0.1);
  border-radius: 12px;
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