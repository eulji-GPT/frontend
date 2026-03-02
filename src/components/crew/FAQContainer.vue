<template>
  <div class="faq-container" ref="faqContainer">
    <!-- Dynamic background elements -->
    <div class="background-elements">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>
    
    <div class="notes-section" ref="notesSection">
      <span class="section-title animated-title" ref="notesTitleRef">
        <span v-for="(char, index) in notesTitleChars" :key="index" 
              class="title-char" :style="{ animationDelay: `${index * 0.05}s` }">
          {{ char }}
        </span>
      </span>
      <span class="notes-text" ref="notesTextRef">
        모든 팀은 협업 툴(예: Slack, Notion, Figma, Git 등)을 통해 원활히 소통합니다.<br/>
        익숙하지 않아도 팀에서 함께 배워갈 수 있도록 도와드려요!<br/>
        프로젝트는 실제 운영을 중심으로 하는 만큼, 일정에 대한 책임감을 가지고 임해주시면 감사해요.<br/>
        디자인 및 개발 경험이 부족하더라도 '배우고자 하는 의지'가 있다면 누구나 환영합니다.<br/>
        특히 서포터팀은 그런 분들을 위한 시작점이에요. ✿
      </span>
    </div>
    
    <div class="faq-section" ref="faqSection">
      <span class="section-title animated-title" ref="faqTitleRef">
        <span v-for="(char, index) in faqTitleChars" :key="index" 
              class="title-char" :style="{ animationDelay: `${index * 0.05}s` }">
          {{ char }}
        </span>
      </span>
      <div class="faq-list" ref="faqListRef">
        <div 
          class="faq-card interactive-card" 
          :class="{ expanded: expandedItems.includes(0) }"
          ref="el => faqCards[0] = el"
          @mouseenter="onCardHover(0, $event)"
          @mouseleave="onCardLeave(0)"
        >
          <div class="question-row" @click="toggleItem(0)">
            <div class="question-content">
              <span class="q-label pulse-text">Q.</span>
              <span class="question-text">지원할 때 포트폴리오나 경험이 필요한가요?</span>
            </div>
            <div class="icon-container">
              <img 
                src="@/assets/FaqSection/icn_under_^.svg" 
                alt="icon" 
                class="expand-icon" 
                :class="{ rotated: expandedItems.includes(0) }"
              />
              <div class="icon-glow"></div>
            </div>
          </div>
          <div class="answer-row" v-show="expandedItems.includes(0)">
            <span class="a-label pulse-text">A.</span>
            <span class="answer-text">
              전혀 필요하지 않아요! 경험보다는 열정과 배우려는 의지를 중요하게 생각합니다. 모든 것을 팀에서 함께 배워갈 수 있도록 지원해드려요.
            </span>
          </div>
          <div class="card-glow"></div>
        </div>
        
        <div 
          class="faq-card interactive-card" 
          :class="{ expanded: expandedItems.includes(1) }"
          ref="el => faqCards[1] = el"
          @mouseenter="onCardHover(1, $event)"
          @mouseleave="onCardLeave(1)"
        >
          <div class="question-row" @click="toggleItem(1)">
            <div class="question-content">
              <span class="q-label pulse-text">Q.</span>
              <span class="question-text">시간 투자는 얼마나 해야 하나요?</span>
            </div>
            <div class="icon-container">
              <img 
                src="@/assets/FaqSection/icn_under_^.svg" 
                alt="icon" 
                class="expand-icon" 
                :class="{ rotated: expandedItems.includes(1) }"
              />
              <div class="icon-glow"></div>
            </div>
          </div>
          <div class="answer-row" v-show="expandedItems.includes(1)">
            <span class="a-label pulse-text">A.</span>
            <span class="answer-text">
              개인의 상황에 맞춰 유연하게 조정 가능해요. 중요한 건 일정에 대한 책임감과 팀과의 소통입니다. 주 5~10시간 정도 투자하시면 충분해요.
            </span>
          </div>
          <div class="card-glow"></div>
        </div>
        
        <div 
          class="faq-card interactive-card" 
          :class="{ expanded: expandedItems.includes(2) }"
          ref="el => faqCards[2] = el"
          @mouseenter="onCardHover(2, $event)"
          @mouseleave="onCardLeave(2)"
        >
          <div class="question-row" @click="toggleItem(2)">
            <div class="question-content">
              <span class="q-label pulse-text">Q.</span>
              <span class="question-text">협업 툴을 처음 사용하는데 괜찮을까요?</span>
            </div>
            <div class="icon-container">
              <img 
                src="@/assets/FaqSection/icn_under_^.svg" 
                alt="icon" 
                class="expand-icon" 
                :class="{ rotated: expandedItems.includes(2) }"
              />
              <div class="icon-glow"></div>
            </div>
          </div>
          <div class="answer-row" v-show="expandedItems.includes(2)">
            <span class="a-label pulse-text">A.</span>
            <span class="answer-text">
              물론이에요! Slack, Notion, Figma, Git 등의 툴 사용법을 팀에서 친절하게 알려드립니다. 함께 배워가는 것도 성장의 일부라고 생각해요.
            </span>
          </div>
          <div class="card-glow"></div>
        </div>
        
        <div 
          class="faq-card interactive-card" 
          :class="{ expanded: expandedItems.includes(3) }"
          ref="el => faqCards[3] = el"
          @mouseenter="onCardHover(3, $event)"
          @mouseleave="onCardLeave(3)"
        >
          <div class="question-row" @click="toggleItem(3)">
            <div class="question-content">
              <span class="q-label pulse-text">Q.</span>
              <span class="question-text">Parrot 팀은 구체적으로 어떤 일을 하나요?</span>
            </div>
            <div class="icon-container">
              <img 
                src="@/assets/FaqSection/icn_under_^.svg" 
                alt="icon" 
                class="expand-icon" 
                :class="{ rotated: expandedItems.includes(3) }"
              />
              <div class="icon-glow"></div>
            </div>
          </div>
          <div class="answer-row" v-show="expandedItems.includes(3)">
            <span class="a-label pulse-text">A.</span>
            <span class="answer-text">
              프로젝트 전반을 관찰하면서 자신에게 맞는 분야를 찾아가는 팀이에요. 점차 관심 있는 팀에 합류하며 실무 경험을 쌓을 수 있습니다.
            </span>
          </div>
          <div class="card-glow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const faqContainer = ref<HTMLElement>()
