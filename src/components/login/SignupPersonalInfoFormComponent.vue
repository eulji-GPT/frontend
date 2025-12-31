<template>
  <div class="signup-page">
    <!-- Header -->
    <HeaderSection />

    <!-- Main Content -->
    <main class="main-content">
      <div class="form-container">
        <h1 class="form-title">EULGPT 회원 가입을 위해<br>정보를 입력해 주세요</h1>
        
        <form class="signup-form" @submit.prevent="handleSubmit">
          <!-- Name Field -->
          <div class="form-group">
            <div class="label-container">
              <label class="form-label">이름</label>
              <span class="required-indicator"></span>
            </div>
            <div class="input-container">
              <input
                v-model="formData.name"
                type="text"
                placeholder="김을지"
                class="form-input"
              />
            </div>
          </div>

          <!-- Phone Number Field -->
          <div class="form-group">
            <div class="label-container">
              <label class="form-label">휴대폰 번호</label>
              <span class="required-indicator"></span>
            </div>
            <div class="input-container">
              <input
                v-model="formData.phoneNumber"
                type="tel"
                placeholder="010-0000-0000"
                class="form-input"
                @input="formatPhoneNumber"
                maxlength="13"
              />
            </div>
          </div>

          <!-- Birth Date Field -->
          <div class="form-group birth-group">
            <div class="label-container">
              <label class="form-label">생년월일</label>
              <span class="required-indicator"></span>
            </div>
            <div class="birth-inputs">
              <!-- Year Dropdown -->
              <div class="dropdown-container year-dropdown">
                <div class="dropdown-selected" @click="toggleDropdown('year')">
                  <span class="dropdown-text">{{ formData.year ? formData.year + '년' : '연도' }}</span>
                  <svg class="dropdown-arrow" :class="{ open: dropdownOpen.year }" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L10 8L15 13" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div v-if="dropdownOpen.year" class="dropdown-menu">
                  <div
                    v-for="year in yearOptions"
                    :key="year"
                    class="dropdown-item"
                    @click="selectOption('year', year)"
                  >
                    {{ year }}년
                  </div>
                </div>
              </div>

              <!-- Month Dropdown -->
              <div class="dropdown-container month-dropdown">
                <div class="dropdown-selected" @click="toggleDropdown('month')">
                  <span class="dropdown-text">{{ formData.month ? formData.month + '월' : '월' }}</span>
                  <svg class="dropdown-arrow" :class="{ open: dropdownOpen.month }" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L10 8L15 13" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div v-if="dropdownOpen.month" class="dropdown-menu">
                  <div
                    v-for="month in monthOptions"
                    :key="month"
                    class="dropdown-item"
                    @click="selectOption('month', month)"
                  >
                    {{ month }}월
                  </div>
                </div>
              </div>

              <!-- Day Dropdown -->
              <div class="dropdown-container day-dropdown">
                <div class="dropdown-selected" @click="toggleDropdown('day')">
                  <span class="dropdown-text">{{ formData.day ? formData.day + '일' : '일' }}</span>
                  <svg class="dropdown-arrow" :class="{ open: dropdownOpen.day }" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 13L10.5 8L15.5 13" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div v-if="dropdownOpen.day" class="dropdown-menu">
                  <div
                    v-for="day in dayOptions"
                    :key="day"
                    class="dropdown-item"
                    @click="selectOption('day', day)"
                  >
                    {{ day }}일
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-button">
            <span class="button-text">정보 입력하기</span>
          </button>
        </form>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <span class="footer-privacy">개인정보 처리방침</span>
      <span class="footer-separator">|</span>
      <span class="footer-copyright">Copyright ⓒ EULGPT. All Rights Reserved</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderSection from '../main/HeaderSection.vue'

const router = useRouter()

// Railway 내부 URL(.railway.internal)은 브라우저에서 접근 불가하므로 외부 URL로 대체
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_FASTAPI_URL;

  // Railway 내부 URL 감지 및 외부 URL로 대체
  if (envUrl && envUrl.includes('.railway.internal')) {
    
    return 'https://fastapi-backend-production-2cd0.up.railway.app';
  }

  // 프로덕션 환경에서 /api 프록시 경로 사용 시 외부 URL로 대체
  if (!envUrl || envUrl === '/api') {
    // 브라우저에서 Railway 호스트인지 확인
    if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
      return 'https://fastapi-backend-production-2cd0.up.railway.app';
    }
  }

  return envUrl || '/api';
};

