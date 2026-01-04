<template>
  <header class="admin-header">
    <div class="header-left">
      <router-link to="/" class="logo-link">
        <img :src="eulLogo" alt="EulGPT" class="logo" />
      </router-link>
      <span class="header-title">Admin</span>
    </div>
    <div class="header-right">
      <button class="logout-btn" @click="$emit('logout')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        로그아웃
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import eulLogo from '../../assets/eul_logo.svg';

defineEmits<{
  (e: 'logout'): void
}>()
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo {
  height: 32px;
  width: auto;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #02478A;
  padding-left: 12px;
  border-left: 2px solid #e5e7eb;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #9ca3af;
}

@media (max-width: 768px) {
  .admin-header {
    padding: 0 16px;
  }

  .header-title {
    display: none;
  }
}
</style>
