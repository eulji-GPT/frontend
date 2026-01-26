<template>
  <div class="frame" id="faq">
    <div class="text-wrapper-4">자주 묻는 질문</div>
    <div class="div-2">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="faq-loading">
        <SkeletonLoader :count="4" height="70px" gap="12px" :showSubline="false" />
      </div>
      <!-- 에러 상태 -->
      <div v-else-if="error" class="faq-error">
        <p class="error-message">{{ error }}</p>
        <button class="retry-button" @click="fetchFaqData">다시 시도</button>
      </div>
      <!-- 빈 상태 -->
      <div v-else-if="faqList.length === 0" class="faq-empty">자주 묻는 질문이 없습니다.</div>
      <!-- FAQ 목록 -->
      <div v-for="(faq, idx) in faqList" :key="idx" class="faq-row">
        <div class="faq-question-row" @click="toggleFaq(idx)">
          <span class="faq-q-label">Q.</span>
          <span class="faq-q-text">{{ faq.q }}</span>
          <span class="faq-arrow-btn">
            <img :class="['faq-arrow-icon', {open: openFaqIdx === idx}]" src="../../assets/FaqSection/icn_under_^.svg" alt="arrow" />
          </span>
        </div>
        <div 
          :class="['faq-answer-wrapper', { open: openFaqIdx === idx }]"
          :style="{ maxHeight: openFaqIdx === idx ? `${answerHeights[idx] || 200}px` : '0px' }"
        >
          <div class="faq-answer-card" :ref="el => setAnswerRef(el, idx)">
            <span class="faq-a-label">A.</span>
            <span class="faq-a-text">{{ faq.a }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, type ComponentPublicInstance } from 'vue'
import SkeletonLoader from '../common/SkeletonLoader.vue'
import { getApiBaseUrl } from '@/utils/ports-config'

interface FaqItem {
  q: string;
  a: string;
}

const faqList = ref<FaqItem[]>([])
const openFaqIdx = ref<number|null>(null)
const answerHeights = ref<Record<number, number>>({})
const answerRefs = ref<Record<number, HTMLElement>>({})
const isLoading = ref(true)
const error = ref<string | null>(null)

const API_BASE_URL = getApiBaseUrl()

function setAnswerRef(el: HTMLElement | Element | ComponentPublicInstance | null, idx: number) {
  if (el && el instanceof HTMLElement) {
    answerRefs.value[idx] = el
  }
}

async function toggleFaq(idx: number) {
  const isOpening = openFaqIdx.value !== idx

  if (isOpening) {
    openFaqIdx.value = idx
    await nextTick()

    // 실제 콘텐츠 높이 측정
    const answerEl = answerRefs.value[idx]
    if (answerEl) {
      answerHeights.value[idx] = answerEl.scrollHeight + 48 // padding 포함
    }
  } else {
    openFaqIdx.value = null
  }
}

const fetchFaqData = async () => {
  isLoading.value = true
  error.value = null

  try {
    // 백엔드 API에서 FAQ 데이터 가져오기
    const res = await fetch(`${API_BASE_URL}/faq`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    faqList.value = await res.json()

    // 모든 답변의 높이를 미리 측정
    await nextTick()
    faqList.value.forEach((_, idx) => {
      const answerEl = answerRefs.value[idx]
      if (answerEl) {
        answerHeights.value[idx] = answerEl.scrollHeight + 48
      }
    })
  } catch (e) {
    console.error("Could not fetch FAQ data from API:", e)
    // API 실패 시 로컬 JSON 파일에서 가져오기 (폴백)
    try {
      const fallbackRes = await fetch('/faq.json')
      if (fallbackRes.ok) {
        faqList.value = await fallbackRes.json()
        await nextTick()
        faqList.value.forEach((_, idx) => {
          const answerEl = answerRefs.value[idx]
          if (answerEl) {
            answerHeights.value[idx] = answerEl.scrollHeight + 48
          }
        })
      } else {
        error.value = 'FAQ 데이터를 불러올 수 없습니다.'
      }
    } catch {
      error.value = 'FAQ 데이터를 불러올 수 없습니다.'
      faqList.value = []
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchFaqData()
})
</script>

<style scoped>
.frame {
  align-items: flex-start;
  background-color: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: 600px;
  padding: 100px 40px;
  position: relative;
  width: 100%;
  max-width: 1066px;
  margin: 0 auto;
  box-sizing: border-box;
  scroll-margin-top: 84px;
}

.text-wrapper-4 {
  align-self: stretch;
  color: var(--color-text-primary);
  font-size: 2.2rem;
  font-weight: 700;
  margin-top: -1.00px;
  position: relative;
}

.div-2 {
  align-items: flex-start;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.faq-row {
  width: 100%;
  border-bottom: 1px solid var(--color-card-border);
  margin-bottom: 0;
}

.faq-question-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px 0;
  cursor: pointer;
  gap: 18px;
  transition: background-color 0.2s ease;
}

.faq-question-row {
  position: relative;
}

.faq-question-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: -40px;
  right: -40px;
  bottom: 0;
  background-color: var(--color-bg-secondary);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: -1;
}

.faq-question-row:hover::before {
  opacity: 1;
}

.faq-q-label {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-right: 2px;
  flex-shrink: 0;
}

.faq-q-text {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-text-primary);
  flex: 1;
  line-height: 1.4;
}