const notesSection = ref<HTMLElement>()
const faqSection = ref<HTMLElement>()
const notesTitleRef = ref<HTMLElement>()
const faqTitleRef = ref<HTMLElement>()
const notesTextRef = ref<HTMLElement>()
const faqListRef = ref<HTMLElement>()
const faqCards = ref<HTMLElement[]>([])

const expandedItems = ref<number[]>([])

// IntersectionObserver 인스턴스 (cleanup을 위해 컴포넌트 스코프에 저장)
let scrollObserver: IntersectionObserver | null = null

// Animated title characters
const notesTitleChars = '지원 시 참고사항'.split('')
const faqTitleChars = '자주 묻는 질문'.split('')

const toggleItem = (index: number) => {
  const itemIndex = expandedItems.value.indexOf(index)
  if (itemIndex > -1) {
    expandedItems.value.splice(itemIndex, 1)
  } else {
    expandedItems.value.push(index)
  }
  
  // Add vibration effect on toggle
  if (faqCards.value[index]) {
    faqCards.value[index].style.animation = 'cardPulse 0.3s ease-out'
    setTimeout(() => {
      if (faqCards.value[index]) {
        faqCards.value[index].style.animation = ''
      }
    }, 300)
  }
}

const onCardHover = (index: number, event: MouseEvent) => {
  const card = faqCards.value[index]
  if (!card) return
  
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Update glow position
  const glow = card.querySelector('.card-glow') as HTMLElement
  if (glow) {
    glow.style.left = `${x}px`
    glow.style.top = `${y}px`
    glow.style.opacity = '0.6'
  }
  
  // Add hover transform
  card.style.transform = 'translateY(-8px) scale(1.02)'
  card.style.boxShadow = '0 25px 50px rgba(71, 137, 238, 0.2)'
}

const onCardLeave = (index: number) => {
  const card = faqCards.value[index]
  if (!card) return
  
  const glow = card.querySelector('.card-glow') as HTMLElement
  if (glow) {
    glow.style.opacity = '0'
  }
  
  card.style.transform = 'translateY(0) scale(1)'
  card.style.boxShadow = 'none'
}

const setupScrollAnimations = () => {
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, { threshold: 0.1 })

  // Observe elements for scroll animations
  if (notesSection.value) scrollObserver.observe(notesSection.value)
  if (faqSection.value) scrollObserver.observe(faqSection.value)

  faqCards.value.forEach((card, index) => {
    if (card) {
      card.style.animationDelay = `${index * 0.1}s`
      scrollObserver?.observe(card)
    }
  })
}

onMounted(() => {
  nextTick(() => {
    setupScrollAnimations()
  })
})

onUnmounted(() => {
  // IntersectionObserver cleanup (메모리 누수 방지)
  if (scrollObserver) {
    scrollObserver.disconnect()
    scrollObserver = null
  }
})
</script>

<style scoped>
.faq-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 160px;
  width: 1080px;
  max-width: 1080px;
  margin: 0 auto;
  box-sizing: border-box;
  background: transparent;
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

