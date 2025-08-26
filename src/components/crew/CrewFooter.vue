<template>
  <div class="crew-footer">
    <!-- Background blur effects -->
    <div class="blur-bg-1"></div>
    <div class="blur-bg-2"></div>
    <div class="blur-bg-3"></div>

    <!-- Main 3D graphic -->
    <div class="main-graphic">
      <img 
        src="https://api.builder.io/api/v1/image/assets/TEMP/f2a2113f3fbb31836b2adaab841bf65f66e28f40?width=2539" 
        alt="EULGPT 3D Illustration" 
        class="graphic-image"
      />
    </div>

    <!-- CTA Content -->
    <div class="cta-content">
      <div class="branding-section">
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/83ffc94aa1b6ec1d4ed4f6afe3f6172f5fc06a7d?width=1142" 
          alt="EULGPT" 
          class="logo"
        />
        <div class="title-section">
          <span class="recruitment-title">팀원 모집</span>
          <div class="arrow-icon">
            <div class="arrow-line-1"></div>
            <div class="arrow-line-2"></div>
          </div>
        </div>
      </div>
      
      <button class="apply-button">지원하기</button>
    </div>

    <!-- Footer -->
    <footer class="footer-section">
      <div class="footer-content">
        <div class="footer-text privacy">개인정보처리방침</div>
        <div class="footer-text copyright">Copyright ⓒ EULGPT. All Rights Reserved</div>
        <div class="footer-text email">E-mail: Eu. EULGPT@gmail.com</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
.crew-footer {
  width: 100%;
  height: 1051px;
  background: #141D30;
  position: relative;
  overflow: hidden;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
}

/* Background blur effects */
.blur-bg-1 {
  width: 617px;
  height: 617px;
  position: absolute;
  right: -453px;
  bottom: 100px;
  background: radial-gradient(circle, #4789EE 0%, #3574d9 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(250px);
  transform: rotate(-14.676deg);
}

.blur-bg-2 {
  width: 617px;
  height: 617px;
  position: absolute;
  left: -453px;
  top: 494px;
  background: radial-gradient(circle, #4789EE 0%, #3574d9 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(250px);
  transform: rotate(-14.676deg);
}

.blur-bg-3 {
  width: 675px;
  height: 675px;
  position: absolute;
  left: -324px;
  bottom: 150px;
  background: radial-gradient(circle, #665CED 0%, #5649d8 50%, transparent 70%);
  border-radius: 50%;
  opacity: 0.8;
  filter: blur(250px);
  transform: rotate(-14.676deg);
}

/* Main 3D graphic */
.main-graphic {
  position: absolute;
  right: -200px;
  top: -115px;
  width: 1269px;
  height: 1141px;
  z-index: 5;
}

.graphic-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* CTA Content */
.cta-content {
  position: absolute;
  left: 180px;
  top: 148px;
  width: 550px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  z-index: 10;
}

.branding-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 571.164px;
}

.logo {
  height: 103px;
  width: auto;
  align-self: flex-start;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 247px;
}

.recruitment-title {
  color: #4789EE;
  font-size: 64px;
  font-weight: 700;
  line-height: 90px;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
}

.arrow-icon {
  position: relative;
  width: 21px;
  height: 21px;
  margin-top: 20px;
  flex-shrink: 0;
}

.arrow-line-1 {
  width: 6px;
  height: 21px;
  background: #4789EE;
  position: absolute;
  left: 3px;
  top: 0;
  transform: rotate(30deg);
}

.arrow-line-2 {
  width: 6px;
  height: 21px;
  background: #4789EE;
  position: absolute;
  left: 0;
  top: 3px;
  transform: rotate(120deg);
}

.apply-button {
  width: 220px;
  padding: 14px 77px;
  border-radius: 68px;
  background: rgba(2, 71, 138, 0.10);
  border: none;
  color: #FFFFFF;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 140%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.apply-button:hover {
  background: rgba(2, 71, 138, 0.20);
  transform: translateY(-2px);
}

/* Footer */
.footer-section {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.footer-content {
  width: 100%;
  max-width: 1040px;
  padding: 10px 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.footer-text {
  text-align: center;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 23px;
}

.privacy {
  color: #F0F6FF;
  font-weight: 700;
}

.copyright {
  color: #F0F6FF;
  font-weight: 400;
}

.email {
  color: #F3F8FF;
  font-weight: 400;
  line-height: 120%;
}

/* Responsive Design */
@media (max-width: 1440px) {
  .main-graphic {
    right: -300px;
    width: 1100px;
    height: 900px;
  }
  
  .cta-content {
    left: 5%;
    width: 45%;
  }
}

@media (max-width: 1200px) {
  .crew-footer {
    height: 900px;
  }
  
  .main-graphic {
    right: -400px;
    width: 900px;
    height: 700px;
    top: 50px;
  }
  
  .cta-content {
    left: 60px;
    top: 120px;
    width: 500px;
  }
  
  .footer-content {
    padding: 10px 100px;
  }
}

@media (max-width: 768px) {
  .crew-footer {
    height: 700px;
  }
  
  .main-graphic {
    right: -500px;
    width: 700px;
    height: 500px;
    top: 100px;
  }
  
  .cta-content {
    left: 40px;
    top: 80px;
    width: 60%;
    gap: 30px;
  }
  
  .branding-section {
    width: 100%;
  }
  
  .logo {
    height: 60px;
  }
  
  .recruitment-title {
    font-size: 40px;
    line-height: 60px;
  }
  
  .title-section {
    width: auto;
  }
  
  .arrow-icon {
    width: 15px;
    height: 15px;
    margin-top: 15px;
  }
  
  .arrow-line-1,
  .arrow-line-2 {
    width: 4px;
    height: 15px;
  }
  
  .apply-button {
    width: 180px;
    padding: 12px 40px;
    font-size: 24px;
  }
  
  .footer-content {
    padding: 10px 40px;
  }
  
  .footer-text {
    font-size: 12px;
    line-height: 20px;
  }
}

@media (max-width: 480px) {
  .crew-footer {
    height: 600px;
  }
  
  .main-graphic {
    right: -600px;
    width: 600px;
    height: 400px;
    top: 80px;
  }
  
  .cta-content {
    left: 20px;
    top: 60px;
    width: 70%;
    gap: 25px;
  }
  
  .logo {
    height: 50px;
  }
  
  .recruitment-title {
    font-size: 32px;
    line-height: 45px;
  }
  
  .apply-button {
    width: 160px;
    padding: 10px 30px;
    font-size: 20px;
  }
  
  .footer-content {
    padding: 10px 20px;
  }
  
  .footer-text {
    font-size: 11px;
    line-height: 18px;
  }
}
</style>
