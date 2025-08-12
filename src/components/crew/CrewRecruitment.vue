<template>
  <div class="root-wrapper-desktop20">
    <div class="frame-2147227661">
      <div class="frame-2147227618">
        <span class="nan-0001">지원 자격</span>
        <span class="gpt-ok">
          을GPT에 관심 있는 누구나!<br/>
          서비스 기획, 개발, 디자인에 도전해보고 싶은 분<br/>
          협업과 커뮤니케이션에 열린 마음을 가진 분<br/>
          경험이 없어도 괜찮아요! 열정과 호기심만 있다면 OK!
        </span>
      </div>
      <div class="frame-2147227617">
        <span class="nan-0001">모집 부문</span>
        <div class="frame-2147227616">
          <div class="line110"></div>
          <div class="frame-2147227615">
            <div class="frame-2147227610">
              <span class="front-end">Front-end</span>
              <span class="react-vue-nextjs-ui-ux-figma">
                유저가 마주하는 모든 화면과 경험을 만드는 팀입니다.<br/>
                React, Vue, Next.js 등을 사용해 UI/UX를 구현합니다.<br/>
                Figma로 디자인된 시안을 바탕으로 인터랙션을 개발하고, 실제 서비스로 연결합니다.
              </span>
            </div>
            <div class="frame-2147227611">
              <span class="back-end">Back-end</span>
              <span class="db-spring-django-fastapi-llm-api">
                서버 및 DB 설계와 개발을 맡는 핵심 팀이에요.<br/>
                Spring, Django, FastAPI 등 익숙한 프레임워크가 있다면 환영!<br/>
                LLM 기반 기능과 연동되는 API를 개발하고, 안정적인 시스템을 구현합니다.<br/>
              </span>
            </div>
            <div class="frame-2147227612">
              <span class="ai-rag">AI / RAG</span>
              <span class="gpt-rag-llm-vector-db-embedding-retrieval-ai-ai">
                GPT, RAG, LLM 관련 기술을 연구하고 적용하는 팀이에요.<br/>
                Vector DB, Embedding, Retrieval 등 최신 AI 기술을 다룹니다.<br/>
                AI 챗봇의 자연스러운 응답 흐름과 정확도를 높이는 역할을 합니다.<br/>
              </span>
            </div>
            <div class="frame-2147227613">
              <span class="design">Design</span>
              <span class="ui-ux-figma">
                브랜드 아이덴티티, UI/UX, 일러스트 등 시각적 방향성을 책임지는 팀입니다.<br/>
                Figma 기반의 프로덕트 디자인을 중심으로 활동하며, 개발팀과 긴밀히 협업합니다.<br/>
                사용자 친화적인 인터페이스와 감각적인 디자인을 함께 만들어가요.<br/>
              </span>
            </div>
            <div class="frame-2147227612">
              <span class="support">Support</span>
              <span class="nan-0003">
                프로젝트 흐름을 함께 관찰하고, 본인의 흥미와 역량에 맞는 분야를 탐색하는 팀입니다.<br/>
                향후 관심 있는 팀(프론트, 백엔드 , 디자인 등)에 점차 합류하며<br/>
                실질적인 역할도 차근차근 맡게 될 예정이에요!<br/>
                처음 시작은 가볍게, 하지만 함께 성장할 수 있도록 돕는 팀입니다.
              </span>
            </div>
          </div>
          <div class="line110"></div>
        </div>
      </div>
    </div>
    <div class="frame-2147227660">
      <div class="frame-2147227619">
        <span class="nan-0001">지원 시 참고사항</span>
        <span class="slack-notion-figma-git">
          모든 팀은 협업 툴(예: Slack, Notion, Figma, Git 등)을 통해 원활히 소통합니다.<br/>
          익숙하지 않아도 팀에서 함께 배워갈 수 있도록 도와드려요!<br/>
          프로젝트는 실제 운영을 중심으로 하는 만큼, 일정에 대한 책임감을 가지고 임해주시면 감사해요.<br/>
          디자인 및 개발 경험이 부족하더라도 '배우고자 하는 의지'가 있다면 누구나 환영합니다.<br/>
          특히 서포터팀은 그런 분들을 위한 시작점이에요. ✿
        </span>
      </div>
      <div class="frame-2147227617">
        <span class="nan-0005">자주 묻는 질문</span>
        <div class="frame-2147227320">
          <div v-for="(faq, index) in faqs" :key="index" class="common">
            <div class="frame-2147227319">
              <div class="frame-2147227252">
                <span class="q">Q.</span>
                <span class="nan-0006">{{ faq.question }}</span>
              </div>
              <img :src="faq.iconSrc" alt="icon" class="icon"/>
            </div>
            <div class="frame-2147226778">
              <span class="a">A.</span>
              <span class="ai-ai">{{ faq.answer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * Desktop21 Vue Component
 * 을GPT 크루 모집 페이지
 * 
 * 기존 React 컴포넌트를 Vue 3 Composition API로 변환
 */

interface FAQ {
  question: string;
  answer: string;
  iconSrc: string;
}

const faqs = ref<FAQ[]>([
  {
    question: "을지피티가 뭔가요?",
    answer: "Ai 대화형 서비스 입니다. Ai 대화형 서비스 입니다.",
    iconSrc: "https://via.placeholder.com/40x40/4789EE/FFFFFF?text=?"
  },
  {
    question: "을지피티가 뭔가요?",
    answer: "Ai 대화형 서비스 입니다. Ai 대화형 서비스 입니다.",
    iconSrc: "https://via.placeholder.com/40x40/4789EE/FFFFFF?text=?"
  },
  {
    question: "을지피티가 뭔가요?",
    answer: "Ai 대화형 서비스 입니다. Ai 대화형 서비스 입니다.",
    iconSrc: "https://via.placeholder.com/40x40/4789EE/FFFFFF?text=?"
  },
  {
    question: "을지피티가 뭔가요?",
    answer: "Ai 대화형 서비스 입니다. Ai 대화형 서비스 입니다.",
    iconSrc: "https://via.placeholder.com/40x40/4789EE/FFFFFF?text=?"
  }
]);
</script>

<style scoped>
.root-wrapper-desktop20 {
  width: 1440px;
  height: 3420px;
  min-height: 100vh;
  overflow: hidden;
  background-color: rgb(20, 29, 48);
  position: relative;
  align-self: stretch;
  flex-shrink: 0;
}

.frame-2147227661 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 160px;
  align-self: stretch;
  width: 1080px;
  height: 1593px;
  box-sizing: border-box;
  position: absolute;
  left: 180px;
  top: 163px;
  flex-shrink: 0;
}

.frame-2147227618 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 40px;
  width: 423px;
  box-sizing: border-box;
}

