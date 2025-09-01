<template>
  <div class="info-container">
    <span class="info-question">을지피티는 어떤 서비스인가요?</span>
    <span class="info-answer">
      을지대학교 성남캠퍼스에서 학생들의<br/>
      편의를 위한 기능을 담은 AI 웹사이트입니다!
    </span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.info-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 50px;
  box-sizing: border-box;
  padding: 80px 40px;
  background: transparent;
}

.info-question {
  color: white;
  text-overflow: ellipsis;
  font-size: 56px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 90px;
  text-align: center;
}

.info-answer {
  color: white;
  text-overflow: ellipsis;
  font-size: 32px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
}

@media (max-width: 768px) {
  .info-question {
    font-size: 40px;
    line-height: 60px;
  }
  
  .info-answer {
    font-size: 24px;
  }
}
</style>