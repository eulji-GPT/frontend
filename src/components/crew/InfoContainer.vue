<template>
  <div class="info-container">
    <div class="left-gradient">
      <div class="ellipse-left" />
    </div>
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
  position: relative;
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

.left-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.ellipse-left {
  background: radial-gradient(circle, var(--darksub-2, #4789ee) 0%, var(--darksub-2, #4789ee) 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(225px);
  height: 708px;
  width: 708px;
  position: absolute;
  left: -354px;
  top: -354px;
  transform: rotate(-148.78deg);
  opacity: 0.7;
}

@media (max-width: 768px) {
  .info-container {
    padding: 60px 20px;
    gap: 30px;
  }

  .info-question {
    font-size: 32px;
    line-height: 48px;
  }

  .info-answer {
    font-size: 18px;
    line-height: 32px;
  }

  .ellipse-left {
    width: 400px;
    height: 400px;
    left: -200px;
    top: -200px;
  }
}

@media (max-width: 480px) {
  .info-container {
    padding: 40px 16px;
    gap: 24px;
  }

  .info-question {
    font-size: 24px;
    line-height: 36px;
  }

  .info-answer {
    font-size: 16px;
    line-height: 28px;
  }
}
</style>