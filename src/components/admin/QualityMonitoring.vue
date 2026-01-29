<template>
  <div class="quality-monitoring">
    <div class="header">
      <h2>📊 답변 품질 모니터링</h2>
      <p class="subtitle">VerifyAnswerTool 실시간 검증 결과 (할루시네이션 방지 시스템)</p>
    </div>

    <!-- Period Selector -->
    <div class="period-selector">
      <label>통계 기간:</label>
      <select v-model="selectedPeriod" @change="fetchStats">
        <option :value="7">최근 7일</option>
        <option :value="30">최근 30일</option>
        <option :value="90">최근 90일</option>
      </select>
    </div>

    <!-- Stats Cards -->
    <div v-if="loadingStats" class="loading">
      <div class="spinner"></div>
      <p>통계를 불러오는 중...</p>
    </div>

    <div v-else-if="statsError" class="error-message">
      {{ statsError }}
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🔍</div>
        <div class="stat-content">
          <div class="stat-label">전체 검증</div>
          <div class="stat-value">{{ stats.total_verifications }}</div>
        </div>
      </div>

      <div class="stat-card highlight">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <div class="stat-label">평균 신뢰도</div>
          <div class="stat-value">{{ stats.avg_confidence_score.toFixed(1) }}<span class="stat-unit">/100</span></div>
        </div>
      </div>

      <div class="stat-card" :class="{ warning: stats.hallucination_rate > 10 }">
        <div class="stat-icon">{{ stats.hallucination_rate > 10 ? '⚠️' : '✅' }}</div>
        <div class="stat-content">
          <div class="stat-label">할루시네이션</div>
          <div class="stat-value">{{ stats.hallucination_rate.toFixed(1) }}<span class="stat-unit">%</span></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <div class="stat-label">사실 정확성</div>
          <div class="stat-value">{{ stats.avg_factual_accuracy.toFixed(1) }}<span class="stat-unit">/100</span></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-label">관련성</div>
          <div class="stat-value">{{ stats.avg_relevance.toFixed(1) }}<span class="stat-unit">/100</span></div>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">✔️</div>
        <div class="stat-content">
          <div class="stat-label">승인률 (ACCEPT)</div>
          <div class="stat-value">{{ stats.accept_rate.toFixed(1) }}<span class="stat-unit">%</span></div>
        </div>
      </div>

      <div class="stat-card reject">
        <div class="stat-icon">✖️</div>
        <div class="stat-content">
          <div class="stat-label">거부율 (REJECT)</div>
          <div class="stat-value">{{ stats.reject_rate.toFixed(1) }}<span class="stat-unit">%</span></div>
        </div>
      </div>

      <div class="stat-card revise">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <div class="stat-label">수정률 (REVISE)</div>
          <div class="stat-value">{{ stats.revise_rate.toFixed(1) }}<span class="stat-unit">%</span></div>
        </div>
      </div>
    </div>

    <!-- Quality Insights -->
    <div v-if="!loadingStats && !statsError" class="insights-section">
      <h3 class="section-title">🎯 품질 인사이트</h3>

      <div class="insights-grid">
        <div class="insight-card" :class="getQualityLevel(stats.avg_confidence_score)">
          <div class="insight-title">신뢰도 등급</div>
          <div class="insight-badge">{{ getQualityLabel(stats.avg_confidence_score) }}</div>
          <div class="insight-description">
            {{ getQualityDescription(stats.avg_confidence_score) }}
          </div>
        </div>

        <div class="insight-card" :class="getHallucinationLevel(stats.hallucination_rate)">
          <div class="insight-title">할루시네이션 상태</div>
          <div class="insight-badge">{{ getHallucinationLabel(stats.hallucination_rate) }}</div>
          <div class="insight-description">
            {{ getHallucinationDescription(stats.hallucination_rate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Recent History -->
    <div class="history-section">
      <h3 class="section-title">
        📜 최근 검증 기록
        <button @click="fetchHistory" class="refresh-btn" :disabled="loadingHistory">
          🔄 새로고침
        </button>
      </h3>

      <div v-if="loadingHistory" class="loading">
        <div class="spinner"></div>
        <p>기록을 불러오는 중...</p>
      </div>

      <div v-else-if="historyError" class="error-message">
        {{ historyError }}
      </div>

      <div v-else-if="history.items.length === 0" class="empty-state">
        검증 기록이 없습니다
      </div>

      <div v-else class="history-table">
        <table>
          <thead>
            <tr>
              <th>질문</th>
              <th>신뢰도</th>
              <th>할루시네이션</th>
              <th>권장사항</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history.items" :key="item.id">
              <td class="question-cell">{{ truncate(item.question, 50) }}</td>
              <td class="score-cell">
                <div class="score-bar">
                  <div
                    class="score-fill"
                    :style="{ width: item.confidence_score + '%' }"
                    :class="getScoreClass(item.confidence_score)"
                  ></div>
                  <span class="score-text">{{ item.confidence_score.toFixed(0) }}</span>
                </div>
              </td>
              <td class="hallucination-cell">
                <span class="badge" :class="{ danger: item.has_hallucination }">
                  {{ item.has_hallucination ? '있음' : '없음' }}
                </span>
              </td>
              <td class="recommendation-cell">
                <span class="badge" :class="item.recommendation.toLowerCase()">
                  {{ item.recommendation }}
                </span>
              </td>
              <td class="time-cell">{{ formatDate(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="history.total_pages > 1" class="pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            이전
          </button>
          <span class="page-info">{{ currentPage }} / {{ history.total_pages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === history.total_pages"
            class="page-btn"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface QualityStats {
  total_verifications: number
  avg_confidence_score: number
  hallucination_rate: number
  avg_factual_accuracy: number
  avg_relevance: number
  accept_rate: number
  reject_rate: number
  revise_rate: number
}

interface QualityHistoryItem {
  id: number
  question: string
  confidence_score: number
  has_hallucination: boolean
  recommendation: string
  created_at: string
}

interface QualityHistoryResponse {
  items: QualityHistoryItem[]
  total: number
  page: number
  limit: number
  total_pages: number
}

const selectedPeriod = ref(7)
const loadingStats = ref(true)
const loadingHistory = ref(true)
const statsError = ref('')
const historyError = ref('')
const currentPage = ref(1)

const stats = ref<QualityStats>({
  total_verifications: 0,
  avg_confidence_score: 0,
  hallucination_rate: 0,
  avg_factual_accuracy: 0,
  avg_relevance: 0,
  accept_rate: 0,
  reject_rate: 0,
  revise_rate: 0
})

const history = ref<QualityHistoryResponse>({
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  total_pages: 1
})

const fetchStats = async () => {
  loadingStats.value = true
  statsError.value = ''

  try {
    const response = await fetch(`/api/admin/quality/stats?days=${selectedPeriod.value}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (!response.ok) {
      throw new Error('통계를 불러오는데 실패했습니다')
    }

    stats.value = await response.json()
  } catch (err: any) {
    statsError.value = err.message || '통계를 불러올 수 없습니다'
  } finally {
    loadingStats.value = false
  }
}

const fetchHistory = async () => {
  loadingHistory.value = true
  historyError.value = ''

  try {
    const response = await fetch(`/api/admin/quality/history?page=${currentPage.value}&limit=20`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (!response.ok) {
      throw new Error('기록을 불러오는데 실패했습니다')
    }

    history.value = await response.json()
  } catch (err: any) {
    historyError.value = err.message || '기록을 불러올 수 없습니다'
  } finally {
    loadingHistory.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchHistory()
}

const truncate = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  return date.toLocaleString('ko-KR')
}

const getScoreClass = (score: number): string => {
  if (score >= 80) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

const getQualityLevel = (score: number): string => {
  if (score >= 80) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

const getQualityLabel = (score: number): string => {
  if (score >= 80) return '우수'
  if (score >= 70) return '양호'
  if (score >= 50) return '보통'
  return '개선 필요'
}

const getQualityDescription = (score: number): string => {
  if (score >= 80) return '답변 품질이 매우 우수합니다. 현재 설정을 유지하세요.'
  if (score >= 70) return '답변 품질이 양호합니다. 추가 개선을 위해 프롬프트를 최적화하세요.'
  if (score >= 50) return '답변 품질이 보통입니다. Temperature를 낮추고 프롬프트를 강화하세요.'
  return '답변 품질이 낮습니다. 즉시 프롬프트와 RAG 설정을 점검하세요.'
}

const getHallucinationLevel = (rate: number): string => {
  if (rate <= 5) return 'excellent'
  if (rate <= 10) return 'good'
  if (rate <= 20) return 'fair'
  return 'poor'
}

const getHallucinationLabel = (rate: number): string => {
  if (rate <= 5) return '매우 낮음'
  if (rate <= 10) return '낮음'
  if (rate <= 20) return '보통'
  return '높음'
}

const getHallucinationDescription = (rate: number): string => {
  if (rate <= 5) return '할루시네이션이 매우 낮습니다. 현재 설정이 효과적입니다.'
  if (rate <= 10) return '할루시네이션이 낮은 수준입니다. 지속적으로 모니터링하세요.'
  if (rate <= 20) return '할루시네이션이 다소 높습니다. Temperature를 낮추세요.'
  return '할루시네이션이 높습니다. 즉시 Temperature를 낮추고 VerifyAnswerTool을 점검하세요.'
}

onMounted(() => {
  fetchStats()
  fetchHistory()
})
</script>

<style scoped>
.quality-monitoring {
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

.period-selector {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.period-selector label {
  font-weight: 600;
  color: #333;
}

.period-selector select {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.highlight {
  border-color: #02478A;
  background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
}

.stat-card.warning {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
}

.stat-card.success {
  border-color: #10b981;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.stat-card.reject {
  border-color: #ef4444;
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
}

.stat-card.revise {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #02478A;
}

.stat-unit {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
}

.insights-section {
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

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.insight-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.insight-card.excellent {
  border-color: #10b981;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.insight-card.good {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
}

.insight-card.fair {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
}

.insight-card.poor {
  border-color: #ef4444;
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
}

.insight-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.insight-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #02478A;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.insight-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.history-section {
  margin-bottom: 32px;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #666;
}

.history-table {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
}

.question-cell {
  max-width: 300px;
  color: #333;
}

.score-cell {
  min-width: 150px;
}

.score-bar {
  position: relative;
  width: 100%;
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.score-fill.excellent {
  background: #10b981;
}

.score-fill.good {
  background: #3b82f6;
}

.score-fill.fair {
  background: #f59e0b;
}

.score-fill.poor {
  background: #ef4444;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.badge.danger {
  background: #fee;
  color: #c33;
}

.badge.accept {
  background: #d1fae5;
  color: #065f46;
}

.badge.reject {
  background: #fee;
  color: #991b1b;
}

.badge.revise {
  background: #fef3c7;
  color: #92400e;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  padding: 8px 16px;
  background: #02478A;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background: #023a6e;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}
</style>
