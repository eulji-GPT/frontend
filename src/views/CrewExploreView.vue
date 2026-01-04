<template>
  <div class="explore-page">
    <div class="background-gradient">
      <div class="ellipse animated-gradient" />
      <div class="ellipse-2 animated-gradient" />
    </div>

    <HeaderSection />

    <div class="explore-container">
      <!-- 헤더 섹션 -->
      <div class="explore-header">
        <h1 class="explore-title">을GPT 둘러보기</h1>
        <p class="explore-subtitle">
          을GPT는 어떤 팀일까요?<br/>
          우리의 프로젝트와 활동을 소개합니다.
        </p>
      </div>

      <!-- 프로젝트 소개 -->
      <section class="content-section">
        <h2 class="section-title">프로젝트 소개</h2>
        <div class="card">
          <h3 class="card-title">을GPT - AI 기반 대학생 챗봇</h3>
          <p class="card-text">
            을GPT는 대학생들을 위한 AI 챗봇 서비스입니다.<br/>
            학업, 진로, 대학 생활 전반에 걸쳐 학생들에게 도움을 제공하고 있습니다.<br/><br/>

            <strong>주요 기능:</strong><br/>
            • 일반 대화: 다양한 주제로 자유롭게 대화<br/>
            • 학습 도우미: 학업 관련 질문과 학습 지원<br/>
            • 진로 상담: 진로와 취업 관련 조언<br/>
            • 대학 정보: RAG 기반 대학 정보 검색<br/>
            • Chain of Thought: 단계별 사고 과정을 보여주는 고급 AI 모드
          </p>
        </div>
      </section>

      <!-- 기술 스택 -->
      <section class="content-section">
        <h2 class="section-title">기술 스택</h2>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-icon">💻</div>
            <h3 class="tech-name">Frontend</h3>
            <p class="tech-description">
              Vue 3, TypeScript, Vite<br/>
              Composition API, Vue Router
            </p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">⚙️</div>
            <h3 class="tech-name">Backend</h3>
            <p class="tech-description">
              FastAPI, Python<br/>
              RESTful API 설계
            </p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">🤖</div>
            <h3 class="tech-name">AI/ML</h3>
            <p class="tech-description">
              Gemini API<br/>
              RAG, Vector DB, Embeddings
            </p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">🎨</div>
            <h3 class="tech-name">Design</h3>
            <p class="tech-description">
              Figma<br/>
              UI/UX 디자인, 프로토타이핑
            </p>
          </div>
        </div>
      </section>

      <!-- 팀 문화 -->
      <section class="content-section">
        <h2 class="section-title">팀 문화</h2>
        <div class="culture-grid">
          <div class="culture-card">
            <div class="culture-number">01</div>
            <h3 class="culture-title">자율과 책임</h3>
            <p class="culture-description">
              자율적인 근무 환경에서 스스로 일정을 관리하고,<br/>
              맡은 역할에 책임감을 가집니다.
            </p>
          </div>
          <div class="culture-card">
            <div class="culture-number">02</div>
            <h3 class="culture-title">열린 소통</h3>
            <p class="culture-description">
              누구나 자유롭게 의견을 제시하고,<br/>
              서로의 아이디어를 존중합니다.
            </p>
          </div>
          <div class="culture-card">
            <div class="culture-number">03</div>
            <h3 class="culture-title">함께 성장</h3>
            <p class="culture-description">
              경험이 부족해도 괜찮습니다.<br/>
              함께 배우고 성장하는 것을 지향합니다.
            </p>
          </div>
          <div class="culture-card">
            <div class="culture-number">04</div>
            <h3 class="culture-title">실전 경험</h3>
            <p class="culture-description">
              실제 서비스를 개발하고 운영하며<br/>
              실무 경험을 쌓을 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <!-- 활동 내역 -->
      <section class="content-section">
        <h2 class="section-title">주요 활동</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">2024.12</div>
            <div class="timeline-content">
              <h3 class="timeline-title">을GPT v2.0 런칭</h3>
              <p class="timeline-description">
                Chain of Thought 모드 추가, UI 개선
              </p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">2024.10</div>
            <div class="timeline-content">
              <h3 class="timeline-title">RAG 시스템 구축</h3>
              <p class="timeline-description">
                대학 정보 검색 기능 고도화
              </p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-date">2024.08</div>
            <div class="timeline-content">
              <h3 class="timeline-title">을GPT v1.0 베타 오픈</h3>
              <p class="timeline-description">
                초기 서비스 런칭 및 사용자 피드백 수집
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <div class="cta-section">
        <h2 class="cta-title">을GPT와 함께하고 싶으신가요?</h2>
        <p class="cta-description">
          지금 바로 지원하고 우리 팀의 일원이 되어보세요!
        </p>
        <div class="cta-buttons">
          <button class="btn-apply" @click="goToApply">지원하기</button>
          <button class="btn-back" @click="goBack">돌아가기</button>
        </div>
      </div>
    </div>

    <FooterContainer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeaderSection from '../components/main/HeaderSection_Desktop21.vue'
import FooterContainer from '../components/crew/FooterContainer.vue'

const router = useRouter()

const goToApply = () => {
  router.push('/crew/apply')
}

const goBack = () => {
  router.push('/crew')
}
</script>

<style scoped>
.explore-page {
  width: 100%;
  min-height: 100vh;
  background: #141D30;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.animated-gradient {
  animation: float 6s ease-in-out infinite;
}

