<template>
  <div class="development-status-container">
    <!-- 헤더 섹션 -->
    <div class="header-section">
      <h1 class="main-title">개발 중입니다</h1>
      <div class="divider-section">
        <div class="divider-line"></div>
        <p class="subtitle">더 나은 서비스를 위해 열심히 개발하고 있어요.</p>
      </div>
    </div>

    <!-- 크루 모집 카드 -->
    <div class="recruitment-section">
      <div class="recruitment-card">
        <div class="card-header">
          <div class="recruitment-icon">🔥</div>
          <h2 class="card-title">을GPT 크루 모집중!</h2>
        </div>
        <p class="card-description">을지대학교 학생들을 위한 서비스를 함께 만들어갈 개발자를 찾고 있습니다.</p>
        <div class="card-actions">
          <button class="primary-button" @click="goToCrew">
            <span class="button-text">크루 모집 공고 보기</span>
            <div class="button-arrow">→</div>
          </button>
        </div>
      </div>
    </div>

    <!-- 개발 진행 현황 -->
    <div class="progress-section">
      <h2 class="section-title">개발 진행 현황</h2>
      <div class="progress-list">
        <div class="progress-item">
          <div class="progress-info">
            <span class="feature-name">AI 챗봇 기본 기능</span>
            <span class="progress-percentage">100%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill completed" :style="{width: '100%'}"></div>
          </div>
          <span class="progress-status completed">완료</span>
        </div>
        <div class="progress-item">
          <div class="progress-info">
            <span class="feature-name">빈 강의실 확인</span>
            <span class="progress-percentage">75%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill in-progress" :style="{width: '75%'}"></div>
          </div>
          <span class="progress-status in-progress">진행 중</span>
        </div>
        <div class="progress-item">
          <div class="progress-info">
            <span class="feature-name">도서관 자리 예약</span>
            <span class="progress-percentage">60%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill in-progress" :style="{width: '60%'}"></div>
          </div>
          <span class="progress-status in-progress">진행 중</span>
        </div>
        <div class="progress-item">
          <div class="progress-info">
            <span class="feature-name">학식당 현황</span>
            <span class="progress-percentage">45%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill in-progress" :style="{width: '45%'}"></div>
          </div>
          <span class="progress-status in-progress">진행 중</span>
        </div>
      </div>
    </div>

    <!-- 현재 이용 가능한 기능 -->
    <div class="features-section">
      <h2 class="section-title">현재 이용 가능한 기능</h2>
      <div class="features-grid">
        <div class="feature-card available" @click="goToChat">
          <div class="feature-status-badge available">이용 가능</div>
          <div class="feature-icon">💬</div>
          <h3 class="feature-title">AI 챗봇</h3>
          <p class="feature-description">궁금한 것을 자유롭게 물어보세요</p>
          <div class="feature-action">
            <span class="action-text">바로 사용하기</span>
            <div class="action-arrow">→</div>
          </div>
        </div>
        <div class="feature-card coming-soon">
          <div class="feature-status-badge coming-soon">준비 중</div>
          <div class="feature-icon">🏫</div>
          <h3 class="feature-title">빈 강의실 확인</h3>
          <p class="feature-description">실시간 강의실 현황 조회</p>
        </div>
        <div class="feature-card coming-soon">
          <div class="feature-status-badge coming-soon">준비 중</div>
          <div class="feature-icon">📚</div>
          <h3 class="feature-title">도서관 자리 예약</h3>
          <p class="feature-description">도서관 및 열람실 자리 예약</p>
        </div>
        <div class="feature-card coming-soon">
          <div class="feature-status-badge coming-soon">준비 중</div>
          <div class="feature-icon">🍽️</div>
          <h3 class="feature-title">학식당 현황</h3>
          <p class="feature-description">실시간 학식당 메뉴 및 혼잡도</p>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-actions">
      <button class="secondary-button" @click="goBack">
        <span class="button-text">돌아가기</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToChat = () => {
  router.push('/');
};

const goToCrew = () => {
  router.push('/crew');
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
/* 컨테이너 */
.development-status-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Pretendard, sans-serif;
  gap: 50px;
}

/* 헤더 섹션 */
.header-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  width: 100%;
  max-width: 659px;
  margin-bottom: 20px;
}

.main-title {
  color: rgb(31, 41, 55);
  font-size: 32px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  margin: 0;
}

.divider-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.divider-line {
  width: 301px;
  height: 1px;
  background-color: rgb(156, 163, 175);
}