/* Dynamic Background Elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(71, 137, 238, 0.1), rgba(102, 92, 237, 0.1));
  filter: blur(60px);
  animation: floatOrb 8s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: -5%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: -5%;
  animation-delay: 3s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  top: 80%;
  left: 50%;
  animation-delay: 6s;
}


/* Animated Titles */
.animated-title {
  display: inline-block;
  overflow: hidden;
}

.title-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(50px) rotateX(90deg);
  animation: charReveal 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

/* Interactive Cards */
.interactive-card {
  position: relative;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  backdrop-filter: blur(10px);
  overflow: hidden;
  cursor: pointer;
}

.interactive-card:hover {
  border-color: rgba(71, 137, 238, 0.5) !important;
}

.card-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(71, 137, 238, 0.3), transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.pulse-text {
  animation: textPulse 2s ease-in-out infinite;
}

.icon-container {
  position: relative;
  display: inline-block;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(71, 137, 238, 0.4), transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
}

.expand-icon:hover + .icon-glow,
.icon-container:hover .icon-glow {
  opacity: 0.8;
}

/* Animation Keyframes */
@keyframes floatOrb {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(30px, -20px) rotate(90deg) scale(1.1);
  }
  50% {
    transform: translate(-20px, -40px) rotate(180deg) scale(0.9);
  }
  75% {
    transform: translate(-40px, 20px) rotate(270deg) scale(1.05);
  }
}


@keyframes charReveal {
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

@keyframes textPulse {
  0%, 100% {
    color: rgb(71, 137, 238);
    text-shadow: 0 0 5px rgba(71, 137, 238, 0.5);
  }
  50% {
    color: rgb(102, 92, 237);
    text-shadow: 0 0 10px rgba(102, 92, 237, 0.8);
  }
}

@keyframes cardPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Scroll-triggered animations */
.animate-in {
  animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.notes-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.section-title {
  color: rgb(240, 246, 255);
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: left;
  width: 100%;
}

.notes-text {
  color: white;
  text-overflow: ellipsis;
  font-size: 20px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  width: 100%;
}

.faq-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 60px;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  position: relative;
  z-index: 1;
}

.faq-section .section-title {
  color: white;
}

.faq-list {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  width: 100%;
  box-sizing: border-box;
}

.faq-card {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

.faq-card:hover {
  border-color: rgba(71, 137, 238, 0.3);
  background: transparent;
}

.faq-card.expanded {
  border-color: rgba(71, 137, 238, 0.5);
  background: transparent;
}

.question-row {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-row:hover {
  background: transparent;
}

.question-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  box-sizing: border-box;
}

.q-label {
  color: white;
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
}

.question-text {
  color: white;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
}

.expand-icon {
  width: 40px;
  height: 40px;
  object-fit: cover;
  transition: transform 0.3s ease;
  transform: rotate(0deg);
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.answer-row {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 30px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
  animation: slideDown 0.3s ease-out;
  background: transparent;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.a-label {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 150%;
  text-align: center;
  flex-shrink: 0;
}

.answer-text {
  color: white;
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  flex: 1;
}

@media (max-width: 768px) {
  .faq-container {
    width: 100%;
    padding: 60px 20px;
    gap: 60px;
  }

  .notes-section {
    gap: 24px;
  }

  .section-title {
    font-size: 28px;
  }

  .notes-text {
    font-size: 15px;
    line-height: 26px;
  }

  .faq-section {
    gap: 40px;
  }

  .faq-list {
    gap: 20px;
  }

  .faq-card {
    border-radius: 12px;
  }

  .question-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 16px;
  }

  .question-content {
    gap: 12px;
    flex: 1;
  }

  .q-label {
    font-size: 24px;
  }

  .question-text {
    font-size: 16px;
    text-align: left;
  }

  .expand-icon {
    width: 28px;
    height: 28px;
  }

  .answer-row {
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
    padding: 0 16px 16px 16px;
  }

  .a-label {
    font-size: 24px;
  }

  .answer-text {
    font-size: 15px;
    line-height: 24px;
  }

  .floating-orb {
    display: none;
  }
}

@media (max-width: 480px) {
  .faq-container {
    padding: 40px 16px;
    gap: 40px;
  }

  .section-title {
    font-size: 24px;
  }

  .notes-text {
    font-size: 14px;
    line-height: 24px;
  }

  .question-row {
    padding: 14px;
  }

  .question-content {
    gap: 10px;
  }

  .q-label,
  .a-label {
    font-size: 20px;
  }

  .question-text {
    font-size: 15px;
  }

  .expand-icon {
    width: 24px;
    height: 24px;
  }

  .answer-row {
    gap: 10px;
    padding: 0 14px 14px 14px;
  }

  .answer-text {
    font-size: 14px;
    line-height: 22px;
  }
}
</style>