.ellipse {
  background: radial-gradient(circle, #4789ee 0%, #4789ee 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(150px);
  height: 600px;
  width: 600px;
  position: absolute;
  right: -300px;
  top: -300px;
  opacity: 0.4;
}

.ellipse-2 {
  background: radial-gradient(circle, #2d4a8a 0%, #2d4a8a 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(250px);
  height: 672px;
  width: 672px;
  position: absolute;
  left: -336px;
  bottom: -336px;
  opacity: 0.3;
}

.explore-container {
  max-width: 1200px;
  width: 100%;
  margin: 120px auto 80px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.explore-header {
  text-align: center;
  margin-bottom: 80px;
}

.explore-title {
  font-size: 48px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
}

.explore-subtitle {
  font-size: 18px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
}

.content-section {
  margin-bottom: 80px;
}

.section-title {
  font-size: 32px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: #4789ee;
  margin-bottom: 32px;
}

.card {
  background: rgba(2, 71, 138, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(71, 137, 238, 0.2);
}

.card-title {
  font-size: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
}

.card-text {
  font-size: 16px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.tech-card {
  background: rgba(2, 71, 138, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(71, 137, 238, 0.2);
  text-align: center;
  transition: all 0.3s ease;
}

.tech-card:hover {
  transform: translateY(-4px);
  border-color: rgba(71, 137, 238, 0.5);
  box-shadow: 0 8px 25px rgba(71, 137, 238, 0.2);
}

.tech-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.tech-name {
  font-size: 20px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.tech-description {
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.culture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.culture-card {
  background: rgba(2, 71, 138, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(71, 137, 238, 0.2);
  transition: all 0.3s ease;
}

.culture-card:hover {
  transform: translateY(-4px);
  border-color: rgba(71, 137, 238, 0.5);
}

.culture-number {
  font-size: 40px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: #4789ee;
  margin-bottom: 16px;
}

.culture-title {
  font-size: 20px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.culture-description {
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #4789ee, rgba(71, 137, 238, 0.2));
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  padding-left: 40px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -45px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4789ee;
  box-shadow: 0 0 15px rgba(71, 137, 238, 0.6);
}

.timeline-date {
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  color: #4789ee;
  margin-bottom: 8px;
}

.timeline-content {
  background: rgba(2, 71, 138, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(71, 137, 238, 0.2);
}

.timeline-title {
  font-size: 18px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.timeline-description {
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, rgba(71, 137, 238, 0.15), rgba(102, 92, 237, 0.15));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  border: 1px solid rgba(71, 137, 238, 0.3);
  margin-top: 80px;
}

.cta-title {
  font-size: 32px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.cta-description {
  font-size: 18px;
  font-family: 'Pretendard', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-apply,
.btn-back {
  padding: 14px 40px;
  border-radius: 12px;
  font-size: 18px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-apply {
  background: linear-gradient(135deg, #4789ee, #665ced);
  color: white;
}

.btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(71, 137, 238, 0.4);
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@media (max-width: 768px) {
  .explore-container {
    margin: 80px auto 40px;
    padding: 0 16px;
  }

  .explore-header {
    margin-bottom: 50px;
  }

  .explore-title {
    font-size: 32px;
  }

  .explore-subtitle {
    font-size: 16px;
    line-height: 1.6;
  }

  .content-section {
    margin-bottom: 50px;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .card {
    padding: 24px;
    border-radius: 16px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-text {
    font-size: 15px;
    line-height: 1.7;
  }

  .tech-grid,
  .culture-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .tech-card,
  .culture-card {
    padding: 24px;
    border-radius: 16px;
  }

  .tech-icon {
    font-size: 36px;
  }

  .tech-name,
  .culture-title {
    font-size: 18px;
  }

  .tech-description,
  .culture-description {
    font-size: 14px;
  }

  .culture-number {
    font-size: 32px;
  }

  .timeline {
    padding-left: 24px;
  }

  .timeline-item {
    padding-left: 24px;
    margin-bottom: 30px;
  }

  .timeline-item::before {
    left: -29px;
    width: 10px;
    height: 10px;
  }

  .timeline-content {
    padding: 20px;
  }

  .timeline-title {
    font-size: 16px;
  }

  .cta-section {
    padding: 40px 24px;
    margin-top: 50px;
    border-radius: 16px;
  }

  .cta-title {
    font-size: 22px;
  }

  .cta-description {
    font-size: 15px;
    margin-bottom: 24px;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .btn-apply,
  .btn-back {
    width: 100%;
    padding: 14px 30px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .explore-container {
    margin: 70px auto 30px;
    padding: 0 12px;
  }

  .explore-header {
    margin-bottom: 40px;
  }

  .explore-title {
    font-size: 28px;
  }

  .explore-subtitle {
    font-size: 15px;
  }

  .content-section {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 22px;
  }

  .card {
    padding: 20px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-text {
    font-size: 14px;
  }

  .tech-card,
  .culture-card {
    padding: 20px;
  }

  .timeline {
    padding-left: 20px;
  }

  .timeline-item {
    padding-left: 20px;
  }

  .cta-section {
    padding: 30px 20px;
  }

  .cta-title {
    font-size: 20px;
  }

  .cta-description {
    font-size: 14px;
  }

  .btn-apply,
  .btn-back {
    padding: 12px 24px;
    font-size: 15px;
    border-radius: 10px;
  }
}
</style>
