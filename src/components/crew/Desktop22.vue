<template>
  <div class="desktop">
    <div class="overlap-wrapper">
      <div class="overlap">
        <img class="group" alt="Group" :src="group48097293" />

        <div class="frame">
          <div class="div">
            <img class="EULGPT" alt="Eulgpt" :src="EULGPT" />

            <div class="frame-2">
              <div class="text-wrapper">팀원 모집</div>

              <div class="overlap-group-wrapper">
                <div class="overlap-group">
                  <div class="rectangle" />

                  <div class="rectangle-2" />
                </div>
              </div>
            </div>
          </div>

          <img class="img" alt="Frame" :src="frame2147227638" />
        </div>

        <div class="ellipse" />

        <div class="ellipse-2" />

        <div class="ellipse-3" />

        <img class="common-footer" alt="Common footer" :src="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import EULGPT from './img/aa 1.png';
import footer from './img/Common/랜딩/Union.svg';
import frame2147227638 from './img/Ellipse 75.svg';
import group48097293 from './img/Group 48097214.svg';

export default {
  name: "Desktop",
  data() {
    return {
      EULGPT,
      footer,
      frame2147227638,
      group48097293,
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
  height: 1051px;
  overflow: hidden;
  width: 100%;
  max-width: 1440px;
}

.desktop .overlap {
  height: 1635px;
  left: -453px;
  position: relative;
  width: 2235px;
}

.desktop .group {
  height: 1027px;
  left: 946px;
  position: absolute;
  top: 0;
  width: 947px;
}

.desktop .frame {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 50px;
  left: 633px;
  position: absolute;
  top: 148px;
  width: 550px;
}

.desktop .div {
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 20px;
  margin-right: -21.16px;
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

.desktop .frame-2 {
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
  position: relative;
  width: 247px;
}

.desktop .text-wrapper {
  color: var(--darksub-1);
  font-family: var(--title-bold0-font-family);
  font-size: var(--title-bold0-font-size);
  font-style: var(--title-bold0-font-style);
  font-weight: var(--title-bold0-font-weight);
  letter-spacing: var(--title-bold0-letter-spacing);
  line-height: var(--title-bold0-line-height);
  margin-top: -1px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.desktop .overlap-group-wrapper {
  height: 21px;
  margin-right: -10px;
  position: relative;
  width: 21px;
}

.desktop .overlap-group {
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

.desktop .img {
  flex: 0 0 auto;
  position: relative;
  width: 220px;
}

.desktop .ellipse {
  background-color: var(--darksub-1);
  border-radius: 308.57px;
  filter: blur(250px);
  height: 617px;
  left: 1550px;
  opacity: 0.6;
  position: absolute;
  top: 831px;
  transform: rotate(-14.68deg);
  width: 617px;
}

.desktop .ellipse-2 {
  background-color: var(--darksub-1);
  border-radius: 308.57px;
  filter: blur(250px);
  height: 617px;
  left: 68px;
  opacity: 0.6;
  position: absolute;
  top: 562px;
  transform: rotate(-14.68deg);
  width: 617px;
}

.desktop .ellipse-3 {
  background-color: var(--darksub-2);
  border-radius: 337.42px;
  filter: blur(250px);
  height: 675px;
  left: 203px;
  opacity: 0.8;
  position: absolute;
  top: 886px;
  transform: rotate(-14.68deg);
  width: 675px;
}

.desktop .common-footer {
  height: 120px;
  left: 453px;
  position: absolute;
  top: 931px;
  width: 1440px;
}
</style>