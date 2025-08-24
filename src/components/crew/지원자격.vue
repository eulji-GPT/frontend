<template>
  <div class="frame">
    <div class="div">
      <div class="text-wrapper">지원 자격</div>
      <p class="GPT-OK">
        <span class="span">
          을GPT에 관심 있는 누구나!
          <br />
        </span>
        <span class="text-wrapper-2">서비스 기획, 개발, 디자인</span>
        <span class="span">
          에 도전해보고 싶은 분<br />
          협업과 커뮤니케이션에 열린 마음을 가진 분<br />
          경험이 없어도 괜찮아요!{" "}
        </span>
        <span class="text-wrapper-2">열정</span>
        <span class="span">과 </span>
        <span class="text-wrapper-2">호기심</span>
        <span class="span">만 있다면 OK!</span>
      </p>
    </div>
    <div class="div-2">
      <div class="text-wrapper">모집 부문</div>
      <div class="div-3">
        <img class="line" alt="Line" src="./line-110.svg" />
        <div class="div-4">
          <div class="div-5">
            <div class="text-wrapper-3">Front-end</div>
            <p class="react-vue-next-js-UI">
              유저가 마주하는 모든 화면과 경험을 만드는 팀입니다.
              <br />
              React, Vue, Next.js 등을 사용해 UI/UX를 구현합니다.
              <br />
              Figma로 디자인된 시안을 바탕으로 인터랙션을 개발하고, 실제
              서비스로 연결합니다.
            </p>
          </div>
          <div class="div-6">
            <div class="text-wrapper-3">Back-end</div>
            <p class="p">
              서버 및 DB 설계와 개발을 맡는 핵심 팀이에요.
              <br />
              Spring, Django, FastAPI 등 익숙한 프레임워크가 있다면 환영!
              <br />
              LLM 기반 기능과 연동되는 API를 개발하고, 안정적인 시스템을
              구현합니다.
            </p>
          </div>
          <div class="div-7">
            <div class="text-wrapper-3">AI / RAG</div>
            <p class="p">
              GPT, RAG, LLM 관련 기술을 연구하고 적용하는 팀이에요.
              <br />
              Vector DB, Embedding, Retrieval 등 최신 AI 기술을 다룹니다.
              <br />
              AI 챗봇의 자연스러운 응답 흐름과 정확도를 높이는 역할을 합니다.
            </p>
          </div>
          <div class="div-8">
            <div class="text-wrapper-3">Design</div>
            <p class="UI-UX-figma">
              브랜드 아이덴티티, UI/UX, 일러스트 등 시각적 방향성을 책임지는
              팀입니다.
              <br />
              Figma 기반의 프로덕트 디자인을 중심으로 활동하며, 개발팀과
              긴밀히 협업합니다.
              <br />
              사용자 친화적인 인터페이스와 감각적인 디자인을 함께 만들어가요.
            </p>
          </div>
          <div class="div-7">
            <div class="text-wrapper-3">Support</div>
            <p class="text-wrapper-4">
              프로젝트 흐름을 함께 관찰하고, 본인의 흥미와 역량에 맞는 분야를
              탐색하는 팀입니다.
              <br />
              향후 관심 있는 팀(프론트, 백엔드 , 디자인 등)에 점차 합류하며
              <br />
              실질적인 역할도 차근차근 맡게 될 예정이에요!
              <br />
              처음 시작은 가볍게, 하지만 함께 성장할 수 있도록 돕는 팀입니다.
            </p>
          </div>
        </div>
        <img class="img" alt="Line" src="./line-111.svg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Frame",
};
</script>

<style>
:root {
  --primary-300: #f0f6ff;
  --title-bold1-font-family: "Pretendard-Bold", Helvetica;
  --title-bold1-font-size: 36px;
  --title-bold1-font-style: normal;
  --title-bold1-font-weight: 700;
  --title-bold1-letter-spacing: 0;
  --title-bold1-line-height: 54px;
  --subtitle-semibold1-font-family: "Pretendard-SemiBold", Helvetica;
  --subtitle-semibold1-font-size: 20px;
  --subtitle-semibold1-font-style: normal;
  --subtitle-semibold1-font-weight: 600;
  --subtitle-semibold1-letter-spacing: 0;
  --subtitle-semibold1-line-height: 40px;
}

.frame {
  align-items: flex-start;
  background: #141d30;
  color: white;
  padding: 80px 20px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 160px;
  position: relative;
  width: 1080px;
}

.frame .div {
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 40px;
  position: relative;
  width: 423px;
}

.frame .text-wrapper {
  align-self: stretch;
  color: var(--primary-300);
  font-family: var(--title-bold1-font-family);
  font-size: var(--title-bold1-font-size);
  font-style: var(--title-bold1-font-style);
  font-weight: var(--title-bold1-font-weight);
  letter-spacing: var(--title-bold1-letter-spacing);
  line-height: var(--title-bold1-line-height);
  margin-top: -1.00px;
  position: relative;
}

.frame .GPT-OK {
  align-self: stretch;
  color: transparent;
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  position: relative;
}

.frame .span {
  color: #ffffff;
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
}

.frame .text-wrapper-2 {
  color: #4789ee;
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
}

.frame .div-2 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 60px;
  position: relative;
  width: 100%;
}

.frame .div-3 {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 60px;
  height: 1065px;
  justify-content: center;
  position: relative;
  width: 100%;
}

.frame .line {
  align-self: stretch;
  height: 1px;
  margin-top: -1.50px;
  object-fit: cover;
  position: relative;
  width: 100%;
}

.frame .div-4 {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 80px;
  height: 946px;
  position: relative;
  width: 959px;
}

.frame .div-5 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  gap: 164px;
  position: relative;
  width: 100%;
}

.frame .text-wrapper-3 {
  color: var(--darksub-1);
  font-family: var(--title-bold3-font-family);
  font-size: var(--title-bold3-font-size);
  font-style: var(--title-bold3-font-style);
  font-weight: var(--title-bold3-font-weight);
  letter-spacing: var(--title-bold3-letter-spacing);
  line-height: var(--title-bold3-line-height);
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.frame .react-vue-next-js-UI {
  color: var(--white);
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  height: 88px;
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  margin-right: -1.00px;
  margin-top: -1.00px;
  position: relative;
  width: 683px;
}

.frame .div-6 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  gap: 168px;
  position: relative;
  width: 100%;
}

.frame .p {
  color: var(--white);
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  height: 117px;
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  margin-right: -1.00px;
  margin-top: -1.00px;
  position: relative;
  width: 683px;
}

.frame .div-7 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  gap: 184px;
  position: relative;
  width: 100%;
}

.frame .div-8 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  gap: 196px;
  position: relative;
  width: 100%;
}

.frame .UI-UX-figma {
  color: var(--white);
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  height: 117px;
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  margin-top: -1.00px;
  position: relative;
  width: 683px;
}

.frame .text-wrapper-4 {
  color: var(--white);
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  height: 160px;
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  margin-top: -1.00px;
  position: relative;
  width: 683px;
}

.frame .img {
  align-self: stretch;
  height: 1px;
  margin-bottom: -0.50px;
  object-fit: cover;
  position: relative;
  width: 100%;
}
</style>