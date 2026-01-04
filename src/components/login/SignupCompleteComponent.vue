<template>
  <div class="root-wrapper">
    <div class="content-container">
      <div class="icon-container">
        <img src="../../assets/eul_logo.svg" alt="icon" class="completion-icon"/>
      </div>
      <div class="text-container">
        <span class="completion-title">
          가입이 완료 되었어요
        </span>
        <span class="completion-subtitle">
          EULGPT의 다양한 서비스와 혜택을 제공 받으실 수 있어요
        </span>
      </div>
    </div>
    <button class="main-button" @click="goToMain">
      <div class="button-content">
        <span class="button-text">
          메인으로
        </span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMain = () => {
  router.push('/');
};
</script>

<style scoped>
.root-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 60px;
  background-color: white;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 80px 20px;
}

.content-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.completion-icon {
  width: 39px;
  height: 39px;
  object-fit: cover;
}

.text-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.completion-title {
  color: black;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  align-self: stretch;
  flex-shrink: 0;
}

.completion-subtitle {
  color: rgb(75, 85, 99);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: center;
  align-self: stretch;
  flex-shrink: 0;
}

.main-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  border-radius: 12px;
  width: 181px;
  background-color: rgb(2, 71, 138);
  box-sizing: border-box;
  padding: 13px 60px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.main-button:hover {
  background-color: rgb(1, 60, 120);
}

.button-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.button-text {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: center;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .root-wrapper {
    padding: 60px 20px;
    gap: 40px;
  }
  
  .completion-title {
    font-size: 20px;
  }
  
  .completion-subtitle {
    font-size: 14px;
  }
  
  .main-button {
    width: 160px;
    padding: 12px 50px;
  }
  
  .button-text {
    font-size: 16px;
  }
}
</style>
