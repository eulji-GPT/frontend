<template>
  <section id="news" class="section news-section">
    <div class="news-header">새로운 소식</div>
    <div class="news-list">
      <div v-if="newsList.length === 0">새로운 소식이 없습니다.</div>
      <div v-for="(news, idx) in newsList" :key="idx" class="news-item">
        <div class="news-title">{{ news.title }}</div>
        <div class="news-date">{{ news.date }}</div>
        <div v-if="news.desc" class="news-desc">{{ news.desc }}</div>
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