const API_BASE_URL = getApiBaseUrl()

// Form data
const formData = ref({
  name: '',
  phoneNumber: '',
  year: '',
  month: '',
  day: ''
})

// Dropdown state
const dropdownOpen = ref({
  year: false,
  month: false,
  day: false
})

// Generate year options (1900 to current year)
const currentYear = new Date().getFullYear()
const yearOptions = computed(() => {
  const years = []
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year.toString())
  }
  return years
})

// Generate month options (01-12)
const monthOptions = computed(() => {
  const months = []
  for (let month = 1; month <= 12; month++) {
    months.push(month.toString().padStart(2, '0'))
  }
  return months
})

// Generate day options based on selected year and month
const dayOptions = computed(() => {
  if (!formData.value.year || !formData.value.month) {
    // Default to 31 days if year/month not selected
    const days = []
    for (let day = 1; day <= 31; day++) {
      days.push(day.toString().padStart(2, '0'))
    }
    return days
  }

  const year = parseInt(formData.value.year)
  const month = parseInt(formData.value.month)
  const daysInMonth = new Date(year, month, 0).getDate()

  const days = []
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day.toString().padStart(2, '0'))
  }
  return days
})

// Methods
const toggleDropdown = (type: 'year' | 'month' | 'day') => {
  // Close all other dropdowns
  Object.keys(dropdownOpen.value).forEach(key => {
    if (key !== type) {
      dropdownOpen.value[key as keyof typeof dropdownOpen.value] = false
    }
  })
  // Toggle the selected dropdown
  dropdownOpen.value[type] = !dropdownOpen.value[type]
}

const selectOption = (type: 'year' | 'month' | 'day', value: string) => {
  formData.value[type] = value
  dropdownOpen.value[type] = false

  // When year or month changes, validate the selected day
  if (type === 'year' || type === 'month') {
    if (formData.value.year && formData.value.month && formData.value.day) {
      const year = parseInt(formData.value.year)
      const month = parseInt(formData.value.month)
      const day = parseInt(formData.value.day)
      const daysInMonth = new Date(year, month, 0).getDate()

      // If selected day is invalid for the new month/year, reset it
      if (day > daysInMonth) {
        formData.value.day = ''
      }
    }
  }
}

const formatPhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/[^0-9]/g, '') // 숫자만 추출

  // 최대 11자리까지만 허용
  if (value.length > 11) {
    value = value.slice(0, 11)
  }

  // 3-4-4 형식으로 포맷팅
  if (value.length <= 3) {
    formData.value.phoneNumber = value
  } else if (value.length <= 7) {
    formData.value.phoneNumber = value.replace(/(\d{3})(\d{0,4})/, '$1-$2')
  } else {
    formData.value.phoneNumber = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3')
  }
}

