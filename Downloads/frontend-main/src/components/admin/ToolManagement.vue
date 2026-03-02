<template>
  <div class="tool-management">
    <div class="header">
      <h2>🛠️ Tool 관리</h2>
      <p class="subtitle">AI Agent가 사용하는 Tool (23개 → 5개로 최적화)</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Tool 정보를 불러오는 중...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="tool-grid">
      <!-- Essential Tools -->
      <div class="category-section">
        <h3 class="category-title">
          ⭐ Essential Tools (2개)
        </h3>
        <div class="tools-grid">
          <div
            v-for="tool in essentialTools"
            :key="tool.name"
            class="tool-card"
            :class="{ inactive: !tool.is_active }"
          >
            <div class="tool-header">
              <div class="tool-name">{{ formatToolName(tool.name) }}</div>
              <div class="tool-status" :class="{ active: tool.is_active }">
                {{ tool.is_active ? '활성' : '비활성' }}
              </div>
            </div>
            <p class="tool-description">{{ tool.description }}</p>
            <div class="tool-footer">
              <div class="tool-stats">
                <span class="stat-item">사용: {{ tool.usage_count }}회</span>
                <span v-if="tool.last_used" class="stat-item">
                  최근: {{ formatDate(tool.last_used) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quality-Focused Tools -->
      <div class="category-section">
        <h3 class="category-title">
          ✨ Quality-Focused Tools (3개) - 새로 추가
        </h3>
        <div class="tools-grid">
          <div
            v-for="tool in qualityTools"
            :key="tool.name"
            class="tool-card new-tool"
            :class="{ inactive: !tool.is_active }"
          >
            <div class="tool-header">
              <div class="tool-name">{{ formatToolName(tool.name) }}</div>
              <div class="tool-status" :class="{ active: tool.is_active }">
                {{ tool.is_active ? '활성' : '비활성' }}
              </div>
            </div>
            <p class="tool-description">{{ tool.description }}</p>
            <div class="tool-footer">
              <div class="tool-stats">
                <span class="stat-item">사용: {{ tool.usage_count }}회</span>
                <span v-if="tool.last_used" class="stat-item">
                  최근: {{ formatDate(tool.last_used) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="!loading && !error" class="summary">
      <div class="summary-card">
        <div class="summary-label">전체 Tool</div>
        <div class="summary-value">{{ tools.total }}개</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">활성화됨</div>
        <div class="summary-value success">{{ tools.active_count }}개</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Essential</div>
        <div class="summary-value">2개</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Quality-Focused</div>
        <div class="summary-value">3개</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { aiSettingsAPI } from '@/services/api'

interface ToolInfo {
  name: string
  description: string
  is_active: boolean
  category: 'essential' | 'quality_focused'
  usage_count: number
  last_used: string | null
}

interface ToolListResponse {
  tools: ToolInfo[]
  total: number
  active_count: number
}

const loading = ref(true)
const error = ref('')
const tools = ref<ToolListResponse>({
  tools: [],
  total: 0,
  active_count: 0
})

const essentialTools = computed(() =>
  tools.value.tools.filter(t => t.category === 'essential')
)

const qualityTools = computed(() =>
  tools.value.tools.filter(t => t.category === 'quality_focused')
)

const formatToolName = (name: string): string => {
  const names: Record<string, string> = {
    search_university_rag: 'RAG 검색',
    get_current_datetime: '현재 시간',
    search_notion_live: 'Notion Live 검색',
    verify_answer: '답변 검증',
    get_related_questions: '연관 질문 생성'
  }
  return names[name] || name
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return date.toLocaleDateString('ko-KR')
}

const fetchTools = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/admin/tools', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Tool 목록을 불러오는데 실패했습니다')
    }

    tools.value = await response.json()
  } catch (err: any) {
    error.value = err.message || 'Tool 정보를 불러올 수 없습니다'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTools()
})
</script>

<style scoped>
.tool-management {
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

.category-section {
  margin-bottom: 32px;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #02478A;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.tool-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.tool-card:hover {
  border-color: #02478A;
  box-shadow: 0 4px 12px rgba(2, 71, 138, 0.1);
}

.tool-card.new-tool {
  border-color: #4ade80;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.tool-card.inactive {
  opacity: 0.6;
  border-color: #ddd;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tool-name {
  font-size: 16px;
  font-weight: 600;
  color: #02478A;
}

.tool-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #6b7280;
}

.tool-status.active {
  background: #d1fae5;
  color: #065f46;
}

.tool-description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.tool-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

.tool-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
}

.stat-item {
  display: flex;
  align-items: center;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid #e5e7eb;
}

.summary-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #02478A;
}

.summary-value.success {
  color: #10b981;
}
</style>
