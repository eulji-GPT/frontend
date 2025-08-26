<template>
  <div class="crew-recruitment">
    <!-- 지원 자격 섹션 -->
    <section class="qualifications-section">
      <h2 class="section-title">지원 자격</h2>
      <div class="qualifications-content">
        <span class="base-text">을GPT에 관심 있는 누구나!</span><br>
        <span class="highlight-text">서비스 기획, 개발, 디자인</span><span class="base-text">에 도전해보고 싶은 분</span><br>
        <span class="base-text">협업과 커뮤니케이션에 열린 마음을 가진 분</span><br>
        <span class="base-text">경험이 없어도 괜찮아요! </span><span class="highlight-text">열정</span><span class="base-text">과 </span><span class="highlight-text">호기심</span><span class="base-text">만 있다면 OK!</span>
      </div>
    </section>

    <!-- 모집 부문 섹션 -->
    <section class="recruitment-section">
      <h2 class="section-title">모집 부문</h2>
      <div class="recruitment-content">
        <div class="separator-line"></div>
        
        <div class="roles-container">
          <div class="role-item">
            <h3 class="role-title">Front-end</h3>
            <p class="role-description">
              유저가 마주하는 모든 화면과 경험을 만드는 팀입니다.<br>
              React, Vue, Next.js 등을 사용해 UI/UX를 구현합니다.<br>
              Figma로 디자인된 시안을 바탕으로 인터랙션을 개발하고, 실제 서비스로 연결합니다.
            </p>
          </div>

          <div class="role-item">
            <h3 class="role-title">Back-end</h3>
            <p class="role-description">
              서버 및 DB 설계와 개발을 맡는 핵심 팀이에요.<br>
              Spring, Django, FastAPI 등 익숙한 프레임워크가 있다면 환영!<br>
              LLM 기반 기능과 연동되는 API를 개발하고, 안정적인 시스템을 구현합니다.
            </p>
          </div>

          <div class="role-item">
            <h3 class="role-title">AI / RAG</h3>
            <p class="role-description">
              GPT, RAG, LLM 관련 기술을 연구하고 적용하는 팀이에요.<br>
              Vector DB, Embedding, Retrieval 등 최신 AI 기술을 다룹니다.<br>
              AI 챗봇의 자연스러운 응답 흐름과 정확도를 높이는 역할을 합니다.
            </p>
          </div>

          <div class="role-item">
            <h3 class="role-title">Design</h3>
            <p class="role-description">
              브랜드 아이덴티티, UI/UX, 일러스트 등 시각적 방향성을 책임지는 팀입니다.<br>
              Figma 기반의 프로덕트 디자인을 중심으로 활동하며, 개발팀과 긴밀히 협업합니다.<br>
              사용자 친화적인 인터페이스와 감��적인 디자인을 함께 만들어가요.
            </p>
          </div>

          <div class="role-item">
            <h3 class="role-title">Support</h3>
            <p class="role-description">
              프로젝트 흐름을 함께 관찰하고, 본인의 흥미와 역량에 맞는 분야를 탐색하는 팀입니다.<br>
              향후 관심 있는 팀(프론트, 백엔드 , 디자인 등)에 점차 합류하며<br>
              실질적인 역할도 차근차근 맡게 될 예정이에요!<br>
              처음 시작은 가볍게, 하지만 함께 성장할 수 있도록 돕는 팀입니다.
            </p>
          </div>
        </div>

        <div class="separator-line"></div>
      </div>
    </section>

    <!-- 지원 시 참고사항 섹션 -->
    <section class="notes-section">
      <h2 class="section-title">지원 시 참고사항</h2>
      <div class="notes-content">
        모든 팀은 협업 툴(예: Slack, Notion, Figma, Git 등)을 통해 원활히 소통합니다.<br>
        익숙하지 않아도 팀에서 함께 배워갈 수 있도록 도와드려요!<br>
        프로젝트는 실제 운영을 중심으로 하는 만큼, 일정에 대한 책임감을 가지고 임해주시면 감사해요.<br>
        디자인 및 개발 경험이 부족하더라도 '배우���자 하는 의지'가 있다면 누구나 환영합니다.<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;특히 서포터팀은 그런 분들을 위한 시작점이에요. ✿
      </div>
    </section>

    <!-- FAQ 섹션 -->
    <section class="faq-section">
      <h2 class="section-title faq-title">자주 묻는 질문</h2>
      <div class="faq-container">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="faq-item"
          :class="{ 'active': faq.isOpen }"
        >
          <div class="faq-question" @click="toggleFaq(index)">
            <div class="question-content">
              <span class="q-label">Q.</span>
              <span class="question-text">{{ faq.question }}</span>
            </div>
            <svg
              class="faq-arrow"
              :class="{ 'rotated': faq.isOpen }"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 25L20 15L30 25"
                stroke="#6B7280"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="faq-answer" v-show="faq.isOpen">
            <span class="a-label">A.</span>
            <span class="answer-text">{{ faq.answer }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FAQ {
  question: string
  answer: string
  isOpen: boolean
}

const faqs = ref<FAQ[]>([
  {
    question: '을지피티가 뭔가요?',
    answer: 'AI 대화형 서비스 입니다. AI 대화형 서비스 입니다.',
    isOpen: false
  },
  {
    question: '을지피티가 뭔가요?',
    answer: 'AI 대화형 서비스 입니다. AI 대화형 서비스 입니다.',
    isOpen: false
  },
  {
    question: '을지피티가 뭔가요?',
    answer: 'AI 대화형 서비스 입니다. AI 대화형 서비스 입니다.',
    isOpen: false
  },
  {
    question: '을지피티가 뭔가요?',
    answer: 'AI 대화형 서비스 입니다. AI 대화형 서비스 입니다.',
    isOpen: false
  }
])

const toggleFaq = (index: number) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}
</script>

