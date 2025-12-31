<template>
  <aside class="admin-sidebar">
    <nav class="sidebar-nav">
      <button
        class="nav-item"
        :class="{ active: activeMenu === 'dashboard' }"
        @click="$emit('menuChange', 'dashboard')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>대시보드</span>
      </button>
      <button
        class="nav-item"
        :class="{ active: activeMenu === 'users' }"
        @click="$emit('menuChange', 'users')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>회원 관리</span>
      </button>
      <button
        class="nav-item"
        :class="{ active: activeMenu === 'database' }"
        @click="$emit('menuChange', 'database')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
        <span>DB 브라우저</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  activeMenu: string
}>()

defineEmits<{
  (e: 'menuChange', menu: string): void
}>()
</script>

<style scoped>
.admin-sidebar {
  width: 240px;
  min-height: calc(100vh - 64px);
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 16px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-item.active {
  background-color: #eff6ff;
  color: #02478A;
}

.nav-item.active svg {
  color: #02478A;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 8px 0;
  }

  .sidebar-nav {
    flex-direction: row;
    justify-content: center;
    gap: 8px;
  }

  .nav-item {
    flex-direction: column;
    gap: 4px;
    padding: 8px 16px;
    font-size: 12px;
  }

  .nav-item svg {
    width: 18px;
    height: 18px;
  }
}
</style>
