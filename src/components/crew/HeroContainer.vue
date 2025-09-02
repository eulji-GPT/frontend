<template>
  <div class="hero-container" ref="heroContainer">
    <div class="hero-main">
      <span class="eulgpt-title" ref="titleRef">
        <span v-for="(letter, index) in titleLetters" :key="index" 
              class="letter" :style="{ animationDelay: `${index * 0.1}s` }">
          {{ letter }}
        </span>
      </span>
      <div class="team-recruit-section" ref="recruitSection">
        <span class="team-recruit-text typing-text" ref="typingText">팀원 모집</span>
        <img src="@/components/crew/img/Group 48097214.svg" alt="icon" class="team-icon rotating-icon" ref="iconRef"/>
      </div>
    </div>
    <div class="buttons-container" ref="buttonsRef">
      <div class="apply-button interactive-button" @mousemove="onButtonHover" @mouseleave="onButtonLeave">
        <span class="button-text">지원하기</span>
        <div class="button-glow"></div>
      </div>
      <div class="explore-button interactive-button" @mousemove="onButtonHover" @mouseleave="onButtonLeave">
        <span class="button-text">둘러보기</span>
        <div class="button-glow"></div>
      </div>
    </div>
    
    <!-- Floating geometric shapes -->
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const heroContainer = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const recruitSection = ref<HTMLElement>()
const typingText = ref<HTMLElement>()
const iconRef = ref<HTMLElement>()
const buttonsRef = ref<HTMLElement>()

const titleLetters = 'EULGPT'.split('')

const onButtonHover = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const glow = button.querySelector('.button-glow') as HTMLElement
  if (glow) {
    glow.style.left = `${x}px`
    glow.style.top = `${y}px`
    glow.style.opacity = '1'
  }
}

const onButtonLeave = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const glow = button.querySelector('.button-glow') as HTMLElement
  if (glow) {
    glow.style.opacity = '0'
  }
}

const startTypingAnimation = () => {
  if (!typingText.value) return
  
  const text = '팀원 모집'
  let currentIndex = 0
  typingText.value.textContent = ''
  
  const typeInterval = setInterval(() => {
    if (currentIndex < text.length) {
      typingText.value!.textContent += text[currentIndex]
      currentIndex++
    } else {
      clearInterval(typeInterval)
      if (iconRef.value) {
        iconRef.value.style.opacity = '1'
        iconRef.value.style.transform = 'scale(1) rotate(0deg)'
      }
    }
  }, 150)
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      startTypingAnimation()
    }, 1000)
  })
})
</script>

<style scoped>
.hero-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 80px;
  box-sizing: border-box;
  padding: 60px 40px;
  background: transparent;
  margin-left: 180px;
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.hero-main {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  gap: 20px;
  width: 571px;
  box-sizing: border-box;
  background: transparent;
  z-index: 2;
}

.eulgpt-title {
  color: white;
  text-overflow: ellipsis;
  font-size: 145px;
  font-family: Poppins, sans-serif;
  font-weight: 700;
  text-align: left;
  min-height: 103px;
  align-self: stretch;
  flex-shrink: 0;
  display: flex;
  overflow: hidden;
}

.letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(100px) rotateX(90deg);
  animation: letterDrop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.team-recruit-section {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
  gap: 15px;
}

.typing-text {
  color: rgb(71, 137, 238);
  text-overflow: ellipsis;
  font-size: 64px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 90px;
  text-align: left;
  position: relative;
}

.typing-text::after {
  content: '|';
  animation: blink 1s infinite;
  margin-left: 2px;
}

.rotating-icon {
  width: 21px;
  height: 21px;
  object-fit: cover;
  opacity: 0;
  transform: scale(0) rotate(180deg);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.buttons-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 50px;
  box-sizing: border-box;
  background: transparent;
  z-index: 2;
}

.interactive-button {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  border-radius: 68px;
  width: 220px;
  background: rgba(2, 71, 138, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(71, 137, 238, 0.2);
  box-sizing: border-box;
  padding: 14px 77px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(71, 137, 238, 0.1);
}

.interactive-button:hover {
  background: rgba(71, 137, 238, 0.15);
  border-color: rgba(71, 137, 238, 0.4);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(71, 137, 238, 0.25);
}

.button-glow {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(71, 137, 238, 0.4), transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.button-text {
  color: white;
  text-overflow: ellipsis;
  font-size: 32px;
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  line-height: 140%;
  text-align: left;
  position: relative;
  z-index: 1;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(71, 137, 238, 0.1), rgba(102, 92, 237, 0.1));
  animation: floatShapes 8s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 70%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 80%;
  animation-delay: 2s;
}

.shape-3 {
  width: 40px;
  height: 40px;
  top: 10%;
  left: 85%;
  animation-delay: 4s;
  border-radius: 20%;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 70%;
  left: 10%;
  animation-delay: 6s;
  border-radius: 30%;
}

@keyframes letterDrop {
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes floatShapes {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(-10px, -20px) rotate(180deg);
  }
  75% {
    transform: translate(-30px, 10px) rotate(270deg);
  }
}

@media (max-width: 768px) {
  .hero-container {
    margin-left: 0;
    padding: 40px 20px;
    align-items: center;
  }
  
  .hero-main {
    width: 100%;
    max-width: 571px;
    align-items: center;
  }
  
  .eulgpt-title {
    font-size: 100px;
  }
  
  .typing-text {
    font-size: 48px;
  }
  
  .buttons-container {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  
  .interactive-button {
    width: 200px;
  }
  
  .button-text {
    font-size: 24px;
  }
  
  .floating-shapes {
    display: none;
  }
}
</style>