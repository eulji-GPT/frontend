<template>
  <section id="news" class="news-section-image">
    <div class="news-header-image text-wrapper-4">새로운 소식</div>
    <div class="news-list-image">
      <div v-if="newsList.length === 0" class="news-empty-image">새로운 소식이 없습니다.</div>
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

interface NewsItem {
  title: string;
  date: string;
  desc?: string;
}

const newsList = ref<NewsItem[]>([])

onMounted(async () => {
  try {
    const res = await fetch('/news.json')
    if (res.ok) {
      newsList.value = await res.json()
    }
  } catch (e) {
    newsList.value = []
  }
})
</script>

<style scoped>
.news-section-image {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(79, 110, 219, 0.04);
  padding: 2.5rem 0 2.5rem 0;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
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
  color: #222;
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
  color: #232834;
  margin-bottom: 0.1rem;
  letter-spacing: -0.01em;
}
.news-date-image {
  font-size: 1rem;
  color: #b0b4bb;
  font-weight: 600;
  margin-bottom: 0.1rem;
  letter-spacing: 0.01em;
}
.news-desc-image {
  color: #4f6edb;
  font-size: 1.05rem;
  margin-top: 0.1rem;
  font-weight: 400;
}
.news-empty-image {
  text-align: left;
  color: #b0b4bb;
  font-size: 1.1rem;
  font-weight: 400;
  padding-left: 0.2rem;
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
</style>
