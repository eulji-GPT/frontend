<template>
  <header class="header">
    <nav class="nav">
      <div class="logo-text" style="padding:0; background:none; margin-right:2rem;">
        <img :src="eulLogo" alt="EULGPT 로고" style="height:48px; width:auto; display:block;" />
      </div>
      <ul class="nav-list">
        <li><a href="#intro" @click.prevent="scrollToSection('intro')">서비스 소개</a></li>
        <li><a href="#features" @click.prevent="scrollToSection('features')">유용한 기능</a></li>
        <li><a href="#faq" @click.prevent="scrollToSection('faq')">자주 묻는 질문</a></li>
        <li><a href="#news" @click.prevent="scrollToSection('news')">새로운 소식</a></li>
      </ul>
      <div class="auth-links">
        <span>로그인</span>
        <span>회원가입</span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import eulLogo from '../assets/eul_logo.png'
const emit = defineEmits(['scrollToSection'])

function scrollToSection(id: string) {
  emit('scrollToSection', id)
}
</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  width: 100%;
}
.logo-text {
  margin-right: 2rem;
}
.nav-list {
  flex: 1;
  display: flex;
  gap: 2rem;
  justify-content: center;
}
.auth-links {
  margin-left: auto;
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
  color: #222;
  font-weight: 500;
}
</style>
