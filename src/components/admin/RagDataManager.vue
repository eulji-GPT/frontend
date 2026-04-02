<template>
  <div class="rag-manager">
    <!-- 헤더 -->
    <div class="header">
      <div class="header-left">
        <h2 class="section-title">RAG 데이터 관리</h2>
        <span class="sub-desc">PostgreSQL 직접 관리 (academic_info, calendar_info, static_info, regulations, lecture_reviews)</span>
      </div>
    </div>

    <!-- 테이블 탭 -->
    <div class="file-tabs">
      <button
        v-for="file in files"
        :key="file.name"
        class="file-tab"
        :class="{ active: selectedTable === file.name }"
        @click="selectTable(file.name)"
      >
        <span class="tab-name">{{ file.display_name }}</span>
        <span class="tab-count">{{ file.entry_count.toLocaleString() }}</span>
      </button>
    </div>

    <!-- 검색/필터 -->
    <div v-if="selectedTable" class="controls">
      <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="제목/내용 검색..." @input="debouncedSearch" />
      </div>

      <select v-if="categories.length > 0" v-model="selectedCategory" class="filter-select" @change="loadEntries">
        <option value="">전체 카테고리</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <select v-if="campuses.length > 0" v-model="selectedCampus" class="filter-select" @change="loadEntries">
        <option value="">전체 캠퍼스</option>
        <option v-for="campus in campuses" :key="campus" :value="campus">{{ campus }}</option>
      </select>

      <select v-model="sortOrder" class="filter-select" @change="loadEntries">
        <option value="index">기본순</option>
        <option value="title">제목순</option>
        <option value="recent">최근 수정순</option>
      </select>
    </div>

    <!-- 항목 목록 -->
    <div v-if="selectedTable" class="entries-section">
      <div class="entries-header">
        <span class="entries-count">총 {{ total.toLocaleString() }}건</span>
        <div class="pagination-info" v-if="totalPages > 1">
          {{ currentPage }} / {{ totalPages }} 페이지
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>로딩 중...</span>
      </div>

      <div v-else class="entries-table-wrap">
        <table class="entries-table">
          <thead>
            <tr>
              <th style="width:40px">#</th>
              <th>제목</th>
              <th style="width:110px">카테고리</th>
              <th style="width:80px">캠퍼스</th>
              <th style="width:110px">소분류</th>
              <th style="width:80px">intent</th>
              <th style="width:80px">수정자</th>
              <th style="width:100px">수정일</th>
              <th style="width:80px">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in entries" :key="entry.id" @click="openModal('view', entry)" class="entry-row">
              <td class="col-index">{{ entry.index }}</td>
              <td class="col-title">{{ entry.title }}</td>
              <td class="col-cat">{{ entry.category }}</td>
              <td class="col-campus">{{ entry.campus }}</td>
              <td class="col-subcat">{{ entry.subcategory || '-' }}</td>
              <td class="col-intent">{{ (entry as any).intent }}</td>
              <td class="col-by">{{ entry.updated_by || '-' }}</td>
              <td class="col-at">{{ entry.updated_at || '-' }}</td>
              <td class="col-actions" @click.stop>
                <button class="btn-edit" @click="openModal('edit', entry)" title="수정">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="btn-delete" @click="confirmDelete(entry)" title="삭제">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="entries.length === 0" class="empty-state">항목이 없습니다.</div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage <= 1" @click="goPage(currentPage - 1)">이전</button>
        <button
          v-for="p in visiblePages"
          :key="p"
          :class="{ active: p === currentPage }"
          @click="goPage(p)"
        >{{ p }}</button>
        <button :disabled="currentPage >= totalPages" @click="goPage(currentPage + 1)">다음</button>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalMode === 'edit' ? '항목 수정' : '항목 상세' }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <!-- 조회 모드 -->
          <div v-if="modalMode === 'view'" class="view-fields">
            <div class="field-row"><label>ID</label><span>{{ currentEntry?.id }}</span></div>
            <div class="field-row"><label>제목</label><span>{{ currentEntry?.title }}</span></div>
            <div class="field-row"><label>카테고리</label><span>{{ currentEntry?.category }}</span></div>
            <div class="field-row"><label>소분류</label><span>{{ currentEntry?.subcategory }}</span></div>
            <div class="field-row"><label>캠퍼스</label><span>{{ currentEntry?.campus }}</span></div>
            <div class="field-row"><label>intent</label><span>{{ (currentEntry as any)?.intent }}</span></div>
            <div class="field-row"><label>data_type</label><span>{{ (currentEntry as any)?.data_type }}</span></div>
            <div class="field-row"><label>수정자</label><span>{{ currentEntry?.updated_by || '-' }}</span></div>
            <div class="field-row"><label>수정일</label><span>{{ currentEntry?.updated_at || '-' }}</span></div>
            <div class="field-row content-row">
              <label>내용</label>
              <pre class="content-pre">{{ currentEntry?.content }}</pre>
            </div>
          </div>

          <!-- 수정 모드 -->
          <div v-else class="edit-fields">
            <div class="form-row">
              <label>제목</label>
              <input v-model="editForm.title" type="text" />
            </div>
            <div class="form-row">
              <label>카테고리</label>
              <input v-model="editForm.category" type="text" />
            </div>
            <div class="form-row">
              <label>소분류</label>
              <input v-model="editForm.sub_category" type="text" />
            </div>
            <div class="form-row">
              <label>캠퍼스</label>
              <input v-model="editForm.campus" type="text" placeholder="성남 / 대전 / 전체" />
            </div>
            <div class="form-row">
              <label>intent</label>
              <input v-model="editForm.intent" type="text" />
            </div>
            <div class="form-row">
              <label>data_type</label>
              <input v-model="editForm.data_type" type="text" />
            </div>
            <div class="form-row">
              <label>내용</label>
              <textarea v-model="editForm.content" rows="10"></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="modalMode === 'view'" class="btn-primary" @click="openModal('edit', currentEntry!)">수정</button>
          <button v-if="modalMode === 'edit'" class="btn-primary" :disabled="saving" @click="saveEntry">
            {{ saving ? '저장 중...' : '저장' }}
          </button>
          <button class="btn-secondary" @click="closeModal">닫기</button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h3>항목 삭제</h3>
          <button class="modal-close" @click="showDeleteConfirm = false">✕</button>
        </div>
        <div class="modal-body">
          <p><strong>{{ deleteTarget?.title }}</strong></p>
          <p class="warn-text">이 항목을 삭제하시겠습니까? 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-danger" :disabled="deleting" @click="executeDelete">
            {{ deleting ? '삭제 중...' : '삭제' }}
          </button>
          <button class="btn-secondary" @click="showDeleteConfirm = false">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ragDataAPI, type KnowledgeFile, type KnowledgeEntry } from '../../services/api'

