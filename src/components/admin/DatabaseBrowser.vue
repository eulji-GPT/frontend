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
                  <span>{{ col.name }}</span>
                  <span class="column-type">{{ formatColumnType(col.type) }}</span>
                </div>
              </th>
              <th class="actions-column">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in tableData.rows" :key="idx">
              <td v-for="col in tableData.columns" :key="col.name" :class="{ 'pk-column': col.primary_key }">
                <span class="cell-value" :title="formatCellValue(row[col.name])">
                  {{ formatCellValue(row[col.name]) }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminAPI, type TableInfo, type TableDataResponse } from '../../services/api'

const tables = ref<TableInfo[]>([])
const selectedTable = ref<string | null>(null)
const tableData = ref<TableDataResponse | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const searchQuery = ref('')
const showDeleteModal = ref(false)
const rowToDelete = ref<Record<string, unknown> | null>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

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

const formatColumnType = (type: string): string => {
  // 간략한 타입 표시
  if (type.includes('VARCHAR') || type.includes('String')) return 'STR'
  if (type.includes('BIGINT') || type.includes('BigInteger')) return 'INT'
  if (type.includes('BOOLEAN') || type.includes('Boolean')) return 'BOOL'
  if (type.includes('TEXT') || type.includes('Text')) return 'TEXT'
  if (type.includes('DATE') && !type.includes('DATETIME')) return 'DATE'
  if (type.includes('DATETIME') || type.includes('DateTime')) return 'TIME'
  return type.slice(0, 4).toUpperCase()
}

const formatCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return '(null)'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string' && value.length > 50) {
    return value.slice(0, 50) + '...'
  }
  return String(value)
}

const isProtectedRow = (row: Record<string, unknown>): boolean => {
  // member 테이블의 현재 사용자는 삭제 불가
  // (실제 체크는 백엔드에서 하지만 UI에서도 표시)
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
    loadTables() // 카운트 업데이트
  } catch (error: any) {
    alert(error.message || '삭제 중 오류가 발생했습니다.')
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
