<template>
  <header class="header">
    <nav class="nav">
      <div class="logo-text" @click="goToHome" style="cursor: pointer;">
        <img :src="eulLogo" alt="EULGPT 로고" class="logo-img" />
      </div>
      <ul class="nav-list">
        <li><a href="#intro" @click.prevent="scrollToSection('intro')">서비스 소개</a></li>
        <li><a href="#features" @click.prevent="scrollToSection('features')">유용한 기능</a></li>
        <li><a href="#faq" @click.prevent="scrollToSection('faq')">자주 묻는 질문</a></li>
        <li><a href="#news" @click.prevent="scrollToSection('news')">새로운 소식</a></li>
      </ul>

      <!-- 테마 토글 버튼 -->
      <!-- <button
        class="theme-toggle-btn"
        @click="toggleTheme"
        :title="effectiveTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'"
        aria-label="테마 전환"
      >
        <!~~ 다크 모드일 때 달 아이콘 ~~>
        <svg v-if="effectiveTheme === 'dark'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79z"/>
        </svg>
        <!~~ 라이트 모드일 때 태양 아이콘 ~~>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button> -->

      <div class="auth-links">
        <template v-if="!isLoggedIn">
          <router-link to="/login">로그인</router-link>
          <router-link to="/signup">회원가입</router-link>
        </template>
        <template v-else>
          <span class="user-info" @click="handleOpenMyPage" style="cursor: pointer;">{{ userName }}님</span>
          <button @click="handleLogout" class="logout-btn">로그아웃</button>
        </template>
      </div>
      <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="메뉴 열기">
        <span :class="['hamburger-line', { active: isMobileMenuOpen }]"></span>
        <span :class="['hamburger-line', { active: isMobileMenuOpen }]"></span>
        <span :class="['hamburger-line', { active: isMobileMenuOpen }]"></span>
      </button>
    </nav>
    
    <!-- 모바일 메뉴 -->
    <div :class="['mobile-menu', { active: isMobileMenuOpen }]">
      <ul class="mobile-nav-list">
        <li><a href="#intro" @click.prevent="scrollToMobileSection('intro')">서비스 소개</a></li>
        <li><a href="#features" @click.prevent="scrollToMobileSection('features')">유용한 기능</a></li>
        <li><a href="#faq" @click.prevent="scrollToMobileSection('faq')">자주 묻는 질문</a></li>
        <li><a href="#news" @click.prevent="scrollToMobileSection('news')">새로운 소식</a></li>
      </ul>
      <div class="mobile-auth-links">
        <router-link to="/login" @click="closeMobileMenu">로그인</router-link>
        <router-link to="/signup" @click="closeMobileMenu">회원가입</router-link>
      </div>
    </div>

    <!-- 다크모드 베타 경고 모달 -->
    <DarkModeBetaWarning
      :is-visible="showDarkModeWarning"
      @confirm="confirmDarkMode"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import eulLogo from '../../assets/eul_logo.svg'
import { isAuthenticated, logout } from '../../utils/auth'
import { getApiBaseUrl } from '../../utils/ports-config'
import { useTheme } from '../../composables/useTheme'
import DarkModeBetaWarning from '../common/DarkModeBetaWarning.vue'

const emit = defineEmits<{
  (e: 'scrollToSection', id: string): void
  (e: 'openMyPage'): void
}>()

const router = useRouter()
const route = useRoute()

const API_BASE_URL = getApiBaseUrl()
const isMobileMenuOpen = ref(false)
const isLoggedIn = ref(false)
const userName = ref('')

// 테마 컴포저블
const { currentTheme, effectiveTheme, setTheme } = useTheme()

// 다크모드 경고 관련
const showDarkModeWarning = ref(false)
const pendingTheme = ref<'light' | 'dark' | 'system' | null>(null)

// 테마 토글 함수
function toggleTheme() {
  let targetTheme: 'light' | 'dark' | 'system'

  if (currentTheme.value === 'light') {
    targetTheme = 'dark'
  } else if (currentTheme.value === 'dark') {
    targetTheme = 'light'
  } else {
    // 시스템 모드인 경우, 현재 표시된 테마의 반대로 전환
    targetTheme = effectiveTheme.value === 'dark' ? 'light' : 'dark'
  }

  // 다크모드로 전환 시 항상 경고 표시
  if (targetTheme === 'dark') {
    pendingTheme.value = targetTheme
    showDarkModeWarning.value = true
  } else {
    // 라이트 모드로 전환하는 경우 바로 적용
    setTheme(targetTheme)
  }
}

// 다크모드 베타 경고 확인
const confirmDarkMode = () => {
  // 보류 중이던 테마 적용
  if (pendingTheme.value) {
    setTheme(pendingTheme.value)
  }

  // 상태 초기화
  showDarkModeWarning.value = false
  pendingTheme.value = null
}