// ─── 상태 ───────────────────────────────────────────────────────────────────
const files          = ref<KnowledgeFile[]>([])
const selectedTable  = ref('')
const entries        = ref<KnowledgeEntry[]>([])
const loading        = ref(false)
const total          = ref(0)
const totalPages     = ref(1)
const currentPage    = ref(1)
const searchQuery    = ref('')
const selectedCategory = ref('')
const selectedCampus   = ref('')
const sortOrder      = ref<'index' | 'recent' | 'title'>('index')
const categories     = ref<string[]>([])
const campuses       = ref<string[]>([])

// 모달
const showModal      = ref(false)
const modalMode      = ref<'view' | 'edit'>('view')
const currentEntry   = ref<KnowledgeEntry | null>(null)
const editForm       = ref<Record<string, string>>({})
const saving         = ref(false)

// 삭제
const showDeleteConfirm = ref(false)
const deleteTarget   = ref<KnowledgeEntry | null>(null)
const deleting       = ref(false)

// 알림
const toast          = ref('')

// ─── 페이지네이션 ────────────────────────────────────────────────────────────
const visiblePages = computed(() => {
  const delta = 2
  const range: number[] = []
  for (let i = Math.max(1, currentPage.value - delta); i <= Math.min(totalPages.value, currentPage.value + delta); i++) {
    range.push(i)
  }
  return range
})

// ─── 검색 debounce ───────────────────────────────────────────────────────────
let searchTimer: ReturnType<typeof setTimeout> | null = null
const debouncedSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    loadEntries()
  }, 300)
}

// ─── 초기화 ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadFiles()
})

async function loadFiles() {
  try {
    files.value = await ragDataAPI.getFiles()
    if (files.value.length > 0) {
      await selectTable(files.value[0].name)
    }
  } catch (e) {
    console.error('파일 목록 로드 실패', e)
  }
}

async function selectTable(tableName: string) {
  selectedTable.value = tableName
  currentPage.value = 1
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedCampus.value = ''
  await Promise.all([loadEntries(), loadFilters()])
}

async function loadEntries() {
  if (!selectedTable.value) return
  loading.value = true
  try {
    const res = await ragDataAPI.getEntries(selectedTable.value, {
      page:     currentPage.value,
      limit:    20,
      search:   searchQuery.value,
      category: selectedCategory.value,
      campus:   selectedCampus.value,
      sort:     sortOrder.value,
    })
    entries.value    = res.items
    total.value      = res.total
    totalPages.value = res.total_pages
  } catch (e) {
    console.error('항목 로드 실패', e)
  } finally {
    loading.value = false
  }
}

async function loadFilters() {
  if (!selectedTable.value) return
  const [catRes, campRes] = await Promise.all([
    ragDataAPI.getCategories(selectedTable.value),
    ragDataAPI.getCampuses(selectedTable.value),
  ])
  categories.value = catRes.categories
  campuses.value   = campRes.campuses
}

function goPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadEntries()
}

