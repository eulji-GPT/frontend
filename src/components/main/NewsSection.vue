<template>
  <section id="news" class="news-section-image">
    <div class="news-header-image text-wrapper-4">새로운 소식</div>
    <div class="news-list-image">
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
      <div v-else-if="newsList.length === 0" class="news-empty-image">새로운 소식이 없습니다.</div>
      <!-- 뉴스 목록 -->
      <div v-for="(news, idx) in newsList" :key="idx" class="news-row-image">
        <div class="news-title-image">{{ news.title }}</div>
        <div class="news-date-image">{{ news.date }}</div>
        <div v-if="news.desc" class="news-desc-image">{{ news.desc }}</div>
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

const API_BASE_URL = getApiBaseUrl()

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
.news-section-image {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-bg-primary);
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(79, 110, 219, 0.04);
  padding: 2.5rem 0 30rem 0;
  margin-top: 0;
  margin-bottom: 0;
  scroll-margin-top: 84px;
}
.news-header-image {
  width: 100%;
  max-width: 1100px;
  margin-bottom: 2.2rem;
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
.news-list-image {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: flex-start;
  padding: 0 2.5rem;
}
.news-row-image {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}
.news-title-image {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: 0.1rem;
  letter-spacing: -0.01em;
}
.news-date-image {
  font-size: 1rem;
  color: var(--color-text-tertiary);
  font-weight: 600;
  margin-bottom: 0.1rem;
  letter-spacing: 0.01em;
}
.news-desc-image {
  color: var(--color-primary);
  font-size: 1.05rem;
  margin-top: 0.1rem;
  font-weight: 400;
}
.news-empty-image {
  text-align: left;
  color: var(--color-text-tertiary);
  font-size: 1.1rem;
  font-weight: 400;
  padding-left: 0.2rem;
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

@media (max-width: 900px) {
  .news-section-image {
    padding: 1.2rem 0 1.2rem 0;
  }
  .news-header-image {
    font-size: 1.1rem;
    padding-left: 1.2rem;
  }
  .news-list-image {
    padding: 0 1.2rem;
    gap: 1.2rem;
  }
  .news-title-image {
    font-size: 1.05rem;
  }
  .news-date-image {
    font-size: 0.95rem;
  }
  .news-desc-image {
    font-size: 0.98rem;
  }
}
@media (max-width: 600px) {
  .news-section-image {
    padding: 0.5rem 0 0.5rem 0;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
  }
  .news-header-image {
    font-size: 1rem;
    padding-left: 0.5rem;
  }
  .news-list-image {
    padding: 0 0.5rem;
    gap: 0.7rem;
  }
  .news-title-image {
    font-size: 0.98rem;
  }
  .news-date-image {
    font-size: 0.9rem;
  }
  .news-desc-image {
    font-size: 0.93rem;
  }
}

@media (max-width : 1024px) {
  .news-section-image {
    padding-bottom: 80px;
  }
  .news-header-image {
    width : 90%;
    margin : 0 auto;
  }

  .news-list-image {
    width : 90%;
    margin : 0 auto;
  }

  .news-header-image {
    font-size : 2.2rem;
    margin-bottom: 40px;
  }
}

@media (max-width : 768px) {
  .news-header-image {
    font-size : 1.8rem;
    margin-bottom: 35px;
  }

}

@media (min-width : 320px) and (max-width : 480px) {
  .news-header-image {
    font-size : 1.6rem;
    margin-bottom: 30px;
  }
}

</style>
