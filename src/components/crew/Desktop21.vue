<template>
  <div class="desktop">
    <div class="overlap-wrapper">
      <div class="overlap">
        <div class="overlap-group">
          <div class="ellipse" />

          <div class="div" />

          <div class="frame">
            <div class="frame-2">
              <img class="EULGPT" alt="Eulgpt" :src="EULGPT" />

              <div class="frame-3">
                <div class="text-wrapper">팀원 모집</div>

                <div class="group">
                  <div class="overlap-group-2">
                    <div class="rectangle" />

                    <div class="rectangle-2" />
                  </div>
                </div>
              </div>
            </div>

            <div class="frame-4">
              <img class="img" alt="Frame" :src="frame2147227638" />

              <img class="img" alt="Frame" :src="frame2147227639" />
            </div>
          </div>

          <img class="common-header" alt="Common header" :src="header" />
        </div>

        <div class="overlap-2">
          <div class="ellipse-2" />

          <div class="ellipse-3" />

          <div class="ellipse-4" />

          <div class="ellipse-5" />

          <div class="frame-5">
            <div class="text-wrapper-2">
              을지피티는 어떤 서비스인가요?
            </div>

            <p class="AI">
              을지대학교 성남캠퍼스에서 학생들의
              <br />
              편의를 위한 기능을 담은 AI 웹사이트입니다!
            </p>
          </div>

          <div class="overlap-group-wrapper">
            <div class="overlap-3">
              <img class="group-2" alt="Group" :src="group48097282" />

              <div class="div-wrapper">
                <div class="overlap-4">
                  <div class="overlap-group-3">
                    <img class="vector" alt="Vector" :src="vector4" />

                    <img class="vector-2" alt="Vector" :src="vector6" />

                    <div class="ellipse-6" />

                    <div class="ellipse-7" />

                    <div class="ellipse-8" />

                    <div class="ellipse-9" />

                    <div class="ellipse-10" />

                    <div class="ellipse-11" />

                    <img class="vector-3" alt="Vector" :src="vector5" />

                    <div class="ellipse-12" />

                    <div class="ellipse-13" />

                    <div class="frame-6">
                      <div class="text-wrapper-3">챗봇 시스템</div>

                      <p class="p">
                        EULGPT AI 챗봇학교생활
                        <br />
                        정보, 일정, 공지사항까지
                        <br />
                        질문 하나면 확인할 수 있어요.
                      </p>
                    </div>

                    <div class="frame-7">
                      <div class="text-wrapper-3">빈 강의실 확인</div>

                      <p class="p">
                        빈 강의실, 어디 있는지 한눈에!
                        <br />
                        수업 없는 시간대의 강의실을
                        <br />
                        확인하고 바로 이용해보세요.
                      </p>
                    </div>

                    <div class="frame-8">
                      <div class="text-wrapper-3">
                        열람실 • 도서관&nbsp;&nbsp;예약
                      </div>

                      <p class="p">
                        좌석 예약도 스마트하게!
                        <br />
                        열람실 좌석 현황과 예약까지
                        <br />
                        클릭 한 번으로&nbsp;&nbsp;해결해요.
                      </p>
                    </div>
                  </div>

                  <div class="frame-9">
                    <div class="text-wrapper-3">학식당 혼잡도</div>

                    <p class="text-wrapper-4">
                      오늘의 학식, 기다리지 마세요.
                      <br />
                      메뉴 확인은 기본
                      <br />
                      혼잡도 그래프로 줄까지 예측!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ellipse-14" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EULGPT from "./img/aa 1.png";
import frame2147227638 from "./img/Ellipse 75.svg";
import frame2147227639 from "./img/Ellipse 76.svg";
import group48097282 from "./img/Group 48097214.svg";
import header from "./img/Common/랜딩/Union.svg";
import vector4 from "./img/Ellipse 77.svg";
import vector5 from "./img/Ellipse 78.svg";
import vector6 from "./img/Ellipse 79.svg";

export default {
  name: "Desktop",
  data() {
    return {
      EULGPT,
      frame2147227638,
      frame2147227639,
      group48097282,
      header,
      vector4,
      vector5,
      vector6,
    };
  },
};
</script>

<style>
:root {
  --darksub-1: #4789ee;
  --darksub-2: #7c3aed;
  --darkprimary: #141d30;
  --white: #ffffff;
  --title-bold0-font-family: "Pretendard-Bold", Helvetica;
  --title-bold0-font-size: 64px;
  --title-bold0-font-style: normal;
  --title-bold0-font-weight: 700;
  --title-bold0-letter-spacing: 0;
  --title-bold0-line-height: 90px;
  --title-bold3-font-family: "Pretendard-Bold", Helvetica;
  --title-bold3-font-size: 28px;
  --title-bold3-font-style: normal;
  --title-bold3-font-weight: 700;
  --title-bold3-letter-spacing: 0;
  --title-bold3-line-height: 42px;
  --subtitle-semibold0-font-family: "Pretendard-SemiBold", Helvetica;
  --subtitle-semibold0-font-size: 20px;
  --subtitle-semibold0-font-style: normal;
  --subtitle-semibold0-font-weight: 600;
  --subtitle-semibold0-letter-spacing: 0;
  --subtitle-semibold0-line-height: 30px;
}