// ─── 모달 ────────────────────────────────────────────────────────────────────
function openModal(mode: 'view' | 'edit', entry: KnowledgeEntry) {
  modalMode.value    = mode
  currentEntry.value = entry
  if (mode === 'edit') {
    editForm.value = {
      title:        entry.title,
      content:      entry.content,
      category:     entry.category,
      sub_category: entry.subcategory,
      campus:       entry.campus,
      intent:       (entry as any).intent || '',
      data_type:    (entry as any).data_type || '',
    }
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveEntry() {
  if (!currentEntry.value || !selectedTable.value) return
  saving.value = true
  try {
    await ragDataAPI.updateEntry(selectedTable.value, currentEntry.value.id, editForm.value)
    showToast('저장되었습니다.')
    closeModal()
    await loadEntries()
    await loadFiles()
  } catch (e) {
    console.error('저장 실패', e)
    showToast('저장에 실패했습니다.')
  } finally {
    saving.value = false
  }
}

// ─── 삭제 ────────────────────────────────────────────────────────────────────
function confirmDelete(entry: KnowledgeEntry) {
  deleteTarget.value = entry
  showDeleteConfirm.value = true
}

async function executeDelete() {
  if (!deleteTarget.value || !selectedTable.value) return
  deleting.value = true
  try {
    await ragDataAPI.deleteEntry(selectedTable.value, deleteTarget.value.id)
    showToast('삭제되었습니다.')
    showDeleteConfirm.value = false
    await loadEntries()
    await loadFiles()
  } catch (e) {
    console.error('삭제 실패', e)
    showToast('삭제에 실패했습니다.')
  } finally {
    deleting.value = false
  }
}

// ─── 토스트 ──────────────────────────────────────────────────────────────────
function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}
</script>

<style scoped>
.rag-manager { padding: 24px; }

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}
.section-title { font-size: 20px; font-weight: 700; margin: 0 0 4px; }
.sub-desc { font-size: 12px; color: #888; }

/* 탭 */
.file-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.file-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  font-size: 13px;
  transition: all .15s;
}
.file-tab.active {
  background: #02478A;
  color: #fff;
  border-color: #02478A;
}
.tab-count {
  background: rgba(0,0,0,.12);
  border-radius: 12px;
  padding: 1px 8px;
  font-size: 11px;
}
.file-tab.active .tab-count { background: rgba(255,255,255,.25); }

/* 검색/필터 */
.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: center;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px 12px;
  background: #fff;
  flex: 1;
  min-width: 200px;
}
.search-box input { border: none; outline: none; flex: 1; font-size: 14px; }
.filter-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
}

/* 테이블 */
.entries-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
  color: #555;
}
.entries-table-wrap { overflow-x: auto; }
.entries-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.entries-table th {
  background: #f0f4f8;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-weight: 600;
  white-space: nowrap;
}
.entries-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}
.entry-row { cursor: pointer; transition: background .12s; }
.entry-row:hover { background: #f5f9ff; }
.col-title { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-cat, .col-campus, .col-subcat, .col-intent, .col-by, .col-at { color: #666; font-size: 12px; }
.col-actions { display: flex; gap: 6px; }
.btn-edit, .btn-delete {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.btn-edit  { background: #e8f0fe; color: #1a73e8; }
.btn-delete { background: #fde8e8; color: #d93025; }
.btn-edit:hover  { background: #c6d9fb; }
.btn-delete:hover { background: #f5c6c6; }

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
}
.pagination button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
.pagination button.active { background: #02478A; color: #fff; border-color: #02478A; }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 700px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-small { width: 420px; }
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #eee;
}
.modal-header h3 { margin: 0; font-size: 16px; }
.modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #666; }
.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* 조회 필드 */
.field-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: flex-start;
}
.field-row label {
  width: 90px;
  flex-shrink: 0;
  font-size: 12px;
  color: #888;
  padding-top: 2px;
}
.field-row span { font-size: 14px; }
.content-row { flex-direction: column; }
.content-row label { width: auto; margin-bottom: 6px; }
.content-pre {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
  font-family: inherit;
}

/* 수정 폼 */
.form-row { margin-bottom: 14px; }
.form-row label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; }
.form-row input,
.form-row textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
  resize: vertical;
}

/* 버튼 */
.btn-primary  { padding: 8px 20px; background: #02478A; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
.btn-secondary { padding: 8px 20px; background: #f0f0f0; color: #333; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
.btn-danger   { padding: 8px 20px; background: #dc3545; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
.btn-primary:disabled, .btn-danger:disabled { opacity: .6; cursor: not-allowed; }
.btn-primary:hover:not(:disabled)  { background: #01356a; }
.btn-danger:hover:not(:disabled)   { background: #c82333; }

/* 기타 */
.loading-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 40px;
  justify-content: center;
  color: #888;
}
.spinner {
  width: 20px; height: 20px;
  border: 2px solid #ddd;
  border-top-color: #02478A;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 40px; color: #aaa; }
.warn-text { color: #dc3545; font-size: 13px; margin-top: 8px; }
</style>
