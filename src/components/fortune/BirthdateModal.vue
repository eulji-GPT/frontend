<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="content-section">
          <div class="title-section">
            <h2 class="modal-title">운세를 알아보려면<br>생일 정보가 필요해요</h2>
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
        </div>

        <button class="submit-button" @click="submitBirthdate">
          <span class="button-text">입력하기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface BirthdateData {
  year: number;
  month: number;
  day: number;
}

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: BirthdateData];
}>();

const selectedYear = ref<number | null>(null);
const selectedMonth = ref<number | null>(null);
const selectedDay = ref<number | null>(null);

const isYearOpen = ref(true);
const isMonthOpen = ref(true);
const isDayOpen = ref(true);

// 생년월일 옵션들을 더 실용적으로 확장
const yearOptions = Array.from({ length: 50 }, (_, i) => 2024 - i); // 1975년부터 2024년까지
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1); // 1월부터 12월까지
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1); // 1일부터 31일까지

const toggleDropdown = (type: 'year' | 'month' | 'day') => {
  if (type === 'year') {
    isYearOpen.value = !isYearOpen.value;
  } else if (type === 'month') {
    isMonthOpen.value = !isMonthOpen.value;
  } else if (type === 'day') {
    isDayOpen.value = !isDayOpen.value;
  }
};

const selectYear = (year: number) => {
  selectedYear.value = year;
  isYearOpen.value = false;
};

const selectMonth = (month: number) => {
  selectedMonth.value = month;
  isMonthOpen.value = false;
};

const selectDay = (day: number) => {
  selectedDay.value = day;
  isDayOpen.value = false;
};

const closeModal = () => {
  emit('close');
};

const submitBirthdate = () => {
  // 선택된 값이 없으면 알림 표시
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
    alert('생년월일을 모두 선택해주세요.');
    return;
  }
  
  const data: BirthdateData = {
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value
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
  min-height: 450px;
  height: auto;
  box-sizing: border-box;
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
  .modal-container {
    width: 90%;
    max-width: 400px;
    height: auto;
    position: relative;
    left: auto;
    top: auto;
  }

  .modal-content {
    width: 100%;
    height: auto;
    min-height: 388px;
  }

  .dropdowns-section {
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }

  .dropdown-container {
    flex: none;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 20px 25px;
    gap: 25px;
  }

  .modal-title {
    font-size: 18px;
    text-align: center;
  }

  .dropdowns-section {
    flex-direction: column;
    gap: 15px;
  }

  .year-dropdown,
  .month-dropdown,
  .day-dropdown {
    width: 140px;
  }

  .submit-button {
    width: 160px;
    padding: 12px 50px;
  }

  .button-text {
    font-size: 16px;
  }
}
</style>