<style scoped>
.crew-recruitment {
  background: #141D30;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  color: #FFFFFF;
  padding: 163px 0;
}

/* Section Titles */
.section-title {
  color: #F0F6FF;
  font-size: 36px;
  font-weight: 700;
  line-height: 150%;
  margin: 0 0 40px 0;
}

.faq-title {
  color: #FFFFFF;
}

/* 지원 자격 섹션 */
.qualifications-section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
  margin-bottom: 160px;
}

.qualifications-content {
  font-size: 20px;
  font-weight: 700;
  line-height: 40px;
  max-width: 423px;
}

.base-text {
  color: #FFFFFF;
}

.highlight-text {
  color: #4789EE;
}

/* 모집 부문 섹션 */
.recruitment-section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
  margin-bottom: 160px;
}

.recruitment-content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.separator-line {
  width: 100%;
  height: 1px;
  background: #FFFFFF;
}

.roles-container {
  display: flex;
  flex-direction: column;
  gap: 80px;
  max-width: 959px;
  margin: 0 auto;
}

.role-item {
  display: flex;
  gap: 164px;
  align-items: flex-start;
}

.role-title {
  color: #4789EE;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  margin: 0;
  min-width: 152px;
  flex-shrink: 0;
}

.role-description {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 700;
  line-height: 40px;
  margin: 0;
  flex: 1;
  max-width: 683px;
}

/* 지원 시 참고사항 섹션 */
.notes-section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
  margin-bottom: 160px;
}

.notes-content {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 700;
  line-height: 40px;
}

/* FAQ 섹션 */
.faq-section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}

.faq-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.faq-item {
  width: 100%;
  background: transparent;
  border: none;
}

.faq-question {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  cursor: pointer;
  gap: 30px;
  background: transparent;
  border: none;
  border-radius: 0;
}

.question-content {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
}

.q-label {
  color: #FFFFFF;
  font-size: 36px;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
}

.question-text {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  max-width: 737px;
}

.faq-arrow {
  width: 40px;
  height: 40px;
  transform: rotate(-90deg);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-arrow.rotated {
  transform: rotate(0deg);
}

.faq-answer {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px 90px 20px 20px;
  background: transparent;
  border: none;
}

.a-label {
  color: #4789EE;
  font-size: 36px;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
}

.answer-text {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  width: 904px;
  max-width: 904px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .crew-recruitment {
    padding: 100px 0;
  }
  
  .qualifications-section,
  .recruitment-section,
  .notes-section,
  .faq-section {
    padding: 0 40px;
    margin-bottom: 120px;
  }
  
  .role-item {
    gap: 80px;
  }
  
  .roles-container {
    gap: 60px;
  }
}

@media (max-width: 768px) {
  .crew-recruitment {
    padding: 80px 0;
  }
  
  .qualifications-section,
  .recruitment-section,
  .notes-section,
  .faq-section {
    padding: 0 20px;
    margin-bottom: 80px;
  }
  
  .section-title {
    font-size: 28px;
    margin-bottom: 30px;
  }
  
  .qualifications-content {
    font-size: 18px;
    line-height: 32px;
  }
  
  .role-item {
    flex-direction: column;
    gap: 20px;
  }
  
  .role-title {
    font-size: 20px;
    min-width: auto;
  }
  
  .role-description {
    font-size: 16px;
    line-height: 32px;
  }
  
  .notes-content {
    font-size: 16px;
    line-height: 32px;
  }
  
  .faq-question {
    padding: 15px;
    gap: 15px;
  }
  
  .q-label, .a-label {
    font-size: 24px;
  }
  
  .question-text, .answer-text {
    font-size: 18px;
  }
  
  .question-content {
    gap: 15px;
  }
  
  .faq-answer {
    padding: 15px 40px 15px 15px;
    gap: 15px;
  }
  
  .faq-arrow {
    width: 30px;
    height: 30px;
  }
  
  .answer-text {
    width: auto;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .crew-recruitment {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .qualifications-content {
    font-size: 16px;
    line-height: 28px;
  }
  
  .role-description {
    font-size: 14px;
    line-height: 28px;
  }
  
  .notes-content {
    font-size: 14px;
    line-height: 28px;
  }
  
  .q-label, .a-label {
    font-size: 20px;
  }
  
  .question-text, .answer-text {
    font-size: 16px;
  }
}
</style>
