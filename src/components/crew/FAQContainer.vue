<template>
  <div class="faq-container">
    <div class="notes-section">
      <span class="section-title">지원 시 참고사항</span>
      <span class="notes-text">
        모든 팀은 협업 툴(예: Slack, Notion, Figma, Git 등)을 통해 원활히 소통합니다.<br/>
        익숙하지 않아도 팀에서 함께 배워갈 수 있도록 도와드려요!<br/>
        프로젝트는 실제 운영을 중심으로 하는 만큼, 일정에 대한 책임감을 가지고 임해주시면 감사해요.<br/>
        디자인 및 개발 경험이 부족하더라도 '배우고자 하는 의지'가 있다면 누구나 환영합니다.<br/>
        특히 서포터팀은 그런 분들을 위한 시작점이에요. ✿
      </span>
    </div>
    
    <div class="faq-section">
      <span class="section-title">자주 묻는 질문</span>
      <div class="faq-list">
        <div class="faq-card" :class="{ expanded: expandedItems.includes(0) }">
          <div class="question-row" @click="toggleItem(0)">
            <div class="question-content">
              <span class="q-label">Q.</span>
              <span class="question-text">지원할 때 포트폴리오나 경험이 필요한가요?</span>
            </div>
            <img 
              src="/home/ubuntu_euphoria/eulGPT/frontend/src/components/chat/icon/mulmum.svg" 
              alt="icon" 
              class="expand-icon" 
              :class="{ rotated: expandedItems.includes(0) }"
            />
          </div>
          <div class="answer-row" v-show="expandedItems.includes(0)">
            <span class="a-label">A.</span>
            <span class="answer-text">
              전혀 필요하지 않아요! 경험보다는 열정과 배우려는 의지를 중요하게 생각합니다. 모든 것을 팀에서 함께 배워갈 수 있도록 지원해드려요.
            </span>
          </div>
        </div>
        
        <div class="faq-card" :class="{ expanded: expandedItems.includes(1) }">
          <div class="question-row" @click="toggleItem(1)">
            <div class="question-content">
              <span class="q-label">Q.</span>
              <span class="question-text">시간 투자는 얼마나 해야 하나요?</span>
            </div>
            <img 
              src="/home/ubuntu_euphoria/eulGPT/frontend/src/components/chat/icon/mulmum.svg" 
              alt="icon" 
              class="expand-icon" 
              :class="{ rotated: expandedItems.includes(1) }"
            />
          </div>
          <div class="answer-row" v-show="expandedItems.includes(1)">
            <span class="a-label">A.</span>
            <span class="answer-text">
              개인의 상황에 맞춰 유연하게 조정 가능해요. 중요한 건 일정에 대한 책임감과 팀과의 소통입니다. 주 5~10시간 정도 투자하시면 충분해요.
            </span>
          </div>
        </div>
        
        <div class="faq-card" :class="{ expanded: expandedItems.includes(2) }">
          <div class="question-row" @click="toggleItem(2)">
            <div class="question-content">
              <span class="q-label">Q.</span>
              <span class="question-text">협업 툴을 처음 사용하는데 괜찮을까요?</span>
            </div>
            <img 
              src="/home/ubuntu_euphoria/eulGPT/frontend/src/components/chat/icon/mulmum.svg" 
              alt="icon" 
              class="expand-icon" 
              :class="{ rotated: expandedItems.includes(2) }"
            />
          </div>
          <div class="answer-row" v-show="expandedItems.includes(2)">
            <span class="a-label">A.</span>
            <span class="answer-text">
              물론이에요! Slack, Notion, Figma, Git 등의 툴 사용법을 팀에서 친절하게 알려드립니다. 함께 배워가는 것도 성장의 일부라고 생각해요.
            </span>
          </div>
        </div>
        
        <div class="faq-card" :class="{ expanded: expandedItems.includes(3) }">
          <div class="question-row" @click="toggleItem(3)">
            <div class="question-content">
              <span class="q-label">Q.</span>
              <span class="question-text">Support 팀은 구체적으로 어떤 일을 하나요?</span>
            </div>
            <img 
              src="/home/ubuntu_euphoria/eulGPT/frontend/src/components/chat/icon/mulmum.svg" 
              alt="icon" 
              class="expand-icon" 
              :class="{ rotated: expandedItems.includes(3) }"
            />
          </div>
          <div class="answer-row" v-show="expandedItems.includes(3)">
            <span class="a-label">A.</span>
            <span class="answer-text">
              프로젝트 전반을 관찰하면서 자신에게 맞는 분야를 찾아가는 팀이에요. 점차 관심 있는 팀에 합류하며 실무 경험을 쌓을 수 있습니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const expandedItems = ref<number[]>([])

const toggleItem = (index: number) => {
  const itemIndex = expandedItems.value.indexOf(index)
  if (itemIndex > -1) {
    expandedItems.value.splice(itemIndex, 1)
  } else {
    expandedItems.value.push(index)
  }
}
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
}

.notes-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  box-sizing: border-box;
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
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s ease;
  overflow: hidden;
}

.faq-card:hover {
  border-color: rgba(71, 137, 238, 0.3);
  background: rgba(71, 137, 238, 0.05);
}

.faq-card.expanded {
  border-color: rgba(71, 137, 238, 0.5);
  background: rgba(71, 137, 238, 0.08);
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
  background: rgba(255, 255, 255, 0.05);
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
  background: rgba(255, 255, 255, 0.02);
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
    padding: 40px 20px;
    gap: 80px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .notes-text {
    font-size: 16px;
    line-height: 28px;
  }
  
  .question-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
  }
  
  .question-content {
    gap: 15px;
  }
  
  .q-label {
    font-size: 24px;
  }
  
  .question-text {
    font-size: 18px;
  }
  
  .expand-icon {
    width: 30px;
    height: 30px;
  }
  
  .answer-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
  }
  
  .a-label {
    font-size: 24px;
  }
  
  .answer-text {
    font-size: 16px;
    line-height: 24px;
  }
}
</style>