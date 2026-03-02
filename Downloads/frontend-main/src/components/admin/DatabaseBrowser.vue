<template>
  <div class="db-browser">
    <h2 class="section-title">데이터베이스 브라우저</h2>

    <!-- 테이블 목록 -->
    <div class="tables-grid">
      <div
        v-for="table in tables"
        :key="table.name"
        class="table-card"
        :class="{ active: selectedTable === table.name }"
        @click="selectTable(table.name)"
      >
        <div class="table-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="9" x2="9" y2="21"></line>
          </svg>
        </div>
        <div class="table-info">
          <span class="table-name">{{ table.display_name }}</span>
          <span class="table-count">{{ table.row_count.toLocaleString() }} rows</span>
        </div>
      </div>
    </div>

    <!-- 데이터 테이블 -->
    <div v-if="selectedTable" class="data-section">
      <div class="data-header">
        <h3 class="data-title">
          {{ getTableDisplayName(selectedTable) }}
          <span class="table-name-badge">{{ selectedTable }}</span>
        </h3>
        <div class="data-controls">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="검색..."
              @input="debouncedSearch"
            />
          </div>
          <button class="refresh-btn" @click="loadTableData" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ spinning: loading }">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            새로고침
          </button>
        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>데이터를 불러오는 중...</span>
      </div>

      <!-- 데이터 테이블 -->
      <div v-else-if="tableData" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="col in tableData.columns" :key="col.name" :class="{ 'pk-column': col.primary_key }">
                <div class="column-header">
                  <span>{{ getColumnDisplayName(col.name) }}</span>
                  <span class="column-type">{{ formatColumnType(col.type) }}</span>
                </div>
              </th>
              <th class="actions-column">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in tableData.rows" :key="idx">
              <td
                v-for="col in tableData.columns"
                :key="col.name"
                :class="getCellClass(row[col.name], col)"
                @click="openDetailModal(row[col.name], col.name)"
              >
                <span
                  class="cell-value"
                  :title="isDateValue(col.name, row[col.name]) ? formatDateFull(String(row[col.name])) : String(row[col.name] ?? '')"
                >
                  {{ formatCellValue(row[col.name], col.name) }}
                </span>
                <span v-if="isClickableCell(row[col.name], col.name)" class="expand-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </span>
              </td>
              <td class="actions-column">
                <button
                  class="delete-btn"
                  @click="confirmDelete(row)"
                  :disabled="isProtectedRow(row)"
                  :title="isProtectedRow(row) ? '삭제할 수 없는 레코드입니다' : '삭제'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="tableData.rows.length === 0">
              <td :colspan="tableData.columns.length + 1" class="empty-state">
                데이터가 없습니다
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="tableData && tableData.total_pages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          처음
        </button>
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          이전
        </button>
        <span class="page-info">
          {{ currentPage }} / {{ tableData.total_pages }} (총 {{ tableData.total.toLocaleString() }}건)
        </span>
        <button
          class="page-btn"
          :disabled="currentPage === tableData.total_pages"
          @click="goToPage(currentPage + 1)"
        >
          다음
        </button>
        <button
          class="page-btn"
          :disabled="currentPage === tableData.total_pages"
          @click="goToPage(tableData.total_pages)"
        >
          마지막
        </button>
      </div>
    </div>

    <!-- 테이블 선택 안내 -->
    <div v-else class="select-prompt">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
        <line x1="9" y1="9" x2="9" y2="21"></line>
      </svg>
      <p>위에서 테이블을 선택하세요</p>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h3>삭제 확인</h3>
        <p>정말로 이 레코드를 삭제하시겠습니까?</p>
        <p class="delete-warning">이 작업은 되돌릴 수 없습니다.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">취소</button>
          <button class="confirm-delete-btn" @click="deleteRow">삭제</button>
        </div>
      </div>
    </div>

    <!-- 상세 보기 모달 -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="detail-modal-content">
        <div class="detail-modal-header">
          <h3>{{ detailModalTitle }}</h3>
          <button class="close-btn" @click="closeDetailModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="detail-modal-body">
          <pre v-if="detailModalType === 'json'" class="json-content">{{ detailModalContent }}</pre>
          <div v-else-if="detailModalType === 'message'" class="message-content">
            <p>{{ detailModalContent }}</p>
          </div>
          <div v-else class="text-content">
            <p>{{ detailModalContent }}</p>
          </div>
        </div>
        <div class="detail-modal-footer">
          <button class="copy-btn" @click="copyToClipboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            복사
          </button>
          <button class="cancel-btn" @click="closeDetailModal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminAPI, type TableInfo, type TableDataResponse, type TableColumn } from '../../services/api'

