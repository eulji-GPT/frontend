<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="content-section">
          <div class="title-section">
            <h2 class="modal-title">운세를 알아보려면<br>정보가 필요해요!</h2>
          </div>

          <!-- Name Input Section -->
          <div class="name-section">
            <div class="section-label">이름</div>
            <input
              v-model="userName"
              type="text"
              class="name-input"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div class="dropdowns-section">
            <!-- Year Dropdown -->
            <div class="dropdown-container year-dropdown">
              <div class="dropdown-header" @click="toggleDropdown('year')">
                <span class="dropdown-value" :class="{ 'selected-value': selectedYear }">{{ selectedYear || '년도' }}</span>
                <svg class="dropdown-icon" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L10 8L15 13" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="isYearOpen" class="dropdown-options">
                <div
                  v-for="year in yearOptions"
                  :key="year"
                  class="dropdown-option"
                  :class="{ 'selected': selectedYear === year }"
                  @click="selectYear(year)"
                >
                  {{ year }}
                </div>
              </div>
            </div>

            <!-- Month Dropdown -->
            <div class="dropdown-container month-dropdown">
              <div class="dropdown-header" @click="toggleDropdown('month')">
                <span class="dropdown-value" :class="{ 'selected-value': selectedMonth }">{{ selectedMonth ? String(selectedMonth).padStart(2, '0') + '월' : '월' }}</span>
                <svg class="dropdown-icon" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L10 8L15 13" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="isMonthOpen" class="dropdown-options">
                <div
                  v-for="month in monthOptions"
                  :key="month"
                  class="dropdown-option"
                  :class="{ 'selected': selectedMonth === month }"
                  @click="selectMonth(month)"
                >
                  {{ String(month).padStart(2, '0') }}월
                </div>
              </div>
            </div>

            <!-- Day Dropdown -->
            <div class="dropdown-container day-dropdown">
              <div class="dropdown-header" @click="toggleDropdown('day')">
                <span class="dropdown-value" :class="{ 'selected-value': selectedDay }">{{ selectedDay ? String(selectedDay).padStart(2, '0') + '일' : '일' }}</span>
                <svg class="dropdown-icon" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 13L10.5 8L15.5 13" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="isDayOpen" class="dropdown-options">
                <div
                  v-for="day in dayOptions"
                  :key="day"
                  class="dropdown-option"
                  :class="{ 'selected': selectedDay === day }"
                  @click="selectDay(day)"
                >
                  {{ String(day).padStart(2, '0') }}일
                </div>
              </div>
            </div>
          </div>

          <!-- Gender Section -->
          <div class="gender-section">
            <div class="section-label">성별</div>
            <div class="gender-buttons">
              <button
                class="gender-button"
                :class="{ 'selected': selectedGender === '남자' }"
                @click="selectGender('남자')"
              >
                남자
              </button>
              <button
                class="gender-button"
                :class="{ 'selected': selectedGender === '여자' }"
                @click="selectGender('여자')"
              >
                여자
              </button>
            </div>
          </div>

          <!-- Birth Time Section -->
          <div class="birth-time-section">
            <div class="section-label">태어난 시각 (선택)</div>
            <div class="dropdown-container birth-time-dropdown">
              <div class="dropdown-header" @click="toggleDropdown('birthTime')">
                <span class="dropdown-value" :class="{ 'selected-value': selectedBirthTime }">{{ selectedBirthTime || '모름' }}</span>
                <svg class="dropdown-icon" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L10 8L15 13" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="isBirthTimeOpen" class="dropdown-options">
                <div
                  v-for="time in birthTimeOptions"
                  :key="time"
                  class="dropdown-option"
                  :class="{ 'selected': selectedBirthTime === time }"
                  @click="selectBirthTime(time)"
                >
                  {{ time }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="submit-button" @click="submitBirthdate">
          <span class="button-text">입력하기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface BirthdateData {
  name: string;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  gender: 'male' | 'female';
  genderKorean?: string;
  birthTime?: string;
  isLunar: boolean;
}

defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: BirthdateData];
}>();

