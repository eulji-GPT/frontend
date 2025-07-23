<template>
  <div class="frame">
    <div class="text-wrapper-4">자주 묻는 질문</div>
    <div class="div-2">
      <div v-if="faqList.length === 0" class="faq-empty">자주 묻는 질문이 없습니다.</div>
      <div v-for="(faq, idx) in faqList" :key="idx" class="faq-row">
        <div class="faq-question-row" @click="toggleFaq(idx)">
          <span class="faq-q-svg"><img :src="q" alt="Q" /></span>
          <span class="faq-q-label">Q.</span>
          <span class="faq-q-text">{{ faq.q }}</span>
          <span class="faq-arrow-btn">
            <span :class="['faq-arrow-icon', {open: openFaqIdx === idx}]">&#x25BC;</span>
          </span>
        </div>
        <transition name="faq-slide">
          <div v-if="openFaqIdx === idx" class="faq-answer-card">
            <span class="faq-a-label">A.</span>
            <span class="faq-a-text">{{ faq.a }}</span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import q from '../../assets/Q.svg'
import vector2 from '../../assets/Q.svg' // 임시로 Q.svg 사용, 실제 vector2.svg로 교체 가능

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
    // 개발용 더미 데이터
    faqList.value = [
      {
        q: '울지피티가 뭔가요?',
        a: '울지피티는 울지대학교 AI 대화형 서비스 입니다.'
      },
      {
        q: '울지피티가 뭔가요?',
        a: '울지피티는 AI 기반 대화형 서비스로, 다양한 질문에 답변해드립니다.'
      },
      {
        q: '울지피티가 뭔가요?',
        a: '학습과 업무에 도움을 주는 AI 어시스턴트입니다.'
      },
      {
        q: '울지피티가 뭔가요?',
        a: '24시간 언제든지 이용 가능한 AI 서비스입니다.'
      },
      {
        q: '울지피티가 뭔가요?',
        a: '사용자의 다양한 요청에 실시간으로 응답하는 서비스입니다.'
      }
    ]
  }
})
</script>

<style scoped>
.frame {
  align-items: flex-start;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: 600px;
  padding: 100px 0;
  position: relative;
  width: 1066px;
  max-width: 1066px;
  min-width: 1066px;
  margin: 0 auto;
}

.text-wrapper-4 {
  align-self: stretch;
  color: #222;
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
  border-bottom: 1px solid #eee;
  margin-bottom: 0;
}
.faq-question-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px 0 24px 0;
  cursor: pointer;
  gap: 18px;
}
.faq-q-svg {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.faq-q-label {
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  margin-right: 2px;
}
.faq-q-text {
  font-size: 1.35rem;
  font-weight: 600;
  color: #111;
  flex: 1;
}
.faq-arrow-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.faq-arrow-icon {
  font-size: 2rem;
  color: #888;
  transition: transform 0.2s;
  display: inline-block;
}
.faq-arrow-icon.open {
  transform: rotate(180deg);
  color: #222;
}
.faq-answer-card {
  width: 100%;
  background: #f7f9fb;
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 32px 48px;
  margin: 0 0 24px 0;
  box-sizing: border-box;
  min-width: 1066px;
  max-width: 1066px;
}
.faq-a-label {
  font-size: 2rem;
  font-weight: 700;
  color: #294a8d;
  margin-right: 8px;
  flex-shrink: 0;
}
.faq-a-text {
  font-size: 1.35rem;
  font-weight: 500;
  color: #222;
  line-height: 1.6;
}
.faq-slide-enter-active, .faq-slide-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}
.faq-slide-enter-from, .faq-slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}
.faq-slide-enter-to, .faq-slide-leave-from {
  max-height: 300px;
  opacity: 1;
  margin-top: 12px;
}

.frame-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.div-4 {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #f7f9fb;
  border-radius: 12px;
  padding: 24px 40px;
  min-width: 400px;
  max-width: 900px;
}

.meteor-icons-chevron {
  display: flex;
  align-items: center;
}

.text-wrapper-3 {
  color: #222;
  font-size: 1.1rem;
  font-weight: 400;
}

.faq-empty {
  color: #aaa;
  font-size: 1.1rem;
  font-weight: 400;
  padding: 2rem 0;
}
</style>

