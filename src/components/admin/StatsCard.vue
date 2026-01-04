<template>
  <div class="stats-card" :style="{ '--accent-color': color }">
    <div class="card-icon">
      <svg v-if="icon === 'users'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <svg v-else-if="icon === 'star'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      <svg v-else-if="icon === 'shield'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <svg v-else-if="icon === 'kakao'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.57 1.7 4.83 4.24 6.12-.18.64-.66 2.32-.76 2.68-.12.45.17.44.35.32.14-.1 2.26-1.54 3.18-2.17.64.1 1.3.15 1.99.15 5.52 0 10-3.48 10-7.5S17.52 3 12 3z"/>
      </svg>
      <svg v-else-if="icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>
    <div class="card-content">
      <span class="card-title">{{ title }}</span>
      <span class="card-value">{{ value.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: number
  icon: string
  color: string
}>()
</script>

<style scoped>
.stats-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: color-mix(in srgb, var(--accent-color) 10%, white);
  border-radius: 12px;
  color: var(--accent-color);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}
</style>