// 사용자 정보 가져오기
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    // 개발 환경에서 Pro 계정 토큰인지 체크
    if (import.meta.env.DEV && token.startsWith('dev-pro-token-')) {
      console.log('🔓 개발 환경 Pro 계정 정보 로드 (Header)')
      const devProfile = localStorage.getItem('dev_user_profile')
      if (devProfile) {
        const data = JSON.parse(devProfile)
        userName.value = data.nickname || data.name || '사용자'
        console.log('✅ 개발 환경 사용자명 설정:', userName.value)
      }
      return
    }

    const response = await fetch(`${API_BASE_URL}/member/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('User info:', data)
      userName.value = data.nickname || data.name || '사용자'
      console.log('설정된 userName:', userName.value)
    }
  } catch (error) {
    console.error('User info load error:', error)
  }
}

// 로그인 상태 확인
onMounted(() => {
  isLoggedIn.value = isAuthenticated()
  if (isLoggedIn.value) {
    fetchUserInfo()
  }
})

function scrollToSection(id: string) {
  console.log('[HeaderSection] scrollToSection 호출:', id)

  const performScroll = () => {
    const element = document.getElementById(id)
    console.log('[HeaderSection] 요소 찾기:', id, element ? '성공' : '실패')

    if (element) {
      // scrollIntoView 사용 (더 안정적인 방법)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // 헤더 높이만큼 추가 오프셋 적용
      setTimeout(() => {
        const headerHeight = 100
        window.scrollBy({ top: -headerHeight, behavior: 'smooth' })
      }, 100)
    }
  }

  // 현재 메인 페이지가 아니면 메인 페이지로 이동
  if (route.path !== '/') {
    router.push('/').then(() => {
      // 페이지 이동 후 스크롤 (더 긴 대기 시간)
      setTimeout(performScroll, 500)
    })
  } else {
    // 이미 메인 페이지에 있으면 직접 스크롤
    performScroll()
  }
}

function handleLogout() {
  logout()
  isLoggedIn.value = false
}

function handleOpenMyPage() {
  emit('openMyPage')
}

function scrollToMobileSection(id: string) {
  console.log('[HeaderSection] scrollToMobileSection 호출:', id)
  closeMobileMenu()

  const performScroll = () => {
    const element = document.getElementById(id)
    console.log('[HeaderSection] 모바일 요소 찾기:', id, element ? '성공' : '실패')

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        const headerHeight = 100
        window.scrollBy({ top: -headerHeight, behavior: 'smooth' })
      }, 100)
    }
  }

  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(performScroll, 500)
    })
  } else {
    performScroll()
  }
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function goToHome() {
  if (route.path === '/') {
    // 이미 홈페이지에 있으면 페이지 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    // 다른 페이지에 있으면 홈페이지로 이동
    router.push('/')
  }
}
</script>

<style scoped>
header.header {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  height: 84px;
  padding: 10px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
}

.nav {
  display: flex;
  align-items: center;
  width: 100%;
}

.logo-text {
  margin-right: 32px;
}

.logo-img {
  height: 48px;
  width: auto;
  display: block;
}

.nav-list {
  flex: 1;
  display: flex;
  gap: 56px;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list li a {
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-list li a::after {
  display: none !important;
}

.nav-list li a:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.nav-list li a:hover::after {
  display: none !important;
}

.auth-links {
  margin-left: auto;
  display: flex;
  gap: 24px;
  font-size: 16px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.auth-links a {
  text-decoration: none;
  color: inherit;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.auth-links a:hover {
  background-color: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}

/* 테마 토글 버튼 */
.theme-toggle-btn {
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.theme-toggle-btn:hover {
  background: var(--color-bg-tertiary);
  transform: scale(1.05);
}

.theme-toggle-btn svg {
  width: 20px;
  height: 20px;
}

.user-info {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 16px;
  margin-top: 9px;
}

.logout-btn {
  background: none;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}

/* 모바일 메뉴 버튼 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background-color: var(--color-text-primary);
  transition: all 0.3s ease;
  margin: 2px 0;
  display: block;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 모바일 메뉴 */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg-elevated);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 12px 12px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.mobile-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 20px;
}

.mobile-nav-list li {
  margin-bottom: 16px;
}

.mobile-nav-list li a {
  display: block;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-nav-list li a:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.mobile-auth-links {
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
}

.mobile-auth-links a {
  flex: 1;
  text-align: center;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-card-border);
  transition: all 0.3s ease;
}

.mobile-auth-links a:first-child:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.mobile-auth-links a:last-child:hover {
  background-color: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
  border-color: var(--color-primary);
}

/* 태블릿 반응형 */
@media (max-width: 1024px) {
  header.header {
    padding: 10px 30px;
  }
  
  .nav-list {
    gap: 28px;
    justify-content: flex-start;
  }
  
  .nav-list li a {
    font-size: 13px;
    padding : 0px;
  }
  
  .auth-links {
    gap: 14px;
    font-size: 13px;
  }
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  header.header {
    padding: 10px 20px;
    height: 64px;
  }
  
  .logo-img {
    height: 36px;
  }
  
  .nav-list,
  .auth-links {
    display: none;
  }

  .theme-toggle-btn {
    display: none;  /* 모바일에서 테마 토글 버튼 숨김 */
  }

  .mobile-menu-btn {
    display: flex;
  }
}

/* 소형 모바일 */
@media (max-width: 480px) {
  header.header {
    padding: 8px 16px;
    height: 56px;
  }
  
  .logo-img {
    height: 32px;
  }
  
  .mobile-menu {
    left: -16px;
    right: -16px;
  }
}
</style>
