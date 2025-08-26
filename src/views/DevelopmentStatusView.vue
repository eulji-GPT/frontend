<template>
  <div class="development-status-page">
    <div class="header-section">
      <h1 class="page-title">🚧 개발 중입니다</h1>
      <p class="subtitle">더 나은 서비스를 위해 열심히 개발하고 있어요!</p>
    </div>

    <div class="crew-recruitment-section">
      <div class="recruitment-card">
        <h2>🔥 을GPT 크루 모집중!</h2>
        <p>을지대학교 학생들을 위한 서비스를 함께 만들어갈 개발자를 찾고 있습니다.</p>
        <div class="contact-info">
          <p>관심 있으시면 아래 링크를 확인해주세요! 📧</p>
          <a href="https://blossom-meal-8c6.notion.site/1e56d178ee33812195e3d069f9057024?pvs=105" 
             target="_blank" 
             class="contact-link">
            크루 모집 공고 보러가기 →
          </a>
        </div>
      </div>
    </div>

    <div class="progress-section">
      <h2>개발 진행 현황</h2>
      <div class="feature-progress">
        <div class="progress-item">
          <div class="feature-name">챗봇 기본 기능</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{width: '100%'}"></div>
          </div>
          <span class="progress-text">100%</span>
        </div>
        <div class="progress-item">
          <div class="feature-name">빈 강의실 확인</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{width: '75%'}"></div>
          </div>
          <span class="progress-text">75%</span>
        </div>
        <div class="progress-item">
          <div class="feature-name">도서관 자리 예약</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{width: '60%'}"></div>
          </div>
          <span class="progress-text">60%</span>
        </div>
        <div class="progress-item">
          <div class="feature-name">학식당 현황</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{width: '45%'}"></div>
          </div>
          <span class="progress-text">45%</span>
        </div>
      </div>
    </div>

    <div class="available-features-section">
      <h2>현재 이용 가능한 기능</h2>
      <div class="features-grid">
        <div class="feature-card available">
          <div class="feature-icon">💬</div>
          <h3>AI 챗봇</h3>
          <p>궁금한 것을 자유롭게 물어보세요</p>
          <button class="use-feature-btn" @click="goToChat">바로 사용하기</button>
        </div>
        <div class="feature-card coming-soon">
          <div class="feature-icon">🏫</div>
          <h3>빈 강의실 확인</h3>
          <p>실시간 강의실 현황 조회</p>
          <span class="coming-soon-badge">Coming Soon</span>
        </div>
        <div class="feature-card coming-soon">
          <div class="feature-icon">📚</div>
          <h3>도서관 자리 예약</h3>
          <p>도서관 및 열람실 자리 예약</p>
          <span class="coming-soon-badge">Coming Soon</span>
        </div>
        <div class="feature-card coming-soon">
          <div class="feature-icon">🍽️</div>
          <h3>학식당 현황</h3>
          <p>실시간 학식당 메뉴 및 혼잡도</p>
          <span class="coming-soon-badge">Coming Soon</span>
        </div>
      </div>
    </div>

    <div class="back-section">
      <button class="back-btn" @click="goBack">돌아가기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevelopmentStatusView',
  methods: {
    goToChat() {
      this.$router.push('/')
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.development-status-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.crew-recruitment-section {
  margin-bottom: 40px;
}

.recruitment-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.recruitment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.recruitment-card h2 {
  margin-top: 0;
  font-size: 1.5rem;
}

.contact-info p {
  margin: 15px 0 0 0;
  font-weight: 500;
}

.contact-link {
  display: inline-block;
  margin-top: 15px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.progress-section {
  margin-bottom: 40px;
}

.progress-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.progress-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.progress-item:hover {
  background-color: #f8f9fa;
}

.feature-name {
  min-width: 150px;
  font-weight: 500;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

.progress-text {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #4CAF50;
}

.available-features-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.feature-card.available {
  border: 2px solid #4CAF50;
}

.feature-card.coming-soon {
  border: 2px solid #ddd;
  opacity: 0.8;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.use-feature-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  transform: scale(1);
}

.use-feature-btn:hover {
  background: #45a049;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.coming-soon-badge {
  background: #ff9800;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.back-section {
  text-align: center;
}

.back-btn {
  background: #666;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  transform: scale(1);
}

.back-btn:hover {
  background: #555;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 102, 102, 0.3);
}

@media (max-width: 768px) {
  .development-status-page {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .feature-name {
    min-width: auto;
  }
  
  .progress-text {
    text-align: center;
  }
}
</style>