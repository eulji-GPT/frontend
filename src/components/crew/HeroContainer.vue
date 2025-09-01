<template>
  <div class="hero-container">
    <div class="hero-main">
      <span class="eulgpt-title">EULGPT</span>
      <div class="team-recruit-section">
        <span class="team-recruit-text">팀원 모집</span>
        <img src="@/components/chat/icon/mulmum.svg" alt="icon" class="team-icon"/>
      </div>
    </div>
    <div class="buttons-container">
      <div class="apply-button">
        <span class="button-text">지원하기</span>
      </div>
      <div class="explore-button">
        <span class="button-text">둘러보기</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 80px;
  box-sizing: border-box;
  padding: 60px 40px;
  background: transparent;
}

.hero-main {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 20px;
  width: 571px;
  box-sizing: border-box;
  background: transparent;
}

.eulgpt-title {
  color: white;
  text-overflow: ellipsis;
  font-size: 145px;
  font-family: Poppins, sans-serif;
  font-weight: 700;
  text-align: left;
  min-height: 103px;
  align-self: stretch;
  flex-shrink: 0;
}

.team-recruit-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.team-recruit-text {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 64px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 90px;
  text-align: left;
}

.team-icon {
  width: 21px;
  height: 21px;
  object-fit: cover;
}

.buttons-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 50px;
  box-sizing: border-box;
  background: transparent;
}

.apply-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  border-radius: 68px;
  width: 220px;
  background-color: rgba(2, 71, 138, 0.1);
  box-sizing: border-box;
  padding: 14px 77px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.explore-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  border-radius: 68px;
  width: 220px;
  background-color: rgba(2, 71, 138, 0.1);
  box-sizing: border-box;
  padding: 14px 77px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-text {
  color: white;
  text-overflow: ellipsis;
  font-size: 32px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
}

.apply-button:hover,
.explore-button:hover {
  background-color: rgba(2, 71, 138, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero-main {
    width: 100%;
    max-width: 571px;
  }
  
  .eulgpt-title {
    font-size: 100px;
  }
  
  .team-recruit-text {
    font-size: 48px;
  }
  
  .buttons-container {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  
  .apply-button,
  .explore-button {
    width: 200px;
  }
  
  .button-text {
    font-size: 24px;
  }
}
</style>