.nan-0001 {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.gpt-ok {
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.frame-2147227617 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 60px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.frame-2147227616 {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  align-self: stretch;
  height: 1065px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.line110 {
  height: 0px;
  border-top: solid 1px white;
  align-self: stretch;
  flex-shrink: 0;
}

.frame-2147227615 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 80px;
  width: 959px;
  height: 946px;
  box-sizing: border-box;
}

.frame-2147227610 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 164px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.front-end {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
}

.react-vue-nextjs-ui-ux-figma {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 683px;
  min-height: 88px;
}

.frame-2147227611 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 168px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.back-end {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
}

.db-spring-django-fastapi-llm-api {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 683px;
  min-height: 117px;
}

.frame-2147227612 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 184px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.ai-rag {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
}

.gpt-rag-llm-vector-db-embedding-retrieval-ai-ai {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 683px;
  min-height: 117px;
}

.frame-2147227613 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 196px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.design {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
}

.ui-ux-figma {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 683px;
  min-height: 117px;
}

.support {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
}

.nan-0003 {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 683px;
  min-height: 160px;
}

.frame-2147227660 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 160px;
  align-self: stretch;
  width: 1080px;
  height: 1410px;
  box-sizing: border-box;
  position: absolute;
  left: 180px;
  top: 1847px;
  flex-shrink: 0;
}

.frame-2147227619 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

.slack-notion-figma-git {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.nan-0005 {
  color: white;
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.frame-2147227320 {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 30px;
  box-sizing: border-box;
}

.common {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  width: 1080px;
  box-sizing: border-box;
}

.frame-2147227319 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 750px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 20px;
  flex-shrink: 0;
}

.frame-2147227252 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 30px;
  box-sizing: border-box;
}

.q {
  color: white;
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
}

.nan-0006 {
  color: white;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
}

.icon {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.frame-2147226778 {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 30px;
  box-sizing: border-box;
  padding-bottom: 20px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 90px;
}

.a {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
}

.ai-ai {
  color: white;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  width: 904px;
}
</style>
