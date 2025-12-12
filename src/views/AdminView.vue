<template>
  <div class="admin-container">
    <AdminHeader @logout="handleLogout" />
    <div class="admin-body">
      <AdminSidebar
        :activeMenu="activeMenu"
        @menuChange="handleMenuChange"
      />
      <main class="admin-main">
        <UserManagement v-if="activeMenu === 'users'" />
        <div v-else-if="activeMenu === 'dashboard'" class="dashboard-content">
          <h2 class="section-title">대시보드</h2>
          <div class="stats-grid">
            <StatsCard
              title="전체 회원"
              :value="stats.total_users"
              icon="users"
              color="#02478A"
            />
            <StatsCard
              title="Pro 회원"
              :value="stats.pro_users"
              icon="star"
              color="#4f6edb"
            />
            <StatsCard
              title="관리자"
              :value="stats.admin_users"
              icon="shield"
              color="#10b981"
            />
            <StatsCard
              title="카카오 가입"
              :value="stats.kakao_users"
              icon="kakao"
              color="#FEE500"
            />
            <StatsCard
              title="오늘 가입"
              :value="stats.today_signups"
              icon="calendar"
              color="#f59e0b"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '../components/admin/AdminHeader.vue'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
import UserManagement from '../components/admin/UserManagement.vue'
import StatsCard from '../components/admin/StatsCard.vue'
import { adminAPI, type PlatformStats } from '../services/api'
import { removeAccessToken, removeUserInfo } from '../utils/auth'

const router = useRouter()
const activeMenu = ref('dashboard')

const stats = ref<PlatformStats>({
  total_users: 0,
  pro_users: 0,
  admin_users: 0,
  kakao_users: 0,
  today_signups: 0,
})

const handleMenuChange = (menu: string) => {
  activeMenu.value = menu
}

const handleLogout = async () => {
  try {
    // 백엔드 로그아웃 API 호출
    await fetch('/api/member/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error)
  }

  removeAccessToken()
  removeUserInfo()
  router.push('/login')
}

const loadStats = async () => {
  try {
    stats.value = await adminAPI.getStats()
  } catch (error) {
    console.error('통계 로드 실패:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}

.admin-body {
  display: flex;
  min-height: calc(100vh - 64px);
}

.admin-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.dashboard-content {
  max-width: 1200px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .admin-body {
    flex-direction: column;
  }

  .admin-main {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
