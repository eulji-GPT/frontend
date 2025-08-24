<template>
  <div class="frame">
    <div class="div-2">
      <div class="text-wrapper-4">지원 시 참고사항</div>
      <p class="slack-notion-figma">
        모든 팀은 협업 툴(예: Slack, Notion, Figma, Git 등)을 통해 원활히
        소통합니다.
        <br />
        익숙하지 않아도 팀에서 함께 배워갈 수 있도록 도와드려요!
        <br />
        프로젝트는 실제 운영을 중심으로 하는 만큼, 일정에 대한 책임감을 가지고
        임해주시면 감사해요.
        <br />
        디자인 및 개발 경험이 부족하더라도 &apos;배우고자 하는 의지&apos;가 있다면
        누구나 환영합니다.
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;특히 서포터팀은 그런 분들을 위한
        시작점이에요. ✿
      </p>
    </div>
    <div class="div-3">
      <div class="text-wrapper-5">자주 묻는 질문</div>
      <div class="div-4">
        <Common
          aiAiClassName="common-2"
          className="common-instance"
          divClassName="common-2"
          divClassName1="common-3"
          divClassNameOverride="common-2"
          frameClassName="design-component-instance-node"
          frameClassNameOverride="design-component-instance-node"
          one="one"
        />
        <Common
          aiAiClassName="common-2"
          className="common-instance"
          divClassName="common-2"
          divClassName1="common-3"
          divClassNameOverride="common-2"
          frameClassName="design-component-instance-node"
          frameClassNameOverride="design-component-instance-node"
          one="one"
        />
        <Common
          aiAiClassName="common-2"
          className="common-instance"
          divClassName="common-2"
          divClassName1="common-3"
          divClassNameOverride="common-2"
          frameClassName="design-component-instance-node"
          frameClassNameOverride="design-component-instance-node"
          one="one"
        />
        <Common
          aiAiClassName="common-2"
          className="common-instance"
          divClassName="common-2"
          divClassName1="common-3"
          divClassNameOverride="common-2"
          frameClassName="design-component-instance-node"
          frameClassNameOverride="design-component-instance-node"
          one="one"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Frame'
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
  background: #141d30;
  color: white;
  padding: 80px 20px;
  min-height: 400px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 160px;
  position: relative;
  width: 1080px;
}

.frame .div-2 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 40px;
  position: relative;
  width: 100%;
}

.frame .text-wrapper-4 {
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

.frame .slack-notion-figma {
  align-self: stretch;
  color: var(--white);
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  position: relative;
}

.frame .div-3 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 60px;
  position: relative;
  width: 100%;
}

.frame .text-wrapper-5 {
  align-self: stretch;
  color: var(--white);
  font-family: var(--title-bold1-font-family);
  font-size: var(--title-bold1-font-size);
  font-style: var(--title-bold1-font-style);
  font-weight: var(--title-bold1-font-weight);
  letter-spacing: var(--title-bold1-letter-spacing);
  line-height: var(--title-bold1-line-height);
  margin-top: -1.00px;
  position: relative;
}

.frame .div-4 {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 30px;
  position: relative;
}

.frame .common-instance {
  flex: 0 0 auto !important;
}

.frame .design-component-instance-node {
  background-color: unset !important;
}

.frame .common-2 {
  color: var(--white) !important;
}

.frame .common-3 {
  color: var(--darksub-1) !important;
}
</style>