<template>
  <div class="footer-desktop">
    <div class="overlap-wrapper">
      <div class="overlap">
        <img class="group" alt="Group" src="@/components/chat/icon/mulmum.svg" />
        <div class="hero-frame">
          <div class="hero-content">
            <div class="eulgpt-logo">EULGPT</div>
            <div class="recruitment-section">
              <div class="recruitment-text">팀원 모집</div>
              <div class="icon-wrapper">
                <div class="icon-overlap">
                  <div class="rectangle" />
                  <div class="rectangle-2" />
                </div>
              </div>
            </div>
          </div>
          <div class="apply-button">
            <span class="button-text">지원하기</span>
          </div>
        </div>
        <div class="ellipse" />
        <div class="ellipse-2" />
        <div class="ellipse-3" />
        <div class="common-footer">
          <div class="footer-content">
            <div class="footer-logo">EULGPT</div>
            <div class="footer-info">
              <p>을지대학교 성남캠퍼스 AI 웹서비스</p>
              <p>© 2024 EULGPT Team. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer-desktop {
  align-items: flex-start;
  background-color: #141d30;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 1051px;
  position: relative;
}

.overlap-wrapper {
  background-color: #141d30;
  height: 1051px;
  overflow: hidden;
  width: 1440px;
  position: relative;
}

.overlap {
  height: 1635px;
  left: -453px;
  position: relative;
  width: 2235px;
}

.group {
  height: 1027px;
  left: 946px;
  position: absolute;
  top: 0;
  width: 947px;
  opacity: 0.3;
  filter: brightness(0.7);
}

.hero-frame {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 50px;
  left: 633px;
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
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 247px;
}

.recruitment-text {
  color: rgb(71, 137, 238);
  font-family: 'Pretendard', sans-serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 90px;
  text-align: left;
}

.icon-wrapper {
  height: 21px;
  width: 21px;
  position: relative;
}

.icon-overlap {
  height: 21px;
  position: relative;
}

.rectangle {
  background-color: rgb(71, 137, 238);
  height: 21px;
  left: 8px;
  position: absolute;
  top: 0;
  transform: rotate(30deg);
  width: 6px;
}

.rectangle-2 {
  background-color: rgb(71, 137, 238);
  height: 21px;
  left: 7px;
  position: absolute;
  top: 0;
  transform: rotate(120deg);
  width: 6px;
}

.apply-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 68px;
  width: 220px;
  background-color: rgba(2, 71, 138, 0.1);
  padding: 14px 77px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-button:hover {
  background-color: rgba(2, 71, 138, 0.2);
  transform: translateY(-2px);
}

.button-text {
  color: white;
  font-size: 32px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 140%;
}

.ellipse {
  background-color: rgb(71, 137, 238);
  border-radius: 308px;
  filter: blur(250px);
  height: 617px;
  left: 1550px;
  opacity: 0.6;
  position: absolute;
  top: 831px;
  transform: rotate(-14.68deg);
  width: 617px;
}

.ellipse-2 {
  background-color: rgb(71, 137, 238);
  border-radius: 308px;
  filter: blur(250px);
  height: 617px;
  left: 68px;
  opacity: 0.6;
  position: absolute;
  top: 562px;
  transform: rotate(-14.68deg);
  width: 617px;
}

.ellipse-3 {
  background-color: rgba(71, 137, 238, 0.8);
  border-radius: 337px;
  filter: blur(250px);
  height: 675px;
  left: 203px;
  opacity: 0.8;
  position: absolute;
  top: 886px;
  transform: rotate(-14.68deg);
  width: 675px;
}

.common-footer {
  height: 120px;
  left: 453px;
  position: absolute;
  top: 931px;
  width: 1440px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
}

.footer-logo {
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 36px;
  font-weight: 700;
}

.footer-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.footer-info p {
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-desktop {
    min-height: 800px;
  }
  
  .overlap-wrapper {
    width: 100%;
    height: 800px;
  }
  
  .overlap {
    width: 100%;
    height: 800px;
    left: 0;
  }
  
  .group {
    display: none;
  }
  
  .hero-frame {
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    top: 100px;
  }
  
  .hero-content {
    width: 100%;
  }
  
  .eulgpt-logo {
    font-size: 80px;
    text-align: center;
  }
  
  .recruitment-section {
    justify-content: center;
    width: 100%;
  }
  
  .recruitment-text {
    font-size: 40px;
    line-height: 60px;
  }
  
  .apply-button {
    align-self: center;
    width: 180px;
  }
  
  .button-text {
    font-size: 24px;
  }
  
  .ellipse,
  .ellipse-2,
  .ellipse-3 {
    display: none;
  }
  
  .common-footer {
    left: 0;
    width: 100%;
    top: 600px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .footer-info {
    align-items: center;
  }
}
</style>