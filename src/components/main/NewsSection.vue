<template>
  <section id="news" class="news-section">
    <div class="news-header text-wrapper-4">새로운 소식</div>
    <div class="news-list">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="news-loading">
        <SkeletonLoader :count="3" height="60px" gap="16px" :showSubline="true" />
      </div>
      <!-- 에러 상태 -->
      <div v-else-if="error" class="news-error">
        <p class="error-message">{{ error }}</p>
        <button class="retry-button" @click="fetchNewsData">다시 시도</button>
      </div>
      <!-- 빈 상태 -->
      <div v-else-if="newsList.length === 0" class="news-empty">새로운 소식이 없습니다.</div>
      <!-- 뉴스 목록 -->
      <div
        v-else
        v-for="(news, idx) in newsList"
        :key="idx"
        class="news-row"
        :class="{ 'is-expanded': expandedIndex === idx }"
        @click="toggleExpand(idx)"
      >
        <div class="news-row-header">
          <div class="news-row-content">
            <div class="news-title">{{ news.title }}</div>
          </div>
          <div class="news-chevron" :class="{ rotated: expandedIndex === idx }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="news-expand-area" :class="{ expanded: expandedIndex === idx }">
          <div class="news-expand-inner">
            <div v-if="news.desc" class="news-desc">{{ news.desc }}</div>
          </div>
        </div>
        <div class="news-date">{{ news.date }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SkeletonLoader from '../common/SkeletonLoader.vue'
import { getApiBaseUrl } from '@/utils/ports-config'

interface NewsItem {
  title: string;
  date: string;
  desc?: string;
}

const newsList = ref<NewsItem[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const expandedIndex = ref<number | null>(0)

const API_BASE_URL = getApiBaseUrl()

const toggleExpand = (idx: number) => {
  if (expandedIndex.value === idx) {
    expandedIndex.value = null
  } else {
    expandedIndex.value = idx
  }
}

const fetchNewsData = async () => {
  isLoading.value = true
  error.value = null

  try {
    // 백엔드 API에서 뉴스 데이터 가져오기
    const res = await fetch(`${API_BASE_URL}/news`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    newsList.value = await res.json()
  } catch (e) {
    console.error("Could not fetch news data from API:", e)
    // API 실패 시 로컬 JSON 파일에서 가져오기 (폴백)
    try {
      const fallbackRes = await fetch('/news.json')
      if (fallbackRes.ok) {
        newsList.value = await fallbackRes.json()
      } else {
        error.value = '뉴스 데이터를 불러올 수 없습니다.'
      }
    } catch {
      error.value = '뉴스 데이터를 불러올 수 없습니다.'
      newsList.value = []
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchNewsData()
})
</script>

<style scoped>
.news-section {
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

.news-header {
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

.news-list {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 2.5rem;
  gap: 0;
}

/* --- News Row --- */
.news-row {
  cursor: pointer;
  padding: 24px 8px 24px 48px;
}

.news-row:hover {
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: 8px;
}

.news-row-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.news-row-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  line-height: 1.5;
}

.news-date {
  font-size: 0.9rem;
  color: #9CA3AF;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.4;
  margin-top: 6px;
  padding-left: 0;
}

/* --- Chevron --- */
.news-chevron {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D1D5DB;
  transition: transform 0.3s ease, color 0.2s ease;
}

.news-chevron.rotated {
  transform: rotate(180deg);
  color: #9CA3AF;
}

/* --- Accordion --- */
.news-expand-area {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.25s ease;
  opacity: 0;
}

.news-expand-area.expanded {
  max-height: 300px;
  opacity: 1;
}

.news-expand-inner {
  padding: 0;
}

.news-desc {
  padding: 4px 0 8px 0;
  font-size: 0.95rem;
  font-weight: 400;
  color: #6B7280;
  line-height: 1.7;
}

/* --- States --- */
.news-empty {
  text-align: left;
  color: var(--color-text-tertiary);
  font-size: 1.1rem;
  font-weight: 400;
  padding: 1rem 0.2rem;
}

.news-loading {
  width: 100%;
  padding: 0.5rem 0;
}

.news-error {
  width: 100%;
  text-align: center;
  padding: 2rem 0;
}

.news-error .error-message {
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
  .news-section {
    padding-bottom: 80px;
  }
  .news-header {
    width: 90%;
    margin: 0 auto;
    font-size: 2.2rem;
    margin-bottom: 40px;
  }
  .news-list {
    width: 90%;
    margin: 0 auto;
  }
}

@media (max-width: 900px) {
  .news-section {
    padding: 1.2rem 0 3rem 0;
  }
  .news-header {
    font-size: 1.1rem;
    padding-left: 1.2rem;
  }
  .news-list {
    padding: 0 1.2rem;
  }
  .news-row {
    padding: 18px 6px 18px 32px;
  }
  .news-title {
    font-size: 1.1rem;
  }
  .news-date {
    font-size: 0.85rem;
  }
  .news-desc {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .news-header {
    font-size: 1.8rem;
    margin-bottom: 35px;
  }
}

@media (max-width: 600px) {
  .news-section {
    padding: 0.5rem 0 2rem 0;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
  }
  .news-header {
    font-size: 1rem;
    padding-left: 0.5rem;
  }
  .news-list {
    padding: 0 0.5rem;
  }
  .news-row {
    padding: 14px 4px 14px 20px;
  }
  .news-title {
    font-size: 0.98rem;
  }
  .news-date {
    font-size: 0.82rem;
  }
  .news-desc {
    font-size: 0.93rem;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  .news-header {
    font-size: 1.6rem;
    margin-bottom: 30px;
  }
}
</style>
