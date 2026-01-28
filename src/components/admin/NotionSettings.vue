<template>
  <div class="notion-settings">
    <div class="header">
      <h2>🔗 Notion API 설정</h2>
      <p class="subtitle">실시간 대학 정보 동기화 (5개 Database)</p>
    </div>

    <!-- API Key Status -->
    <div class="api-key-section">
      <div class="section-title">
        <h3>API 연결 상태</h3>
        <button @click="refreshStatus" class="refresh-btn" :disabled="loading">
          🔄 새로고침
        </button>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>상태 확인 중...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else class="status-card" :class="{ connected: status.api_key_configured }">
        <div class="status-icon">
          {{ status.api_key_configured ? '✅' : '❌' }}
        </div>
        <div class="status-details">
          <div class="status-label">
            {{ status.api_key_configured ? 'Notion API 연결됨' : 'Notion API 미연결' }}
          </div>
          <div class="status-info">
            {{ status.connected_count }}/{{ status.total_databases }} 데이터베이스 연결
          </div>
        </div>
      </div>
    </div>

    <!-- Database List -->
    <div v-if="!loading && !error" class="databases-section">
      <h3 class="section-title">데이터베이스 연결 상태</h3>

      <div class="database-grid">
        <div
          v-for="db in status.databases"
          :key="db.db_type"
          class="database-card"
          :class="{ connected: db.is_connected }"
        >
          <div class="db-header">
            <div class="db-icon">
              {{ db.is_connected ? '🟢' : '🔴' }}
            </div>
            <div class="db-name">{{ db.db_name }}</div>
          </div>

          <div class="db-details">
            <div class="db-type">{{ db.db_type }}</div>
            <div v-if="db.last_sync" class="db-sync">
              마지막 동기화: {{ formatDate(db.last_sync) }}
            </div>
            <div v-if="db.record_count !== null" class="db-records">
              레코드: {{ db.record_count }}개
            </div>
            <div v-if="db.error_message" class="db-error">
              {{ db.error_message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sync Actions -->
    <div v-if="!loading && !error && status.api_key_configured" class="actions-section">
      <h3 class="section-title">동기화 작업</h3>

      <div class="actions-grid">
        <button @click="syncAll" class="action-btn primary" :disabled="syncing">
          <span v-if="syncing">⏳ 동기화 중...</span>
          <span v-else>🔄 전체 동기화</span>
        </button>

        <button @click="syncSelective" class="action-btn secondary" :disabled="syncing">
          <span v-if="syncing">⏳ 동기화 중...</span>
          <span v-else>📋 선택 동기화</span>
        </button>
      </div>

      <div v-if="syncResult" class="sync-result" :class="{ success: syncResult.success }">
        <div class="result-icon">
          {{ syncResult.success ? '✅' : '❌' }}
        </div>
        <div class="result-details">
          <div class="result-message">
            {{ syncResult.message }}
          </div>
          <div v-if="syncResult.synced_databases.length" class="result-list">
            동기화됨: {{ syncResult.synced_databases.join(', ') }}
          </div>
          <div v-if="syncResult.failed_databases.length" class="result-list error">
            실패: {{ syncResult.failed_databases.join(', ') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration Guide -->
    <div v-if="!status.api_key_configured && !loading" class="config-guide">
      <h3>📚 Notion API 설정 가이드</h3>
      <ol>
        <li>Notion Integration 생성: <a href="https://www.notion.so/my-integrations" target="_blank">https://www.notion.so/my-integrations</a></li>
        <li>Internal Integration 생성 후 API 키 복사</li>
        <li>Backend .env 파일에 NOTION_API_KEY 추가</li>
        <li>Backend 서비스 재시작</li>
        <li>5개 Database ID 설정</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface NotionDatabaseStatus {
  db_type: string
  db_name: string
  is_connected: boolean
  last_sync: string | null
  record_count: number | null
  error_message: string | null
}

interface NotionStatusResponse {
  api_key_configured: boolean
  databases: NotionDatabaseStatus[]
  total_databases: number
  connected_count: number
}

interface SyncResult {
  success: boolean
  message: string
  synced_databases: string[]
  failed_databases: string[]
}

const loading = ref(true)
const error = ref('')
const syncing = ref(false)
const status = ref<NotionStatusResponse>({
  api_key_configured: false,
  databases: [],
  total_databases: 0,
  connected_count: 0
})
const syncResult = ref<SyncResult | null>(null)

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleString('ko-KR')
}

const fetchStatus = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/admin/notion/status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Notion 상태를 불러오는데 실패했습니다')
    }

    status.value = await response.json()
  } catch (err: any) {
    error.value = err.message || 'Notion 상태를 불러올 수 없습니다'
  } finally {
    loading.value = false
  }
}