.desktop {
  align-items: start;
  background-color: #141d30;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
}

.desktop .overlap-wrapper {
  background-color: var(--darkprimary);
  height: 2332px;
  overflow: hidden;
  width: 100%;
  max-width: 1440px;
}

.desktop .overlap {
  height: 2660px;
  position: relative;
  width: 100%;
}

.desktop .overlap-group {
  height: 1197px;
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.desktop .ellipse {
  background-color: var(--darksub-1);
  border-radius: 335.9px;
  filter: blur(250px);
  height: 672px;
  left: 811px;
  opacity: 0.7;
  position: absolute;
  top: 51px;
  transform: rotate(-9.47deg);
  width: 672px;
}

.desktop .div {
  background-color: var(--darksub-2);
  border-radius: 421px;
  filter: blur(250px);
  height: 842px;
  left: 1212px;
  opacity: 0.7;
  position: absolute;
  top: 291px;
  transform: rotate(-9.47deg);
  width: 842px;
}

.desktop .frame {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 100px;
  position: relative;
  width: 100%;
  max-width: 1080px;
  margin: 200px auto 0;
  z-index: 10;
}

.desktop .frame-2 {
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 20px;
  position: relative;
  width: 571.16px;
}

.desktop .EULGPT {
  align-self: stretch;
  height: 103.96px;
  margin-top: -0.95px;
  position: relative;
  width: 100%;
}

.desktop .frame-3 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  position: relative;
  width: 100%;
}

.desktop .text-wrapper {
  color: var(--darksub-1);
  font-family: var(--title-bold0-font-family);
  font-size: var(--title-bold0-font-size);
  font-style: var(--title-bold0-font-style);
  font-weight: var(--title-bold0-font-weight);
  letter-spacing: var(--title-bold0-letter-spacing);
  line-height: var(--title-bold0-line-height);
  position: relative;
  white-space: nowrap;
  width: fit-content;
  z-index: 15;
}

.desktop .group {
  height: 21px;
  position: relative;
  width: 21px;
}

.desktop .overlap-group-2 {
  height: 21px;
  position: relative;
}

.desktop .rectangle {
  background-color: var(--darksub-1);
  height: 21px;
  left: 8px;
  position: absolute;
  top: 0;
  transform: rotate(30deg);
  width: 6px;
}

.desktop .rectangle-2 {
  background-color: var(--darksub-1);
  height: 21px;
  left: 7px;
  position: absolute;
  top: 0;
  transform: rotate(120deg);
  width: 6px;
}

.desktop .frame-4 {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 50px;
  position: relative;
}

.desktop .img {
  position: relative;
  width: 220px;
}

.desktop .common-header {
  height: 84px;
  position: relative;
  width: 100%;
  z-index: 20;
  margin-top: 100px;
}

.desktop .overlap-2 {
  height: 1635px;
  position: relative;
  width: 100%;
  margin-top: 50px;
}

.desktop .ellipse-2 {
  background-color: var(--darksub-2);
  border-radius: 353.99px;
  filter: blur(225px);
  height: 708px;
  left: 132px;
  opacity: 0.7;
  position: absolute;
  top: 132px;
  transform: rotate(-148.78deg);
  width: 708px;
}

.desktop .ellipse-3 {
  background-color: var(--darkprimary);
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 1432px;
  position: absolute;
  top: 479px;
  width: 36px;
}

.desktop .ellipse-4 {
  background-color: var(--darksub-1);
  border-radius: 235.71px/236.37px;
  filter: blur(250px);
  height: 473px;
  left: 714px;
  opacity: 0.6;
  position: absolute;
  top: 454px;
  transform: rotate(-148.78deg);
  width: 471px;
}

.desktop .ellipse-5 {
  background-color: var(--darksub-1);
  border-radius: 235.71px/236.37px;
  filter: blur(250px);
  height: 473px;
  left: 1793px;
  opacity: 0.32;
  position: absolute;
  top: 617px;
  transform: rotate(-148.78deg);
  width: 471px;
}

.desktop .frame-5 {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 70px;
  position: relative;
  margin: 50px auto;
  z-index: 10;
}

.desktop .text-wrapper-2 {
  color: var(--white);
  font-family: "Pretendard-Bold", Helvetica;
  font-size: 56px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 90px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: fit-content;
  z-index: 15;
}

