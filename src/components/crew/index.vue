<template>
  <div class="crew-page" ref="crewPage">
    <div class="background-gradient" ref="backgroundGradient">
      <div class="ellipse animated-gradient" />
      <div class="ellipse-2 animated-gradient" />
      <div class="floating-particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>
    <HeaderSection />
    <div class="scroll-container">
      <HeroContainer ref="heroRef" />
      <InfoContainer ref="infoRef" />
      <FeaturesContainer ref="featuresRef" />
      <RecruitmentContainer ref="recruitmentRef" />
      <FAQContainer ref="faqRef" />
      <FooterContainer ref="footerRef" />
    </div>
    
    <!-- Progress Bar -->
    <div class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }"></div>
    
    <!-- Floating Action Button -->
    <div class="floating-actions" :class="{ visible: showFloatingActions }">
      <button class="scroll-to-top" @click="scrollToTop" title="위로 가기">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import HeaderSection from '../main/HeaderSection_Desktop21.vue'
import HeroContainer from './HeroContainer.vue'
import InfoContainer from './InfoContainer.vue'
import FeaturesContainer from './FeaturesContainer.vue'
import RecruitmentContainer from './RecruitmentContainer.vue'
import FAQContainer from './FAQContainer.vue'
import FooterContainer from './FooterContainer.vue'

const crewPage = ref<HTMLElement>()
const backgroundGradient = ref<HTMLElement>()
const heroRef = ref<HTMLElement>()
const infoRef = ref<HTMLElement>()
const featuresRef = ref<HTMLElement>()
const recruitmentRef = ref<HTMLElement>()
const faqRef = ref<HTMLElement>()
const footerRef = ref<HTMLElement>()

const scrollProgress = ref(0)
const showFloatingActions = ref(false)

const getParticleStyle = (_index: number) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${3 + Math.random() * 4}s`
})

let ticking = false

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects)
    ticking = true
  }
}

const updateScrollEffects = () => {
  const scrolled = window.pageYOffset
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight

  scrollProgress.value = Math.min(scrolled / maxScroll, 1)
  showFloatingActions.value = scrolled > 300

  if (backgroundGradient.value) {
    const parallaxSpeed = scrolled * 0.15
    backgroundGradient.value.style.transform = `translate3d(0, ${parallaxSpeed}px, 0)`
  }

  const sections = [
    { ref: heroRef.value, speed: 0.05 },
    { ref: infoRef.value, speed: 0.075 },
    { ref: featuresRef.value, speed: 0.1 },
    { ref: recruitmentRef.value, speed: 0.125 },
    { ref: faqRef.value, speed: 0.15 }
  ]

  sections.forEach(({ ref, speed }) => {
    animateOnScroll(ref, scrolled, speed)
  })

  ticking = false
}

const animateOnScroll = (element: HTMLElement | undefined, scrolled: number, _speed: number) => {
  if (!element) return

  const rect = element.getBoundingClientRect()
  const elementTop = rect.top + scrolled
  const elementHeight = rect.height
  const windowHeight = window.innerHeight

  if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
    const progress = (scrolled + windowHeight - elementTop) / (windowHeight + elementHeight)
    const clampedProgress = Math.max(0, Math.min(1, progress))

    const translateY = (1 - clampedProgress) * 30
    const opacity = Math.max(0.5, clampedProgress)

    element.style.transform = `translate3d(0, ${translateY}px, 0)`
    element.style.opacity = opacity.toString()
    element.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out'
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const setupIntersectionObserver = () => {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, options)

  const sections = [heroRef, infoRef, featuresRef, recruitmentRef, faqRef, footerRef]
  sections.forEach(ref => {
    if (ref.value) {
      observer.observe(ref.value)
    }
  })
}

onMounted(() => {
  nextTick(() => {
    setupIntersectionObserver()
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.crew-page {
  width: 100%;
  min-width: 100vw;
  min-height: 100vh;
  background: var(--dark-primary, #141D30) !important;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  position: relative;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.scroll-container {
  display: flex;
  flex-direction: column;
  gap: 120px;
  position: relative;
  z-index: 2;
  overflow: visible;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  will-change: auto;
}

.crew-page > *:not(.background-gradient):not(.scroll-progress):not(.floating-actions) {
  background: transparent !important;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 120vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
}

.animated-gradient {
  animation: float 6s ease-in-out infinite;
}

.ellipse {
  background: radial-gradient(circle, #4789ee 0%, #4789ee 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(150px);
  height: 600px;
  width: 600px;
  position: absolute;
  right: -300px;
  top: -300px;
  opacity: 0.6;
  animation-delay: 0s;
}

.ellipse-2 {
  background: radial-gradient(circle, var(--darksub-1, #2d4a8a) 0%, var(--darksub-1, #2d4a8a) 70%, transparent 100%);
  border-radius: 50%;
  filter: blur(250px);
  height: 672px;
  width: 672px;
  position: absolute;
  right: -336px;
  top: -336px;
  opacity: 0.7;
  transform: rotate(-9.47deg);
  z-index: 1;
  animation-delay: 3s;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(71, 137, 238, 0.6);
  border-radius: 50%;
  animation: particleFloat 5s linear infinite;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4789ee, #665ced);
  transform-origin: left;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(71, 137, 238, 0.5);
}

.floating-actions {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.floating-actions.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-to-top {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4789ee, #665ced);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(71, 137, 238, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(71, 137, 238, 0.4);
}

.scroll-to-top:active {
  transform: translateY(-1px);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.animate-in {
  animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0.3;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .crew-page {
    width: 100%;
    max-width: 768px;
    padding: 0 16px;
  }
  
  .scroll-container {
    gap: 60px;
  }
  
  .floating-actions {
    bottom: 20px;
    right: 20px;
  }
  
  .scroll-to-top {
    width: 48px;
    height: 48px;
  }
}
</style>

<style>
/* 전역 스타일로 body와 html 배경색 설정 */
body, html {
  background-color: #141D30 !important;
  background: #141D30 !important;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  scroll-behavior: smooth;
}

#app {
  background-color: #141D30 !important;
  background: #141D30 !important;
  min-height: 100vh;
  width: 100%;
  scroll-behavior: smooth;
}
</style>