const tables = ref<TableInfo[]>([])
const selectedTable = ref<string | null>(null)
const tableData = ref<TableDataResponse | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const searchQuery = ref('')
const showDeleteModal = ref(false)
const rowToDelete = ref<Record<string, unknown> | null>(null)

// 상세 보기 모달
const showDetailModal = ref(false)
const detailModalTitle = ref('')
const detailModalContent = ref('')
const detailModalType = ref<'text' | 'json' | 'message'>('text')

let searchTimeout: ReturnType<typeof setTimeout> | null = null

// 컬럼명 한글 번역
const columnNameMap: Record<string, string> = {
  id: 'ID',
  user_id: '사용자 ID',
  chat_history_id: '채팅 ID',
  chat_message_id: '메시지 ID',
  title: '제목',
  message: '메시지',
  is_user: '사용자 여부',
  is_positive: '긍정 여부',
  is_pro: 'Pro 회원',
  is_admin: '관리자',
  name: '이름',
  nickname: '닉네임',
  email: '이메일',
  phone_number: '전화번호',
  birth_date: '생년월일',
  password: '비밀번호',
  verified_email: '인증 이메일',
  oauth_provider: 'OAuth 제공자',
  oauth_id: 'OAuth ID',
  profile_image_url: '프로필 이미지',
  created_at: '생성일',
  updated_at: '수정일',
  policy_agree_1: '이용약관 동의',
  policy_agree_2: '개인정보 동의',
}


const loadTables = async () => {
  try {
    const response = await adminAPI.getTables()
    tables.value = response.tables
  } catch (error) {
    console.error('테이블 목록 로드 실패:', error)
  }
}

const selectTable = (tableName: string) => {
  selectedTable.value = tableName
  currentPage.value = 1
  searchQuery.value = ''
  loadTableData()
}

const loadTableData = async () => {
  if (!selectedTable.value) return

  loading.value = true
  try {
    tableData.value = await adminAPI.getTableData(selectedTable.value, {
      page: currentPage.value,
      limit: 20,
      search: searchQuery.value || undefined,
    })
  } catch (error) {
    console.error('테이블 데이터 로드 실패:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadTableData()
  }, 300)
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadTableData()
}

const getTableDisplayName = (tableName: string): string => {
  const table = tables.value.find(t => t.name === tableName)
  return table?.display_name || tableName
}

// 컬럼명 한글화
const getColumnDisplayName = (colName: string): string => {
  return columnNameMap[colName] || colName
}

const formatColumnType = (type: string): string => {
  if (type.includes('VARCHAR') || type.includes('String')) return 'STR'
  if (type.includes('BIGINT') || type.includes('BigInteger')) return 'INT'
  if (type.includes('BOOLEAN') || type.includes('Boolean')) return 'BOOL'
  if (type.includes('TEXT') || type.includes('Text')) return 'TEXT'
  if (type.includes('DATE') && !type.includes('DATETIME')) return 'DATE'
  if (type.includes('DATETIME') || type.includes('DateTime')) return 'TIME'
  return type.slice(0, 4).toUpperCase()
}

// 날짜 포맷팅 (상대 시간)
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 30) {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } else if (diffDay > 0) {
      return `${diffDay}일 전`
    } else if (diffHour > 0) {
      return `${diffHour}시간 전`
    } else if (diffMin > 0) {
      return `${diffMin}분 전`
    } else {
      return '방금 전'
    }
  } catch {
    return dateStr
  }
}

// 날짜 풀 포맷
const formatDateFull = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return dateStr
  }
}

// 값이 날짜인지 확인
const isDateValue = (colName: string, value: unknown): boolean => {
  if (typeof value !== 'string') return false
  if (colName.includes('_at') || colName.includes('date')) return true
  // ISO 8601 형식 체크
  return /^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}/.test(value)
}

// 셀 값 포맷팅 (개선)
const formatCellValue = (value: unknown, colName: string): string => {
  if (value === null || value === undefined) return '-'

  // Boolean 처리
  if (typeof value === 'boolean') {
    if (colName === 'is_user') return value ? '👤 사용자' : '🤖 AI'
    if (colName === 'is_positive') return value ? '👍 좋아요' : '👎 싫어요'
    if (colName === 'is_pro') return value ? '✨ Pro' : '일반'
    if (colName === 'is_admin') return value ? '🛡️ 관리자' : '일반'
    return value ? 'Yes' : 'No'
  }

  // 날짜 처리
  if (typeof value === 'string' && isDateValue(colName, value)) {
    return formatDate(value)
  }

  // 비밀번호 마스킹
  if (colName === 'password' && typeof value === 'string') {
    return '••••••••'
  }

  // 긴 텍스트 처리
  if (typeof value === 'string') {
    if (value.length > 80) {
      return value.slice(0, 80) + '...'
    }
    return value
  }

  return String(value)
}

