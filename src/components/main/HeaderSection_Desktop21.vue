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
      <div class="auth-links">
        <template v-if="!isLoggedIn">
          <router-link to="/login">로그인</router-link>
          <router-link to="/signup">회원가입</router-link>
        </template>
        <template v-else>
          <span class="user-info">안녕하세요!</span>
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
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import eulLogo from '../../assets/eul_logo.svg'
import { isAuthenticated, logout } from '../../utils/auth'

const router = useRouter()
const emit = defineEmits(['scrollToSection'])
const isMobileMenuOpen = ref(false)
const isLoggedIn = ref(false)

// 로그인 상태 확인
onMounted(() => {
  isLoggedIn.value = isAuthenticated()
})

function goToHome() {
  router.push('/')
}

function scrollToSection(id: string) {
  // If not on main page, navigate to home first then scroll to section
  if (router.currentRoute.value.path !== '/') {
    router.push({ path: '/', hash: `#${id}` })
  } else {
    emit('scrollToSection', id)
  }
}

function handleLogout() {
  logout()
  isLoggedIn.value = false
}

function scrollToMobileSection(id: string) {
  // If not on main page, navigate to home first then scroll to section
  if (router.currentRoute.value.path !== '/') {
    router.push({ path: '/', hash: `#${id}` })
  } else {
    emit('scrollToSection', id)
  }
  closeMobileMenu()
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
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
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-list li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.auth-links {
  margin-left: auto;
  display: flex;
  gap: 24px;
  font-size: 16px;
  color: #ffffff;
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
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.user-info {
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
}

.logout-btn {
  background: none;
  border: 1px solid #ffffff;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
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
  background-color: #ffffff;
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
  background: rgba(20, 29, 48, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-nav-list li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
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
  color: #ffffff;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.mobile-auth-links a:first-child:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.5);
}

.mobile-auth-links a:last-child:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.5);
}

/* 태블릿 반응형 */
@media (max-width: 1024px) {
  header.header {
    padding: 10px 30px;
  }
  
  .nav-list {
    gap: 32px;
  }
  
  .nav-list li a {
    font-size: 14px;
  }
  
  .auth-links {
    gap: 16px;
    font-size: 14px;
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