.desktop .AI {
  color: var(--white);
  font-family: "Pretendard-Bold", Helvetica;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 48px;
  position: relative;
  text-align: center;
  width: fit-content;
}

.desktop .overlap-group-wrapper {
  height: 815px;
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 100px auto;
}

.desktop .overlap-3 {
  height: 959px;
  position: relative;
  top: -144px;
}

.desktop .group-2 {
  height: 623px;
  left: 485px;
  position: absolute;
  top: 0;
  width: 692px;
}

.desktop .div-wrapper {
  height: 635px;
  left: 0;
  position: absolute;
  top: 324px;
  width: 1763px;
}

.desktop .overlap-4 {
  height: 625px;
  left: 86px;
  position: relative;
  top: 10px;
  width: 1440px;
}

.desktop .overlap-group-3 {
  height: 522px;
  left: 0;
  position: absolute;
  top: 0;
  width: 1440px;
}

.desktop .vector {
  height: 314px;
  left: 0;
  position: absolute;
  top: 21px;
  width: 1440px;
}

.desktop .vector-2 {
  height: 357px;
  left: 0;
  position: absolute;
  top: 0;
  width: 1440px;
}

.desktop .ellipse-6 {
  background-color: var(--darkprimary);
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 869px;
  position: absolute;
  top: 309px;
  width: 36px;
}

.desktop .ellipse-7 {
  background-color: var(--darkprimary);
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 1234px;
  position: absolute;
  top: 227px;
  width: 36px;
}

.desktop .ellipse-8 {
  aspect-ratio: 1;
  background-color: var(--darksub-1);
  border-radius: 10px;
  height: 20px;
  left: 877px;
  position: absolute;
  top: 317px;
  width: 20px;
}

.desktop .ellipse-9 {
  aspect-ratio: 1;
  background-color: var(--darksub-1);
  border-radius: 10px;
  height: 20px;
  left: 1242px;
  position: absolute;
  top: 235px;
  width: 20px;
}

.desktop .ellipse-10 {
  background-color: var(--darkprimary);
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 169px;
  opacity: 0.8;
  position: absolute;
  top: 5px;
  width: 36px;
}

.desktop .ellipse-11 {
  aspect-ratio: 1;
  background-color: var(--darksub-1);
  border-radius: 10px;
  height: 20px;
  left: 177px;
  position: absolute;
  top: 13px;
  width: 20px;
}

.desktop .vector-3 {
  height: 338px;
  left: 0;
  position: absolute;
  top: 10px;
  width: 1440px;
}

.desktop .ellipse-12 {
  background-color: var(--darkprimary);
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 528px;
  position: absolute;
  top: 207px;
  width: 36px;
}

.desktop .ellipse-13 {
  aspect-ratio: 1;
  background-color: var(--darksub-1);
  border-radius: 10px;
  height: 20px;
  left: 536px;
  position: absolute;
  top: 215px;
  width: 20px;
}

.desktop .frame-6 {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 15px;
  left: 51px;
  position: absolute;
  top: 108px;
  width: 272px;
}

.desktop .text-wrapper-3 {
  align-self: stretch;
  color: var(--white);
  font-family: var(--title-bold3-font-family);
  font-size: var(--title-bold3-font-size);
  font-style: var(--title-bold3-font-style);
  font-weight: var(--title-bold3-font-weight);
  letter-spacing: var(--title-bold3-letter-spacing);
  line-height: var(--title-bold3-line-height);
  position: relative;
  text-align: center;
  z-index: 15;
}

.desktop .p {
  align-self: stretch;
  color: var(--white);
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  position: relative;
  text-align: center;
}

.desktop .frame-7 {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  left: 410px;
  position: absolute;
  top: 353px;
  width: 272px;
}

.desktop .frame-8 {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 15px;
  left: 1109px;
  position: absolute;
  top: 10px;
  width: 285px;
}

.desktop .frame-9 {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  left: 744px;
  position: absolute;
  top: 456px;
  width: 285px;
}

.desktop .text-wrapper-4 {
  color: var(--white);
  font-family: var(--subtitle-semibold0-font-family);
  font-size: var(--subtitle-semibold0-font-size);
  font-style: var(--subtitle-semibold0-font-style);
  font-weight: var(--subtitle-semibold0-font-weight);
  letter-spacing: var(--subtitle-semibold0-letter-spacing);
  line-height: var(--subtitle-semibold0-line-height);
  margin-left: -0.02px;
  margin-right: -0.02px;
  position: relative;
  text-align: center;
  width: 285px;
}

.desktop .ellipse-14 {
  background-color: var(--darkprimary);
  border-radius: 18px;
  filter: blur(3px);
  height: 36px;
  left: 1797px;
  position: absolute;
  top: 1422px;
  width: 36px;
}
</style>