.faq-arrow-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.faq-arrow-icon {
  font-size: 1.2rem;
  color: var(--color-text-tertiary);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.2s ease;
  display: inline-block;
}

.faq-arrow-icon.open {
  transform: rotate(180deg);
  color: var(--color-text-primary);
}

.faq-answer-wrapper {
  width: 100%;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  max-height: 0;
  opacity: 0;
  margin-left: -2px;
}

.faq-answer-wrapper.open {
  opacity: 1;
}

.faq-answer-card {
  width: 100%;
  background: var(--color-bg-secondary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  padding: 24px 0 24px 2px;
  /* margin-bottom: 24px; */
  box-sizing: border-box;
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.faq-answer-wrapper:not(.open) .faq-answer-card {
  transform: translateY(-8px);
}

.faq-a-label {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  flex-shrink: 0;
}

.faq-a-text {
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.6;
  flex: 1;
  text-align: left;
  display: flex;
  align-items: center;
  height: 100%;
}

.faq-empty {
  color: var(--color-text-disabled);
  font-size: 1.1rem;
  font-weight: 400;
  padding: 2rem 0;
  text-align: center;
}

.faq-loading {
  width: 100%;
  padding: 1rem 0;
}

.faq-error {
  width: 100%;
  text-align: center;
  padding: 2rem 0;
}

.faq-error .error-message {
  color: var(--color-error);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 10px 24px;
  background-color: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: var(--color-button-primary-hover);
}

/* 반응형 디자인 */
@media (max-width: 1106px) {
  .frame {
    padding: 80px 30px;
  }
  
  .faq-question-row::before {
    left: -30px;
    right: -30px;
  }
  
  .faq-answer-card {
    padding: 24px 36px;
  }
}

@media (max-width : 1024px) {
  .text-wrapper-4 {
    width : 90%;
    margin : 0 auto;
  }
  .div-2 {
    margin : 0 auto;
    width : 90%;
  }
}

@media (max-width: 768px) {
  .frame {
    padding: 60px 20px;
    gap: 20px;
  }
  
  .text-wrapper-4 {
    font-size: 1.8rem;
  }
  
  .faq-question-row {
    padding: 20px 0;
    gap: 12px;
  }
  
  .faq-question-row::before {
    left: -20px;
    right: -20px;
  }
  
  .faq-q-label {
    font-size: 1.6rem;
  }
  
  .faq-q-text {
    font-size: 1.1rem;
  }
  
  .faq-answer-card {
    padding: 20px 28px;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .faq-a-label {
    font-size: 1.6rem;
  }
  
  .faq-a-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .frame {
    padding: 40px 16px;
  }
  
  .text-wrapper-4 {
    font-size: 1.6rem;
  }
  
  .faq-question-row {
    padding: 16px 0;
    gap: 8px;
  }
  
  .faq-question-row::before {
    left: -16px;
    right: -16px;
  }
  
  .faq-q-label {
    font-size: 1.4rem;
  }
  
  .faq-q-text {
    font-size: 1rem;
  }
  
  .faq-answer-card {
    padding: 18px 24px;
    gap: 10px;
    margin-bottom: 16px;
  }
  
  .faq-a-label {
    font-size: 1.4rem;
  }
  
  .faq-a-text {
    font-size: 1rem;
  }
}

@media (min-width : 320px) and (max-width : 480px) {
  .text-wrapper-4 {
    width : 90%;
    margin : 0 auto;
  }
  .div-2 {
    margin : 0 auto;
    width : 90%;
  }
}
</style>