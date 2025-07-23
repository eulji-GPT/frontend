<template>
  <section id="faq" class="section faq-section">
    <div class="faq-header">자주 묻는 질문</div>
    <div class="faq-list">
      <div v-if="faqList.length === 0">자주 묻는 질문이 없습니다.</div>
      <div v-for="(faq, idx) in faqList" :key="idx" class="faq-accordion">
        <div class="faq-item" @click="toggleFaq(idx)" :class="{active: openFaqIdx === idx}">
          <span class="faq-q">Q.</span> {{ faq.q }}
          <span class="faq-arrow" :class="{open: openFaqIdx === idx}">▼</span>
        </div>
        <transition name="faq-slide">
          <div v-if="openFaqIdx === idx" class="faq-item faq-answer">
            <span class="faq-a">A.</span> {{ faq.a }}
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface FaqItem {
  q: string;
  a: string;
}

const faqList = ref<FaqItem[]>([])
const openFaqIdx = ref<number|null>(null)

function toggleFaq(idx: number) {
  openFaqIdx.value = openFaqIdx.value === idx ? null : idx
}

onMounted(async () => {
  try {
    const res = await fetch('/faq.json')
    if (res.ok) {
      faqList.value = await res.json()
    }
  } catch (e) {
    faqList.value = []
  }
})
</script>