const userName = ref<string>('');
const selectedYear = ref<number | null>(null);
const selectedMonth = ref<number | null>(null);
const selectedDay = ref<number | null>(null);
const selectedGender = ref<string>('남자');
const selectedBirthTime = ref<string>('모름');
const isLunar = ref<boolean>(false);

const isYearOpen = ref(false);
const isMonthOpen = ref(false);
const isDayOpen = ref(false);
const isBirthTimeOpen = ref(false);

// 생년월일 옵션들을 더 실용적으로 확장
const yearOptions = Array.from({ length: 50 }, (_, i) => 2024 - i); // 1975년부터 2024년까지
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1); // 1월부터 12월까지
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1); // 1일부터 31일까지
const birthTimeOptions = ['모름', '자시(23:30-01:29)', '축시(01:30-03:29)', '인시(03:30-05:29)', '묘시(05:30-07:29)', '진시(07:30-09:29)', '사시(09:30-11:29)', '오시(11:30-13:29)', '미시(13:30-15:29)', '신시(15:30-17:29)', '유시(17:30-19:29)', '술시(19:30-21:29)', '해시(21:30-23:29)'];

const toggleDropdown = (type: 'year' | 'month' | 'day' | 'birthTime') => {
  if (type === 'year') {
    isYearOpen.value = !isYearOpen.value;
  } else if (type === 'month') {
    isMonthOpen.value = !isMonthOpen.value;
  } else if (type === 'day') {
    isDayOpen.value = !isDayOpen.value;
  } else if (type === 'birthTime') {
    isBirthTimeOpen.value = !isBirthTimeOpen.value;
  }
};

const selectYear = (year: number) => {
  selectedYear.value = year;
  isYearOpen.value = false;
  checkAllSelected();
};

const selectMonth = (month: number) => {
  selectedMonth.value = month;
  isMonthOpen.value = false;
  checkAllSelected();
};

const selectDay = (day: number) => {
  selectedDay.value = day;
  isDayOpen.value = false;
  checkAllSelected();
};

const selectGender = (gender: string) => {
  selectedGender.value = gender;
};

const selectBirthTime = (time: string) => {
  selectedBirthTime.value = time;
  isBirthTimeOpen.value = false;
};

const checkAllSelected = () => {
  if (selectedYear.value && selectedMonth.value && selectedDay.value) {
    // 모든 값이 선택되면 모든 드롭다운을 닫음
    isYearOpen.value = false;
    isMonthOpen.value = false;
    isDayOpen.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

const submitBirthdate = () => {
  // 이름과 생년월일 유효성 검사
  if (!userName.value.trim()) {
    alert('이름을 입력해주세요.');
    return;
  }

  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
    alert('생년월일을 모두 선택해주세요.');
    return;
  }

  const data: BirthdateData = {
    name: userName.value.trim(),
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value,
    gender: selectedGender.value === '남자' ? 'male' : 'female',
    genderKorean: selectedGender.value,
    birthTime: selectedBirthTime.value,
    isLunar: isLunar.value
  };
  emit('submit', data);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-container {
  position: relative;
  width: 400px;
  height: auto;
  max-height: 70vh;
}

.modal-content {
  display: inline-flex;
  padding: 25px 30px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 25px;
  border-radius: 12px;
  background: #FFF;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
  width: 400px;
  height: auto;
  box-sizing: border-box;
  transition: height 0.3s ease;
}

.content-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  position: relative;
}

.modal-title {
  align-self: stretch;
  color: #000;
  font-family: Pretendard, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  position: relative;
  margin: 0;
}

.dropdowns-section {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.dropdown-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #FFF;
  position: relative;
}

.year-dropdown {
  width: 110px;
}

.month-dropdown {
  width: 100px;
}

.day-dropdown {
  width: 100px;
}

.dropdown-header {
  display: flex;
  height: 45px;
  padding: 10px 15px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid #E5E7EB;
  position: relative;
  cursor: pointer;
}

.dropdown-value {
  color: #9CA3AF;
  font-family: Pretendard, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;
  position: relative;
}

.dropdown-value.selected-value {
  color: #000000;
  font-weight: 700;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  transform: rotate(-90deg);
  aspect-ratio: 1/1;
  position: relative;
}

.dropdown-options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  position: relative;
  max-height: 140px;
  overflow-y: auto;
  border: 1px solid #E5E7EB;
  border-top: none;
  background: #FFF;
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 #F1F5F9;
}

