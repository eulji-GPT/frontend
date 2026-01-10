<template>
  <div class="footer-desktop">
    <div class="overlap-wrapper">
      <div class="overlap">
        <img class="group" alt="Group" src="@/components/crew/img/orbit_X.png" />
        <div class="hero-frame">
          <div class="hero-content">
            <div class="eulgpt-logo">EULGPT</div>
            <div class="recruitment-section">
              <div class="recruitment-text">팀원 모집</div>
              <div class="icon-container">
                <img src="@/components/crew/img/Common/랜딩/Union.svg" alt="icon" class="recruitment-icon" />
              </div>
            </div>
          </div>
          <div class="apply-button" @click="goToApply">
            <span class="button-text">지원하기</span>
          </div>
        </div>
        <div class="ellipse" />
        <div class="ellipse-2" />
        <div class="ellipse-3" />
        <div class="common-footer">
          <span class="privacy-policy">개인정보처리방침</span>
          <span class="copyright">Copyright ⓒ EULGPT. All Rights Reserved</span>
          <span class="email">E-mail: EULGPT@gmail.com</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToApply = () => {
  router.push('/crew/apply')
}
</script>

<style scoped>
.footer-desktop {
  align-items: center;
  background-color: #141d30;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 1051px;
  position: relative;
  margin: 0 auto;
  padding: 0;
}

.overlap-wrapper {
  background-color: #141d30;
  height: 1051px;
  width: 100%;
  position: relative;
  margin: 0;
  padding: 0;
}

.overlap {
  height: 100%;
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0;
}

.group {
  height: 1027px;
  left: 50%;
  transform: translateX(50px);
  position: absolute;
  top: 0;
  width: 947px;
  opacity: 1;
  filter: none;
}

.hero-frame {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 50px;
  left: 50%;
  transform: translateX(-620px);
  position: absolute;
  top: 148px;
  width: 550px;
}

.hero-content {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 571px;
  position: relative;
}

.eulgpt-logo {
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 145px;
  font-weight: 700;
  line-height: 1;
  width: 100%;
  text-align: left;
}

.recruitment-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  position: relative;
  width: auto;
}

.recruitment-text {
  color: rgb(71, 137, 238);
  font-family: 'Pretendard', sans-serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
  margin-top: 10px;
}

.icon-container {
  position: absolute;
  top: -20px;
  right: -20px;
}

.recruitment-icon {
  width: 18px;
  height: 62px;
  transform: rotate(120deg);
  flex-shrink: 0;
  filter: brightness(0) saturate(100%) invert(45%) sepia(77%) saturate(2476%) hue-rotate(209deg) brightness(96%) contrast(89%);
}


.apply-button {
  display: flex;
  width: 220px;
  padding: 14px 77px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 68px;
  background: var(--ETC-Light-Blue, rgba(2, 71, 138, 0.10));
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-button:hover {
  background-color: rgba(2, 71, 138, 0.2);
  transform: translateY(-2px);
}

.button-text {
  color: var(--White, #FFF);
  font-family: Pretendard;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 44.8px */
  white-space: nowrap;
}

.ellipse {
  background-color: rgb(71, 137, 238);
  border-radius: 308px;
  filter: blur(250px);
  height: 617px;
  right: -300px;
  opacity: 0.6;
  position: absolute;
  bottom: 100px;
  transform: rotate(-14.68deg);
  width: 617px;
}

.ellipse-2 {
  background-color: rgb(71, 137, 238);
  border-radius: 308px;
  filter: blur(250px);
  height: 617px;
  left: -300px;
  opacity: 0.6;
  position: absolute;
  top: 400px;
  transform: rotate(-14.68deg);
  width: 617px;
}

.ellipse-3 {
  background-color: rgba(71, 137, 238, 0.8);
  border-radius: 337px;
  filter: blur(250px);
  height: 675px;
  left: -200px;
  opacity: 0.8;
  position: absolute;
  bottom: 50px;
  transform: rotate(-14.68deg);
  width: 675px;
}

.common-footer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 5px;
  box-sizing: border-box;
  padding: 10px 20px;
  height: 120px;
  left: 0;
  right: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: transparent;
  border-top: none;
}

.privacy-policy {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 23px;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.copyright {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

.email {
  color: rgb(243, 248, 255);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  line-height: 120%;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .footer-desktop {
    min-height: 600px;
  }

  .overlap-wrapper {
    width: 100%;
    height: 600px;
  }

  .overlap {
    width: 100%;
    height: 600px;
    left: 0;
  }

  .group {
    display: none;
  }

  .hero-frame {
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 100%;
    top: 80px;
    align-items: center;
    gap: 30px;
  }

  .hero-content {
    width: 100%;
    align-items: center;
  }

  .eulgpt-logo {
    font-size: 64px;
    text-align: center;
  }

  .recruitment-section {
    justify-content: center;
    width: 100%;
  }

  .recruitment-text {
    font-size: 36px;
    line-height: 50px;
  }

  .icon-container {
    top: -15px;
    right: -15px;
  }

  .recruitment-icon {
    width: 14px;
    height: 48px;
  }

  .apply-button {
    align-self: center;
    width: 160px;
    padding: 12px 40px;
  }

  .button-text {
    font-size: 20px;
  }

  .ellipse,
  .ellipse-2,
  .ellipse-3 {
    display: none;
  }

  .common-footer {
    left: 0;
    right: 0;
    width: 100%;
    bottom: 0;
    padding: 10px 16px;
    height: auto;
  }

  .privacy-policy,
  .copyright,
  .email {
    text-align: center;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .footer-desktop {
    min-height: 500px;
  }

  .overlap-wrapper {
    height: 500px;
  }

  .overlap {
    height: 500px;
  }

  .hero-frame {
    top: 60px;
    gap: 24px;
  }

  .eulgpt-logo {
    font-size: 48px;
  }

  .recruitment-text {
    font-size: 28px;
    line-height: 40px;
  }

  .apply-button {
    width: 140px;
    padding: 10px 30px;
  }

  .button-text {
    font-size: 18px;
  }
}
</style>

<style>
/* 전역 스타일 - Footer 영역 테두리 제거 */
body,
html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>