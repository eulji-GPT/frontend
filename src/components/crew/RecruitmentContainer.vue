<template>
  <div class="recruitment-container">
    <div class="qualification-section">
      <span class="section-title">지원 자격</span>
      <span class="qualification-text">
        을GPT에 관심 있는 누구나!<br/>
        서비스 기획, 개발, 디자인에 도전해보고 싶은 분<br/>
        협업과 커뮤니케이션에 열린 마음을 가진 분<br/>
        경험이 없어도 괜찮아요! 열정과 호기심만 있다면 OK!
      </span>
    </div>
    
    <div class="departments-section">
      <span class="section-title">모집 부문</span>
      <div class="departments-frame">
        <div class="line-separator"></div>
        <div class="departments-list">
          <div class="department-item">
            <span class="department-name">Front-end</span>
            <span class="department-description">
              유저가 마주하는 모든 화면과 경험을 만드는 팀입니다.<br/>
              Vue 3 + TypeScript + Vite로 빠르고 반응적인 UI를 구현합니다.<br/>
              Tailwind CSS로 스타일링하고, Figma 디자인을 서비스로 연결합니다.
            </span>
          </div>
          
          <div class="department-item">
            <span class="department-name">Back-end</span>
            <span class="department-description">
              서버 및 DB 설계와 개발을 맡는 핵심 팀이에요.<br/>
              FastAPI + PostgreSQL 기반으로 인증, 채팅 이력, 예약 시스템을 개발합니다.<br/>
              RESTful API 설계와 배포 자동화로 안정적인 서비스를 운영합니다.
            </span>
          </div>
          
          <div class="department-item">
            <span class="department-name">AI / RAG</span>
            <span class="department-description">
              RAG 기반 AI 챗봇의 핵심 기술을 연구하고 적용하는 팀이에요.<br/>
              ChromaDB + LangChain으로 벡터 검색을, BM25로 하이브리드 검색을 구현합니다.<br/>
              을지대 정보에 특화된 정확하고 자연스러운 AI 응답을 만들어갑니다.
            </span>
          </div>
          
          <div class="department-item">
            <span class="department-name">Design</span>
            <span class="department-description">
              브랜드 아이덴티티, UI/UX, 일러스트 등 시각적 방향성을 책임지는 팀입니다.<br/>
              Figma 기반의 프로덕트 디자인을 중심으로 활동하며, 개발팀과 긴밀히 협업합니다.<br/>
              사용자 친화적인 인터페이스와 감각적인 디자인을 함께 만들어가요.
            </span>
          </div>
          
          <div class="department-item">
            <span class="department-name">Parrot</span>
            <span class="department-description">
              프로젝트 흐름을 함께 관찰하고, 본인의 흥미와 역량에 맞는 분야를 탐색하는 팀입니다.<br/>
              향후 관심 있는 팀(프론트, 백엔드 , 디자인 등)에 점차 합류하며<br/>
              실질적인 역할도 차근차근 맡게 될 예정이에요!<br/>
              처음 시작은 가볍게, 하지만 함께 성장할 수 있도록 돕는 팀입니다.
            </span>
          </div>
        </div>
        <div class="line-separator"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.recruitment-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 160px;
  width: 1080px;
  max-width: 1080px;
  margin: 0 auto;
  box-sizing: border-box;
  background: transparent;
  padding: 80px 40px;
}

.qualification-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 423px;
  box-sizing: border-box;
}

.section-title {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: left;
  width: 100%;
}

.qualification-text {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 100%;
}

.departments-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 60px;
  width: 100%;
  box-sizing: border-box;
}

.departments-frame {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  width: 100%;
  height: 1065px;
  box-sizing: border-box;
}

.line-separator {
  height: 0px;
  border-top: solid 1px white;
  width: 100%;
}

.departments-list {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 80px;
  width: 959px;
  height: 946px;
  box-sizing: border-box;
}

.department-item {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 164px;
  width: 100%;
  box-sizing: border-box;
}

.department-item:nth-child(2) {
  gap: 168px;
}

.department-item:nth-child(3) {
  gap: 184px;
}

.department-item:nth-child(4) {
  gap: 196px;
}

.department-item:nth-child(5) {
  gap: 196px;
}

.department-name {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  flex-shrink: 0;
}

.department-description {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 683px;
  min-height: 88px;
}

.department-item:nth-child(2) .department-description,
.department-item:nth-child(3) .department-description,
.department-item:nth-child(4) .department-description {
  min-height: 117px;
}

.department-item:nth-child(5) .department-description {
  min-height: 160px;
}

@media (max-width: 768px) {
  .recruitment-container {
    width: 100%;
    padding: 60px 20px;
    gap: 60px;
  }

  .qualification-section {
    width: 100%;
    gap: 24px;
  }

  .section-title {
    font-size: 28px;
  }

  .qualification-text {
    font-size: 16px;
    line-height: 28px;
  }

  .departments-section {
    gap: 40px;
  }

  .departments-frame {
    height: auto;
    gap: 40px;
  }

  .departments-list {
    width: 100%;
    height: auto;
    gap: 32px;
  }

  .department-item {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 20px;
    background: rgba(2, 71, 138, 0.1);
    border-radius: 16px;
    border: 1px solid rgba(71, 137, 238, 0.2);
  }

  .department-item:nth-child(2),
  .department-item:nth-child(3),
  .department-item:nth-child(4),
  .department-item:nth-child(5) {
    gap: 12px;
  }

  .department-name {
    font-size: 20px;
  }

  .department-description {
    width: 100%;
    font-size: 15px;
    line-height: 26px;
    min-height: auto;
  }

  .line-separator {
    display: none;
  }
}

@media (max-width: 480px) {
  .recruitment-container {
    padding: 40px 16px;
    gap: 40px;
  }

  .section-title {
    font-size: 24px;
  }

  .qualification-text {
    font-size: 15px;
    line-height: 26px;
  }

  .departments-list {
    gap: 24px;
  }

  .department-item {
    padding: 16px;
  }

  .department-name {
    font-size: 18px;
  }

  .department-description {
    font-size: 14px;
    line-height: 24px;
  }
}
</style>