.subtitle {
  color: rgb(107, 114, 128);
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  text-align: left;
  margin: 0;
}

/* 섹션 제목 */
.section-title {
  color: rgb(31, 41, 55);
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  margin: 0 0 30px 0;
}

/* 크루 모집 섹션 */
.recruitment-section {
  width: 100%;
  max-width: 659px;
}

.recruitment-card {
  background-color: rgb(240, 246, 255);
  border-radius: 20px;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 25px;
  border: 1px solid rgba(2, 71, 138, 0.1);
  transition: all 0.3s ease;
}

.recruitment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(2, 71, 138, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.recruitment-icon {
  font-size: 32px;
}

.card-title {
  color: rgb(2, 71, 138);
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  margin: 0;
}

.card-description {
  color: rgb(31, 41, 55);
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  line-height: 150%;
  margin: 0;
}

.card-actions {
  display: flex;
  justify-content: flex-start;
}

/* 버튼 스타일 */
.primary-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  background-color: rgb(2, 71, 138);
  padding: 13px 24px;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.primary-button:hover {
  background-color: rgb(1, 56, 110);
  transform: translateY(-1px);
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.3);
}

.secondary-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  background-color: rgb(107, 114, 128);
  padding: 13px 24px;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  background-color: rgb(75, 85, 99);
  transform: translateY(-1px);
  box-shadow: 0px 4px 12px 0px rgba(107, 114, 128, 0.3);
}

.button-text {
  color: rgb(248, 251, 255);
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  text-align: center;
}

.button-arrow {
  color: rgb(248, 251, 255);
  font-size: 16px;
  font-weight: 600;
}

/* 진행 현황 섹션 */
.progress-section {
  width: 100%;
  max-width: 659px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  background-color: rgb(249, 250, 251);
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
}

.progress-item:hover {
  background-color: rgb(243, 244, 246);
  transform: translateY(-1px);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-name {
  color: rgb(31, 41, 55);
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
}

.progress-percentage {
  color: rgb(107, 114, 128);
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: rgb(229, 231, 235);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.completed {
  background-color: rgb(34, 197, 94);
}

.progress-fill.in-progress {
  background-color: rgb(2, 71, 138);
}

.progress-status {
  font-size: 12px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  align-self: flex-start;
}

.progress-status.completed {
  background-color: rgba(34, 197, 94, 0.1);
  color: rgb(34, 197, 94);
}

.progress-status.in-progress {
  background-color: rgba(2, 71, 138, 0.1);
  color: rgb(2, 71, 138);
}

/* 기능 섹션 */
.features-section {
  width: 100%;
  max-width: 659px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-card {
  position: relative;
  background-color: rgb(255, 255, 255);
  border-radius: 16px;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid rgb(229, 231, 235);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.feature-card.available {
  border-color: rgb(34, 197, 94);
}

.feature-card.available:hover {
  border-color: rgb(21, 128, 61);
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.2);
}

.feature-card.coming-soon {
  opacity: 0.7;
  cursor: default;
}

.feature-card.coming-soon:hover {
  transform: none;
  box-shadow: none;
}

.feature-status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 12px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
}

.feature-status-badge.available {
  background-color: rgba(34, 197, 94, 0.1);
  color: rgb(34, 197, 94);
}

.feature-status-badge.coming-soon {
  background-color: rgba(249, 115, 22, 0.1);
  color: rgb(249, 115, 22);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 5px;
}

.feature-title {
  color: rgb(31, 41, 55);
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  margin: 0;
}

.feature-description {
  color: rgb(107, 114, 128);
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  line-height: 150%;
  margin: 0;
}

.feature-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.action-text {
  color: rgb(2, 71, 138);
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
}

.action-arrow {
  color: rgb(2, 71, 138);
  font-size: 16px;
  font-weight: 600;
}

/* 하단 액션 */
.bottom-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .development-status-container {
    padding: 20px;
    gap: 30px;
  }

  .header-section {
    max-width: 100%;
  }

  .main-title {
    font-size: 28px;
  }

  .recruitment-section,
  .progress-section,
  .features-section {
    max-width: 100%;
  }

  .recruitment-card {
    padding: 30px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .progress-item {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .development-status-container {
    padding: 15px;
  }

  .main-title {
    font-size: 24px;
  }

  .divider-line {
    width: 100%;
  }

  .recruitment-card {
    padding: 20px;
  }

  .feature-card {
    padding: 20px;
  }
}
</style>