/* 웹킷 브라우저용 스크롤바 스타일링 */
.dropdown-options::-webkit-scrollbar {
  width: 6px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: #F1F5F9;
  border-radius: 3px;
}

.dropdown-options::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

.dropdown-option {
  display: flex;
  height: 35px;
  padding: 10px 4px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-bottom: 1px solid #E5E7EB;
  position: relative;
  cursor: pointer;
  color: #9CA3AF;
  font-family: Pretendard, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;
}

.dropdown-option:last-child {
  border-bottom: 0 solid #E5E7EB;
}

.dropdown-option:hover {
  background-color: #F9FAFB;
}

.dropdown-option.selected {
  color: #000000;
  font-weight: 700;
  background-color: #F0F6FF;
}

.name-section,
.gender-section,
.birth-time-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  position: relative;
}

.section-label {
  color: #1F2937;
  font-family: Pretendard, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.name-input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #FFF;
  color: #000;
  font-family: Pretendard, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.name-input::placeholder {
  color: #9CA3AF;
}

.name-input:focus {
  outline: none;
  border-color: #02478A;
}

.gender-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
}

.gender-button {
  display: flex;
  flex: 1;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #FFF;
  color: #9CA3AF;
  font-family: Pretendard, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gender-button:hover {
  background-color: #F9FAFB;
}

.gender-button.selected {
  border-color: #02478A;
  background: #F0F6FF;
  color: #02478A;
  font-weight: 700;
}

.birth-time-dropdown {
  width: 100%;
}

.submit-button {
  display: flex;
  width: 181px;
  padding: 13px 60px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  background: #F0F6FF;
  position: relative;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-text {
  color: #02478A;
  text-align: center;
  font-family: Pretendard, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 1;
  position: relative;
  white-space: nowrap;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-start;
    padding-top: 20px;
    overflow-y: auto;
  }

  .modal-container {
    width: 90%;
    max-width: 400px;
    height: auto;
    max-height: none;
    position: relative;
    left: auto;
    top: auto;
    margin: 20px auto;
  }

  .modal-content {
    width: 100%;
    height: auto;
    max-height: none;
  }

  .dropdowns-section {
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }

  .dropdown-container {
    flex: none;
  }

  .year-dropdown {
    width: 120px;
  }

  .month-dropdown,
  .day-dropdown {
    width: 110px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    align-items: flex-start;
    padding: 10px;
    padding-bottom: 40px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .modal-container {
    width: 100%;
    max-width: 100%;
    margin: 0 auto 20px;
    overflow: visible;
  }

  .modal-content {
    padding: 16px;
    gap: 14px;
    width: 100%;
  }

  .content-section {
    gap: 14px;
  }

  .modal-title {
    font-size: 17px;
    text-align: center;
    line-height: 130%;
  }

  .section-label {
    font-size: 13px;
  }

  .name-section,
  .gender-section,
  .birth-time-section {
    gap: 8px;
  }

  .name-input {
    padding: 10px 12px;
    font-size: 15px;
  }

  .dropdowns-section {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
  }

  .year-dropdown {
    width: 100%;
    min-width: 100%;
  }

  .month-dropdown,
  .day-dropdown {
    width: calc(50% - 5px);
    min-width: calc(50% - 5px);
  }

  .dropdown-header {
    height: 40px;
    padding: 8px 12px;
  }

  .dropdown-value {
    font-size: 14px;
  }

  .dropdown-options {
    max-height: 120px;
  }

  .dropdown-option {
    height: 32px;
    font-size: 14px;
    padding: 6px 4px;
  }

  .gender-button {
    padding: 10px 16px;
    font-size: 15px;
  }

  .submit-button {
    width: 100%;
    max-width: 200px;
    padding: 12px 20px;
    margin-top: 6px;
  }

  .button-text {
    font-size: 16px;
  }
}
</style>
