<template>
  <div>
    <div class="title-block">
      <h1 class="main-title">학교생활의<br><span class="highlight">모든 순간</span>에<br>답하다</h1>
    </div>
    <div class="search-bar">
      <img :src="eulLogo" alt="EULGPT 로고" style="height: 2.5em; width: auto; margin-right: 1.2rem; vertical-align: middle;" />
      <span class="search-eulgpt">EUL<span class="gpt">GPT</span></span>
      <span class="search-icon">✚</span>
    </div>
    <button class="start-btn">시작하기</button>
  </div>
</template>

<script setup lang="ts">
import eulLogo from '../../assets/eul_logo.png'
</script>