const handleSubmit = async () => {
  console.log('handleSubmit 함수 실행됨');
  console.log('현재 formData:', formData.value);
  
  // 필수 필드 검증
  if (!formData.value.name.trim()) {
    alert('이름을 입력해주세요.');
    return;
  }
  
  if (!formData.value.phoneNumber.trim()) {
    alert('휴대폰 번호를 입력해주세요.');
    return;
  }
  
  if (!formData.value.year || !formData.value.month || !formData.value.day) {
    alert('생년월일을 모두 선택해주세요.');
    return;
  }
  
  try {
    console.log('localStorage 확인 중...');
    // localStorage에서 이메일과 비밀번호 가져오기
    const email = localStorage.getItem('signup_email') || '';
    const password = localStorage.getItem('signup_password') || '';
    
    console.log('email:', email, 'password:', password ? '설정됨' : '없음');
    
    if (!email || !password) {
      alert('회원가입 정보가 누락되었습니다. 처음부터 다시 시도해주세요.');
      router.push('/signup-email');
      return;
    }
    
    // 생년월일 포맷팅 (YYYY-MM-DD)
    const birthDate = `${formData.value.year}-${formData.value.month.padStart(2, '0')}-${formData.value.day.padStart(2, '0')}`;
    console.log('생년월일 포맷팅 결과:', birthDate);
    console.log('year:', formData.value.year, 'month:', formData.value.month, 'day:', formData.value.day);
    
    // 전화번호 형식을 010-1234-5678로 유지 (백엔드가 이 형식을 요구함)
    const phoneNumber = formData.value.phoneNumber;
    console.log('전화번호:', phoneNumber);
    
    // 백엔드 API 호출
    const signupData = {
      name: formData.value.name,
      email: email,
      password: password,
      phone_number: phoneNumber,
      birth_date: birthDate,
      nickname: formData.value.name, // 이름을 닉네임으로 사용
      policy_agree_1: true,
      policy_agree_2: true
    };
    
    console.log('백엔드로 전송할 데이터:', signupData);
    console.log('API 호출 시작...');

    const response = await fetch(`${API_BASE_URL}/member/signup-init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });
    
    console.log('API 응답 상태:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API 오류 세부사항:', errorData);
      throw new Error(errorData.detail || '회원가입에 실패했습니다.');
    }
    
    const result = await response.json();
    console.log('회원가입 성공:', result);
    
    // localStorage 정리
    localStorage.removeItem('signup_email');
    localStorage.removeItem('signup_password');
    
    // 회원가입 완료 페이지로 이동
    console.log('완료 페이지로 이동 중...');
    router.push('/signup-complete');
    
  } catch (error) {
    console.error('회원가입 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
    alert(errorMessage);
  }
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  Object.keys(dropdownOpen.value).forEach(key => {
    dropdownOpen.value[key as keyof typeof dropdownOpen.value] = false
  })
}

// Add click outside listener
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as Element
    if (!target.closest('.dropdown-container')) {
      closeDropdowns()
    }
  })
}
</script>

<style scoped>
.signup-page {
  width: 100vw;
  height: 100vh;
  background: #FFF;
  position: relative;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
}

/* Main Content */
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 84px - 50px); /* Full height minus header and footer space */
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.form-container {
  display: flex;
  width: 407px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
}

.form-title {
  align-self: stretch;
  color: #000;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  margin: 0;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
}

.birth-group {
  width: 286px;
}

.label-container {
  display: flex;
  align-items: flex-start;
  gap: 2px;
}

.form-label {
  color: #1F2937;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 25px;
}

.required-indicator {
  width: 5px;
  height: 5px;
  background: #F87171;
  border-radius: 50%;
  margin-top: 10px;
}

/* Input Styles */
.input-container {
  display: flex;
  height: 46px;
  padding: 10px 13px;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #FFF;
}

.form-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #1F2937;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
}

.form-input::placeholder {
  color: #9CA3AF;
}

/* Birth Date Inputs */
.birth-inputs {
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: stretch;
}

.dropdown-container {
  position: relative;
  background: #FFF;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
}

.year-dropdown {
  width: 95px;
}

.month-dropdown, .day-dropdown {
  width: 75px;
}

.dropdown-selected {
  display: flex;
  height: 45px;
  padding: 10px 13px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-bottom: 1px solid #E5E7EB;
}

.dropdown-text {
  color: #9CA3AF;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
}

.dropdown-arrow {
  width: 20px;
  height: 20px;
  transform: rotate(-90deg);
  transition: transform 0.2s ease;
}

.dropdown-arrow.open {
  transform: rotate(90deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFF;
  border-radius: 0 0 10px 10px;
  border: 1px solid #E5E7EB;
  border-top: none;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  height: 35px;
  padding: 10px 4px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid #E5E7EB;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #F9FAFB;
}

.dropdown-item {
  color: #9CA3AF;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 25px;
}

/* Submit Button */
.submit-button {
  display: flex;
  width: 407px;
  padding: 14px 60px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  background: #F0F6FF;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background: #E0ECFF;
}

.button-text {
  color: #02478A;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: normal;
}

/* Footer */
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  width: 277px;
  height: 12px;
}

.footer-privacy {
  color: #9CA3AF;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
}

.footer-separator {
  width: 4px;
  color: #9CA3AF;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
}

.footer-copyright {
  width: 191px;
  color: #9CA3AF;
  font-family: 'Pretendard', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 10px 20px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .form-container {
    width: 90%;
    max-width: 407px;
  }
  
  .submit-button {
    width: 100%;
  }
  
  .birth-inputs {
    flex-direction: column;
    gap: 10px;
  }
  
  .year-dropdown,
  .month-dropdown,
  .day-dropdown {
    width: 100%;
  }
  
  .footer {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 10px 15px;
  }
  
  .auth-links {
    gap: 15px;
  }
  
  .auth-link,
  .nav-link {
    font-size: 14px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .footer {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
