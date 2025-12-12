<template>
  <div class="skeleton-container">
    <div
      v-for="i in count"
      :key="i"
      class="skeleton-item"
      :style="{
        height: height,
        marginBottom: i < count ? gap : '0'
      }"
    >
      <div class="skeleton-line skeleton-main"></div>
      <div v-if="showSubline" class="skeleton-line skeleton-sub"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  height?: string
  gap?: string
  showSubline?: boolean
}

withDefaults(defineProps<Props>(), {
  count: 3,
  height: '80px',
  gap: '16px',
  showSubline: true
})
</script>

<style scoped>
.skeleton-container {
  width: 100%;
}

.skeleton-item {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  background: linear-gradient(
    90deg,
    #e5e7eb 0%,
    #f3f4f6 50%,
    #e5e7eb 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: 6px;
}

.skeleton-main {
  height: 20px;
  width: 70%;
}

.skeleton-sub {
  height: 16px;
  width: 45%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .skeleton-item {
    padding: 16px;
  }

  .skeleton-main {
    height: 18px;
  }

  .skeleton-sub {
    height: 14px;
  }
}
</style>
