<template>
  <section id="faq" class="faq-section">
    <div class="faq-header text-wrapper-4">자주 묻는 질문</div>
    <div class="faq-list">
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
      <div
        v-else
        v-for="(faq, idx) in faqList"
        :key="idx"
        class="faq-row"
        :class="{ 'is-expanded': openFaqIdx === idx }"
        @click="toggleFaq(idx)"
      >
        <div class="faq-row-header">
          <div class="faq-row-content">
            <div class="faq-title"><span class="faq-q-label">Q.</span>{{ faq.q }}</div>
          </div>
          <div class="faq-chevron" :class="{ rotated: openFaqIdx === idx }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div
          class="faq-expand-area"
          :class="{ expanded: openFaqIdx === idx }"
          :style="{ maxHeight: openFaqIdx === idx ? `${answerHeights[idx] || 200}px` : '0px' }"
        >
          <div class="faq-expand-inner">
            <div class="faq-answer-card" :ref="el => setAnswerRef(el, idx)">
              <span class="faq-a-label">A.</span>
              <span class="faq-a-text">{{ faq.a }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
.faq-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-bg-primary);
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(79, 110, 219, 0.04);
  padding: 2.5rem 0 5rem 0;
  margin-top: 0;
  margin-bottom: 0;
  scroll-margin-top: 84px;
}

.faq-header {
  width: 100%;
  max-width: 1100px;
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
  text-align: left;
  padding-left: 2.5rem;
}

.text-wrapper-4 {
  color: var(--color-text-primary);
  font-size: 2.2rem;
  font-weight: 700;
  margin-top: -1.00px;
  position: relative;
}

.faq-list {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 2.5rem;
  gap: 0;
}

/* --- FAQ Row --- */
.faq-row {
  cursor: pointer;
  padding: 24px 8px 24px 48px;
}

.faq-row:hover {
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: 8px;
}

.faq-row-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.faq-row-content {
  flex: 1;
  min-width: 0;
}

.faq-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  line-height: 1.5;
}

.faq-q-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-right: 6px;
}

/* --- Chevron --- */
.faq-chevron {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D1D5DB;
  transition: transform 0.3s ease, color 0.2s ease;
}

.faq-chevron.rotated {
  transform: rotate(180deg);
  color: #9CA3AF;
}

/* --- Accordion --- */
.faq-expand-area {
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  max-height: 0;
  opacity: 0;
  background: #F8FBFF;
  margin-left: -48px;
  margin-right: -8px;
  padding-left: 48px;
  padding-right: 8px;
}

.faq-expand-area.expanded {
  opacity: 1;
}

.faq-expand-inner {
  padding: 0;
}

.faq-answer-card {
  width: 100%;
  background: transparent;
  border-radius: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 6px;
  padding: 24px 0;
  box-sizing: border-box;
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.faq-expand-area:not(.expanded) .faq-answer-card {
  transform: translateY(-8px);
}

.faq-a-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: #02478A;
  flex-shrink: 0;
}

.faq-a-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: #02478A;
  line-height: 1.6;
  flex: 1;
  text-align: left;
  display: flex;
  align-items: center;
  height: 100%;
}

/* --- States --- */
.faq-empty {
  text-align: left;
  color: var(--color-text-tertiary);
  font-size: 1.1rem;
  font-weight: 400;
  padding: 1rem 0.2rem;
}

.faq-loading {
  width: 100%;
  padding: 0.5rem 0;
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

/* --- Responsive: Tablet --- */
@media (max-width: 1024px) {
  .faq-section {
    padding-bottom: 80px;
  }
  .faq-header {
    width: 90%;
    margin: 0 auto;
    font-size: 2.2rem;
    margin-bottom: 40px;
  }
  .faq-list {
    width: 90%;
    margin: 0 auto;
  }
}

@media (max-width: 900px) {
  .faq-section {
    padding: 1.2rem 0 3rem 0;
  }
  .faq-header {
    font-size: 1.1rem;
    padding-left: 1.2rem;
  }
  .faq-list {
    padding: 0 1.2rem;
  }
  .faq-row {
    padding: 18px 6px 18px 32px;
  }
  .faq-title {
    font-size: 1.1rem;
  }
  .faq-q-label {
    font-size: 1.1rem;
  }
  .faq-a-label {
    font-size: 1.1rem;
  }
  .faq-a-text {
    font-size: 0.95rem;
  }
  .faq-expand-area {
    margin-left: -32px;
    margin-right: -6px;
    padding-left: 32px;
    padding-right: 6px;
  }
}

@media (max-width: 768px) {
  .faq-header {
    font-size: 1.8rem;
    margin-bottom: 35px;
  }
}

@media (max-width: 600px) {
  .faq-section {
    padding: 0.5rem 0 2rem 0;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
  }
  .faq-header {
    font-size: 1rem;
    padding-left: 0.5rem;
  }
  .faq-list {
    padding: 0 0.5rem;
  }
  .faq-row {
    padding: 14px 4px 14px 20px;
  }
  .faq-title {
    font-size: 0.98rem;
  }
  .faq-q-label {
    font-size: 0.98rem;
  }
  .faq-a-label {
    font-size: 0.98rem;
  }
  .faq-a-text {
    font-size: 0.93rem;
  }
  .faq-expand-area {
    margin-left: -20px;
    margin-right: -4px;
    padding-left: 20px;
    padding-right: 4px;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  .faq-header {
    font-size: 1.6rem;
    margin-bottom: 30px;
  }
}
</style>