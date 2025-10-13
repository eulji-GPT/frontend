<template>
  <div class="popup-overlay" v-if="isVisible" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-main">
        <div class="blur-circle"></div>

        <button class="close-button" @click="closePopup" aria-label="닫기">
          ×
        </button>

        <div class="character-container">
          <div class="cards">
            <img
              src="@/assets/fortune/사주카드_애정운.svg"
              alt="애정운 카드"
              class="fortune-card fortune-card-love"
            />
            <img
              src="@/assets/fortune/사주카드_성공운.svg"
              alt="성공운 카드"
              class="fortune-card fortune-card-success"
            />
            <img
              src="@/assets/fortune/사주카드_재물운 2.svg"
              alt="재물운 카드"
              class="fortune-card fortune-card-money"
            />
          </div>

          <!-- 을랑이 캐릭터 -->
          <img
            src="@/assets/fortune-character.svg"
            alt="을랑이 캐릭터"
            class="character-image"
          />
        </div>

        <div class="title-badge">
          <h2 class="title-text">오늘의 운세 보기</h2>
        </div>

        <p class="description">
          을랑이와 오늘의 운세를 확인하고<br>
          행운 카드를 받아보세요
        </p>

        <button class="confirm-button" @click="confirmAction">
          확인하러 가기
        </button>

        <div class="decorative-pattern"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isVisible = ref(false);

onMounted(() => {
  // 팝업을 표시할지 결정 (매번 표시)
  isVisible.value = true;
});

const closePopup = () => {
  isVisible.value = false;
};

const confirmAction = () => {
  isVisible.value = false;
  // 운세 페이지로 이동
  router.push('/fortune');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap');

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  padding: 20px;
}

.popup-container {
  position: relative;
  width: 100%;
  max-width: 396px;
}

.popup-main {
  width: 100%;
  background: rgb(240, 246, 255);
  border-radius: 25px;
  position: relative;
  overflow: hidden;
  padding: 48px 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #02478a;
  font-size: 24px;
  font-weight: bold;
  transition: transform 0.2s;
}

.close-button:hover {
  transform: scale(1.1);
}

.character-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}

.cards {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.fortune-card {
  position: absolute;
  width: 60px;
  height: 85px;
  object-fit: contain;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  transition: transform 0.3s ease;
  animation: cardFloat 3s ease-in-out infinite;
}

.fortune-card-love {
  left: -15px;
  top: 80px;
  transform: rotate(-12deg);
  animation-delay: 0s;
}

.fortune-card-success {
  right: -15px;
  top: 30px;
  transform: rotate(15deg);
  animation-delay: -1s;
}

.fortune-card-money {
  right: 15px;
  bottom: 40px;
  transform: rotate(-8deg);
  animation-delay: -2s;
}

@keyframes cardFloat {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-8px) rotate(var(--rotation, 0deg));
  }
}

.fortune-card-love {
  --rotation: -12deg;
}

.fortune-card-success {
  --rotation: 15deg;
}

.fortune-card-money {
  --rotation: -8deg;
}

.title-badge {
  border-radius: 67.388px;
  background: linear-gradient(90deg, rgba(0, 112, 221, 0.10) 0%, rgba(189, 215, 255, 0.10) 22.6%, rgba(0, 112, 221, 0.10) 91.83%);
  display: flex;
  width: 276px;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 3px;
  margin: 0 auto 20px;
}

.title-text {
  color: #02478a;
  font-size: 24px;
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

.description {
  color: #333;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 30px;
}

.confirm-button {
  display: flex;
  width: 276px;
  height: 50px;
  padding: 13px 60px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #02478A;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(2, 71, 138, 0.3);
  margin: 0 auto;
}

.confirm-button:hover {
  background: #024a8f;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(2, 71, 138, 0.4);
}

.confirm-button:active {
  transform: translateY(0);
}

.decorative-pattern {
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  opacity: 0.1;
  background: radial-gradient(circle, #4789ee 20%, transparent 20%),
              radial-gradient(circle, #4789ee 20%, transparent 20%);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
  transform: rotate(-22deg);
  pointer-events: none;
}

.blur-circle {
  position: absolute;
  width: 130px;
  height: 130px;
  background: rgb(71, 137, 238);
  border-radius: 50%;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.3;
  filter: blur(80px);
  pointer-events: none;
}

/* 반응형 스타일 */
@media (max-width: 480px) {
  .popup-main {
    padding: 40px 24px;
  }

  .title-text {
    font-size: 20px;
  }

  .description {
    font-size: 16px;
  }

  .character-container {
    width: 240px;
    height: 240px;
  }

  .character-image {
    width: 160px;
    height: 160px;
  }

  .fortune-card {
    width: 50px;
    height: 70px;
  }

  .fortune-card-love {
    left: -10px;
    top: 70px;
  }

  .fortune-card-success {
    right: -10px;
    top: 25px;
  }

  .fortune-card-money {
    right: 10px;
    bottom: 35px;
  }
}
</style>
