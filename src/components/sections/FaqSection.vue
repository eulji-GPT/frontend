<template>
  <div class="frame" id="faq">
    <div class="text-wrapper-4">자주 묻는 질문</div>
    <div class="div-2">
      <div v-if="faqList.length === 0" class="faq-empty">자주 묻는 질문이 없습니다.</div>
      <div v-for="(faq, idx) in faqList" :key="idx" class="faq-row">
        <div class="faq-question-row" @click="toggleFaq(idx)">
          <span class="faq-q-label">Q.</span>
          <span class="faq-q-text">{{ faq.q }}</span>
          <span class="faq-arrow-btn">
            <span :class="['faq-arrow-icon', {open: openFaqIdx === idx}]">▼</span>
          </span>
        </div>
        <transition name="faq-slide">
          <div v-if="openFaqIdx === idx" class="faq-answer-wrapper">
            <div class="faq-answer-card">
              <span class="faq-a-label">A.</span>
              <span class="faq-a-text">{{ faq.a }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
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
  padding: 100px 40px;
  position: relative;
  width: 100%;
  max-width: 1066px;
  margin: 0 auto;
  box-sizing: border-box;
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
  padding: 24px 0;
  cursor: pointer;
  gap: 18px;
  transition: background-color 0.2s ease;
}

.faq-question-row:hover {
  background-color: #f9fafb;
  margin: 0 -40px;
  padding-left: 40px;
  padding-right: 40px;
}

.faq-q-label {
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  margin-right: 2px;
  flex-shrink: 0;
}

.faq-q-text {
  font-size: 1.35rem;
  font-weight: 600;
  color: #111;
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
  color: #888;
  transition: transform 0.3s ease, color 0.2s ease;
  display: inline-block;
}

.faq-arrow-icon.open {
  transform: rotate(180deg);
  color: #222;
}

.faq-answer-wrapper {
  width: 100%;
  padding-bottom: 24px;
}

.faq-answer-card {
  width: 100%;
  background: #f7f9fb;
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 32px 48px;
  box-sizing: border-box;
}

.faq-a-label {
  font-size: 2rem;
  font-weight: 700;
  color: #294a8d;
  flex-shrink: 0;
}

.faq-a-text {
  font-size: 1.35rem;
  font-weight: 500;
  color: #222;
  line-height: 1.6;
  flex: 1;
}

/* 자연스러운 FAQ 슬라이드 트랜지션 */
.faq-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.faq-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.faq-slide-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.faq-slide-enter-to {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0);
}

.faq-slide-leave-from {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0);
}

.faq-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.faq-empty {
  color: #aaa;
  font-size: 1.1rem;
  font-weight: 400;
  padding: 2rem 0;
  text-align: center;
}

/* 반응형 디자인 */
@media (max-width: 1106px) {
  .frame {
    padding: 80px 30px;
  }
  
  .faq-question-row:hover {
    margin: 0 -30px;
    padding-left: 30px;
    padding-right: 30px;
  }
  
  .faq-answer-card {
    padding: 28px 36px;
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
  
  .faq-question-row:hover {
    margin: 0 -20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .faq-q-label {
    font-size: 1.6rem;
  }
  
  .faq-q-text {
    font-size: 1.1rem;
  }
  
  .faq-answer-card {
    padding: 24px 28px;
    gap: 12px;
  }
  
  .faq-a-label {
    font-size: 1.6rem;
  }
  
  .faq-a-text {
    font-size: 1.1rem;
  }
  
  .faq-answer-wrapper {
    padding-bottom: 20px;
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
  
  .faq-question-row:hover {
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .faq-q-label {
    font-size: 1.4rem;
  }
  
  .faq-q-text {
    font-size: 1rem;
  }
  
  .faq-answer-card {
    padding: 20px 24px;
    gap: 10px;
  }
  
  .faq-a-label {
    font-size: 1.4rem;
  }
  
  .faq-a-text {
    font-size: 1rem;
  }
}
</style>