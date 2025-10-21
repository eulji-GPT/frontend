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
        <div class="asterisk-icon">
          <div class="asterisk-bar asterisk-bar-1"></div>
          <div class="asterisk-bar asterisk-bar-2"></div>
        </div>
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

    <!-- Orbital graphics with glowing X -->
    <div class="orbital-graphics">
      <!-- Central X (non-rotating) -->
      <div class="orbital-center">
        <img src="@/components/crew/img/a1383640386a4468f3aafbd85f25d782ba898213.png" alt="Glowing X" class="glowing-x glowing-x-blur" />
        <img src="@/components/crew/img/a1383640386a4468f3aafbd85f25d782ba898213.png" alt="Glowing X" class="glowing-x glowing-x-sharp" />
      </div>
      <!-- Blue gradient ellipses around center (non-rotating) -->
      <img src="@/components/crew/img/25a43ac12a8d753b067a4c4069a3f3341b2d58f6.svg" alt="" class="orbital-ellipse ellipse-1" />
      <img src="@/components/crew/img/dc7b486bfbbe722d0e80300ae0204de2ed66dedc.svg" alt="" class="orbital-ellipse ellipse-2" />

      <!-- Rotating orbital container -->
      <div class="orbit-rotation-container">
        <img src="@/components/crew/img/f663413e85514dd24d4819857a1b49b20eb547c0.svg" alt="Orbital ring" class="orbital-ring orbital-ring-1" />
        <img src="@/components/crew/img/5cda7af5cc885470a0642ad0b337664fdaac6c1c.svg" alt="Orbital ring" class="orbital-ring orbital-ring-2" />
        <!-- Blue dots fixed on orbital paths -->
        <img src="@/components/crew/img/4d6e604a8ebfdbe0dd5075eee8e8976b3ce46760.svg" alt="" class="orbital-dot dot-1" />
        <img src="@/components/crew/img/4d6e604a8ebfdbe0dd5075eee8e8976b3ce46760.svg" alt="" class="orbital-dot dot-2" />
        <img src="@/components/crew/img/f2050756aa70caf5c98711fd9d2dcbe64525dba7.svg" alt="" class="orbital-dot dot-3" />
        <img src="@/components/crew/img/d29d3c3543fd8f5da994a9cbd2e6d84abd3fb801.svg" alt="" class="orbital-dot dot-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const heroContainer = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const recruitSection = ref<HTMLElement>()
const typingText = ref<HTMLElement>()
const buttonsRef = ref<HTMLElement>()

const titleLetters = 'EULGPT '.split('') // Note the space after T

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
  gap: 50px;
  box-sizing: border-box;
  padding: 148px 0 100px 180px;
  background: transparent;
  position: relative;
  overflow: visible;
  width: 100%;
  min-height: 700px;
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
  overflow: visible;
}

.eulgpt-title {
  color: white;
  text-overflow: ellipsis;
  font-size: 145px;
  font-family: Poppins, sans-serif;
  font-weight: 700;
  text-align: left;
  line-height: 1.2;
  letter-spacing: 2.9px;
  min-height: 145px;
  align-self: stretch;
  flex-shrink: 0;
  display: flex;
  overflow: visible;
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
  align-items: flex-start;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
  gap: 0;
  position: relative;
  width: 247px;
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
  white-space: nowrap;
}

.typing-text::after {
  content: '|';
  animation: blink 1s infinite;
  margin-left: 2px;
}

/* Asterisk icon (two bars forming X) */
.asterisk-icon {
  position: relative;
  width: 18px;
  height: 18px;
  margin-left: 5px;
  margin-top: 5px;
}

.asterisk-bar {
  position: absolute;
  background-color: #4789EE;
  width: 6px;
  height: 20.73px;
  left: 50%;
  top: 50%;
}

.asterisk-bar-1 {
  transform: translate(-50%, -50%) rotate(30deg);
}

.asterisk-bar-2 {
  transform: translate(-50%, -50%) rotate(120deg);
}

.buttons-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 20px;
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
  border: none;
  box-sizing: border-box;
  padding: 14px 77px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
}

.interactive-button:hover {
  background: rgba(2, 71, 138, 0.2);
  transform: translateY(-2px);
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
  white-space: nowrap;
}

/* Orbital Graphics */
.orbital-graphics {
  position: absolute;
  right: -200px;
  top: -50px;
  width: 900px;
  height: 700px;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

/* Rotation container for orbits and dots */
.orbit-rotation-container {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: rotateOrbitY 60s linear infinite;
}

.orbital-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  object-fit: contain;
}

.orbital-ring-1 {
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.orbital-ring-2 {
  width: 85%;
  height: 85%;
  transform: translate(-50%, -50%) rotate(15deg);
}

.orbital-center {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, -50%);
  animation: pulse 3s ease-in-out infinite;
}

.glowing-x {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: rotate(-12.015deg);
}

.glowing-x-blur {
  filter: blur(2.5px);
  opacity: 0.8;
}

.glowing-x-sharp {
  left: 0;
  top: 0;
  filter: none;
}

.orbital-ellipse {
  position: absolute;
  object-fit: contain;
  left: 50%;
  top: 50%;
}

.ellipse-1 {
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%) rotate(2.53deg);
  opacity: 0.6;
}

.ellipse-2 {
  width: 220px;
  height: 220px;
  transform: translate(-50%, -50%) rotate(-3.464deg);
  opacity: 0.5;
}

.orbital-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  object-fit: contain;
  animation: pulseDot 2s ease-in-out infinite;
  transform: translate(-50%, -50%);
}

/* 점들을 궤도 타원 라인 위에 정확히 배치 */
.dot-1 {
  /* 우측 (궤도 라인 위) */
  left: 85%;
  top: 50%;
}

.dot-2 {
  /* 하단 (궤도 라인 위) */
  left: 50%;
  top: 85%;
}

.dot-3 {
  /* 좌측 (궤도 라인 위) */
  left: 15%;
  top: 50%;
}

.dot-4 {
  /* 상단 (궤도 라인 위) */
  left: 50%;
  top: 15%;
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

@keyframes pulseDot {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

@keyframes rotateOrbitY {
  from {
    transform: translate(-50%, -50%) rotateX(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotateX(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@media (max-width: 768px) {
  .hero-container {
    padding: 60px 20px 40px 20px;
    align-items: center;
    min-height: auto;
  }

  .hero-main {
    width: 100%;
    max-width: 571px;
    align-items: center;
  }

  .eulgpt-title {
    font-size: 80px;
    height: auto;
    text-align: center;
    justify-content: center;
  }

  .team-recruit-section {
    justify-content: center;
  }

  .typing-text {
    font-size: 40px;
    line-height: 60px;
  }

  .buttons-container {
    justify-content: center;
  }

  .apply-button {
    width: 180px;
    padding: 12px 60px;
  }

  .button-text {
    font-size: 24px;
  }

  .orbital-graphics {
    display: none;
  }
}
</style>