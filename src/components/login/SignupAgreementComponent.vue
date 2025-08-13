<template>
  <div class="root-wrapper">
    <!-- 헤더 -->
    <HeaderSection />

    <!-- 푸터 -->
    <div class="common-footer-notice">
      <span class="footer-text">개인정보 처리방침</span>
      <span class="footer-separator">|</span>
      <span class="footer-copyright">Copyright ⓒ EULGPT. All Rights Reserved</span>
    </div>
    
    <!-- 메인 컨텐츠 -->
    <div class="frame-main-content">
      <div class="agreement-form-wrapper">
        <span class="agreement-title">
          서비스 이용 약관에 <br/>
동의해주세요
        </span>
        <div class="agreement-container">
          <!-- 전체 동의 -->
          <div class="all-agreement-section">
            <div class="agreement-item">
              <div class="checkbox-wrapper" @click="toggleAllAgreement">
                <img 
                  :src="allAgreed ? checkedIcon : uncheckedIcon" 
                  alt="checkbox" 
                  class="checkbox-icon"
                />
                <span class="agreement-label">전체 동의</span>
              </div>
              <span class="agreement-description">아래 항목에 모두 동의할게요.</span>
            </div>
          </div>
          
          <!-- 구분선 -->
          <div class="divider"></div>
          
          <!-- 개별 동의 항목들 -->
          <div class="individual-agreements">
            <div class="agreement-row">
              <div class="agreement-item">
                <div class="required-tag-wrapper">
                  <div class="checkbox-wrapper" @click="toggleAgreement('terms')">
                    <img 
                      :src="agreements.terms ? checkedIcon : uncheckedIcon" 
                      alt="checkbox" 
                      class="checkbox-icon"
                    />
                    <span class="required-tag">필수</span>
                  </div>
                  <span class="agreement-text">EULGPT 회원 이용약관</span>
                </div>
                <span class="view-link" @click="viewTerms('terms')">보기</span>
              </div>
            </div>
            
            <div class="agreement-row">
              <div class="agreement-item">
                <div class="required-tag-wrapper">
                  <div class="checkbox-wrapper" @click="toggleAgreement('service')">
                    <img 
                      :src="agreements.service ? checkedIcon : uncheckedIcon" 
                      alt="checkbox" 
                      class="checkbox-icon"
                    />
                    <span class="required-tag">필수</span>
                  </div>
                  <span class="agreement-text">EULGPT 서비스 이용약관</span>
                </div>
                <span class="view-link" @click="viewTerms('service')">보기</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 모두 동의하기 버튼 -->
      <div class="agree-button" @click="handleAgreeAll">
        <div class="agree-button-inner">
          <span class="agree-text">모두 동의하기</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HeaderSection from '../main/HeaderSection.vue';
// import { useRouter } from 'vue-router';

// const router = useRouter();

// 체크박스 이미지 (실제 이미지 경로로 교체 필요)
const checkedIcon = '/src/assets/checkbox-checked.svg';
const uncheckedIcon = '/src/assets/checkbox-unchecked.svg';

// 개별 동의 상태
const agreements = ref({
  terms: false,
  service: false
});

// 전체 동의 상태 computed
const allAgreed = computed(() => {
  return agreements.value.terms && agreements.value.service;
});

// 개별 동의 토글
const toggleAgreement = (type: 'terms' | 'service') => {
  agreements.value[type] = !agreements.value[type];
};

// 전체 동의 토글
const toggleAllAgreement = () => {
  const newValue = !allAgreed.value;
  agreements.value.terms = newValue;
  agreements.value.service = newValue;
};

// 약관 보기
const viewTerms = (type: 'terms' | 'service') => {
  console.log(`${type} 약관 보기`);
  // 약관 모달 또는 새 창 열기 로직
};