const refreshStatus = () => {
  fetchStatus()
}

const syncAll = async () => {
  syncing.value = true
  syncResult.value = null

  try {
    const response = await fetch('/api/admin/notion/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({})
    })

    if (!response.ok) {
      throw new Error('동기화에 실패했습니다')
    }

    const result = await response.json()
    syncResult.value = {
      success: result.success,
      message: result.success ? '전체 동기화가 완료되었습니다' : '동기화 중 오류가 발생했습니다',
      synced_databases: result.synced_databases || [],
      failed_databases: result.failed_databases || []
    }

    // 성공 시 상태 새로고침
    if (result.success) {
      setTimeout(() => {
        fetchStatus()
      }, 1000)
    }
  } catch (err: any) {
    syncResult.value = {
      success: false,
      message: err.message || '동기화 요청 중 오류가 발생했습니다',
      synced_databases: [],
      failed_databases: []
    }
  } finally {
    syncing.value = false
  }
}

const syncSelective = async () => {
  // TODO: 선택 동기화 모달
  alert('선택 동기화는 준비 중입니다')
}

onMounted(() => {
  fetchStatus()
})
</script>

<style scoped>
.notion-settings {
  padding: 24px;
}

.header {
  margin-bottom: 32px;
}

.header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.api-key-section {
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #02478A;
}

.refresh-btn {
  background: #02478A;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #023a6e;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 48px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #02478A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff5f5;
  border: 2px solid #fca5a5;
  border-radius: 12px;
}

.status-card.connected {
  background: #f0fdf4;
  border-color: #86efac;
}

.status-icon {
  font-size: 32px;
}

.status-details {
  flex: 1;
}

.status-label {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.status-info {
  font-size: 14px;
  color: #666;
}

.databases-section {
  margin-bottom: 32px;
}

.database-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.database-card {
  background: white;
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.database-card.connected {
  border-color: #86efac;
}

.db-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.db-icon {
  font-size: 20px;
}

.db-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.db-details {
  font-size: 12px;
  color: #666;
}

.db-type {
  color: #02478A;
  margin-bottom: 4px;
}

.db-sync, .db-records {
  margin-bottom: 4px;
}

.db-error {
  color: #dc2626;
  margin-top: 8px;
}

.actions-section {
  margin-bottom: 32px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #02478A;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #023a6e;
}

.action-btn.secondary {
  background: #e5e7eb;
  color: #333;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sync-result {
  display: flex;
  align-items: start;
  gap: 12px;
  padding: 16px;
  background: #fee;
  border: 2px solid #fca5a5;
  border-radius: 8px;
}

.sync-result.success {
  background: #f0fdf4;
  border-color: #86efac;
}

.result-icon {
  font-size: 24px;
}

.result-details {
  flex: 1;
}

.result-message {
  font-weight: 600;
  margin-bottom: 8px;
}

.result-list {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.result-list.error {
  color: #dc2626;
}

.config-guide {
  background: #fef3c7;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 20px;
}

.config-guide h3 {
  margin-bottom: 16px;
  color: #92400e;
}

.config-guide ol {
  margin-left: 20px;
  color: #78350f;
  line-height: 1.8;
}

.config-guide a {
  color: #02478A;
  text-decoration: underline;
}
</style>