// 셀이 클릭 가능한지 (긴 텍스트)
const isClickableCell = (value: unknown, colName: string): boolean => {
  if (colName === 'password') return false
  if (typeof value === 'string' && value.length > 80) return true
  if (colName === 'message') return true
  return false
}

// 상세 모달 열기
const openDetailModal = (value: unknown, colName: string) => {
  if (!isClickableCell(value, colName)) return

  detailModalTitle.value = getColumnDisplayName(colName)

  if (typeof value === 'string') {
    // JSON 파싱 시도
    try {
      const parsed = JSON.parse(value)
      detailModalContent.value = JSON.stringify(parsed, null, 2)
      detailModalType.value = 'json'
    } catch {
      detailModalContent.value = value
      detailModalType.value = colName === 'message' ? 'message' : 'text'
    }
  } else {
    detailModalContent.value = String(value)
    detailModalType.value = 'text'
  }

  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  detailModalContent.value = ''
}

// 셀 클래스 계산
const getCellClass = (value: unknown, col: TableColumn): string => {
  const classes: string[] = []
  if (col.primary_key) classes.push('pk-column')
  if (isClickableCell(value, col.name)) classes.push('clickable-cell')
  if (col.name === 'message') classes.push('message-cell')
  return classes.join(' ')
}

// 클립보드 복사
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(detailModalContent.value)
    alert('복사되었습니다.')
  } catch {
    // fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = detailModalContent.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    alert('복사되었습니다.')
  }
}

const isProtectedRow = (_row: Record<string, unknown>): boolean => {
  return false
}

const confirmDelete = (row: Record<string, unknown>) => {
  rowToDelete.value = row
  showDeleteModal.value = true
}

const deleteRow = async () => {
  if (!selectedTable.value || !rowToDelete.value) return

  const id = rowToDelete.value.id as number
  if (!id) {
    alert('삭제할 수 없는 레코드입니다.')
    return
  }

  try {
    await adminAPI.deleteTableRow(selectedTable.value, id)
    showDeleteModal.value = false
    rowToDelete.value = null
    loadTableData()
    loadTables()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.'
    alert(errorMessage)
  }
}

onMounted(() => {
  loadTables()
})
</script>

<style scoped>
.db-browser {
  max-width: 1400px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

/* 테이블 카드 그리드 */
.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.table-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.table-card:hover {
  border-color: #02478A;
  box-shadow: 0 2px 8px rgba(2, 71, 138, 0.1);
}

.table-card.active {
  border-color: #02478A;
  background: #eff6ff;
}

.table-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #6b7280;
}

.table-card.active .table-icon {
  background: #02478A;
  color: #fff;
}

.table-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.table-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.table-count {
  font-size: 12px;
  color: #6b7280;
}

/* 데이터 섹션 */
.data-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 12px;
}

.data-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-name-badge {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
}

.data-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.search-box svg {
  color: #9ca3af;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 200px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn svg.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 로딩 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #02478A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 데이터 테이블 */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.data-table th.pk-column {
  background: #fef3c7;
}

.data-table td.pk-column {
  background: #fffbeb;
  font-weight: 600;
}

.column-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.column-type {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.cell-value {
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 48px !important;
}

.actions-column {
  width: 60px;
  text-align: center;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.delete-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  padding: 0 16px;
  color: #6b7280;
  font-size: 13px;
}

/* 테이블 선택 안내 */
.select-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 64px;
  background: #fff;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  color: #9ca3af;
}

.select-prompt p {
  font-size: 16px;
}

/* 삭제 확인 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.modal-content p {
  color: #6b7280;
  margin-bottom: 8px;
}

.delete-warning {
  color: #ef4444 !important;
  font-size: 13px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-delete-btn {
  padding: 10px 20px;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.confirm-delete-btn:hover {
  background: #dc2626;
}

/* 클릭 가능한 셀 */
.clickable-cell {
  cursor: pointer;
  position: relative;
}

.clickable-cell:hover {
  background: #eff6ff;
}

.clickable-cell .expand-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  opacity: 0;
  transition: opacity 0.2s;
}

.clickable-cell:hover .expand-icon {
  opacity: 1;
  color: #02478A;
}

.message-cell {
  max-width: 400px;
}

/* 상세 보기 모달 */
.detail-modal-content {
  background: #fff;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.detail-modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.json-content {
  background: #1f2937;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.message-content,
.text-content {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  line-height: 1.8;
}

.message-content p,
.text-content p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #374151;
}

.detail-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #02478A;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #023a6f;
}

/* 반응형 */
@media (max-width: 768px) {
  .tables-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .data-header {
    flex-direction: column;
    align-items: stretch;
  }

  .data-controls {
    flex-direction: column;
  }

  .search-box input {
    width: 100%;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>