// 모두 동의하기 버튼 클릭
const handleAgreeAll = () => {
  if (!allAgreed.value) {
    alert('모든 필수 항목에 동의해주세요.');
    return;
  }
  
  console.log('회원가입 완료');
  // 회원가입 완료 처리 로직
  // router.push('/signup-complete') 또는 로그인 페이지로 이동
};
</script>

<style scoped>
/* 메인 래퍼 */
.root-wrapper {
  min-height: 100vh;
  background-color: white;
  position: relative;
}

/* 푸터 - React CommonFooterNotice와 동일 */
.common-footer-notice {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 5px;
  width: 277px;
  height: 12px;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 138px);
  top: 810px;
}

.footer-text {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  text-align: left;
}

.footer-separator {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  text-align: left;
  width: 4px;
}

.footer-copyright {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  text-align: left;
  width: 191px;
}

/* 메인 컨텐츠 - React Frame2147227464와 동일 */
.frame-main-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 60px;
  width: 407px;
  height: 337px;
  background-color: white;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 203px);
  top: calc(50% - 168px);
}

/* 동의 폼 래퍼 - React Frame2147227463과 동일 */
.agreement-form-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 제목 - React NaN_0009와 동일 */
.agreement-title {
  color: black;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
}

/* 동의 컨테이너 - React Frame2147227462와 동일 */
.agreement-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 전체 동의 섹션 */
.all-agreement-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 동의 항목 - React Frame2147227456과 동일 */
.agreement-item {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

/* 체크박스 래퍼 */
.checkbox-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
  cursor: pointer;
}

/* 체크박스 아이콘 - React IconCopy와 동일 */
.checkbox-icon {
  width: 15px;
  height: 15px;
  object-fit: cover;
}

/* 동의 라벨 - React NaN_0010과 동일 */
.agreement-label {
  color: black;
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: left;
}

/* 동의 설명 - React NaN_0011과 동일 */
.agreement-description {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: left;
}

/* 구분선 - React Line107과 동일 */
.divider {
  height: 0px;
  border-top: solid 1px rgb(156, 163, 175);
  align-self: stretch;
  flex-shrink: 0;
}

/* 개별 동의 항목들 */
.individual-agreements {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 동의 행 - React Frame2147227460과 동일 */
.agreement-row {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 필수 태그 래퍼 - React Frame2147227455_0001과 동일 */
.required-tag-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

/* 필수 태그 - React NaN_0012와 동일 */
.required-tag {
  color: rgb(107, 114, 128);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: left;
}

/* 동의 텍스트 - React Eulgpt_0001과 동일 */
.agreement-text {
  color: rgb(156, 163, 175);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  line-height: 25px;
  text-align: left;
}

/* 보기 링크 - React NaN_0012와 동일 */
.view-link {
  color: rgb(107, 114, 128);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  line-height: 25px;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

.view-link:hover {
  color: rgb(2, 71, 138);
}

/* 모두 동의하기 버튼 - React ButtonPc와 동일 */
.agree-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border: solid 1px rgb(229, 231, 235);
  border-radius: 12px;
  align-self: stretch;
  background-color: rgb(2, 71, 138);
  box-sizing: border-box;
  padding: 14px 60px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.agree-button:hover {
  background-color: rgb(1, 60, 118);
}

.agree-button-inner {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  box-sizing: border-box;
}

.agree-text {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  text-align: left;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .frame-main-content {
    width: 90%;
    left: 5%;
    top: calc(50vh - 150px);
    height: auto;
  }
  
  .common-footer-notice {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
  }
}

@media (max-width: 480px) {
  .frame-main-content {
    width: 95%;
    left: 2.5%;
    top: calc(50vh - 120px);
    gap: 40px;
  }
  
  .agreement-title {
    font-size: 20px;
  }
  
  .agreement-form-wrapper {
    gap: 30px;
  }
  
  .agree-button {
    padding: 15px 20px;
  }
  
  .agree-text {
    font-size: 16px;
  }
  
  .common-footer-notice {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>